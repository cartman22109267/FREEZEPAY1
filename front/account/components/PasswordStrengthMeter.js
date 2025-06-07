// components/PasswordStrengthMeter.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../utils/theme';
import typography from '../../utils/typography';

// Simple calcul : longueur + variété de caractères
function calculateStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (/[A-Z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  return score; // 0 à 4
}

export default function PasswordStrengthMeter({ password }) {
  const { colors } = useTheme();
  const score = calculateStrength(password);
  const labels = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];
  const barWidths = ['0%', '25%', '50%', '75%', '100%'];

  // Couleurs tirées de la palette : error → warning → success
  const barColor =
    score <= 1
      ? colors.error
      : score === 2
      ? colors.warning
      : colors.success;

  return (
    <View style={styles.container}>
      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            {
              width: barWidths[score],
              backgroundColor: barColor,
            },
          ]}
        />
      </View>
      <Text style={[typography.caption, { color: colors.textSecondary }]}>
        {labels[score]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 4 },
  barBackground: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e0e0e0',
    overflow: 'hidden',
  },
  barFill: {
    height: 6,
    borderRadius: 3,
  },
});
