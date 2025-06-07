// backend/middleware/errorHandler.js.js

/**
 * Middleware global de gestion des erreurs.
 * Placez-le en tout dernier dans la chaîne d’Express (après toutes les routes).
 * 
 * Selon err.code (défini dans vos services), on retourne le code HTTP approprié.
 * Par défaut, on renvoie 500 pour toute autre erreur.
 */
export const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Erreur métier : solde insuffisant → 402
  if (err.code === "INSUFFICIENT_FUNDS") {
    return res.status(402).json({ error: "Solde insuffisant" });
  }

  // Erreur métier : contact bloqué → 403 Forbidden
  if (err.code === "CONTACT_FORBIDDEN") {
    return res.status(403).json({ error: "Contact bloqué ou non autorisé" });
  }

  // Erreur QR introuvable ou payload invalide → 404 Not Found
  if (err.code === "QR_NOT_FOUND" || err.code === "QR_INVALID") {
    return res.status(404).json({ error: err.message });
  }

  // Par défaut : 500 Internal Server Error
  return res.status(500).json({ error: "Erreur interne, réessayez plus tard" });
};
