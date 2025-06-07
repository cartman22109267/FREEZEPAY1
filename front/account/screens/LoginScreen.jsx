// account/screens/LoginScreen.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';
import { useTheme } from '../../utils/theme';
import typography from '../../utils/typography';
import InputField from '../../components/InputField';
import AppButton from '../../components/AppButton';
import ToastBubble from '../components/ToastBubble';
import { useRegister, useLogin, useVerifyOtp, useVerifyAuth } from '../controllers/useAuth';
import ApiClient from '../../services/ApiClient';
import { scanBiometric } from '../services/bioService';

export default function LoginScreen({ navigation }) {
  const { colors } = useTheme();
  const animationRef = useRef(null);

  // État MFA vs credentials
  const [step, setStep] = useState('credentials');
  const [userId, setUserId] = useState(null);

  // Formulaires
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [otp, setOtp] = useState('');

  // Toast
  const [toast, setToast] = useState(null);

  // Timer renvoi OTP
  const [resendTimer, setResendTimer] = useState(30);
  useEffect(() => {
    if (step === 'mfa' && resendTimer > 0) {
      const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [step, resendTimer]);

  // Hooks métier
  const { login, loading: loadingLogin, error: errorLogin } = useLogin();
  const { verifyAuth, loading: loadingAuth, error: errorAuth } = useVerifyAuth();

  // Actions

  const handleLogin = async () => {
    try {
      const { userId: id } = await login(form);
      setUserId(id);
      setToast({ type: 'success', message: 'OTP envoyé !' });
      setStep('mfa');
      setResendTimer(30);
    } catch {
      setToast({ type: 'error', message: errorLogin });
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await verifyAuth({ userId, otp });
      setToast({ type: 'success', message: 'Connexion réussie !' });
      navigation.replace('Dashboard');
    } catch {
      setToast({ type: 'error', message: errorAuth });
    }
  };

  const handleBiometric = async () => {
    try {
      const { success, payload } = await scanBiometric();
      if (!success) throw new Error();
      await verifyAuth({ userId, biometricPayload: payload });
      setToast({ type: 'success', message: 'Connexion biométrique !' });
      setToast({ type: 'success', message: 'Entrer otp !' });
    } catch {
      setToast({ type: 'error', message: errorAuth || 'Biométrie échouée' });
    }
  };

  const handleResend = async () => {
    if (resendTimer === 0) {
      try {
        await ApiClient.resendOtp({ userId });
        setToast({ type: 'success', message: 'OTP renvoyé !' });
        setResendTimer(30);
      } catch (err) {
        setToast({ type: 'error', message: err.response?.data?.message || 'Échec renvoi OTP' });
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LottieView
        ref={animationRef}
        source={require('../../../assets/animations/logingif.json')}
        autoPlay
        loop
        style={styles.animation}
      />

      <Text style={[typography.h1, styles.title, { color: colors.textPrimary }]}>
        Connexion
      </Text>

      {step === 'credentials' ? (
        <>
          {/* Identifiant */}
          <View style={[styles.inputRow, { borderColor: colors.textSecondary }]}>
            <Icon name="account-circle-outline" size={24} color={colors.textSecondary} style={styles.icon} />
            <InputField
              placeholder="Email ou Téléphone"
              value={form.identifier}
              onChangeText={(v) => setForm((f) => ({ ...f, identifier: v }))}
              style={{ flex: 1 }}
            />
          </View>

          {/* Mot de passe */}
          <View style={[styles.inputRow, { borderColor: colors.textSecondary }]}>
            <Icon name="lock-outline" size={24} color={colors.textSecondary} style={styles.icon} />
            <InputField
              placeholder="Mot de passe"
              secureTextEntry
              value={form.password}
              onChangeText={(v) => setForm((f) => ({ ...f, password: v }))}
              style={{ flex: 1 }}
            />
          </View>

          {/* Bouton */}
          <AppButton
            title={loadingLogin ? <ActivityIndicator color={colors.surface} /> : 'Se connecter'}
            onPress={handleLogin}
            disabled={loadingLogin}
          />

          {/* Inscription */}
          <TouchableOpacity style={styles.linkRow} onPress={() => navigation.navigate('Registration')}>
            <Text style={[typography.body, { color: colors.brand }]}>
              Pas de compte ? Créer un compte
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={[typography.h2, styles.title, { color: colors.textPrimary }]}>
            Vérification MFA
          </Text>

          {/* OTP */}
          <View style={[styles.inputRow, { borderColor: colors.textSecondary }]}>
            <Icon name="numeric" size={24} color={colors.textSecondary} style={styles.icon} />
            <InputField
              placeholder="Code OTP"
              keyboardType="numeric"
              value={otp}
              onChangeText={setOtp}
              style={{ flex: 1 }}
            />
          </View>

          {/* Valider code */}
          <AppButton
            title={loadingAuth ? <ActivityIndicator color={colors.surface} /> : 'Valider le code'}
            onPress={handleVerifyOtp}
            disabled={loadingAuth}
          />

          {/* Biometrie */}
          <AppButton
            title={
              <><Icon name="fingerprint" size={18} color={colors.surface} />  Utiliser la biométrie</>
            }
            onPress={handleBiometric}
            style={{ marginTop: 12 }}
          />

          {/* Renvoi OTP */}
          <TouchableOpacity
            style={styles.resendRow}
            onPress={handleResend}
            disabled={resendTimer > 0}
          >
            <Icon
              name="refresh"
              size={18}
              color={resendTimer > 0 ? colors.textSecondary : colors.brand}
            />
            <Text
              style={[
                typography.body,
                {
                  color: resendTimer > 0 ? colors.textSecondary : colors.brand,
                  marginLeft: 6,
                },
              ]}
            >
              {resendTimer > 0
                ? `Renvoyer dans ${resendTimer}s`
                : 'Renvoyer OTP'}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {/* Toast */}
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
  animation: { width: 120, height: 120, marginBottom: 16 },
  title: { textAlign: 'center', marginBottom: 24 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    marginVertical: 6,
  },
  icon: { marginRight: 8 },
  linkRow: { marginTop: 16 },
  resendRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
});
