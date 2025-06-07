// components/LoadingButton.js
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default function LoadingButton({ title, onPress, loading, disabled }) {
  return (
    <TouchableOpacity
      style={[styles.btn, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading
        ? <ActivityIndicator />
        : <Text style={styles.text}>{title}</Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#4A90E2', padding: 16, borderRadius: 8,
    alignItems: 'center', marginVertical: 12
  },
  disabled: { opacity: 0.5 },
  text: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});
