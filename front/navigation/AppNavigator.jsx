// src/navigation/AppNavigator.jsx

import React, { useEffect, useState, useMemo } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthContext } from "./AuthContext";

import SplashScreen from "../payment/screens/SplashScreen";
import SplashScreenLogin from "../account/screens/SplashScreenLogin";
import LoginScreen from "../account/screens/LoginScreen";
import RegistrationScreen from "../account/screens/RegistrationScreen";
import RegistrationOTPVerificationScreen from "../account/screens/RegistrationOTPVerificationScreen";
import DashboardScreen from "../payment/screens/DashboardScreen";
import GenerateQRScreen from "../payment/screens/GenerateQRScreen";
import ScanQRScreen from "../payment/screens/ScanQRScreen";
import BluetoothPaymentScreen from "../payment/screens/BluetoothPaymentScreen";

const AuthStack = createNativeStackNavigator();
const AppStack  = createNativeStackNavigator();

export default function AppNavigator() {
  const [isLoading, setIsLoading]   = useState(true);
  const [userToken, setUserToken]   = useState(null);

  // Charge le token au démarrage
  useEffect(() => {
    AsyncStorage.getItem("token")
      .then(token => setUserToken(token))
      .finally(() => setIsLoading(false));
  }, []);

  // Méthodes signIn / signOut exposées par le contexte
  const authContext = useMemo(() => ({
    signIn: async (token) => {
      await AsyncStorage.setItem("token", token);
      setUserToken(token);
    },
    signOut: async () => {
      await AsyncStorage.removeItem("token");
      setUserToken(null);
    },
    userToken,
  }), [userToken]);

  if (isLoading) {
    return <SplashScreenLogin />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {userToken ? (
          <AppStack.Navigator screenOptions={{ headerShown: false }}>
            <AppStack.Screen name="Splash"           component={SplashScreen} />
            <AppStack.Screen name="Dashboard"        component={DashboardScreen} />
            <AppStack.Screen name="GenerateQR"       component={GenerateQRScreen} />
            <AppStack.Screen name="ScanQR"           component={ScanQRScreen} />
            <AppStack.Screen name="BluetoothPayment" component={BluetoothPaymentScreen} />
          </AppStack.Navigator>
        ) : (
          <AuthStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
            <AuthStack.Screen name="Splash"           component={SplashScreenLogin} />
            <AuthStack.Screen name="Login"            component={LoginScreen} />
            <AuthStack.Screen name="Registration"     component={RegistrationScreen} />
            <AuthStack.Screen name="RegistrationOTP"  component={RegistrationOTPVerificationScreen} />
          </AuthStack.Navigator>
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
