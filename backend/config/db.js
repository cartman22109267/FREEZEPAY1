// C:\freezepay\backend\config\db.js
import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

// Export nommé pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err) => {
  console.error("Erreur inattendue sur le client idle :", err);
  process.exit(-1);
});
