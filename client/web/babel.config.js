module.exports = function(api) {
  api.cache(true);

  const presets = ['next/babel'];

  const plugins = [
    [
      'styled-components',
      {
        ssr: true,
      },
    ],
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          components: './components',
          pages: './pages',
          documents: './graphql/documents',
          style: './style',
          hooks: './hooks',
          types: './types',
          images: './assets/images',
          utils: './utils',
        },
      },
    ],
  ];

  return {
    presets,
    plugins,
  };
};
