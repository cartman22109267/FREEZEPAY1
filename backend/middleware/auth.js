// backend/middleware/auth.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/**
 * Middleware global pour vérifier la présence et la validité d'un JWT.
 * Si le token est valide, on place { id: userId } dans req.user.
 * Sinon, on retourne un 401 Unauthorized.
 */
export function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Token manquant" });
  }

  // Format attendu : "Bearer <token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Format du token invalide" });
  }

  const token = parts[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token invalide ou expiré" });
    }
    // On attend que decoded contient au moins { userId }
    req.user = { id: decoded.userId };
    next();
  });
}
