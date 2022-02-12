import Store from '../../Store';
import { snapshot } from 'valtio';
import api from './api';
import supabase from '../supabase';
import helpers from './index';

const cards = {
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
    const update = snap.cards.map(card => {
      if(card.id === id) {
        return Object.assign({}, card, { isVisible: false });
      }

      return card;
    });

    if(snap.session) {
      await supabase
        .from('cards')
        .update({
          is_visible: false,
          edited_at: new Date().toISOString()
        })
        .match({ id })
    }

    Store.cards = update;
    cards.save(update);
  },

  restore: async id => {
    const snap = snapshot(Store);
    const update = snap.cards.map(card => {
      if(card.id === id) {
        return Object.assign({}, card, { isVisible: true });
      }

      return card;
    });

    if(snap.session) {
      await supabase
        .from('cards')
        .update({
          is_visible: true,
          edited_at: new Date().toISOString()
        })
        .match({ id })
    }

    Store.cards = update;

    if(snap.modal.isVisible) {
      Store.modal.isVisible = false;
    }

    cards.save(update);
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

export default cards;