module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      '@sentry/babel-plugin-component-annotate',
    ],
  };
};
