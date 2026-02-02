import { FABAction, FABMenu } from "@/src/components/ui";
import { useTheme } from "@/src/hooks";
import { useEmployees } from "@/src/hooks/useEmployees";
import { useAuth } from "@/src/providers/AuthProvider";
import { Spacing } from "@/src/theme";
import { EmployeeWithDepartment } from "@/src/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator, Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View
} from "react-native";

export default function EmployeeDetailsScreen() {
    const { colors } = useTheme();
    const { role } = useAuth();
    const { id } = useLocalSearchParams<{ id: string }>();
    const employeeId = parseInt(id);

    const { fetchEmployeeById, deleteEmployee } = useEmployees();
    const [employee, setEmployee] = useState<EmployeeWithDepartment | null>(null);
    const [loading, setLoading] = useState(true);

    const isAdmin = role === 'ADMIN';

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
        setLoading(true);
        const data = await fetchEmployeeById(employeeId);
        setEmployee(data);
        } catch (error) {
        Alert.alert("Error", "No se pudieron cargar los datos");
        } finally {
        setLoading(false);
        }
    };
    
    const isWithinWorkingHours = (): boolean => {
        if (!employee) return false;
        
        const now = new Date();
        const currentHour = now.getHours();
        const currentMin = now.getMinutes();
        const currentTimeInMinutes = currentHour * 60 + currentMin;

        const [inHour, inMin] = employee.time_in.split(':').map(Number);
        const [outHour, outMin] = employee.time_out.split(':').map(Number);
        
        const workStartInMinutes = inHour * 60 + inMin;
        const workEndInMinutes = outHour * 60 + outMin;

        return currentTimeInMinutes >= workStartInMinutes && currentTimeInMinutes <= workEndInMinutes;
    };

    const handleCall = () => {
        if (!employee?.phone) return;

        if (!isWithinWorkingHours()) {
        Alert.alert(
            'Fuera de horario',
            `${employee.employee_name} está disponible de ${employee.time_in} a ${employee.time_out}. ¿Deseas llamar de todas formas?`,
            [
            { text: 'Cancelar', style: 'cancel' },
            { 
                text: 'Llamar', 
                onPress: () => Linking.openURL(`tel:${employee.phone}`)
            },
            ]
        );
        } else {
        Linking.openURL(`tel:${employee.phone}`);
        }
    };

    const handleEmail = () => {
        if (employee?.mail) {
        Linking.openURL(`mailto:${employee.mail}`);
        }
    };

    const handleDelete = () => {
        if (!employee) return;
        
        Alert.alert(
        "Eliminar Empleado",
        `¿Eliminar a ${employee.employee_name}?`,
        [
            { text: "Cancelar", style: "cancel" },
            {
            text: "Eliminar",
            style: "destructive",
            onPress: async () => {
                try {
                await deleteEmployee(employeeId);
                router.back();
                Alert.alert("Éxito", "Empleado eliminado");
                } catch (error) {
                Alert.alert("Error", "No se pudo eliminar");
                }
            },
            },
        ]
        );
    };

    const fabActions: FABAction[] | undefined = isAdmin ? [
        {
        icon: "create",
        label: "Editar Empleado",
        onPress: () => {
            router.push({
            pathname: "/manage/employees/edit",
            params: { id: employeeId },
            });
        },
        },
        {
        icon: "trash",
        label: "Eliminar Empleado",
        onPress: handleDelete,
        color: "#ef4444",
        },
    ] : undefined;

    if (loading) {
        return (
        <View style={[styles.container, styles.centered]}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
        );
    }

    if (!employee) {
        return (
        <View style={[styles.container, styles.centered]}>
            <Text style={{ color: colors.text }}>Empleado no encontrado</Text>
        </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView contentContainerStyle={styles.content}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                <MaterialCommunityIcons name="account" size={80} color="#fff" />
            </View>
            </View>

            {/* Nombre y cargo */}
            <Text style={[styles.name, { color: colors.text }]}>
            {employee.employee_name}
            </Text>
            <Text style={[styles.position, { color: colors.textSecondary }]}>
            {employee.position}
            </Text>

            {/* Departamento */}
            {employee.department && (
            <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                <MaterialCommunityIcons name="office-building" size={24} color={colors.primary} />
                <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                    Departamento
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                    {employee.department.department_name}
                </Text>
                </View>
            </View>
            )}

            {/* Email */}
            <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <MaterialCommunityIcons name="email" size={24} color={colors.primary} />
            <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Correo Electrónico
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                {employee.mail}
                </Text>
            </View>
            </View>

            {/* Teléfono */}
            <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <MaterialCommunityIcons name="phone" size={24} color={colors.primary} />
            <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Teléfono
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                {employee.phone}
                </Text>
            </View>
            </View>

            {/* Horario */}
            <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <MaterialCommunityIcons name="clock-outline" size={24} color={colors.primary} />
            <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Horario Laboral
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                {employee.time_in} - {employee.time_out}
                </Text>
                {/* Indicador de disponibilidad */}
                <View style={styles.statusContainer}>
                <View 
                    style={[
                    styles.statusDot, 
                    { backgroundColor: isWithinWorkingHours() ? '#22c55e' : '#ef4444' }
                    ]} 
                />
                <Text style={[styles.statusText, { color: colors.textSecondary }]}>
                    {isWithinWorkingHours() ? 'Disponible ahora' : 'No disponible'}
                </Text>
                </View>
            </View>
            </View>

            {/* Botones de contacto (Solo para cliente) */}
            {!isAdmin && (
            <View style={styles.contactButtons}>
                <TouchableOpacity
                onPress={handleCall}
                style={[
                    styles.contactButton,
                    { 
                    backgroundColor: isWithinWorkingHours() 
                        ? colors.primary 
                        : '#9ca3af'
                    }
                ]}
                >
                <MaterialCommunityIcons name="phone" size={24} color="#fff" />
                <Text style={styles.contactButtonText}>Llamar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                onPress={handleEmail}
                style={[styles.contactButton, { backgroundColor: colors.primary }]}
                >
                <MaterialCommunityIcons name="email" size={24} color="#fff" />
                <Text style={styles.contactButtonText}>Email</Text>
                </TouchableOpacity>
            </View>
            )}
        </ScrollView>

        {/* FAB solo para admin */}
        {fabActions && <FABMenu actions={fabActions} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        padding: Spacing.lg,
        paddingBottom: 100,
    },
    avatarContainer: {
        alignItems: "center",
        marginBottom: Spacing.lg,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: "center",
        alignItems: "center",
    },
    name: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 4,
    },
    position: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: Spacing.xl,
    },
    infoCard: {
        flexDirection: "row",
        padding: Spacing.md,
        borderRadius: 12,
        marginBottom: Spacing.md,
        elevation: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    infoContent: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    infoLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: "600",
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    contactButtons: {
        flexDirection: "row",
        gap: 12,
        marginTop: Spacing.lg,
    },
    contactButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: Spacing.md,
        borderRadius: 12,
        gap: 8,
    },
    contactButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});