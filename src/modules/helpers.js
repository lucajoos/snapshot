import Store from '../Store';
import { snapshot } from 'valtio';
import { v4 as uuidv4 } from 'uuid';

const api = {
  do: (event='', data={}, options={}) => {
    return new Promise((resolve, reject) => {
      if(event.length === 0) {
        reject('No event specified')
        return false;
      }

      const id = uuidv4();
      options = Object.assign({ isWaiting: true }, options);

      window.parent.postMessage({
        event,
        data,
        id
      }, '*');

      if(options.isWaiting) {
        const handler = e => {
          const { id:responseId='', event:responseEvent='', data:responseData={} } = e.data;

          if(id === responseId && event === responseEvent) {
            resolve(responseData);
          }

          window.removeEventListener('message', handler);
        };

        window.addEventListener('message', handler);
      } else {
        resolve();
      }
    });
  }
};

const cards = {
  import: content => {
    try {
      const stack = JSON.parse(content);

      stack.forEach(current => {
        Store.favicons[current.id] = {};
      });

      if (current) {
        Store.cards = stack;
      }
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

  save: current => {
    localStorage.setItem('cards', JSON.stringify(current));
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

  remove: id => {
    const snap = snapshot(Store);

    let stack = snap.cards.map(card => {
      let current = Object.assign({}, card);

      if (current.id === id) {
        current.isVisible = false;
      }

      return current;
    });

    Store.cards = stack;
    cards.save(stack);
  },

  edit: id => {
    const current = cards.get(id);

    Store.modal = {
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

    Store.isModalVisible = true;
  },

  open: async (id, isWindow) => {
    const current = cards.get(id);

    if (isWindow) {
      const {tabs, id: windowId} = await api.do('windows.create', {});

      for(const url of current.urls) {
        await api.do('tabs.create', {
          url,
          windowId
        }, { isWaiting: false });
      }

      await api.do('tabs.remove', tabs[0].id, { isWaiting: false });
    } else {
      for(const url of current.urls) {
        await api.do('tabs.create', {
          url
        }, { isWaiting: false });
      }
    }
  }
};

const settings = {
  save: () => {
    const snap = snapshot(Store);
    localStorage.setItem('settings', JSON.stringify(snap.settings));
  },

  import: content => {
    try {
      const settings = JSON.parse(content);

      if(settings) {
        Store.settings = settings;
      }
    } catch (e) {
      console.error(e);
    }
  }
};

export default {
  cards,
  settings,
  api
}