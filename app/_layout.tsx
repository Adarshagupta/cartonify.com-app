import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { 
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

export type AppSettings = {
  darkMode: boolean;
  saveHistory: boolean;
  highQuality: boolean;
  notifications: boolean;
  offlineMode: boolean;
  setSetting: (key: keyof Omit<AppSettings, 'setSetting'>, value: boolean) => void;
};

const defaultSettings: Omit<AppSettings, 'setSetting'> = {
  darkMode: false,
  saveHistory: true,
  highQuality: true,
  notifications: true,
  offlineMode: false,
};

const SettingsContext = createContext<AppSettings | undefined>(undefined);

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('cartonify_settings');
      if (stored) setSettings(JSON.parse(stored));
    })();
  }, []);

  const setSetting = (key: keyof typeof defaultSettings, value: boolean) => {
    setSettings(prev => {
      const updated = { ...prev, [key]: value };
      AsyncStorage.setItem('cartonify_settings', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <SettingsContext.Provider value={{ ...settings, setSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-Bold': Inter_700Bold,
  });

  // Hide the splash screen once fonts are loaded
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Return null to keep splash screen visible while fonts load
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SettingsProvider>
      <>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="image/[id]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
        </Stack>
        <StatusBar style="auto" />
      </>
    </SettingsProvider>
  );
}