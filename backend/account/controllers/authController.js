// src/controllers/authController.js

import { pool } from '../../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendOTP } from '../services/otpService.js';
import { verifyBiometric } from '../services/bioService.js';

const OTP_TTL = parseInt(process.env.OTP_TTL) || 300;

// 1) Register → envoie OTP
export async function register(req, res, next) {
  const client = await pool.connect();
  let userId;
  let otp;

  try {
    const { email, phone, full_name, password } = req.body;
    const pwdHash = await bcrypt.hash(password, 10);

    await client.query('BEGIN');

    otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Insertion de l'utilisateur
    const userInsert = await client.query(
      `INSERT INTO users(email, phone, full_name, password_hash)
       VALUES($1, $2, $3, $4)
       RETURNING id`,
      [email, phone, full_name, pwdHash]
    );
    userId = userInsert.rows[0].id;

    // Insertion de la méthode OTP
    await client.query(
      `INSERT INTO auth_methods(user_id, type, secret, enabled, created_at)
       VALUES($1, 'otp', $2, false, now())`,
      [userId, otp]
    );

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    client.release();

    if (err.code === '23505') {
      let field = 'champ';
      if (err.constraint === 'users_email_key') {
        field = 'email';
      } else if (err.constraint === 'users_phone_key') {
        field = 'phone';
      }
      return res.status(400).json({ message: `Le ${field} est déjà utilisé.` });
    }

    return next(err);
  }

  client.release();

  try {
    const { email, phone } = req.body;
    await sendOTP(email || phone, otp);
  } catch (otpErr) {
    console.error('Erreur lors de l’envoi de l’OTP :', otpErr);
    // Ne bloque pas la création du compte
  }

  return res.status(200).json({ message: 'OTP envoyé', userId });
}

// 2) Verify OTP → activation du compte
export async function verifyOtp(req, res, next) {
  try {
    const { user_id, otp } = req.body;

    console.log('Payload verify-otp:', req.body);

    const { rows } = await pool.query(
      `SELECT secret FROM auth_methods
       WHERE user_id=$1 AND type='otp' AND enabled=false`,
      [user_id]
    );

    if (!rows.length || rows[0].secret !== otp) {
      return res.status(401).json({ message: 'OTP invalide' });
    }

    await pool.query(
      `UPDATE auth_methods
       SET enabled=true, secret=NULL
       WHERE user_id=$1 AND type='otp'`,
      [user_id]
    );

    return res.json({ message: 'Compte créé' });
  } catch (err) {
    next(err);
  }
}

// 3) Login → envoie OTP & retourne userId
export async function login(req, res, next) {
  try {
    const { identifier, password } = req.body;

    const { rows } = await pool.query(
      `SELECT id, password_hash FROM users
       WHERE email=$1 OR phone=$1`,
      [identifier]
    );

    if (!rows.length) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const { id: userId, password_hash } = rows[0];
    const match = await bcrypt.compare(password, password_hash);

    if (!match) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await pool.query(
      `UPDATE auth_methods
       SET secret=$1, enabled=false, created_at=now()
       WHERE user_id=$2 AND type='otp'`,
      [otp, userId]
    );

    await sendOTP(identifier, otp);

    return res.json({ message: 'OTP envoyé', userId });
  } catch (err) {
    next(err);
  }
}

// 4) Verify Auth → OTP et/ou biométrie
export async function verifyAuth(req, res, next) {
  try {
    const { user_id, otp, biometric_payload } = req.body;

    console.log('Payload verify-auth:', req.body);

    // 4a) Vérif OTP
    if (otp) {
      const { rows } = await pool.query(
        `SELECT secret, created_at FROM auth_methods
         WHERE user_id=$1 AND type='otp' AND enabled=false`,
        [user_id]
      );

      if (!rows.length || rows[0].secret !== otp) {
        return res.status(401).json({ message: 'Code OTP invalide' });
      }

      const otpAge = (Date.now() - new Date(rows[0].created_at).getTime()) / 1000;
      if (otpAge > OTP_TTL) {
        return res.status(401).json({ message: 'OTP expiré' });
      }

      await pool.query(
        `UPDATE auth_methods
         SET enabled=true, secret=NULL
         WHERE user_id=$1 AND type='otp'`,
        [user_id]
      );
    }

    // 4b) Vérif biométrie
    if (biometric_payload) {
      const ok = await verifyBiometric(user_id, biometric_payload);
      if (!ok) {
        return res.status(401).json({ message: 'Biométrie invalide' });
      }
    }

    // 4c) Création session + JWT
    const token = jwt.sign({ userId: user_id }, process.env.JWT_SECRET, { expiresIn: '12h' });

    await pool.query(
      `INSERT INTO sessions(user_id, device_info, ip_address, expires_at)
       VALUES($1, $2, $3, now() + interval '12 hours')`,
      [user_id, req.headers['user-agent'], req.ip]
    );

    return res.json({ token });
  } catch (err) {
    next(err);
  }
}

// 5) Resend OTP → renvoie un nouvel OTP
export async function resendOtp(req, res, next) {
  try {
    const { user_id } = req.body;

    console.log('Payload resend-otp:', req.body);

    const { rows } = await pool.query(
      `SELECT email, phone FROM users WHERE id=$1`,
      [user_id]
    );
    if (!rows.length) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    const { email, phone } = rows[0];

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const updateResult = await pool.query(
      `UPDATE auth_methods
       SET secret=$1, enabled=false, created_at=now()
       WHERE user_id=$2 AND type='otp'
       RETURNING *`,
      [otp, user_id]
    );
    if (!updateResult.rows.length) {
      return res.status(404).json({ message: 'Méthode OTP introuvable.' });
    }

    await sendOTP(email || phone, otp);

    return res.json({ message: 'OTP renvoyé' });
  } catch (err) {
    next(err);
  }
}

// 6) Logout → supprime la session
export async function logout(req, res, next) {
  try {
    const { user_id } = req.body;

    await pool.query(`DELETE FROM sessions WHERE user_id=$1`, [user_id]);

    return res.json({ message: 'Déconnexion réussie' });
  } catch (err) {
    next(err);
  }
}
