import { Stack } from "expo-router";

export default function ManageLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="departments/create" options={{title:"Nuevo Departamento"}} />
      <Stack.Screen name="departments/edit" options={{ title: "Editar Departamento" }} />
      <Stack.Screen name="employees/create" options={{title:"Nuevo Empleado"}}/>
      <Stack.Screen name="employees/edit" options={{ title: "Editar Empleado" }} />
    </Stack>
  );
}