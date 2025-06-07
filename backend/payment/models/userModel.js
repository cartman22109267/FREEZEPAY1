// payment/models/userModel.js
import {pool} from "../../config/db.js";

export const UserModel = {
  async findById(id) {
    const query = `SELECT id, email, phone, full_name, balance, created_at, updated_at
                   FROM users WHERE id = $1`;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  },

  async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = $1`;
    const { rows } = await pool.query(query, [email]);
    return rows[0] || null;
  },

  async updateBalance(userId, newBalance) {
    const query = `UPDATE users SET balance = $1, updated_at = now() WHERE id = $2 RETURNING balance`;
    const { rows } = await pool.query(query, [newBalance, userId]);
    return rows[0];
  },

  // Ajoutez d'autres méthodes au besoin (création d'utilisateur, hachage, etc.)
};
