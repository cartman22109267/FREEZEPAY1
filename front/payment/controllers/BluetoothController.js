// payment/controllers/BluetoothController.js
import ApiClient from "../../services/ApiClient";
import { useToast } from "../../app/ToastProvider";
import { Vibration } from "react-native";
import { Howl } from "howler";

export function useBluetoothController(navigation, setProcessing) {
  const { showToast } = useToast();

  const send = async (payeeId, amount) => {
    if (!payeeId) {
      showToast("error", "Sélectionnez un contact");
      return;
    }
    if (!amount) {
      showToast("error", "Saisissez un montant");
      return;
    }
    setProcessing(true);
    try {
      await ApiClient.confirmBluetooth(payeeId, amount);
      new Howl({ src: ["../../assets/front/success.mp3"] }).play();
      showToast("success", "Paiement Bluetooth réussi");
      navigation.goBack();
    } catch (err) {
      const status = err.response?.status;
      if (status === 402) showToast("error", "Solde insuffisant");
      else if (status === 403) showToast("error", "Contact bloqué");
      else showToast("error", "Erreur technique");
      Vibration.vibrate(200);
    } finally {
      setProcessing(false);
    }
  };

  return { send };
}
