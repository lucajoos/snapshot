window.addEventListener('load', () => {
  if(typeof window.__IS_LISTENING__ === 'boolean' ? !window.__IS_LISTENING__ : true) {
    const iframe = document.querySelector('html > body > iframe');
    iframe.setAttribute('src', (window.__MODE__ === 'production' || window.__MODE__ === 'staging') ? './index.html' : 'http://localhost:3000');

    const emit = (id, event, data) => {
      iframe.contentWindow.postMessage({
        id,
        event,
        data
      }, '*');
    };

    window.addEventListener('message', async e => {
      if(e.origin !== 'http://localhost:3000' && e.origin !== window.location.origin) return false;
      const { id='', event='', data={} } = e.data;

      switch(event) {
        case 'runtime.getURL': {
          emit(id, event, chrome.runtime.getURL(data));
          break;
        }
        case 'windows.create': {
          chrome.windows.create(data, response => {
            emit(id, event, response);
          });
          break;
        }
        case 'tabs.create': {
          chrome.tabs.create(data);
          break;
        }
        case 'tabs.remove': {
          chrome.tabs.remove(data);
          break;
        }
        case 'tabs.query': {
          const response = await chrome.tabs.query(data);
          emit(id, event, response);
          break;
        }
      }
    }, false);

    window.__IS_LISTENING__ = true;
  }
});