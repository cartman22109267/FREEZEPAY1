// payment/controllers/qrController.js
import { QRService } from "../services/qrService.js";

export const QRController = {
  /**
   * POST /create-qr
   * Body attendu : { amount: number, expiresInMs?: number }
   * L’utilisateur (receveur) est authentifié (user.id).
   */
  async createQR(req, res, next) {
    try {
      const ownerId = req.user.id;
      const { amount, expiresInMs } = req.body;
      if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: "Montant invalide" });
      }

      const qr = await QRService.createQR(ownerId, amount, expiresInMs);
      // On renvoie les données nécessaires pour générer le QR côté front
      return res.status(201).json(qr);
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /qr/:id
   * Sert à l’étape « Scanner QR » par le payeur. 
   * Renvoie les détails pour afficher « Montant / Receveur » + bouton « Payer ».
   */
  async getQRInfo(req, res, next) {
    try {
      const qrId = req.params.id;
      const info = await QRService.getQRInfo(qrId);
      // Exemple de réponse : { qrId, ownerId, amount, expiresAt }
      return res.status(200).json(info);
    } catch (err) {
      next(err);
    }
  }
};
