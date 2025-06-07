// payment/controllers/bluetoothController.js
import { BluetoothService } from "../services/bluetoothService.js";

export const BluetoothController = {
  /**
   * POST /confirm-bluetooth
   * Body : { payeeId: string, amount: number }
   * payerId = req.user.id
   */
  async confirmBluetooth(req, res, next) {
    try {
      const payerId = req.user.id;
      const { payeeId, amount } = req.body;
      if (!payeeId || !amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: "Données invalides" });
      }
      const result = await BluetoothService.confirmBluetooth(payerId, payeeId, amount);
      return res.status(200).json({
        message: "Paiement Bluetooth réussi",
        transaction: result.transaction,
      });
    } catch (err) {
      next(err);
    }
  }
};
