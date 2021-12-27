const fs = require('fs/promises');
const path = require('path');

fs.writeFile(path.resolve('./public/inject.js'), `window.__MODE__ = '${process.env.NODE_ENV}';`)
.catch(error => {
  console.error(error);
})