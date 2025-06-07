// src/config/mailer.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOTPEmail(to, otp) {
  const mailOptions = {
    from: `"FreezePay Auth" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Votre code OTP',
    text: `Votre code de vérification est : ${otp}. Ce code est valide 5 minutes.`,
  };
  return transporter.sendMail(mailOptions);
}
