import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AuthProvider from '@/src/providers';

export default function RootLayout() {
  return (
    <AuthProvider>
      <GestureHandlerRootView>
        <Stack screenOptions={{ headerShown: false}}>
          <Stack.Screen name="index"/>
          <Stack.Screen name="(auth)/signin/index"/>
          <Stack.Screen name="(auth)/signup/index"/>
        </Stack>  
      </GestureHandlerRootView>
    </AuthProvider>
  );
}
