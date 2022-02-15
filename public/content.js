window.addEventListener('message', event => {
  if(event.source !== window) {
    return false;
  }

  const { type, data} = event.data;

  switch (type) {
    case 'snapshot:load': {
      chrome.storage.local.get(['load'], result => {
        let load = typeof result.load === 'undefined' ? [] : result.load;
        load.push(data);

        chrome.storage.local.set({
          load
        });
      });

      break;
    }
    case 'snapshot:ping': {
      window.postMessage({
        type: 'snapshot:pong'
      }, '*');
      break;
    }
  }
}, false);