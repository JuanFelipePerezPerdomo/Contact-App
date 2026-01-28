import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function AdminTabsLayout(){
    return(
        <Tabs
        screenOptions={{
            tabBarActiveTintColor: '#007AFF',
            headerShown: false
        }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="home" size={24} color={color}/>
                    )
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "settings",
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="cog" size={24} color={color}/>
                    )
                }}
            />
        </Tabs>
    )
}