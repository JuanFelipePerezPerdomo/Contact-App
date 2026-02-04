import { DepartmentCard } from "@/src/components/shared";
import { FABAction, FABMenu } from "@/src/components/ui";
import { useDepartments, useTheme } from "@/src/hooks";
import { Spacing } from "@/src/theme";
import { Department } from "@/src/types";
import { router } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ClientHomeScreen() {
  const { colors } = useTheme();
  // El hook useDepartments ya filtra automáticamente por rol CLIENT
  const { departments, loading } = useDepartments();

  const handleDepartmentPress = (department: Department) => {
    router.push(`/(roles)/departments/${department.department_id}`);
  };

  // Acción para Escanear QR
  const fabActions: FABAction[] = [
    {
        icon: "qr-code",
        label: "Escanear Código QR",
        onPress: () => router.push("/(roles)/(client)/scan"),
        color: "#10b981", // Verde para destacar acción positiva
    }
  ];

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (departments.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No tienes departamentos
          </Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary, marginBottom: 20 }]}>
            Pide a un administrador que te dé acceso o escanea un código QR.
          </Text>
          {/* Mostramos el FAB incluso si está vacío para que pueda escanear */}
          <FABMenu actions={fabActions} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Mis Departamentos</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Tienes acceso a {departments.length} {departments.length === 1 ? "departamento" : "departamentos"}
        </Text>
      </View>

      <FlatList
        data={departments}
        keyExtractor={(item) => item.department_id.toString()}
        renderItem={({ item }) => (
          <DepartmentCard
            department={item}
            onPress={handleDepartmentPress}
            showActions={false} // El Cliente NO puede editar/borrar
          />
        )}
        contentContainerStyle={styles.list}
      />

      <FABMenu actions={fabActions} />
    </SafeAreaView>
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
    paddingBottom: 100, // Espacio para el FAB
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