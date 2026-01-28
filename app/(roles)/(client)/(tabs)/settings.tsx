import { Button } from "@/src/components/ui";
import { supabase } from "@/src/lib/supabase";
import { View } from "react-native";

export default function settings(){

    const logOut = () => {
        supabase.auth.signOut();
    }

    return(
        <View>
            <Button
                title="Log Out" 
                onPress={ logOut }        
            />
        </View>
    );
}