import { EmployeeCard } from "@/src/components/shared/EmployeeCard";
import { FABAction, FABMenu } from "@/src/components/ui";
import { useDepartments, useTheme } from "@/src/hooks";
import { useEmployees } from "@/src/hooks/useEmployees";
import { useAuth } from "@/src/providers/AuthProvider";
import { Spacing } from "@/src/theme";
import { Employee } from "@/src/types";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from "react-native";

export default function DepartmentDetailsScreen() {
    const { colors } = useTheme();
    const { role } = useAuth();
    const { id } = useLocalSearchParams<{ id: string }>();
    const departmentId = parseInt(id);


    const { fetchDepartmentById, deleteDepartment } = useDepartments();
    const { fetchEmployeesByDepartment, deleteEmployee } = useEmployees();

    const [department, setDepartment] = useState<any>(null);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

    const isAdmin = role === 'ADMIN';

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
        setLoading(true);
        const [deptData, empsData] = await Promise.all([
            fetchDepartmentById(departmentId),
            fetchEmployeesByDepartment(departmentId),
        ]);
        setDepartment(deptData);
        setEmployees(empsData);
        } catch (error) {
        Alert.alert("Error", "No se pudieron cargar los datos");
        } finally {
        setLoading(false);
        }
    };

    const handleEmployeePress = (employee: Employee) => {
        router.push(`/(roles)/employees/${employee.id}`);
    };

    const handleEditEmployee = (employee: Employee) => {
        if (!isAdmin) return; // Safety check
        router.push({
        pathname: "/(roles)/(admin)/manage/employees/edit",
        params: { id: employee.id },
        });
    };

    const handleDeleteEmployee = (employee: Employee) => {
        if (!isAdmin) return;
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
                await deleteEmployee(employee.id);
                loadData();
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
        icon: "person-add",
        label: "Crear Empleado",
        onPress: () => {
            router.push({
            pathname: "/(roles)/(admin)/manage/employees/create",
            params: { departmentId },
            });
        },
        },
        {
        icon: "create",
        label: "Editar Departamento",
        onPress: () => {
            router.push({
            pathname: "/(roles)/(admin)/manage/departments/edit",
            params: { id: departmentId },
            });
        },
        },
        {
        icon: "trash",
        label: "Eliminar Departamento",
        onPress: () => {
            Alert.alert(
            "Eliminar Departamento",
            `¿Eliminar "${department?.department_name}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                text: "Eliminar",
                style: "destructive",
                onPress: async () => {
                    try {
                    await deleteDepartment(departmentId);
                    router.back();
                    Alert.alert("Éxito", "Departamento eliminado");
                    } catch (error) {
                    Alert.alert("Error", "No se pudo eliminar");
                    }
                },
                },
            ]
            );
        },
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

    if (!department) {
        return (
        <View style={[styles.container, styles.centered]}>
            <Text style={{ color: colors.text }}>Departamento no encontrado</Text>
        </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.text }]}>
            {department.department_name}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {employees.length} {employees.length === 1 ? "empleado" : "empleados"}
            </Text>
        </View>

        {/* Lista de empleados */}
        {employees.length === 0 ? (
            <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No hay empleados en este departamento
            </Text>
            </View>
        ) : (
            <FlatList
            data={employees}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <EmployeeCard
                employee={item}
                onPress={handleEmployeePress}
                showActions={isAdmin}          
                onEdit={handleEditEmployee}
                onDelete={handleDeleteEmployee}
                showContactButtons={!isAdmin}  
                />
            )}
            contentContainerStyle={styles.list}
            />
        )}

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
    header: {
        padding: Spacing.lg,
        elevation: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
    },
    list: {
        padding: Spacing.lg,
        paddingBottom: 100,
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: Spacing.xl,
    },
    emptyText: {
        fontSize: 16,
        textAlign: "center",
    },
});