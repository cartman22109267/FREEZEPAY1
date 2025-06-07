// App.tsx
import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './front/navigation/AppNavigator'; // <— votre fichier
import { ToastProvider } from "./front/app/ToastProvider";

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppNavigator />
    </ToastProvider>
  );
};

export default App;
