import { useTheme } from "@/src/hooks";
import { BorderRadius, Spacing } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    Animated,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export interface FABAction {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  color?: string; 
}

interface FABMenuProps {
  actions: FABAction[]; 
}

export function FABMenu({ actions }: FABMenuProps) {
    const { colors } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [rotation] = useState(new Animated.Value(0));

    const toggleMenu = () => {
        const toValue = isOpen ? 0 : 1;

        Animated.spring(rotation, {
        toValue,
        friction: 5,
        useNativeDriver: true,
        }).start();

        setIsOpen(!isOpen);
    };

    const handleAction = (action: FABAction) => {
        action.onPress();
        toggleMenu();
    };

    const rotateInterpolate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "45deg"], 
    });

    return (
        <>
        {/* Overlay oscuro cuando el menú está abierto */}
        <Modal
            visible={isOpen}
            transparent
            animationType="fade"
            onRequestClose={toggleMenu}
        >
            <Pressable style={styles.overlay} onPress={toggleMenu}>
            {/* Lista de acciones */}
            <View style={styles.actionsContainer}>
                {actions.map((action, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => handleAction(action)}
                    style={[
                    styles.actionButton,
                    { backgroundColor: action.color || colors.card },
                    ]}
                    activeOpacity={0.8}
                >
                    <Ionicons
                    name={action.icon}
                    size={24}
                    color={action.color ? "#fff" : colors.text}
                    />
                    <Text
                    style={[
                        styles.actionLabel,
                        { color: action.color ? "#fff" : colors.text },
                    ]}
                    >
                    {action.label}
                    </Text>
                </TouchableOpacity>
                ))}
            </View>
            </Pressable>
        </Modal>

        {/* FAB Principal */}
        <TouchableOpacity
            onPress={toggleMenu}
            activeOpacity={0.8}
            style={[styles.fab, { backgroundColor: colors.primary }]}
        >
            <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
            <Ionicons name="add" size={28} color="#FFFFFF" />
            </Animated.View>
        </TouchableOpacity>
        </>
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
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
    justifyContent: "flex-end",
    paddingBottom: 100, 
  },
  actionsContainer: {
    paddingHorizontal: Spacing.xl,
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: BorderRadius.lg,
    gap: 16,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
});