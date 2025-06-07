// payment/screens/ScanQRScreen.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Camera, useCameraDevices, useCodeScanner } from "react-native-vision-camera";
import { request, check, PERMISSIONS, RESULTS } from "react-native-permissions";
import ApiClient from "../../services/ApiClient";
import Spinner from "../components/Spinner";
import PaymentDetails from "../components/PaymentDetails";
import ToastBubble from "../components/ToastBubble";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "../../utils/theme";
import typography from "../../utils/typography";

export default function ScanQRScreen({ navigation }) {
  const { colors } = useTheme();
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  // États
  const [hasPermission, setHasPermission] = useState(false);
  const [qrInfo, setQrInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Permissions caméra
  useEffect(() => {
    async function getPermission() {
      const permission =
        Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

      let status = await check(permission);
      console.log("Camera permission (initial):", status);
      if (status !== RESULTS.GRANTED) {
        status = await request(permission);
      }
      console.log("Camera permission (final):", status);
      setHasPermission(status === RESULTS.GRANTED);
    }
    getPermission();
  }, []);

  // Appareil caméra
  const devices = useCameraDevices();
  useEffect(() => {
    console.log("Available camera devices:", Object.keys(devices));
  }, [devices]);
  const device = devices.back;
  console.log("Back camera device:", device);

  // Scanner QR code
  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned: ({ displayValue }) => {
      if (!qrInfo) handleScanned(displayValue);
    },
  });

  // Animation de la ligne de scan
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scanLineAnim]);
  const scanLineTranslate = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 250],
  });

  // Gestion du scan
  const handleScanned = (qrString) => {
    try {
      const url = new URL(qrString);
      const segments = url.pathname.split("/").filter(Boolean);
      const qrId = segments.pop();
      fetchQRInfo(qrId);
    } catch {
      setToast({
        type: "error",
        message: "QR invalide : impossible d’extraire l’identifiant",
        onHide: () => navigation.goBack(),
      });
    }
  };

  // Appel API pour récupérer les détails
  const fetchQRInfo = async (qrId) => {
    setLoading(true);
    try {
      const res = await ApiClient.getQRInfo(qrId);
      setQrInfo(res.data);
    } catch (err) {
      setToast({
        type: "error",
        message: err.response?.data?.error || "QR introuvable ou expiré",
        onHide: () => navigation.goBack(),
      });
    } finally {
      setLoading(false);
    }
  };

  // Affichage loader ou permission refusée ou pas de device
  if (!hasPermission || !device || loading) {
    return (
      <SafeAreaView
        style={[styles.loader, { backgroundColor: colors.background }]}
      >
        <Spinner />
      </SafeAreaView>
    );
  }

  // Si on a déjà scanné et récupéré les infos
  if (qrInfo) {
    return <PaymentDetails qrInfo={qrInfo} navigation={navigation} />;
  }

  // Vue du scanner
  return (
    <SafeAreaView style={styles.flex}>
      {toast && (
        <ToastBubble
          type={toast.type}
          message={toast.message}
          onHide={() => {
            setToast(null);
            toast.onHide?.();
          }}
        />
      )}

      <Camera
        style={StyleSheet.absoluteFillObject}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />

      {/* Overlay sombre autour du cadre */}
      <View style={styles.overlay}>
        <View style={styles.topOverlay} />
        <View style={styles.middleRow}>
          <View style={styles.sideOverlay} />
          <View style={[styles.frame, { borderColor: colors.surface }]}>
            <Animated.View
              style={[
                styles.scanLine,
                {
                  backgroundColor: colors.brand,
                  transform: [{ translateY: scanLineTranslate }],
                },
              ]}
            />
          </View>
          <View style={styles.sideOverlay} />
        </View>
        <View style={styles.bottomOverlay} />
      </View>

      {/* Texte d’instruction */}
      <Text style={[styles.instruction, { color: colors.surface }]}>
        Placez votre QR dans le cadre
      </Text>

      {/* Bouton Retour */}
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: colors.brand }]}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  topOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
  bottomOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
  middleRow: { flexDirection: "row" },
  sideOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
  frame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderRadius: 12,
    overflow: "hidden",
  },
  scanLine: { position: "absolute", top: 0, left: 0, right: 0, height: 2 },
  instruction: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 100 : 80,
    alignSelf: "center",
    ...typography.body,
    fontWeight: "600",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    left: 16,
    padding: 10,
    borderRadius: 6,
    elevation: 4,
  },
});
