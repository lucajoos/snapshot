window.addEventListener('load', () => {
  if(typeof window.__IS_LISTENING__ === 'boolean' ? !window.__IS_LISTENING__ : true) {
    const iframe = document.querySelector('html > body > iframe');
    const isFullscreen = new URLSearchParams(window.location.search).get('fullscreen') === 'true';

    if(isFullscreen && !document.body.classList.contains('fullscreen')) {
      document.body.classList.add('fullscreen');
    }

    let options = {
      width: '',
      height: '',
      display: 'none'
    };

    const style = () => {
      let string = '';
      Object.keys(options).forEach(key => {
        const value = options[key];
        if(value ? value.length > 0 : false) {
          string = `${string}${key}:${value};`;
        }
      });
      iframe.setAttribute('style', string);
    }

    if(isFullscreen) {
      options.width = '100vw';
      options.height = '100vh';
      style();
    }

    iframe.setAttribute('src', (window.__MODE__ === 'production' || window.__MODE__ === 'staging') ? `./index.html${isFullscreen ? '?fullscreen=true' : ''}` : `http://localhost:3000${isFullscreen ? '?fullscreen=true' : ''}`);

    iframe.addEventListener('load', () => {
     options.display = '';
     style();
    });

    const emit = (id, event, data) => {
      iframe.contentWindow?.postMessage({
        id,
        event,
        data
      }, '*');
    };

    window.addEventListener('message', async e => {
      if(e.origin !== 'http://localhost:3000' && e.origin !== window.location.origin) return false;
      const { id='', event='', data={} } = e.data;

      switch(event) {
        case 'window.close': {
          window.close();
          break;
        }
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
        case 'storage.get': {
          chrome.storage.local.get([data], result => {
            emit(id, event, result[data]);
          });
          break;
        }
        case 'storage.set': {
          chrome.storage.local.set(data);
        }
      }
    }, false);

    window.__IS_LISTENING__ = true;
  }
});