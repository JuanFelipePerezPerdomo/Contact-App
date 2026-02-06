import { Button, Card } from "@/src/components/ui";
import { useTheme } from "@/src/hooks";
import { supabase } from "@/src/lib/supabase";
import { useSettingsStore } from "@/src/stores";
import { Spacing, Typography } from "@/src/theme";
import type { ThemeMode } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: string }[] = [
    {value: "light", label: "Claro", icon:"sunny-outline"},
    {value: "dark", label: "Oscuro", icon:"moon-outline"},
    {value: "system", label: "Sistema", icon:"phone-portrait-outline"},
];

export default function settings(){

    const { colors } = useTheme();

    const {
        theme,
        welcomeShown,
        setTheme,
        setWelcomeShown,
    } = useSettingsStore();

    const logOut = () => {
        supabase.auth.signOut();
    }

    return(
        <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
            <Card style={styles.section}>
                <Text style={[styles.sectionTitle, {color: colors.text}]}> Tema </Text>

                {THEME_OPTIONS.map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        style={styles.optionInfo}
                        onPress={() => setTheme(option.value)}
                    >
                        <View style={styles.optionInfo}>
                            <Ionicons
                                name={option.icon as any}
                                size={20}
                                color={colors.icon}
                            />
                            <Text style={[styles.optionLabel, { color: colors.text}]}>
                                {option.label}
                            </Text>
                        </View>
                        <View
                            style={[styles.radio,
                                {
                                    borderColor:
                                        theme === option.value ? colors.primary : colors.border
                                },
                            ]}
                        >
                            {theme === option.value && (
                                <View
                                    style={[
                                        styles.radioInner,
                                        { backgroundColor: colors.primary },
                                    ]}
                                />
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
                <Button
                    title="Log Out" 
                    onPress={ logOut }        
                />
            </Card>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    content: {
        padding: Spacing.lg,
        gap: Spacing.lg,
        paddingBottom: 100,
    },
    section: {
        gap: Spacing.md,
    },
    sectionTitle: {
        ...Typography.label,
        marginBottom: Spacing.xs,
    },
    profileRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    profileInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.md,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "600",
    },
    profileName: {
        ...Typography.body,
    },
    editNameContainer: {
        gap: Spacing.sm,
    },
    editActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: Spacing.sm,
    },
    optionRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: Spacing.sm,
    },
    optionInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.md,
    },
    optionLabel: {
        ...Typography.body,
    },
    radio: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        justifyContent: "center",
        alignItems: "center",
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    toggle: {
        width: 50,
        height: 28,
        borderRadius: 14,
        padding: 2,
        justifyContent: "center",
    },
    toggleKnob: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
    },
    toggleKnobActive: {
        alignSelf: "flex-end",
    },
    actionHint: {
        ...Typography.caption,
        textAlign: "center",
        marginTop: -Spacing.xs,
    },
});