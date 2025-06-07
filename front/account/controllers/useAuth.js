// src/controllers/useAuth.js

import { useState } from 'react';
import ApiClient from '../../services/ApiClient';

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const register = async ({ email, phone, fullName, password }) => {
    setLoading(true);
    setError('');
    try {
      const resp = await ApiClient.register({ email, phone, fullName, password });
      return resp.data.userId;
    } catch (err) {
      console.group('useRegister › API error');


      const msg = err.response?.data?.message || 'Erreur inscription';
      setError(msg);
      throw { message: msg, fullError: err };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError('');

  return { register, loading, error, clearError };
}

export function useVerifyOtp() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const verifyOtp = async ({ userId, otp }) => {
    setLoading(true);
    setError('');
    try {
      await ApiClient.verifyOtp({ userId, otp });
    } catch (err) {
      console.group('useVerifyOtp › API error');


      const msg = err.response?.data?.message || 'OTP invalide';
      setError(msg);
      throw { message: msg, fullError: err };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError('');

  return { verifyOtp, loading, error, clearError };
}

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const login = async ({ identifier, password }) => {
    setLoading(true);
    setError('');
    try {
      const resp = await ApiClient.login({ identifier, password });
      // resp.data => { userId }
      return resp.data.userId;
    } catch (err) {
      console.group('useLogin › API error');


      const msg = err.response?.data?.message || 'Échec de la connexion';
      setError(msg);
      throw { message: msg, fullError: err };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError('');

  return { login, loading, error, clearError };
}

export function useVerifyAuth() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const verifyAuth = async ({ userId, otp, biometricPayload }) => {
    setLoading(true);
    setError('');
    try {
      const resp = await ApiClient.verifyAuth({ userId, otp, biometricPayload });
      // resp.data => { token }
      await ApiClient.setToken(resp.data.token);
      return resp.data.token;
    } catch (err) {
      console.group('useVerifyAuth › API error');


      const msg = err.response?.data?.message || 'Échec de la vérification';
      setError(msg);
      throw { message: msg, fullError: err };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError('');

  return { verifyAuth, loading, error, clearError };
}

export function useResendOtp() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const resendOtp = async (userId) => {
    setLoading(true);
    setError('');
    try {
      await ApiClient.resendOtp({ userId });
    } catch (err) {
      console.group('useResendOtp › API error');


      const msg = err.response?.data?.message || 'Impossible de renvoyer l’OTP';
      setError(msg);
      throw { message: msg, fullError: err };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError('');

  return { resendOtp, loading, error, clearError };
}
