import Store from '../../Store';
import { snapshot } from 'valtio';
import helpers from './index';
import supabase from '../supabase';

const cards = {
  move: (event, cards, options={isUpdatingSelf: true}) => {
    if(!cards) {
      cards = [...Store.cards];
    }

    // Calculate whether document was moved back or forth
    const mutation = event.destination.index < event.source.index ? 1 : -1;

    // Apply mutations
    cards.forEach((card, index) => {
      if(
        mutation === 1 ? (
          card.index >= event.destination.index &&
          card.index < event.source.index
        ) : (
          card.index > event.source.index &&
          card.index <= event.destination.index
        )
      ) {
        // If in range mutate index
        cards[index].index += mutation;
      } else if(options.isUpdatingSelf && (card.index === event.source.index)) {
        // Update index of moved document to destination index
        cards[index].index = event.destination.index;
      }
    });

    return cards;
  },

  load: stack => {
    if(stack ? typeof stack !== 'object' : true) return false;

    stack.forEach(current => {
      if(current) {
        Store.favicons[current.id] = {};
      }
    });

    if (stack.length > 0) {
      Store.cards = stack;
    }
  },

  import: content => {
    if(content ? content.length === 0 : false) return [];

    try {
      const stack = JSON.parse(content);
      cards.load(stack);

      return stack;
    } catch (e) {
      console.error(e);
    }
  },

  export: () => {
    const snap = snapshot(Store);
    let a = document.createElement('a');
    a.href = 'data:json/csv;base64,' + btoa(JSON.stringify(snap.cards));
    a.download = 'cards.json'
    a.click();
  },

  save: object => {
    localStorage.setItem('cards', JSON.stringify(object));
  },

  get: id => {
    const snap = snapshot(Store);
    let card = null;

    snap.cards.forEach(current => {
      if(current.id === id) {
        card = current;
      }
    });

    return card;
  },

  remove: async id => {
    const snap = snapshot(Store);
    let card = null;
    let maxIndex = 0;

    let update = [...Store.cards].map(current => {
      if(current.id === id) {
        card = current;
        return Object.assign({}, current, { isVisible: false, index: -1 });
      }

      if(current.index > maxIndex) {
        maxIndex = current.index;
      }

      return current;
    });

    if(snap.session && snap.settings.sync.isSynchronizing) {
      supabase
        .from('cards')
        .update({
          is_visible: false,
          index: -1,
          edited_at: new Date().toISOString()
        })
        .match({ id })
        .then(({ error }) => {
          if(error) {
            console.error(error);
          }
        });
    }

    if(maxIndex > card.index) {
      // Update indices
      update = helpers.cards.move({
        source: {
          index: card.index
        },
        destination: {
          index: update.length
        }
      }, update, {
        isUpdatingSelf: false
      });

      if(snap.session && snap.settings.sync.isSynchronizing) {
        for(const { index, id } of update) {
          supabase
            .from('cards')
            .update([{
              index
            }], {
              returning: 'minimal'
            })
            .match({ id })
            .then(({ error }) => {
              if(error) {
                console.error(error);
              }
            });
        }
      }
    }

    Store.cards = update;
    cards.save(update);
  },

  restore: async id => {
    const snap = snapshot(Store);
    let update = [...Store.cards].map(card => {
      if(card.id === id) {
        return Object.assign({}, card, { isVisible: true });
      }

      return card;
    });

    if(snap.session && snap.settings.sync.isSynchronizing) {
      supabase
        .from('cards')
        .update({
          index: 0,
          is_visible: true,
          edited_at: new Date().toISOString()
        })
        .match({ id })
        .then(({ error }) => {
          if(error) {
            console.error(error);
          }
        });
    }

    update = helpers.cards.move({
      source: {
        index: update.length
      },
      destination: {
        index: 0
      }
    }, update, {
      isUpdatingSelf: false
    });

    update = update.map(current => {
      if(current.id === id) {
        return Object.assign(current, { index: 0 });
      }

      return current;
    });

    if(snap.session && snap.settings.sync.isSynchronizing) {
      for(const { index, id } of update) {
        supabase
          .from('cards')
          .update([{
            index
          }], {
            returning: 'minimal'
          })
          .match({ id })
          .then(({ error }) => {
            if(error) {
              console.error(error);
            }
          });
      }
    }

    Store.cards = update;
    cards.save(update);
  },

  delete: async id => {
    const snap = snapshot(Store);
    const update = {
      index: -1,
      value: '',
      tags: [],

      pickColor: '',
      pickIndex: -1,

      editedAt: new Date().toISOString(),

      isVisible: false,
      isDeleted: true,
      isShowingIcons: false,
      isCustomPick: false,

      urls: [],
      favicons: []
    };
    
    const stack = snap.cards.map(card => {
      if(card.id === id) {
        return Object.assign({}, card, update);
      }

      return card;
    });

    if(update) {
      if(snap.session && snap.settings.sync.isSynchronizing) {
        supabase
          .from('cards')
          .update(
            helpers.remote.camelCaseToSnakeCase(update)
          )
          .match({ id })
          .then(({ error }) => {
            if(error) {
              console.error(error);
            }
          });
      }

      Store.cards = stack;
      cards.save(stack);
    }
  },

  edit: id => {
    const current = cards.get(id);

    Store.modal.data.snapshot = {
      id: current.id,
      value: current.value,
      tags: current.tags,
      pickColor: current.pickColor,
      pickIndex: current.pickIndex,
      pickCustom: current.pickCustom,
      isShowingIcons: current.isShowingIcons,
      isUpdatingTabs: false,
      isShowingCustomPick: current.isCustomPick,
    };

    Store.modal.content = 'Snapshot';
    Store.modal.isVisible = true;
  },

  open: async (id, isWindow) => {
    const current = cards.get(id);

    if (isWindow) {
      const {tabs, id: windowId} = await helpers.api.do('windows.create', {});

      for(const url of current.urls) {
        await helpers.api.do('tabs.create', {
          url,
          windowId
        }, { isWaiting: false });
      }

      await helpers.api.do('tabs.remove', tabs[0].id, { isWaiting: false });
    } else {
      for(const url of current.urls) {
        await helpers.api.do('tabs.create', {
          url
        }, { isWaiting: false });
      }
    }
  }
};

export default cards;