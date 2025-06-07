import React, { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Spinner from "../components/Spinner";

export default function SplashScreen() {
  const navigation = useNavigation();
  useEffect(() => {
    AsyncStorage.getItem("token").then(token => {
      if (token) navigation.replace("Dashboard");
      else setTimeout(() => navigation.replace("Login"), 2000);
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require("../../../assets/images/freezepaylogo.png")} style={styles.logo} />
      <Spinner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#4A90E2", justifyContent: "center", alignItems: "center" },
  logo: { width: 150, height: 150, marginBottom: 20 },
});
