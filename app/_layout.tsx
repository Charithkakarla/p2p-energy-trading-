import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          {/* Landing page – no header, we build our own navbar */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
          {/* Auth screens (login, discom) - no header */}
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          {/* Tabs app shell – also no header, tabs handle their own */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
