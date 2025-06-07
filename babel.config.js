// babel.config.js

module.exports = {
  presets: [
    // Ce preset est indispensable pour que Babel retire les annotations Flow/TypeScript
    'module:@react-native/babel-preset'
  ],
  plugins: [
    // Si vous utilisez react-native-dotenv
    [
      'module:react-native-dotenv',
      {
        envName: '.env',
        moduleName: '@env',
        path: '.env',
      },
    ],
    // Si vous utilisez Reanimated
    'react-native-reanimated/plugin'
  ]
};
