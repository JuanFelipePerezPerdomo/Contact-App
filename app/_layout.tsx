import AuthProvider from '@/src/providers'; // Asegúrate de que esta ruta sea correcta según tu proyecto
import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(roles)" />
          {/* AQUÍ NO van los departamentos, porque están dentro de (roles) */}
        </Stack>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}