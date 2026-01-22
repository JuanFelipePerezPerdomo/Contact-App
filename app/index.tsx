import { Button } from "@/src/components/ui";
import { supabase } from "@/src/lib/supabase";
import { Text, View } from "react-native";

export default function Index() {
const logOut = () => {
   supabase.auth.signOut();

}

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>

      <Button
        title="Log Out" 
        onPress={ logOut }        
      />
    </View>
  );
}
