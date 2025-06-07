// payment/components/PaymentDetails.jsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Vibration } from "react-native";
import { Howl } from "howler";
import ApiClient from "../../services/ApiClient";
import Spinner from "./Spinner";
import { useTheme } from "../../utils/theme";
import typography from "../../utils/typography";

export default function PaymentDetails({ qrInfo, navigation }) {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const { qrId, ownerId, amount, expiresAt } = qrInfo;

  const handlePay = async () => {
    setLoading(true);
    try {
      await ApiClient.sendPayment(qrId);
      new Howl({ src: ["../../assets/front/success.mp3"] }).play();
      Alert.alert("Succès", "Paiement réussi", [{ text: "OK", onPress: () => navigation.goBack() }]);
    } catch (err) {
      const status = err.response?.status;
      if (status === 402) Alert.alert("Erreur", "Solde insuffisant");
      else if (status === 403) Alert.alert("Erreur", "Contact bloqué");
      else Alert.alert("Erreur", "Erreur technique, réessayez plus tard");
      Vibration.vibrate(200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Détails de la transaction</Text>
      <View style={styles.infoRow}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Montant :</Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>{amount} €</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Destinataire :</Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>{ownerId}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Expire le :</Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>
          {new Date(expiresAt).toLocaleString()}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.cancelButton, { borderColor: colors.error }]}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={[styles.cancelText, { color: colors.error }]}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.payButton, { backgroundColor: colors.success }]}
          onPress={handlePay}
          disabled={loading}
        >
          {loading ? <Spinner /> : <Text style={[styles.payText]}>Payer</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontFamily: typography.h2.fontFamily, fontSize: typography.h2.fontSize, textAlign: "center", marginBottom: 20 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  label: { fontFamily: typography.body.fontFamily, fontSize: typography.body.fontSize },
  value: { fontFamily: typography.body.fontFamily, fontSize: typography.body.fontSize, fontWeight: "bold" },
  actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 40 },
  cancelButton: { flex: 0.45, borderWidth: 1, borderRadius: 4, padding: 12, alignItems: "center" },
  cancelText: { fontFamily: typography.button.fontFamily, fontSize: typography.button.fontSize },
  payButton: { flex: 0.45, borderRadius: 4, padding: 12, alignItems: "center" },
  payText: { fontFamily: typography.button.fontFamily, fontSize: typography.button.fontSize, color: "#fff" },
});
