// backend/routes/auth.js
import express from "express";
import { authenticateJWT } from "../../middleware/auth.js";
import {
  register, verifyOtp, login, verifyAuth, resendOtp, logout,
} from "../controllers/authController.js";

const router = express.Router();

// Public
router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/verify-auth", verifyAuth);
router.post("/resend-otp", resendOtp);

// Protégé
router.post("/logout", authenticateJWT, logout);

export default router;
