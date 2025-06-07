// payment/screens/BluetoothPaymentScreen.jsx
import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Vibration
} from "react-native";
import ApiClient from "../../services/ApiClient";
import Spinner from "../components/Spinner";
import { useTheme } from "../../utils/theme";
import typography from "../../utils/typography";
import { Howl } from "howler";

export default function BluetoothPaymentScreen({ navigation }) {
  const { colors } = useTheme();
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState("");
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    api.get("/contacts/nearby")
      .then(resp => setContacts(resp.data))
      .catch(() => Alert.alert("Erreur", "Impossible de charger les contacts"))
      .finally(() => setLoadingContacts(false));
  }, []);

  const sendPayment = async () => {
    if (!selected) return Alert.alert("Attention", "Sélectionnez un contact");
    if (!amount) return Alert.alert("Attention", "Saisissez un montant");
    setProcessing(true);
    try {
      await ApiClient.confirmBluetooth(payeeId, amount);
      new Howl({ src: ["../../assets/front/success.mp3"] }).play();
      Alert.alert("Succès", "Paiement réussi", [{ text: "OK", onPress: () => navigation.goBack() }]);
    } catch (err) {
      const status = err.response?.status;
      if (status === 402) Alert.alert("Erreur", "Solde insuffisant");
      else if (status === 403) Alert.alert("Erreur", "Contact bloqué");
      else Alert.alert("Erreur", "Erreur technique, réessayez plus tard");
      Vibration.vibrate(200);
    } finally {
      setProcessing(false);
    }
  };

  if (loadingContacts) {
    return <View style={[styles.loader, { backgroundColor: colors.background }]}><Spinner /></View>;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Paiement via Bluetooth</Text>
      {contacts.length === 0 ? (
        <Text style={[styles.noContact, { color: colors.textSecondary }]}>Aucun contact à proximité</Text>
      ) : (
        <>
          <FlatList
            data={contacts}
            keyExtractor={i => i.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.contact,
                  { backgroundColor: selected?.id === item.id ? colors.brandDarker : colors.surface }
                ]}
                onPress={() => setSelected(item)}
              >
                <Text style={[
                  styles.contactText,
                  { color: selected?.id === item.id ? "#fff" : colors.textPrimary }
                ]}>{item.fullName}</Text>
              </TouchableOpacity>
            )}
          />

          <TextInput
            style={[styles.input, { borderColor: colors.textSecondary, color: colors.textPrimary }]}
            placeholder="Montant"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.brand }]}
            onPress={sendPayment}
            disabled={processing}
          >
            {processing ? <Spinner /> : <Text style={styles.buttonText}>Envoyer</Text>}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, padding: 20 },
  title: { fontFamily: typography.h2.fontFamily, fontSize: typography.h2.fontSize, textAlign: "center", marginBottom: 20 },
  noContact: { textAlign: "center", marginTop: 20 },
  contact: { padding: 15, borderRadius: 6, marginBottom: 10 },
  contactText: { fontFamily: typography.body.fontFamily, fontSize: typography.body.fontSize },
  input: { borderWidth: 1, borderRadius: 4, padding: 10, marginVertical: 15, fontFamily: typography.body.fontFamily },
  button: { padding: 15, borderRadius: 4, alignItems: "center" },
  buttonText: { fontFamily: typography.button.fontFamily, fontSize: typography.button.fontSize, color: "#fff" },
});
