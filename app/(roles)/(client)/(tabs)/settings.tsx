import { Button } from "@/src/components/ui";
import { supabase } from "@/src/lib/supabase";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function settings(){

    const logOut = () => {
        supabase.auth.signOut();
        console.log("LogOut") 
    }

    return(
        <SafeAreaView>
            <Button
                title="Log Out" 
                onPress={ logOut }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});