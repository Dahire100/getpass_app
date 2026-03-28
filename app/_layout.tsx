import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from './context/AuthContext';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    // Add custom fonts here if needed
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <PaperProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(student)" />
          <Stack.Screen name="(visitor)" />
          <Stack.Screen name="(guard)" />
          <Stack.Screen name="(admin)" />
        </Stack>
      </AuthProvider>
    </PaperProvider>
  );
}
