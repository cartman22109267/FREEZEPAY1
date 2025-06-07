// services/otpService.js
import api from '../../services/ApiClient';

export const sendOtp = async userId => {
  // Le backend gère la régénération/envoi
  return api.resendOtp({ userId });
};
