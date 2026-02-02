import { DepartmentCard } from "@/src/components/shared/DepartmentCard";
import { useTheme } from "@/src/hooks";
import { useDepartments } from "@/src/hooks/";
import { Spacing } from "@/src/theme";
import { Department } from "@/src/types";
import { router } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

export default function Home() {
  const { colors } = useTheme();
  const { departments, loading } = useDepartments();

  const handleDepartmentPress = (department: Department) => {
    router.push(`/(roles)/departments/${department.department_id}`);
  };

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
            No hay departamentos disponibles
          </Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Contacta con un administrador
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Directorio</Text>
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
            showActions={false} 
          />
        )}
        contentContainerStyle={styles.list}
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