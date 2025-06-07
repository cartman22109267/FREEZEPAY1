import React from 'react';
import { TextInput, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../utils/theme';

export default function InputField({ style, ...props }) {
  const { colors } = useTheme();

  return (
    <TextInput
      style={[
        styles.input,
        {
          color: colors.textPrimary,
          // bordure gérée par le parent
        },
        style
      ]}
      placeholderTextColor={colors.textSecondary}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    paddingVertical: 0,               
    paddingHorizontal: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 16,
    borderWidth: 0,                   
  },
});
