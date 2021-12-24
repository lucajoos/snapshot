import Store from '../Store';
import { snapshot } from 'valtio';

const card = {
  import: content => {
    try {
      const cards = JSON.parse(content);

      cards.forEach(current => {
        Store.favicons[current.id] = {};
      });

      if (cards) {
        Store.cards = cards;
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

  save: cards => {
    localStorage.setItem('cards', JSON.stringify(cards));
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

    let cards = snap.cards.map(card => {
      let current = Object.assign({}, card);

      if (current.id === id) {
        current.isVisible = false;
      }

      return current;
    });

    Store.cards = cards;
    card.save(cards);
  },

  edit: id => {
    const current = card.get(id);

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

  open: (id, isWindow) => {
    const current = card.get(id);

    if (isWindow) {
      chrome.windows.create({}, ({ tabs, id: windowId }) => {
        current.urls.forEach(url => {
          chrome.tabs.create({
            url: url,
            windowId
          });
        });

        chrome.tabs.remove(tabs[0].id);
      });
    } else {
      current.urls.forEach(url => {
        chrome.tabs.create({
          url: url
        });
      });
    }
  }
};

export default {
  card
}