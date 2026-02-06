import { DepartmentForm } from "@/src/components/admin/DepartmentForm";
import { CustomAlert } from "@/src/components/ui/CustomAlert";
import { useDepartments, useTheme } from "@/src/hooks";
import { useAlert } from "@/src/hooks/useAlert";
import { Spacing } from "@/src/theme";
import { DepartmentUpdate } from "@/src/types";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditDepartmentScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const departmentId = parseInt(id);

  const { fetchDepartmentById, updateDepartment } = useDepartments();
  const { alertVisible, alertOptions, showAlert, hideAlert } = useAlert();
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchDepartmentById(departmentId);
      setInitialData(data);
    } catch (error) {
      showAlert({
        title: "Error",
        message: "No se pudieron cargar los datos",
        buttons: [{ text: "OK", onPress: () => router.back() }],
      });
    } finally {
      setLoading(false);
    }
  };

  // 👇 Tipo específico: DepartmentUpdate
  const handleSubmit = async (data: DepartmentUpdate) => {
    await updateDepartment(departmentId, data);
    router.back();
  };

  const handleSuccess = (message: string) => {
    showAlert({
      title: "Éxito",
      message,
      buttons: [{ 
        text: "OK",
        onPress: () => router.back()
      }],
    });
  };

  const handleError = (message: string) => {
    showAlert({
      title: "Error",
      message,
      buttons: [{ text: "OK" }],
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      {/* 👇 TypeScript infiere correctamente DepartmentUpdate */}
      <DepartmentForm<DepartmentUpdate>
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        isEditing
        onSuccess={handleSuccess}
        onError={handleError}
      />

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
  container: {
    flex: 1,
    padding: Spacing.lg,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
});