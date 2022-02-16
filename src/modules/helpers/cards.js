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

  push: card => {
    const snap = snapshot(Store);

    if(typeof snap.favicons[card.id] !== 'object') {
      Store.favicons[card.id] = {};
    }

    const stack = [...Store.cards, card];
    Store.cards = stack;
    return stack;
  },

  load: stack => {
    const snap = snapshot(Store);
    if(stack ? typeof stack !== 'object' : true) return false;

    stack.forEach(current => {
      if(current ? typeof snap.favicons[current.id] !== 'object' : false) {
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

  get: (id, options={ isForeign: false }) => {
    const snap = snapshot(Store);
    let card = null;

    snap.cards.forEach(current => {
      if(options.isForeign ? (current.foreignId === id) : (current.id === id)) {
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
      isPrivate: true,

      foreignId: null,

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

  tabs: id => {
    const card = cards.get(id);

    Store.modal.data.tabs.tabs = card.urls.map((url, index) => {
      return {
        url,
        favicon: card.favicons[index],
        title: card.titles[index]
      }
    });

    Store.modal.data.tabs.id = id;

    Store.modal.content = 'Tabs';
    Store.modal.isVisible = true;
  },

  edit: id => {
    const card = cards.get(id);

    Store.modal.data.snapshot = {
      id: card.id,
      value: card.value,
      tags: card.tags,
      pickColor: card.pickColor,
      pickIndex: card.pickIndex,
      pickCustom: card.pickCustom,
      isShowingIcons: card.isShowingIcons,
      isUpdatingTabs: false,
      isShowingCustomPick: card.isCustomPick,
    };

    Store.modal.content = 'Snapshot';
    Store.modal.isVisible = true;
  },

  open: async (id, isWindow) => {
    const snap = snapshot(Store);
    const current = cards.get(id);

    if(snap.environment === 'extension') {
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
    } else {
      current.urls.forEach(url => {
        window.open(url, '_blank');
      });
    }
  }
};

export default cards;