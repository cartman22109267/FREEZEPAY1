// screens/RegistrationScreen.jsx

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';
import { useTheme } from '../../utils/theme';
import typography from '../../utils/typography';
import InputField from '../../components/InputField';
import PhoneNumberField from '../components/PhoneNumberField';
import AppButton from '../../components/AppButton';
import ToastBubble from '../components/ToastBubble';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import { useRegister } from '../controllers/useAuth';

export default function RegistrationScreen({ navigation }) {
  const { colors } = useTheme();
  const { register, loading, error: registerError, clearError } = useRegister();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [toast, setToast] = useState(null);
  const [pwError, setPwError] = useState('');
  const phoneInputRef = useRef(null);
  const [phoneError, setPhoneError] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);
  const animationRef = useRef(null);

  // Clear any previous error when form changes
  useEffect(() => {
    if (registerError) clearError();
  }, [form]);

  // Password and phone validation
  useEffect(() => {
    setPwError(
      form.password && form.confirmPassword && form.password !== form.confirmPassword
        ? 'Les mots de passe ne correspondent pas'
        : ''
    );

    const filled = Object.values(form).every(v => Boolean(v));
    const strengthOk = form.password.length >= 6;
    setCanSubmit(filled && !pwError && strengthOk && !phoneError);
  }, [form, pwError, phoneError]);

  const handleRegister = async () => {
    console.log('🔔 [RegistrationScreen] payload:', form);
    try {
      const userId = await register(form);
      setToast({ type: 'success', message: 'OTP envoyé !' });
      navigation.navigate('RegistrationOTP', { userId });
    } catch (err) {
      console.error('🔴 [RegistrationScreen] register error', err);
      setToast({ type: 'error', message: err.message || registerError });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LottieView
        ref={animationRef}
        source={require('../../../assets/animations/register.json')}
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={[typography.h1, { color: colors.textPrimary, marginBottom: 16 }]}>
        Inscription
      </Text>

      {/* Full Name */}
      <View style={[styles.inputRow, { borderColor: colors.textSecondary }]}>
        <Icon name="account" size={24} color={colors.textSecondary} style={styles.icon} />
        <InputField
          placeholder="Nom complet"
          value={form.fullName}
          onChangeText={v => setForm({ ...form, fullName: v })}
          style={{ height: '100%' }}
        />
      </View>

      {/* Email */}
      <View style={[styles.inputRow, { borderColor: colors.textSecondary }]}>
        <Icon name="email-outline" size={24} color={colors.textSecondary} style={styles.icon} />
        <InputField
          placeholder="Email"
          keyboardType="email-address"
          value={form.email}
          onChangeText={v => setForm({ ...form, email: v })}
          style={{ height: '100%' }}
        />
      </View>

      {/* Phone Number */}
      <PhoneNumberField
        ref={phoneInputRef}
        value={form.phone}
        onChangeFormatted={num => {
        setForm({ ...form, phone: num });
        if (phoneInputRef.current && typeof phoneInputRef.current.isValidNumber === 'function') {
          const valid = phoneInputRef.current.isValidNumber(num);
          setPhoneError(valid ? '' : 'Numéro invalide');
        } else {
          console.warn('⚠️ phoneInputRef n’est pas encore prêt ou méthode indisponible', phoneInputRef.current);
        }
      }}
        error={phoneError}
      />

      {/* Password */}
      <View style={[styles.inputRow, { borderColor: colors.textSecondary }]}>
        <Icon name="lock-outline" size={24} color={colors.textSecondary} style={styles.icon} />
        <InputField
          placeholder="Mot de passe"
          secureTextEntry
          value={form.password}
          onChangeText={v => setForm({ ...form, password: v })}
          style={{ height: '100%' }}
        />
      </View>
      <PasswordStrengthMeter password={form.password} />

      {/* Confirm Password */}
      <View style={[styles.inputRow, { borderColor: colors.textSecondary }]}>
        <Icon
          name="lock-check-outline"
          size={24}
          color={colors.textSecondary}
          style={styles.icon}
        />
        <InputField
          placeholder="Confirmez le mot de passe"
          secureTextEntry
          value={form.confirmPassword}
          onChangeText={v => setForm({ ...form, confirmPassword: v })}
          style={{ height: '100%' }}
        />
      </View>
      {pwError ? (
        <Text style={[typography.caption, { color: colors.error, alignSelf: 'flex-start' }]}>
          {pwError}
        </Text>
      ) : null}

      <AppButton
        title={loading ? <ActivityIndicator color={colors.surface} /> : 'S’inscrire'}
        onPress={handleRegister}
        disabled={!canSubmit || loading}
      />

      {toast && (
        <ToastBubble
          type={toast.type}
          message={toast.message}
          onHide={() => setToast(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  animation: { width: 150, height: 150, marginBottom: 16 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    height: 48,
    width: '100%',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  icon: { marginRight: 8, width: 24, height: 24 },
});
