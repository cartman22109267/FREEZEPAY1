// payment/services/notificationService.js

export const NotificationService = {
  /**
   * Envoi d’une notification au destinataire pour signaler la réception d’un paiement.
   * Ici, on log simplement en console ou on simule.
   */
  sendPaymentReceived(payeeId, payload) {
    // TODO : intégrer un vrai service FCM, APNs, etc.
    console.log(`Notification envoyée à ${payeeId} : Paiement reçu de ${payload.from}, montant ${payload.amount}, transaction ${payload.transactionId}`);
  }
};
