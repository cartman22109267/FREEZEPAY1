// payment/services/qrService.js
import { QRModel } from "../models/qrModel.js";
import { UserService } from "./userService.js";
import crypto from "crypto";

export const QRService = {
  /**
   * Génère un QR pour un destinataire : 
   * - ownerId : celui qui publie le QR (le receveur)
   * - amount : montant à recevoir
   * - expiresInMs : délai d’expiration
   * 
   * On chiffre dans `data` un payload JSON { ownerId, amount, qrId } en base64 AES (exemple). 
   * Vous pouvez adapter selon votre clé ou méthode d’encrypt.
   */
  async createQR(ownerId, amount, expiresInMs = 5 * 60 * 1000) {
    // 1) Calcul de expiresAt
    const expiresAt = new Date(Date.now() + expiresInMs);

    // 2) Création d’un ID QR (postgreSQL gère uuid) via le modèle
    // Générons d’abord un ID temporaire pour l’associer au data
    const tempId = crypto.randomUUID();

    // 3) Création d’un payload chiffré (ici, simple AES-256-CBC pour l’exemple)
    const key = crypto.scryptSync(process.env.JWT_SECRET, "salt", 32);
    const iv = crypto.randomBytes(16);
    const payload = JSON.stringify({ ownerId, amount, qrId: tempId });
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(payload, "utf8", "hex");
    encrypted += cipher.final("hex");
    const data = iv.toString("hex") + ":" + encrypted;

    // 4) Insertion en base
    const record = await QRModel.create(ownerId, "payment", amount, expiresAt, data);

    // 5) On renvoie : { qrId, amount, expiresAt, data } (data = chaîne chiffrée)
    return {
      qrId: record.id, 
      amount: record.amount, 
      expiresAt: record.expires_at, 
      data: record.data
    };
  },

  /**
   * Lecture d’un QR : on récupère l’enregistrement, on décrypte `data` pour valider l’info.
   */
  async getQRInfo(qrId) {
    const record = await QRModel.findById(qrId);
    if (!record) {
      const err = new Error("QR introuvable ou expiré");
      err.code = "QR_NOT_FOUND";
      throw err;
    }
    // Déchiffrage
    const [ivHex, encrypted] = record.data.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const key = crypto.scryptSync(process.env.JWT_SECRET, "salt", 32);
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    const payload = JSON.parse(decrypted);

    // Vérifier que le payload.qrId correspond bien à record.id
    if (payload.qrId !== record.id) {
      const err = new Error("Payload QR invalide");
      err.code = "QR_INVALID";
      throw err;
    }

    // On renvoie les infos nécessaires pour l’étape « Affiche détails + bouton »
    return {
      qrId: record.id,
      ownerId: payload.ownerId,
      amount: parseFloat(payload.amount),
      expiresAt: record.expires_at
    };
  },

  async deleteQR(qrId) {
    await QRModel.deleteById(qrId);
  }
};
