import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../utils/theme';
import typography from '../utils/typography';

export default function AppButton({ title, onPress, disabled, style }) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: colors.brand, opacity: disabled ? 0.6 : 1 },
        style
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {typeof title === 'string'
        ? <Text style={[typography.button, { color: colors.surface }]}>
            {title}
          </Text>
        : title
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,               
    justifyContent: 'center', 
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
  },
});
