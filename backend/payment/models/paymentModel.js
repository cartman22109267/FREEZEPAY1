// payment/models/paymentModel.js
import {pool} from "../../config/db.js";

export const PaymentModel = {
  async create(payerId, payeeId, method, amount) {
    const query = `INSERT INTO payments(id, payer_id, payee_id, method, status, amount, created_at, updated_at)
                   VALUES (uuid_generate_v4(), $1, $2, $3, 'pending', $4, now(), now())
                   RETURNING *`;
    const { rows } = await pool.query(query, [payerId, payeeId, method, amount]);
    return rows[0];
  },

  async updateStatus(paymentId, status) {
    const query = `UPDATE payments SET status = $1, updated_at = now() WHERE id = $2 RETURNING *`;
    const { rows } = await pool.query(query, [status, paymentId]);
    return rows[0];
  },

  async findById(id) {
    const query = `SELECT * FROM payments WHERE id = $1`;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  },

  // Éventuellement ajouter findByUser, etc.
};
