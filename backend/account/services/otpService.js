// services/otpService.js
import { sendOTPEmail } from '../config/mailer.js';

/**
 * Envoie un OTP à l'adresse email spécifiée.
 * @param {string} to - Email du destinataire.
 * @param {string} otp - Le code OTP à envoyer.
 */
export async function sendOTP(to, otp) {
  await sendOTPEmail(to, otp);
}
