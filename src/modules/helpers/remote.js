import { snapshot } from 'valtio';
import { v4 as uuidv4 } from 'uuid';

import Store from '../../Store';

import supabase from '../supabase';
import helpers from './index';

const remote = {
  camelCaseToSnakeCase: object => {
    let r = {};
    if(typeof object !== 'object') return r;

    Object.keys(object).forEach(key => {
      r[
        key.replace( /([A-Z])/g, '_$1').toLowerCase()
      ] = object[key];
    });

    return r;
  },

  snakeCaseToCamelCase: object => {
    let r = {};
    if(typeof object !== 'object') return r;

    const transform = key => {
      return key.replace(/([-_][a-z])/ig, current => {
        return current.toUpperCase().replace('_', '');
      });
    }

    Object.keys(object).forEach(key => {
      r[transform(key)] = object[key];
    });

    return r;
  },

  profile: done => {
    Store.modal.data.profile = {
      email: '',
      password: '',
      error: null,
      isSignIn: true,
      isLoading: false
    };

    Store.modal.data.profile.done = done || (() => {});

    Store.modal.content = 'Profile';
    Store.modal.isVisible = true;
  },

  synchronize: async () => {
    const snap = snapshot(Store);

    if(snap.session && snap.settings.sync.isSynchronizing) {
      let merge = {};
      let cards = [
        ...(
          await supabase
            .from('cards')
            .select()
            .eq('user_id', supabase.auth.user().id)
        ).data.map(card => {
          return helpers.remote.snakeCaseToCamelCase({
            ...card,
            source: 'remote'
          });
        }),

        ...snap.cards.map(card => {
          return {
            ...card,
            source: 'local'
          }
        })
      ];

      cards.forEach(card => {
        if(typeof merge[card.id] === 'object') {
          if(new Date(card.editedAt) > new Date(merge[card.id].editedAt)) {
            merge[card.id] = card;
          }

          merge[card.id].isInRemote = true;
        } else {
          merge[card.id] = { ...card, isInRemote: false };
        }
      });

      Object.values(merge).forEach(card => {
        if(card.userId !== supabase.auth.user().id) {
          merge[card.id] = Object.assign({}, card, {
            id: uuidv4(),
            userId: supabase.auth.user().id,
            isInRemote: false
          });
        }
      });

      let stack = [];
      let current = 0;

      for (
        const card of
        Object.values(merge)
          .sort((a, b) => a.index - b.index || new Date(a.editedAt) - new Date(b.editedAt))
      ) {
        const { source, isInRemote } = card;

        delete card.isInRemote;
        delete card.source;

        if(card.isVisible) {
          card.index = current;

          if(isInRemote) {
            supabase
              .from('cards')
              .update({
                index: current
              })
              .match({ id: card.id })
              .then(({error}) => {
                if(error) {
                  console.error(error);
                }
              });
          }

          current++;
        }

        if(source === 'local') {
          if(isInRemote) {
            supabase
              .from('cards')
              .update([
                remote.camelCaseToSnakeCase(card)
              ], {
                returning: 'minimal'
              })
              .match({
                id: card.id
              })
              .then(({ error }) => {
                if(error) {
                  console.error(error);
                }
              });
          } else {
            supabase
              .from('cards')
              .insert([
                remote.camelCaseToSnakeCase(card)
              ], {
                returning: 'minimal'
              })
              .then(({ error }) => {
                if(error) {
                  console.error(error);
                }
              });
          }
        }

        stack.push(card);
      }

      helpers.cards.load(stack);
      helpers.cards.save(stack);
    }
  },
};

export default remote;