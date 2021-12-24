/** @type {import("snowpack").SnowpackUserConfig } */
const config = require('./package.json');
module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
  },
  plugins: [
    '@snowpack/plugin-postcss',
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',

    process.env.NODE_ENV === 'develop'
        ? 'snowpack-plugin-web-ext'
        : [
          'snowpack-plugin-copy',
          {
            patterns: [
              {
                source: 'manifest.json',
                destination: 'build',
              },
              {
                source: 'web-ext-config.js',
                destination: 'build',
              }
            ],
          },
        ],
  ],
  routes: [],
  optimize: {},
  packageOptions: {},
  devOptions: {},
  buildOptions: {
    metaUrlPath: 'meta'
  },
  env: {
    APP_VERSION: config.version
  }
};
