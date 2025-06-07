// payment/controllers/PaymentController.js
import ApiClient from "../../services/ApiClient";
import { useToast } from "../../app/ToastProvider";
import { Vibration } from "react-native";
import { Howl } from "howler";

export function usePaymentController(navigation, setLoading) {
  const { showToast } = useToast();

  const confirm = async (qrId) => {
    setLoading(true);
    try {
      await ApiClient.sendPayment(qrId);
      new Howl({ src: ["../../assets/front/success.mp3"] }).play();
      showToast("success", "Paiement réussi");
      navigation.goBack();
    } catch (err) {
      const status = err.response?.status;
      if (status === 402) showToast("error", "Solde insuffisant");
      else if (status === 403) showToast("error", "Contact bloqué");
      else showToast("error", "Erreur technique");
      Vibration.vibrate(200);
    } finally {
      setLoading(false);
    }
  };

  return { confirm };
}
