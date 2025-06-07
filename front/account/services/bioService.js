// services/bioService.js
import ReactNativeBiometrics from 'react-native-biometrics';


export const scanBiometric = () => {
  const rnBiometrics = new ReactNativeBiometrics();
  // true si empreinte ou FaceID OK
  return rnBiometrics.simplePrompt({ promptMessage: "Authentifiez-vous pour accerder à l'application" });
};