import { v4 as uuidv4 } from 'uuid';
import { snapshot } from 'valtio';
import Store from '../../Store';

const api = {
  do: (event='', data={}, options={}) => {
    const snap = snapshot(Store);

    if(snap.environment === 'extension') {
      return new Promise((resolve, reject) => {
        if(event.length === 0) {
          reject('No event specified');
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
  }
};

export default api;