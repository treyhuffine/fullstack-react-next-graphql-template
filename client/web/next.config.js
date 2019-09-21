const withImages = require('next-images');
const withTranspileModules = require('next-transpile-modules');

// TODO: add next-optimized-images

const nextConfig = {
  target: 'serverless',
  transpileModules: ['@appname/utils'],
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
};

module.exports = withTranspileModules(withImages(nextConfig));
