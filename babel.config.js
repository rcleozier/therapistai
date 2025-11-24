module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Temporarily disable Sentry plugin to avoid SDK 54 compatibility issues
      // ...(process.env.NODE_ENV === 'production' ? ['@sentry/babel-plugin-component-annotate'] : []),
      'react-native-reanimated/plugin', // Must be last plugin for Reanimated v4
    ],
  };
};
