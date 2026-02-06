import { EmployeeForm } from "@/src/components/admin/EmployeeForm";
import { CustomAlert } from "@/src/components/ui/CustomAlert";
import { useDepartments, useTheme } from "@/src/hooks";
import { useAlert } from "@/src/hooks/useAlert";
import { useEmployees } from "@/src/hooks/useEmployees";
import { EmployeeUpdate } from "@/src/types";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditEmployeeScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const employeeId = parseInt(id);

  const { fetchEmployeeById, updateEmployee } = useEmployees();
  const { departments, loading: loadingDepts } = useDepartments();
  const { alertVisible, alertOptions, showAlert, hideAlert } = useAlert();
  
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchEmployeeById(employeeId);
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

  // 👇 Tipo específico: EmployeeUpdate
  const handleSubmit = async (data: EmployeeUpdate) => {
    await updateEmployee(employeeId, data);
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

  if (loading || loadingDepts) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      {/* 👇 TypeScript infiere correctamente EmployeeUpdate */}
      <EmployeeForm<EmployeeUpdate>
        initialData={initialData}
        departments={departments}
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
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
});