// payment/models/qrModel.js
import {pool} from "../../config/db.js";

export const QRModel = {
  async create(ownerId, purpose, amount, expiresAt, data) {
    const query = `INSERT INTO qr_codes(id, owner_id, purpose, amount, expires_at, data, created_at)
                   VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, now())
                   RETURNING *`;
    const { rows } = await pool.query(query, [ownerId, purpose, amount, expiresAt, data]);
    return rows[0];
  },

  async findById(id) {
    const query = `SELECT * FROM qr_codes WHERE id = $1 AND expires_at > now()`;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  },

  async deleteById(id) {
    await pool.query(`DELETE FROM qr_codes WHERE id = $1`, [id]);
  },
};
