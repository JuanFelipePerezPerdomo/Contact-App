import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AuthProvider from '@/src/providers';

export default function RootLayout() {
  return (
    <AuthProvider>
      <GestureHandlerRootView>
        <Stack screenOptions={{ headerShown: false}}>
          <Stack.Screen name="index"/>
          <Stack.Screen name="(auth)"/>
          <Stack.Screen name="(roles)"/>
          <Stack.Screen 
            name="departments/[id]" 
            options={{
                headerShown: true,
                title:"Departamento",
                headerBackTitle:"Atras",
                presentation:"modal",
            }}
          />
          <Stack.Screen 
            name="employees/[id]"
            options={{
                headerShown: true,
                title:"Empleados",
                headerBackTitle:"Atras",
                presentation:"modal"
            }}
          />
        </Stack>  
      </GestureHandlerRootView>
    </AuthProvider>
  );
}
