// payment/routes/bluetoothRoutes.js
import { Router } from "express";
import { BluetoothController } from "../controllers/bluetoothController.js";
import { authenticateJWT } from "../../middleware/auth.js";

const router = Router();

// Confirmer un paiement Bluetooth (après acceptation côté receveur)
router.post("/confirm-bluetooth", authenticateJWT, BluetoothController.confirmBluetooth);

export default router;
