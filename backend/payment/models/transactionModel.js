// payment/models/transactionModel.js
import {pool} from "../../config/db.js";

export const TransactionModel = {
  async create(paymentId, fromUser, toUser, amount, status) {
    const query = `INSERT INTO transactions(id, payment_id, from_user, to_user, amount, status, created_at)
                   VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, now())
                   RETURNING *`;
    const { rows } = await pool.query(query, [paymentId, fromUser, toUser, amount, status]);
    return rows[0];
  },

  async findById(id) {
    const query = `SELECT * FROM transactions WHERE id = $1`;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  },

  // D’autres méthodes si besoin.
};
