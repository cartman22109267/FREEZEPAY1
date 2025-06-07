// payment/routes/paymentRoutes.js
import { Router } from "express";
import { PaymentController } from "../controllers/paymentController.js";
import { authenticateJWT } from "../../middleware/auth.js";

const router = Router();

// Route pour finaliser un paiement via QR (après GET /qr/:id)
router.post("/send-payment", authenticateJWT, PaymentController.payViaQR);

export default router;
