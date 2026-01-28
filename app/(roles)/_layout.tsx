import { useAuth } from "@/src/providers";
import { router, Stack, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";



export default function RolesLayout(){
    const {session, role, loading} = useAuth();
    const segments = useSegments();

    useEffect(() => {
        if(loading) return;

        if (!session) {
            router.replace('/(auth)/signin');
            return;
        }

        const inAdminRoute = segments[1] === '(admin)'
        const inClientRoute = segments[1] === '(client)'

        if (role === 'ADMIN' && !inAdminRoute) {
            router.replace('/(roles)/(admin)/(tabs)/home');
        } else if (role === 'CLIENT' && !inClientRoute) {
            router.replace('/(roles)/(client)/(tabs)/home');
        }
    }, [session, role, loading, segments]);

    if (loading){
        return(
            <View style={{flex: 1, justifyContent: 'center', alignItems:'center'}}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return(
        <Stack screenOptions={{ headerShown: false}}>
            <Stack.Screen name="(admin)"/>
            <Stack.Screen name="(client)"/>
        </Stack>
    );
}