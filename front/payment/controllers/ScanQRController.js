// payment/ScanQRController
import ApiClient from "../../services/ApiClient";
import { useToast } from "../../app/ToastProvider";

export function useScanQRController(setLoading, setQrInfo, navigation) {
  const { showToast } = useToast();

  const fetchInfo = async (qrId) => {
    setLoading(true);
    try {
      const info = await ApiClient.getQRInfo(qrId);
      setQrInfo(info);
      showToast("success", "QR détecté");
    } catch (err) {
      showToast("error", err.response?.data?.message || "QR introuvable");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  return { fetchInfo };
}
