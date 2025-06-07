// components/ToastBubble.jsx
import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../utils/theme';
import typography from '../../utils/typography';
import { OTP_TTL } from '@env'; // <— import depuis .env

export default function ToastBubble({ type, message, onHide }) {
  const { colors } = useTheme();
  const pos = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(pos, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay((parseInt(OTP_TTL, 10) || 3) * 1000),
      Animated.timing(pos, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(onHide);
  }, [onHide, pos]);

  const bg = type === 'error' ? colors.error : colors.success;
  const icon = type === 'error' ? 'alert-circle' : 'check-circle';

  return (
    <Animated.View style={[styles.toast, { backgroundColor: bg, transform: [{ translateY: pos }] }]}>
      <Icon name={icon} size={24} color={colors.surface} style={styles.icon} />
      <Text style={[typography.body, { color: colors.surface }]}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    elevation: 4,
  },
  icon: {
    marginRight: 8,
    width: 24,
    height: 24,
  },
});
