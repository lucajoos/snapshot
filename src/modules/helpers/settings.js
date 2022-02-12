import { snapshot } from 'valtio';
import Store from '../../Store';

const settings = {
  save: () => {
    const snap = snapshot(Store);
    localStorage.setItem('settings', JSON.stringify(snap.modal.content.settings));
    Store.settings = snap.modal.content.settings;
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

export default settings;