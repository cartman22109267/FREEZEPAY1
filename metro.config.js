/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 */

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

module.exports = (async () => {
  // 1. Charger la config par défaut
  const defaultConfig = await getDefaultConfig(__dirname);

  // 2. Personnaliser uniquement ce qui est nécessaire
  const customConfig = {
    transformer: {
      // Garder le transformer par défaut, mais activer inlineRequires
      ...defaultConfig.transformer,
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      // Traiter JSON et GIF comme assets
      assetExts: [...defaultConfig.resolver.assetExts, 'json',"mp3", 'gif','svg','png'],
      sourceExts: defaultConfig.resolver.sourceExts.filter(
        ext => ext !== 'json' && ext !== 'gif' && ext !== 'svg' && ext !== 'png'
      ),
    },
    // Si vous avez des monorepos ou dossiers externes à surveiller :
    watchFolders: defaultConfig.watchFolders,
    // Vous pouvez également fusionner server, serializer, etc. si besoin
    // server: { ...defaultConfig.server },
    // serializer: { ...defaultConfig.serializer },
  };

  // 3. Fusionner et retourner
  return mergeConfig(defaultConfig, customConfig);
})();
