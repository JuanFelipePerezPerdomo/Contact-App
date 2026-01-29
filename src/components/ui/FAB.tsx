import { useTheme } from "@/src/hooks";
import { BorderRadius, Spacing } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

interface FABProps {
    onPress: () => void;
    icon?: keyof typeof Ionicons.glyphMap;
    style?: ViewStyle;
}

export function FAB ({onPress, icon = "add", style}: FABProps){
    const { colors } = useTheme();

    return(
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={[
                styles.fab,
                {
                    backgroundColor: colors.primary
                },
                style
            ]}
        >
            <Ionicons name={icon} size={28} color="#FFFFFF"/>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: "absolute",
        right: Spacing.xl,
        bottom: Spacing.xl,
        width: 56,
        height: 56,
        borderRadius: BorderRadius.full,
        justifyContent: "center",
        alignItems: "center",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    }
});