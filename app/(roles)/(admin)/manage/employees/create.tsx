import { EmployeeForm } from "@/src/components/admin/EmployeeForm";
import { CustomAlert } from "@/src/components/ui/CustomAlert";
import { useDepartments, useTheme } from "@/src/hooks";
import { useAlert } from "@/src/hooks/useAlert";
import { useEmployees } from "@/src/hooks/useEmployees";
import { EmployeeInsert } from "@/src/types";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateEmployeeScreen() {
  const { colors } = useTheme();
  const { departmentId } = useLocalSearchParams<{ departmentId?: string }>();

  const { createEmployee } = useEmployees();
  const { departments, loading } = useDepartments();
  const { alertVisible, alertOptions, showAlert, hideAlert } = useAlert();

  // 👇 Tipo específico: EmployeeInsert
  const handleSubmit = async (data: EmployeeInsert) => {
    await createEmployee(data);
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
      {/* 👇 TypeScript infiere correctamente EmployeeInsert */}
      <EmployeeForm<EmployeeInsert>
        departments={departments}
        preselectedDepartmentId={departmentId ? parseInt(departmentId) : undefined}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
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