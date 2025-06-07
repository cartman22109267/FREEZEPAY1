// payment/routes/qrRoutes.js
import { Router } from "express";
import { QRController } from "../controllers/qrController.js";
import { authenticateJWT } from "../../middleware/auth.js";

const router = Router();

// Générer un QR (uniquement pour un receveur authentifié)
router.post("/create-qr", authenticateJWT, QRController.createQR);

// Lire un QR scanné (n'importe qui, token requis pour récupérer user ? On peut exiger un token pour le payeur)
router.get("/qr/:id", authenticateJWT, QRController.getQRInfo);

export default router;
