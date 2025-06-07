// backend/server.js
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import apiRouter from "./routes/index.js";
import { authenticateJWT } from "./middleware/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// — Activation des middlewares globaux —
// Sécurité des headers HTTP
app.use(helmet());

// Autoriser le Cross‐Origin (à configurer selon vos besoins)
app.use(cors());

// Pour parser le JSON dans le body
app.use(express.json());

// Journalisation des requêtes HTTP (dev / production selon config)
app.use(morgan("dev"));

// — Montage des routes —

// Choix 1 : Protéger **toutes** les routes /api/** avec JWT
// ---------------------------------------------------------
// Si vous voulez qu’aucune route /api/... ne soit accessible 
// sans JWT, décommentez la ligne suivante :
//
// app.use("/api", authenticateJWT, apiRouter);
//
// Dans ce cas, TOUTES les sous-routes (auth, paiement, qr, bluetooth…) 
// seront protégées. Même /api/auth/register demandera un token (normalement, 
// votre /register est public, donc vous n’utiliserez sans doute pas ce cas).

// Choix 2 : Laisser les modules décider eux-mêmes de leur protection JWT
// ----------------------------------------------------------------------
// Si vous souhaitez que **certaines** routes soient publiques (par ex. /register, /login) 
// et que **d’autres** soient protégées, laissez la ligne ci-dessous active, 
// et montez `authenticateJWT` directement dans **chaque** sous-routeur lorsque nécessaire.
//
// Par exemple, dans `routes/auth.js`, les routes “/register” et “/login” resteront publiques, 
// tandis que `/auth/logout` pourra être protégé en ajoutant `authenticateJWT` dans `authRoutes`.

app.use("/api", apiRouter);

// — Middleware global de gestion des erreurs (toujours last) —
// ------------------------------------------------------------
app.use(errorHandler);

// — Démarrage du serveur —
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🏂🏾Serveur démarré sur http://localhost:${PORT}`);
});
