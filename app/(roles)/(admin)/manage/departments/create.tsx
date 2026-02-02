import { DepartmentForm } from "@/src/components/admin/DepartmentForm";
import { CustomAlert } from "@/src/components/ui/CustomAlert";
import { useDepartments } from "@/src/hooks";
import { useAlert } from "@/src/hooks/useAlert";
import { Spacing } from "@/src/theme";
import { DepartmentInsert } from "@/src/types";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function CreateDepartmentScreen() {
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
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
  },
});