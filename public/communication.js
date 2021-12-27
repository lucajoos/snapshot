window.addEventListener('load', () => {
  const iframe = document.querySelector('html > body > iframe');
  iframe.setAttribute('src', window.__MODE__ === 'production' ? './index.html' : 'http://localhost:3000');
});