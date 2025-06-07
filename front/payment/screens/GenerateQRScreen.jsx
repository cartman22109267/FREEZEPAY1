// payment/screens/GenerateQRScreen.jsx
import React, { useState } from "react";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import QRCodeSVG from "react-native-qrcode-svg";
import Icon from "react-native-vector-icons/MaterialIcons";
import ApiClient from "../../services/ApiClient";
import Spinner from "../components/Spinner";
import ToastBubble from "../components/ToastBubble";
import { useTheme } from "../../utils/theme";
import typography from "../../utils/typography";

export default function GenerateQRScreen({ navigation }) {
  const { colors } = useTheme();
  const [amount, setAmount] = useState("");
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type, message }

  const hideToast = () => setToast(null);

  const generate = async () => {
    if (!amount) {
      return setToast({ type: "error", message: "Montant requis" });
    }
    setLoading(true);
    try {
      const response = await ApiClient.createQR(amount);
      setQrData(response.data);
      setToast({ type: "success", message: "QR généré avec succès !" });
    } catch (err) {
      setToast({
        type: "error",
        message: err.response?.data?.message || "Échec de la génération",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {toast && (
        <ToastBubble
          type={toast.type}
          message={toast.message}
          onHide={hideToast}
        />
      )}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, shadowColor: colors.shadow },
          ]}
        >
          <Text style={[styles.header, { color: colors.textPrimary }]}>
            <Icon name="qr-code-scanner" size={24} /> Génération de QR
          </Text>

          {!qrData ? (
            <>
              <View style={styles.field}>
                <Text
                  style={[styles.label, { color: colors.textSecondary }]}
                >
                  Montant (Frs CFA)
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    },
                  ]}
                  placeholder="Ex. 5000"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.brand }]}
                onPress={generate}
                disabled={loading}
              >
                {loading ? (
                  <Spinner />
                ) : (
                  <Text style={styles.buttonText}>
                    <Icon name="play-arrow" size={20} /> Générer
                  </Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.result}>
              <View style={styles.infoRow}>
                <Text
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  ID :
                </Text>
                <Text
                  style={[styles.infoValue, { color: colors.textPrimary }]}
                >
                  {qrData.qrId}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  Montant :
                </Text>
                <Text
                  style={[styles.infoValue, { color: colors.textPrimary }]}
                >
                  {qrData.amount} Frs CFA
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  Expire :
                </Text>
                <Text
                  style={[styles.infoValue, { color: colors.textPrimary }]}
                >
                  {new Date(qrData.expiresAt).toLocaleString()}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  frais de transaction :
                </Text>
                <Text
                  style={[styles.infoValue, { color: colors.textPrimary }]}
                >
                  {qrData.amount/100} Frs CFA
                </Text>
              </View>
              <View
                style={[
                  styles.qrWrapper,
                  { backgroundColor: colors.surface },
                ]}
              >
                <QRCodeSVG value={qrData.data} size={200} />
              </View>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.brand }]}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.buttonText}>
                  <Icon name="arrow-back" size={20} /> Retour
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1, justifyContent: "center", padding: 16 },
  card: {
    borderRadius: 12,
    padding: 20,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  header: {
    ...typography.h2,
    textAlign: "center",
    marginBottom: 24,
  },
  field: { marginBottom: 16 },
  label: { ...typography.body, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    ...typography.body,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: { ...typography.button, color: "#fff" },
  result: { alignItems: "center" },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
  },
  infoLabel: { ...typography.body },
  infoValue: { ...typography.body, fontWeight: "600" },
  qrWrapper: {
    marginVertical: 24,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
