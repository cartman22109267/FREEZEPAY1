// pament/controllers/GenerateQRController.js
import ApiClient from "../../services/ApiClient";
import { useToast } from "../../app/ToastProvider";

export function useGenerateQRController(setLoading, setQrData) {
  const { showToast } = useToast();

  const generate = async (amount) => {
    if (!amount) {
      showToast("error", "Veuillez saisir un montant");
      return;
    }
    setLoading(true);
    try {
      const data = await ApiClient.createQR(amount);
      setQrData(data);
      showToast("success", "QR généré !");
    } catch (err) {
      showToast("error", err.response?.data?.message || "Erreur génération QR");
    } finally {
      setLoading(false);
    }
  };

  return { generate };
}
