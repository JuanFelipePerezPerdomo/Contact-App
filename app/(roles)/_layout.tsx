import { useAuth } from "@/src/providers";
import { router, Stack, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function RolesLayout() {
    const { session, role, loading } = useAuth();

    // 👇 AQUÍ ESTÁ EL CAMBIO: Añadimos 'as string[]' para calmar a TypeScript
    const segments = useSegments() as string[];

    useEffect(() => {
        if (loading) return;

        if (!session) {
            router.replace('/(auth)/signin');
            return;
        }

        const inAdminGroup = segments.includes('(admin)');
        const inClientGroup = segments.includes('(client)');

        // Rutas compartidas
        const isSharedRoute = segments.includes('departments') || segments.includes('employees');

        if (role === 'ADMIN' && !inAdminGroup && !isSharedRoute) {
            router.replace('/(roles)/(admin)/(tabs)/home');
        } 
        else if (role === 'CLIENT' && !inClientGroup && !isSharedRoute) {
            router.replace('/(roles)/(client)/(tabs)/home');
        }
    }, [session, role, loading, segments]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(admin)" />
            <Stack.Screen name="(client)" />
            
            <Stack.Screen 
                name="departments/[id]" 
                options={{
                    headerShown: true,
                    title: "Departamento",
                    headerBackTitle: "Atrás",
                    presentation: "modal", 
                }}
            />
            <Stack.Screen 
                name="employees/[id]"
                options={{
                    headerShown: true,
                    title: "Empleados",
                    headerBackTitle: "Atrás",
                    presentation: "modal"
                }}
            />
        </Stack>
    );
}