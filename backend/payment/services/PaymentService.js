// payment/services/paymentService.js
import { PaymentModel } from "../models/paymentModel.js";
import { TransactionModel } from "../models/transactionModel.js";
import { UserService } from "./userService.js";
import { QRService } from "./qrService.js";
import { NotificationService } from "./notificationService.js";
import {pool} from "../../config/db.js";

/**
 * On gère deux grandes fonctions :
 * 1) Paiement via QR (frontend appelle /send-payment après avoir lu le QR)
 * 2) Paiement via Bluetooth (flux légèrement différent)
 * 
 * Dans les deux cas, on :
 * - On crée d’abord un enregistrement en table payments (status='pending')
 * - On vérifie le solde du payer
 *    - Si OK : on débite, on crédite, on crée un transaction record, on met payments.status='accepted'
 *    - Sinon : payments.status='failed' et on renvoie erreur 402
 * - On déclenche une notification vers le payee
 * - On supprime (ou marque consommé) le QR (dans le cas du QR)
 */

export const PaymentService = {
  /**
   * Traitement du paiement « classique » via QR :
   * - payerId : l’ID du payeur (récupéré depuis le token JWT)
   * - qrId    : l’ID du QR scanné
   */
  async payViaQR(payerId, qrId) {
    // 1) Récupérer info du QR
    const qrInfo = await QRService.getQRInfo(qrId);
    const payeeId = qrInfo.ownerId;
    const amount = qrInfo.amount;

    // 2) Valider que payerId a le payeeId dans ses contacts
    await UserService.validateContact(payerId, payeeId);

    // 3) Création d’un enregistrement payments (status = 'pending')
    const paymentRecord = await PaymentModel.create(payerId, payeeId, "qr", amount);

    // 4) Vérifier le solde du payer
    const hasEnough = await UserService.checkBalance(payerId, amount);
    if (!hasEnough) {
      // Met à jour payment.status = 'failed'
      await PaymentModel.updateStatus(paymentRecord.id, "failed");
      const err = new Error("Solde insuffisant");
      err.code = "INSUFFICIENT_FUNDS";
      throw err;
    }

    // 5) Démarrer une transaction PostgreSQL pour garantir atomicité
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // a) Débiter payeur
      await UserService.deductBalance(payerId, amount);

      // b) Créditer payee
      await UserService.creditBalance(payeeId, amount);

      // c) Mettre à jour payment.status = 'accepted'
      await PaymentModel.updateStatus(paymentRecord.id, "accepted");

      // d) Créer l’enregistrement transaction
      const transactionRecord = await TransactionModel.create(
        paymentRecord.id,
        payerId,
        payeeId,
        amount,
        "completed"
      );

      await client.query("COMMIT");

      // e) Supprimer le QR (pour éviter réutilisation)
      await QRService.deleteQR(qrId);

      // f) Notifier le payee
      NotificationService.sendPaymentReceived(payeeId, {
        from: payerId,
        amount,
        transactionId: transactionRecord.id,
      });

      // g) On renvoie la transaction
      return {
        transaction: transactionRecord,
        payment: paymentRecord,
      };
    } catch (e) {
      await client.query("ROLLBACK");
      // Si erreur interne (p.ex. DB down), on met status = 'failed'
      await PaymentModel.updateStatus(paymentRecord.id, "failed");
      throw e;
    } finally {
      client.release();
    }
  },

  /**
   * Traitement du paiement via Bluetooth :
   * - payerId     : ID du payeur (via JWT)
   * - payeeId     : ID du receveur (déjà sélectionné localement)
   * - amount      : montant entré par le payeur
   * - bluetoothTx : informations éventuelles (non critiquées ici)
   */
  async payViaBluetooth(payerId, payeeId, amount) {
    // 1) Valider contact
    await UserService.validateContact(payerId, payeeId);

    // 2) Création paiement en base (status pending)
    const paymentRecord = await PaymentModel.create(payerId, payeeId, "bluetooth", amount);

    // 3) Vérifier solde
    const hasEnough = await UserService.checkBalance(payerId, amount);
    if (!hasEnough) {
      await PaymentModel.updateStatus(paymentRecord.id, "failed");
      const err = new Error("Solde insuffisant");
      err.code = "INSUFFICIENT_FUNDS";
      throw err;
    }

    // 4) Même logique transactionnelle que pour QR
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      await UserService.deductBalance(payerId, amount);
      await UserService.creditBalance(payeeId, amount);
      await PaymentModel.updateStatus(paymentRecord.id, "accepted");

      const transactionRecord = await TransactionModel.create(
        paymentRecord.id,
        payerId,
        payeeId,
        amount,
        "completed"
      );

      await client.query("COMMIT");

      // 5) Notifier payee
      NotificationService.sendPaymentReceived(payeeId, {
        from: payerId,
        amount,
        transactionId: transactionRecord.id,
      });

      return {
        transaction: transactionRecord,
        payment: paymentRecord,
      };
    } catch (e) {
      await client.query("ROLLBACK");
      await PaymentModel.updateStatus(paymentRecord.id, "failed");
      throw e;
    } finally {
      client.release();
    }
  },
};
