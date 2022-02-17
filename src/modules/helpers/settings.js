import { snapshot } from 'valtio';

import Store, { Template } from '../../Store';

const settings = {
  save: () => {
    const snap = snapshot(Store);
    localStorage.setItem('settings', JSON.stringify(snap.settings));
  },

  load: content => {
    try {
      let settings = JSON.parse(content);

      if(!settings) {
        settings = Template.settings;
      }

      Store.settings = settings;
      return settings;
    } catch (e) {
      console.error(e);
    }
  }
};

export default settings;