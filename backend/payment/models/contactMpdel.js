// payment/models/contactModel.js
import {pool} from "../../config/db.js";

export const ContactModel = {
  async isContact(ownerId, contactId) {
    const query = `SELECT 1 FROM contacts WHERE owner_id = $1 AND contact_id = $2`;
    const { rowCount } = await pool.query(query, [ownerId, contactId]);
    return rowCount > 0;
  },

  async create(ownerId, contactId, alias = null) {
    const query = `INSERT INTO contacts(id, owner_id, contact_id, alias, created_at)
                   VALUES (uuid_generate_v4(), $1, $2, $3, now())
                   RETURNING *`;
    const { rows } = await pool.query(query, [ownerId, contactId, alias]);
    return rows[0];
  },

  // Vous pouvez ajouter une méthode pour bloquer/débloquer si vous ajoutez un champ 'blocked' dans la table.
};
