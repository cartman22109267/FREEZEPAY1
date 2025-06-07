// utils/typography.js

import { Platform } from 'react-native';

const fontFamily = {
  inter: {
    regular: Platform.select({ ios: 'inter-regular', android: 'inter-regular' }),
    semiBold: Platform.select({ ios: 'inter-semibold', android: 'inter-semibold' }),
    bold: Platform.select({ ios: 'inter-bold', android: 'inter-bold' }),
  },
  roboto: {
    regular: Platform.select({ ios: 'roboto-regular', android: 'roboto-regular' }),
    bold: Platform.select({ ios: 'roboto-bold', android: 'roboto-bold' }),
  },
};

const typography = {
  h1: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 24,
    lineHeight: 32,
  },
  h2: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 20,
    lineHeight: 28,
  },
  body: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 16,
  },
  caption: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    lineHeight: 20,
  },
};

export default typography;
