// src/controllers/LoginController.js

import ApiClient from "../../services/ApiClient";
import { useToast } from "../../app/ToastProvider";

export function useLoginController(navigation, setLoading) {
  const { showToast } = useToast();

  const login = async (email, password) => {
    setLoading(true);
    try {
      await ApiClient.login(email, password);
      navigation.replace("Dashboard");
    } catch (err) {
      showToast("error", err.response?.data?.message || "Connexion impossible");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await ApiClient.logout();
    navigation.replace("Login");
  };

  return { login, logout };
}

