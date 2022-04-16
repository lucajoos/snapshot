const fs = require('fs/promises');
const path = require('path');
const manifest = require('./manifest.js');
const { version } = require('./package.json');

fs.writeFile(path.resolve('./public/manifest.json'), manifest({ version }))
    .catch(error => {
      console.error(error);
    })
fs.writeFile(path.resolve('./public/inject.js'), `window.__MODE__ = '${process.env.NODE_ENV}';`)
  .catch(error => {
    console.error(error);
  })