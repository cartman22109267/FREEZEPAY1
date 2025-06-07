// payment/screens/DashboardScreen.jsx
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "../../utils/theme";
import typography from "../../utils/typography";

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.replace("Login");
  };

  const actions = [
    { name: "GenerateQR",   label: "Générer un QR",   icon: "qr-code" },
    { name: "ScanQR",       label: "Scanner un QR",   icon: "qr-code-scanner" },
    { name: "BluetoothPayment", label: "Paiement Bluetooth", icon: "bluetooth" },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Bienvenue sur Freezepay
        </Text>

        {actions.map(({ name, label, icon }) => (
          <TouchableOpacity
            key={name}
            style={[styles.button, { backgroundColor: colors.brand }]}
            onPress={() => navigation.navigate(name)}
          >
            <Icon name={icon} size={20} color="#fff" />
            <Text style={styles.buttonText}>{label}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.logout} onPress={logout}>
          <Icon name="logout" size={20} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>
            Déconnexion
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "stretch",
  },
  title: {
    ...typography.h1,
    textAlign: "center",
    marginBottom: 32,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    ...typography.button,
    color: "#fff",
    marginLeft: 12,
  },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  logoutText: {
    ...typography.body,
    marginLeft: 8,
  },
});
