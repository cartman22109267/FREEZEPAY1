// payment/controllers/paymentController.js
import { PaymentService } from "../services/paymentService.js";

export const PaymentController = {
  /**
   * POST /send-payment
   * Body : { qrId: string }
   * On récupère payerId via req.user.id
   */
  async payViaQR(req, res, next) {
    try {
      const payerId = req.user.id;
      const { qrId } = req.body;
      if (!qrId) {
        return res.status(400).json({ error: "qrId manquant" });
      }
      const result = await PaymentService.payViaQR(payerId, qrId);
      return res.status(200).json({
        message: "Transaction réussie",
        transaction: result.transaction,
      });
    } catch (err) {
      next(err);
    }
  }
};
