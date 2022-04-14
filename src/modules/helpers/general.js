import Store from '../../Store.js';
import helpers from './index.js';
import { snapshot } from 'valtio';

const general = {
    isValidURL: (string, protocols) => {
        let url;

        try {
            url = new URL(string);
        } catch (_) {
            return false;
        }

        return protocols.includes(url.protocol.slice(0, -1));
    },

    reset: async text => {
        return new Promise(resolve => {
            const snap = snapshot(Store);

            Store.dialogue.text = text;
            Store.dialogue.type = 'Reset';
            Store.dialogue.isVisible = true;

            Store.dialogue.resolve = (async isAccepted => {
                if(isAccepted) {
                    localStorage.clear();

                    if(snap.environment === 'extension') {
                        await helpers.api.do('window.close');
                    } else {
                        location.reload();
                    }

                    resolve(true);
                } else {
                    Store.dialogue.isVisible = false;
                    resolve(false);
                }
            });
        })
    }
};

export default general;