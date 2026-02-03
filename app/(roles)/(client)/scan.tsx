import { useTheme } from "@/src/hooks";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers/AuthProvider";
import { Spacing } from "@/src/theme";
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";

export default function ScanScreen() {
  const { session } = useAuth();
  const { colors } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) return <View style={{backgroundColor: colors.background, flex:1}} />;
  if (!permission.granted) {
    return (
      <View style={[styles.centered, {backgroundColor: colors.background}]}>
        <Text style={{ marginBottom: 10, textAlign: 'center', color: colors.text }}>
            Necesitamos acceso a la cámara para escanear el código QR
        </Text>
        <Button onPress={requestPermission} title="Dar permisos" />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanned(true); // Bloqueamos lecturas adicionales
    try {
      console.log("Datos escaneados:", data); // Para depuración

      const payload = JSON.parse(data);

      if (payload.action === "ACCESS_GRANT" && Array.isArray(payload.ids)) {
        
        // Verificamos sesión antes de insertar
        if (!session?.user?.id) {
            throw new Error("No se ha encontrado la sesión del usuario.");
        }

        const inserts = payload.ids.map((deptId: number) => ({
          "FK_client_id": session.user.id,
          "FK_department_id": deptId
        }));

        // Upsert: Inserta o actualiza si ya existe
        const { error } = await supabase
          .from('client_departments')
          .upsert(inserts, { onConflict: 'FK_client_id, FK_department_id' });
        
        if (error) throw error; // Lanzamos el error real de Supabase

        Alert.alert("¡Éxito!", "Departamentos habilitados correctamente", [
          { text: "OK", onPress: () => router.replace("/(roles)/(client)/(tabs)/home") }
        ]);
      } else {
        Alert.alert("QR Inválido", "Este código no tiene el formato correcto.", [
            { text: "OK", onPress: () => setScanned(false) }
        ]);
      }
    } catch (e: any) {
      // Muestra el mensaje real del error
      console.error(e);
      Alert.alert(
          "Error al procesar", 
          e.message || "Ocurrió un error desconocido", 
          [{ text: "OK", onPress: () => setScanned(false) }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      />
      <View style={styles.overlay}>
        <Text style={styles.text}>Escanea el QR del Administrador</Text>
        <Button title="Cancelar" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: Spacing.xl },
  overlay: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    alignItems: 'center', paddingBottom: 50, paddingTop: 20, 
    backgroundColor: 'rgba(0,0,0,0.5)' 
  },
  text: { color: 'white', fontSize: 16, fontWeight: 'bold', marginBottom: 10 }
});