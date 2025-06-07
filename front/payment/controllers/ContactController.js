// payment/controllers/ContactController.js
import ApiClient from "../../services/ApiClient";
import { useToast } from "../../app/ToastProvider";

export function useContactController(setLoading, setContacts) {
  const { showToast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await ApiClient.fetchNearbyContacts();
      setContacts(data);
    } catch (err) {
      showToast("error", "Impossible de charger les contacts");
    } finally {
      setLoading(false);
    }
  };

  return { load };
}
