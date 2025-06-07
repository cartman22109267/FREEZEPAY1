// backend/account/middleware/ensureMfa.js
import { AuthMethodModel } from "../models/authMethodModel.js";

export async function ensureMfa(req, res, next) {
  const userId = req.user.id;
  // Vérifier dans la table auth_methods qu’au moins un method (pin/otp/biometric) est activé
  const methods = await AuthMethodModel.findByUserId(userId);
  if (!methods || methods.length === 0) {
    return res.status(403).json({ error: "MFA non configuré pour cet utilisateur" });
  }
  next();
}
