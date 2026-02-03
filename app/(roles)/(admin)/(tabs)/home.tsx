import { DepartmentCard } from "@/src/components/shared/DepartmentCard";
import { CustomAlert, FABAction, FABMenu } from "@/src/components/ui";
import { useAlert, useDepartments, useTheme } from "@/src/hooks/";
import { Spacing } from "@/src/theme";
import { Department } from "@/src/types";
import { router } from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdminHomeScreen() {
  const { colors } = useTheme();
  const { departments, loading, deleteDepartment } = useDepartments();
  const { alertVisible, alertOptions, showAlert, hideAlert } = useAlert();

  // Navegar al detalle del departamento
  const handleDepartmentPress = useCallback((department: Department) => {
    router.push(`/(roles)/departments/${department.department_id}`);
  }, []);

  // Navegar a editar departamento
  const handleEdit = (department: Department) => {
    router.push({
      pathname: "/(roles)/(admin)/manage/departments/edit",
      params: { id: department.department_id.toString() },
    });
  };

  // Manejar borrado con confirmación
  const handleDelete = (department: Department) => {
    showAlert({
      title: "Eliminar Departamento",
      message: `¿Estás seguro de eliminar "${department.department_name}"? Esta acción no se puede deshacer.`,
      buttons: [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDepartment(department.department_id);
            } catch (error) {
              console.error(error);
            }
          },
        },
      ],
    });
  };

  // Acciones del Botón Flotante (FAB)
  const fabActions: FABAction[] = [
    {
      icon: "business", 
      label: "Crear Departamento",
      onPress: () => router.push("/(roles)/(admin)/manage/departments/create"),
    },
    {
      icon: "person-add",
      label: "Crear Empleado",
      onPress: () => router.push("/(roles)/(admin)/manage/employees/create"),
    },
    
    {
      icon: "share",
      label: "Compartir con Cliente",
      onPress: () => router.push("/(roles)/(admin)/manage/share/select"),
      color: "#8b5cf6", // Violeta para destacar
    },
  ];

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Panel Admin</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {departments.length} {departments.length === 1 ? "departamento" : "departamentos"} activos
        </Text>
      </View>

      <FlatList
        data={departments}
        keyExtractor={(item) => item.department_id.toString()}
        renderItem={({ item }) => (
          <DepartmentCard
            department={item}
            onPress={handleDepartmentPress}
            showActions={true} // El Admin PUEDE editar/borrar
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={{ color: colors.textSecondary }}>No hay departamentos creados.</Text>
          </View>
        }
      />

      <FABMenu actions={fabActions} />

      <CustomAlert
        visible={alertVisible}
        title={alertOptions.title}
        message={alertOptions.message}
        buttons={alertOptions.buttons}
        onClose={hideAlert}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: "center", alignItems: "center" },
  header: { padding: Spacing.lg, paddingTop: Spacing.xl },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 14 },
  list: { padding: Spacing.lg, paddingBottom: 100 },
  emptyState: { padding: 20, alignItems: "center" }
});