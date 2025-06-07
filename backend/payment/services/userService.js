// payment/services/userService.js
import { UserModel } from "../models/userModel.js";
import { ContactModel } from "../models/contactMpdel.js";

export const UserService = {
  async getUserById(userId) {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error("Utilisateur non trouvé");
    return user;
  },

  async checkBalance(userId, amount) {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error("Utilisateur non trouvé");
    return parseFloat(user.balance) >= parseFloat(amount);
  },

  async deductBalance(userId, amount) {
    const user = await UserModel.findById(userId);
    const newBalance = parseFloat(user.balance) - parseFloat(amount);
    if (newBalance < 0) throw new Error("Solde insuffisant");
    const updated = await UserModel.updateBalance(userId, newBalance);
    return updated.balance;
  },

  async creditBalance(userId, amount) {
    const user = await UserModel.findById(userId);
    const newBalance = parseFloat(user.balance) + parseFloat(amount);
    const updated = await UserModel.updateBalance(userId, newBalance);
    return updated.balance;
  },

  async validateContact(payerId, payeeId) {
    const isContact = await ContactModel.isContact(payerId, payeeId);
    if (!isContact) {
      const err = new Error("Contact bloqué ou non autorisé");
      err.code = "CONTACT_FORBIDDEN";
      throw err;
    }
  },

  // Ajoutez d’autres méthodes (auth, création d’utilisateur, etc.) si nécessaire.
};
