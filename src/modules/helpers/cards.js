import {snapshot} from 'valtio';

import Store, { Template } from '../../Store';

import helpers from './index';
import supabase from '../supabase';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

const cards = {
  fetch: async tabs => {
    return new Promise(resolve => {
      Store.modal.data.tabs = _.cloneDeep(Template.modal.data.tabs);
      Store.modal.data.tabs.tabs = tabs || [];
      Store.modal.content = 'Tabs';
      Store.modal.data.tabs.current = 'default';

      Store.modal.data.tabs.resolve = tabs => {
        resolve(tabs);
      };

      Store.modal.isVisible = true;
    });
  },

  create: async () => {
    const snap = snapshot(Store);

    // Workaround
    const stack = [...Store.cards];

    let tabs = [];
    let urls = [];
    let favicons = [];
    let titles = [];

    if(snap.modal.data.snapshot.isUpdatingTabs) {
      if(snap.environment === 'extension') {
        tabs = (await helpers.api.do('tabs.query', {
          currentWindow: true
        })).map(tab => _.merge(tab, {
          favicon: tab.favIconUrl
        }));
      }

      tabs = await cards.fetch(tabs);

      if(tabs.length > 0) {
        tabs?.forEach(tab => {
          urls.push(tab.url);
          favicons.push(tab.favicon);
          titles.push(tab.title);
        });
      }
    } else {
      Store.modal.isVisible = false;
    }

    if(snap.modal.data.snapshot.id ? snap.modal.data.snapshot.id.length > 0 : false) {
      // Update Snapshot
      for (const card of stack) {
        if(card.id === snap.modal.data.snapshot.id) {
          const update = {
            value: snap.modal.data.snapshot.value?.length === 0 ? `Snapshot #${ snap.cards.filter(card => card.isVisible).length + 1 }` : snap.modal.data.snapshot.value,
            tags: snap.modal.data.snapshot.tags,

            pickColor: snap.modal.data.snapshot.pickIndex === -1 ? snap.modal.data.snapshot.pickColor : snap.palette[snap.modal.data.snapshot.pickIndex],
            pickIndex: snap.modal.data.snapshot.pickIndex,

            editedAt: new Date().toISOString(),

            isShowingIcons: snap.modal.data.snapshot.isShowingIcons,
            isCustomPick: snap.modal.data.snapshot.isShowingCustomPick && snap.modal.data.snapshot.pickColor.length > 0 && snap.modal.data.snapshot.pickIndex === -1,

            urls: snap.modal.data.snapshot.isUpdatingTabs ? urls : card.urls,
            favicons: snap.modal.data.snapshot.isUpdatingTabs ? favicons : card.favicons,
            titles: snap.modal.data.snapshot.isUpdatingTabs ? titles : card.titles,
          };

          stack[stack.indexOf(card)] = Object.assign(card, update);

          if(snap.session && snap.settings.sync.isSynchronizing) {
            supabase
                .from('cards')
                .update([
                  helpers.remote.camelCaseToSnakeCase(update)
                ], {
                  returning: 'minimal'
                })
                .match({ id: card.id })
                .then(({ error }) => {
                  if(error) {
                    console.error(error);
                  }
                });
          }
        }
      }
    } else if(tabs.length > 0) {
      // Take Snapshot
      const id = uuidv4();

      const card = {
        id,
        foreignId: null,
        index: snap.cards.filter(card => card.isVisible).length,
        value: snap.modal.data.snapshot.value?.length === 0 ? `Snapshot #${ snap.cards.filter(card => card.isVisible).length + 1 }` : snap.modal.data.snapshot.value,
        tags: snap.modal.data.snapshot.tags,

        pickColor: snap.modal.data.snapshot.pickIndex === -1 ? snap.modal.data.snapshot.pickColor : snap.palette[snap.modal.data.snapshot.pickIndex],
        pickIndex: snap.modal.data.snapshot.pickIndex,

        createdAt: new Date().toISOString(),
        editedAt: new Date().toISOString(),

        isVisible: true,
        isDeleted: false,
        isPrivate: true,
        isForeign: false,

        isShowingIcons: snap.modal.data.snapshot.isShowingIcons,
        isCustomPick: snap.modal.data.snapshot.isShowingCustomPick && snap.modal.data.snapshot.pickColor.length > 0 && snap.modal.data.snapshot.pickIndex === -1,

        urls,
        favicons,
        titles
      };

      stack.push(card);
      Store.favicons[id] = {};

      if(snap.session && snap.settings.sync.isSynchronizing) {
        supabase
            .from('cards')
            .insert([
              helpers.remote.camelCaseToSnakeCase(card)
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

      Store.cards = stack;
      Store.isScrolling = true;
      helpers.cards.save(stack);
  },

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
        // If in range mutate privacy
        cards[index].index += mutation;
      } else if(options.isUpdatingSelf && (card.index === event.source.index)) {
        // Update privacy of moved document to destination privacy
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

  import: async content => {
    if(content ? content.length === 0 : true) return [];
    const snap = snapshot(Store);

    try {
      if(content.startsWith('\'')) {
        content = content.slice(1);
      }

      if(content.endsWith('\'')) {
        content = content.substring(0, content.length - 1)
      }

      let stack;

      try {
        stack = JSON.parse(content);
      } catch(_) {
        return [];
      }

      if(!Array.isArray(stack) ? Array.isArray(stack.value) : false) {
        stack = stack.value;
        stack = stack.map((card, index) => ({
          id: uuidv4(),
          foreignId: null,
          index: card.visible ? index : -1,
          value: card.name.length === 0 ? `Snapshot #${ index + 1 }` : card.name,
          tags: [],

          pickColor: card.color,
          pickIndex: snap.palette.indexOf(card.color),

          createdAt: new Date(card.meta).toISOString(),
          editedAt: new Date(card.meta).toISOString(),

          isVisible: card.visible,
          isDeleted: false,
          isPrivate: true,
          isForeign: false,

          isShowingIcons: card.isShowingIcons,
          isCustomPick: false,

          urls: card.urls.map(url => (url || '').length > 0 ? url : '#'),
          favicons: card.favicons.map(icon => (icon || '').length > 0 ? icon : '#'),
          titles: card.urls.map(url => (url || '').split('://')[1].split('/')[0])
        }));
      }

      if(stack.length > 0) {
        cards.load(stack);
        cards.save(stack);

        if(snap.session && snap.settings.sync.isSynchronizing) {
          await helpers.remote.synchronize();
        }
      }
    } catch (e) {
      console.error(e);
    }
  },

  export: () => {
    const snap = snapshot(Store);
    let a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(
        [JSON.stringify(snap.cards)],
        {
          type: 'application/json'
        }
    ))
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

  share: () => {
    const snap = snapshot(Store);

    const onAuthentication = () => {
      const card = helpers.cards.get(snap.contextMenu.data);

      const onPublic = () => {
        Store.modal.data.share.id = snap.contextMenu.data;
        Store.modal.content = 'Share';
        Store.modal.isVisible = true;
      };

      if(!card.isPrivate) {
        onPublic();
      } else {
        Store.dialogue.type = 'Share';
        Store.dialogue.text = 'The selected card will be publicly accessible.';

        Store.dialogue.resolve = (isAccepted => {
          if(isAccepted) {
            Store.dialogue.isVisible = false;

            const stack = [...Store.cards].map(current => {
              if(current.id === snap.contextMenu.data) {
                return Object.assign({}, current, { isPrivate: false });
              }

              return current;
            });

            supabase
              .from('cards')
              .update({
                is_private: false
              })
              .match({
                id: snap.contextMenu.data
              })
              .then(({ error }) => {
                if(error) {
                  console.error(error);
                }
              });

            Store.cards = stack;
            helpers.cards.save(stack);

            onPublic();
          }
        });

        Store.dialogue.isVisible = true;
      }
    }

    if(snap.session) {
      onAuthentication()
    } else {
      helpers.remote.profile(() => {
        Store.modal.isVisible = false;
        onAuthentication();
      });
    }
  },

  tabs: (id, isEditing=true) => {
    const card = cards.get(id);

    Store.modal.data.tabs.tabs = card.urls.map((url, index) => {
      return {
        url,
        favicon: card.favicons[index],
        title: card.titles[index]
      }
    });

    Store.modal.data.tabs.id = id;
    Store.modal.data.tabs.current = 'default';
    Store.modal.data.tabs.isEditing = isEditing;
    Store.modal.data.tabs.isFetching = false;

    Store.modal.data.tabs.view.favicon = '';
    Store.modal.data.tabs.view.url = '';
    Store.modal.data.tabs.view.title = '';

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