import { useTheme } from "@/src/hooks";
import { Department } from "@/src/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DepartmentCardProps {
    department: Department;
    onPress?: (department: Department) => void;
    showActions?: boolean; //esto limita a que solo los admins puedan acceder
    onEdit?: (department: Department) => void;
    onDelete?: (department: Department) => void;
}

export function DepartmentCard({
    department,
    onPress,
    showActions=false,
    onEdit,
    onDelete,
}: DepartmentCardProps) {
    const { colors } = useTheme();

    return(
        <TouchableOpacity
            style={[styles.card,{backgroundColor: "#FFFFFF"}]}
            onPress={() => onPress?.(department)}
            activeOpacity={0.7}
        >
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons
                        name="office-building"
                        size={32}
                        color={colors.primary}
                    />
                </View>

                <View style={styles.info}>
                    <Text style={[styles.name, {color: colors.text}]}>
                        {department.department_name}
                    </Text>
                </View>

                {showActions && (
                <View style={styles.actions}>
                    <TouchableOpacity
                    onPress={() => onEdit?.(department)}
                    style={styles.actionButton}
                    >
                    <MaterialCommunityIcons name="pencil" size={20} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={() => onDelete?.(department)}
                    style={styles.actionButton}
                    >
                    <MaterialCommunityIcons name="delete" size={20} color={colors.error} />
                    </TouchableOpacity>
                </View>
                )}
            </View> 
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: 12,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        padding: 8,
    },
});