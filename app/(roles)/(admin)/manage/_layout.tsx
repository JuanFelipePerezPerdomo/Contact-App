import { useTheme } from "@/src/hooks";
import { Stack } from "expo-router";

export default function ManageLayout() {

  const { colors } = useTheme();

  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        headerStyle: {
          backgroundColor: colors.text,
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}>
      <Stack.Screen name="departments/create" options={{title:"Nuevo Departamento"}} />
      <Stack.Screen name="departments/edit" options={{ title: "Editar Departamento" }} />
      <Stack.Screen name="employees/create" options={{title:"Nuevo Empleado"}}/>
      <Stack.Screen name="employees/edit" options={{ title: "Editar Empleado" }} />
      <Stack.Screen name="share/select" options={{ title: "Seleccionar", presentation: 'modal' }} />
      <Stack.Screen name="share/distribute" options={{ title: "Compartir" }} />
    </Stack>
  );
}