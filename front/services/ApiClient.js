// src/services/ApiClient.js

// src/services/ApiClient.js
import axios from "axios";
import xhrAdapter from "axios/lib/adapters/xhr";

axios.defaults.adapter = xhrAdapter;

// … reste de votre code ApiClient …

import AsyncStorage from "@react-native-async-storage/async-storage";

class ApiClient {
  constructor() {
    this.api = axios.create({
      baseURL: "http://192.168.1.100:3000/api",
      timeout: 300000,
      headers: { "Content-Type": "application/json" },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      async (config) => {
        console.log(`→ ${config.method.toUpperCase()} ${config.baseURL}${config.url}`, config.data);
        try {
          const token = await AsyncStorage.getItem("token");
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log("   • Authorization: Bearer [token présent]");
          }
        } catch (storageErr) {
          console.warn("⚠️ Erreur AsyncStorage:", storageErr);
        }
        return config;
      },
      (err) => {
        console.error("⚠️ Request interceptor error:", err);
        return Promise.reject(err);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        console.log(`← ${response.status} ${response.config.url}`, response.data);
        return response;
      },
      (err) => {
        if (!err.response) {
          console.group("⚠️ Axios Network Error");
          console.error(err.toJSON ? err.toJSON() : err);
          console.groupEnd();
        } else {
          console.group("⚠️ Axios HTTP Error");
          console.error(`← ${err.response.status} ${err.config.url}`, err.response.data);
          console.groupEnd();
          if (err.response.status === 401) {
            console.warn("🔒 401 Unauthorized – TODO: déclencher un logout global");
          }
        }
        return Promise.reject(err);
      }
    );
  }

  // ----- Auth & MFA -----

  register({ email, phone, fullName, password }) {
    return this.api.post("/auth/register", {
      email,
      phone,
      full_name: fullName,
      password,
    });
  }

  login({ identifier, password }) {
    // renvoie { userId }
    return this.api.post("/auth/login", { identifier, password });
  }

  verifyOtp({ userId, otp }) {
    return this.api.post("/auth/verify-otp", {
      user_id: userId,
      otp,
    });
  }

  verifyAuth({ userId, otp, biometricPayload }) {
    // renvoie { token }
    return this.api.post("/auth/verify-auth", {
      user_id: userId,
      otp,
      biometric_payload: biometricPayload,
    });
  }

  resendOtp({ userId }) {
    return this.api.post("/auth/resend-otp", {
      user_id: userId,
    });
  }

  // ----- User management -----

  getUsers() {
    return this.api.get("/users");
  }
  getUserById(id) {
    return this.api.get(`/users/${id}`);
  }
  updateUser(id, data) {
    return this.api.put(`/users/${id}`, data);
  }
  deleteUser(id) {
    return this.api.delete(`/users/${id}`);
  }

  // ----- QR Code -----

  createQR(amount) {
    return this.api.post("/qr/create-qr", { amount });
  }
  getQRInfo(qrId) {
    return this.api.get(`/qr/${qrId}`);
  }

  // ----- Paiement via QR -----

  sendPayment(qrId) {
    return this.api.post("/send-payment", { qrId });
  }

  // ----- Paiement via Bluetooth -----

  confirmBluetooth(payeeId, amount) {
    return this.api.post("/confirm-bluetooth", { payeeId, amount });
  }

  // ----- Contacts -----

  fetchNearbyContacts() {
    return this.api.get("/contacts/nearby");
  }

  // ----- Session management -----

  async setToken(token) {
    await AsyncStorage.setItem("token", token);
  }
  async clearToken() {
    await AsyncStorage.removeItem("token");
  }
  async getToken() {
    return AsyncStorage.getItem("token");
  }
}

export default new ApiClient();
