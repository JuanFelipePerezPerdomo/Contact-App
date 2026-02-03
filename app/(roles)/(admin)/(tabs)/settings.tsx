import { Button } from "@/src/components/ui";
import { supabase } from "@/src/lib/supabase";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function settings(){

    const logOut = () => {
        supabase.auth.signOut();
    }

    return(
        <SafeAreaView style={styles.container}>
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