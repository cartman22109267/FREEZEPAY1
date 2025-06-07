// screens/RegistrationOTPVerificationScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../utils/theme';
import typography from '../../utils/typography';
import InputField from '../../components/InputField';
import AppButton from '../../components/AppButton';
import ToastBubble from '../components/ToastBubble';
import { useVerifyOtp } from '../controllers/useAuth';
import apiService from '../../services/ApiClient';

export default function RegistrationOTPVerificationScreen({ route, navigation }) {
  const { userId } = route.params;
  const { colors } = useTheme();
  const { verifyOtp, loading, error } = useVerifyOtp();
  const [otp, setOtp] = useState('');
  const [toast, setToast] = useState(null);
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(t => t - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleVerify = async () => {
    try {
      await verifyOtp({ userId, otp });
      setToast({ type: 'success', message: 'Compte créé !' });
      navigation.replace('Login');
    } catch {
      setToast({ type: 'error', message: error });
    }
  };

  const handleResend = async () => {
    if (resendTimer === 0) {
      await apiService.resendOtp({ userId });
      setToast({ type: 'success', message: 'OTP renvoyé !' });
      setResendTimer(30);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[typography.h2, { color: colors.textPrimary }]}>Vérification OTP</Text>

      <View style={styles.inputRow}>
        <Icon name="numeric" size={20} color={colors.textSecondary} style={styles.icon} />
        <InputField
          placeholder="Code OTP"
          keyboardType="numeric"
          value={otp}
          onChangeText={setOtp}
        />
      </View>

      <AppButton
        title={loading ? <ActivityIndicator color={colors.surface} /> : 'Valider'}
        onPress={handleVerify}
        disabled={loading}
      />

      <TouchableOpacity
        onPress={handleResend}
        disabled={resendTimer > 0}
        style={styles.resend}
      >
        <Icon
          name="refresh"
          size={16}
          color={resendTimer > 0 ? colors.textSecondary : colors.brand}
        />
        <Text
          style={[
            typography.body,
            { color: resendTimer > 0 ? colors.textSecondary : colors.brand, marginLeft: 4 },
          ]}
        >
          {resendTimer > 0 ? `Renvoyer dans ${resendTimer}s` : 'Renvoyer OTP'}
        </Text>
      </TouchableOpacity>

      {toast && (
        <ToastBubble type={toast.type} message={toast.message} onHide={() => setToast(null)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  icon: { marginRight: 8 },
  resend: { flexDirection: 'row', alignItems: 'center', marginTop: 16, justifyContent: 'center' },
});
