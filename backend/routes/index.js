// backend/routes/index.js
import { Router } from "express";

// Import de tous vos sous-routeurs métiers
import authRoutes from "../account/routes/auth.js";

// Si vous avez d’autres modules (paiement, qr, bluetooth), importez-les ici aussi :
import qrRoutes from "../payment/routes/qrRoutes.js";
import paymentRoutes from "../payment/routes/paymentRoutes.js";
import bluetoothRoutes from "../payment/routes/bluetoothRoutes.js";

const router = Router();

// → Tous les endpoints d'authentification
//    /api/auth/register, /api/auth/login, etc.
router.use("/auth", authRoutes);

// → Exemple d’autres modules (à décommenter si vous les avez) :
router.use("/create-qr", qrRoutes); // Pour créer un QR code
router.use("/qr", qrRoutes);
router.use("/payment", paymentRoutes);
router.use("/bluetooth", bluetoothRoutes);

export default router;
