// payment/services/bluetoothService.js
import { PaymentService } from "./paymentService.js";

export const BluetoothService = {
  async confirmBluetooth(payerId, payeeId, amount) {
    // On appelle directement la méthode depuis paymentService
    return PaymentService.payViaBluetooth(payerId, payeeId, amount);
  }
};
