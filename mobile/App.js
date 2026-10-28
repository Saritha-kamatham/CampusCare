import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

const customDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#020617',
    card: '#0f172a',
    text: '#f8fafc',
    border: '#1e293b',
    primary: '#38bdf8',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#020617" />
      <AuthProvider>
        <NavigationContainer theme={customDarkTheme}>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
