import Store from '../Store';
import { snapshot } from 'valtio';

const card = {
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

    const set = cards.filter(card => {
      return card.id !== id;
    });

    localStorage.setItem('cards', JSON.stringify({ value: set }));
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