import { snapshot } from 'valtio';
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

  synchronize: async () => {
    const snap = snapshot(Store);
    if(snap.session) {

      const cards = [
        ...(
          await supabase
            .from('cards')
            .select()
            .eq('user_id', supabase.auth.user().id)
        ).data.map(card => remote.snakeCaseToCamelCase(card)).map(card => ({ ...card, source: 'remote' })),
        ...snap.cards.map(card => ({ ...card, source: 'local' })),
      ]

      const merge = {};

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

      let stack = [];

      for (const card of Object.values(merge)) {
        const { source, isInRemote } = card;

        delete card.isInRemote;
        delete card.source;

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
    }
  },
};

export default remote;