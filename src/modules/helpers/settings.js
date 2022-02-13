import { snapshot } from 'valtio';
import Store from '../../Store';

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

      return settings;
    } catch (e) {
      console.error(e);
    }
  }
};

export default settings;