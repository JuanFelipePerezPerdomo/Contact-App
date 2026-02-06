import { DepartmentForm } from "@/src/components/admin/DepartmentForm";
import { CustomAlert } from "@/src/components/ui/CustomAlert";
import { useDepartments, useTheme } from "@/src/hooks";
import { useAlert } from "@/src/hooks/useAlert";
import { Spacing } from "@/src/theme";
import { DepartmentInsert } from "@/src/types";
import { router } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateDepartmentScreen() {

const { colors } = useTheme();

  const { createDepartment } = useDepartments();
  const { alertVisible, alertOptions, showAlert, hideAlert } = useAlert();

  // 👇 Tipo específico: DepartmentInsert
  const handleSubmit = async (data: DepartmentInsert) => {
    await createDepartment(data);
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

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      {/* 👇 TypeScript infiere correctamente DepartmentInsert */}
      <DepartmentForm<DepartmentInsert>
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
    padding: Spacing.lg,
  },
});