// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Disable package exports to fix "require doesn't exist" error in SDK 54
config.resolver.unstable_enablePackageExports = false;

// Ensure proper asset resolution for audio files
if (!config.resolver.assetExts.includes('mp3')) {
  config.resolver.assetExts.push('mp3', 'wav', 'aac', 'm4a', 'ogg');
}

// Increase max workers for large files like storyLine3.js
config.maxWorkers = Math.max(2, require('os').cpus().length - 1);

// Increase transformer timeout for large story files
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

module.exports = config;

