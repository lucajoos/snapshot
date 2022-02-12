window.addEventListener('load', () => {
  if(new URLSearchParams(window.location.search).get('fullscreen') === 'true') {
    document.querySelector('html > body > iframe').setAttribute('style', 'width:100vw;height:100vh;');
    history.pushState({}, '', window.location.href.split('/').slice(0, -1).join('/'))
  }
});