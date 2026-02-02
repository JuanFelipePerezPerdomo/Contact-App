import { DepartmentCard } from "@/src/components/shared/DepartmentCard";
import { CustomAlert, FABAction, FABMenu } from "@/src/components/ui";
import { useAlert, useDepartments, useTheme } from "@/src/hooks/";
import { Spacing } from "@/src/theme";
import { Department } from "@/src/types";
import { router } from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

export default function AdminHomeScreen() {
  const { colors } = useTheme();
  const { departments, loading, deleteDepartment } = useDepartments();
  const { alertVisible, alertOptions, showAlert, hideAlert } = useAlert(); // 👈 Usar hook

  // useCallback lo añadi por prueba pero originalmnte no esta
  const handleDepartmentPress = useCallback((department: Department) => {
    router.push(`/departments/${department.department_id}`);
    console.log("boton departamento pulsado")
  }, []);

  const handleEdit = (department: Department) => {
    router.push({
      pathname: "/(roles)/(admin)/manage/departments/edit",
      params: { id: department.department_id },
    });
  };

  const handleDelete = (department: Department) => {
    showAlert({
      title: "Eliminar Departamento",
      message: `¿Estás seguro de eliminar "${department.department_name}"?`,
      buttons: [
        { 
          text: "Cancelar", 
          style: "cancel" 
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDepartment(department.department_id);
              // Mostrar confirmación
              showAlert({
                title: "Éxito",
                message: "Departamento eliminado correctamente",
                buttons: [{ text: "OK" }],
              });
            } catch (error) {
              showAlert({
                title: "Error",
                message: error instanceof Error ? error.message : "No se pudo eliminar",
                buttons: [{ text: "OK" }],
              });
            }
          },
        },
      ],
    });
  };

  const fabActions: FABAction[] = [
    {
      icon: "business",
      label: "Crear Departamento",
      onPress: () => {
        router.push("/(roles)/(admin)/manage/departments/create");
      },
    },
    {
      icon: "person-add",
      label: "Crear Empleado",
      onPress: () => {
        router.push("/(roles)/(admin)/manage/employees/create");
      },
    },
    {
      icon: "share",
      label: "Enviar a Cliente",
      onPress: () => {
        showAlert({
          title: "Próximamente",
          message: "Función de compartir en desarrollo",
          buttons: [{ text: "OK" }],
        });
      },
      color: "#3b82f6",
    },
  ];

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (departments.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No hay departamentos
          </Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Crea tu primer departamento usando el botón +
          </Text>
        </View>
        <FABMenu actions={fabActions} />
        
        {/* 👇 Alert personalizado */}
        <CustomAlert
          visible={alertVisible}
          title={alertOptions.title}
          message={alertOptions.message}
          buttons={alertOptions.buttons}
          onClose={hideAlert}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Departamentos</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {departments.length} {departments.length === 1 ? "departamento" : "departamentos"}
        </Text>
      </View>

      <FlatList
        data={departments}
        keyExtractor={(item) => item.department_id.toString()}
        renderItem={({ item }) => (
          <DepartmentCard
            department={item}
            onPress={handleDepartmentPress}
            showActions
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        contentContainerStyle={styles.list}
      />

      <FABMenu actions={fabActions} />

      {/* 👇 Alert personalizado */}
      <CustomAlert
        visible={alertVisible}
        title={alertOptions.title}
        message={alertOptions.message}
        buttons={alertOptions.buttons}
        onClose={hideAlert}
      />
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
    paddingTop: Spacing.xl,
  },
  title: {
    fontSize: 28,
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
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
});