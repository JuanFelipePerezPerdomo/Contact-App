import { CustomAlert } from "@/src/components/ui/CustomAlert";
import { useAlert, useTheme } from "@/src/hooks";
import { supabase } from "@/src/lib/supabase";
import { BorderRadius, Spacing } from "@/src/theme";
import { Department, User } from "@/src/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function DistributeScreen() {
  const { colors } = useTheme();
  const { data } = useLocalSearchParams<{ data: string }>();
  const { alertVisible, alertOptions, showAlert, hideAlert } = useAlert();
  
  const [clients, setClients] = useState<User[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingClients, setLoadingClients] = useState(false);

  const selectedDepartments: Department[] = data ? JSON.parse(data) : [];
  
  const qrPayload = JSON.stringify({
    action: "ACCESS_GRANT",
    ids: selectedDepartments.map(d => d.department_id)
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoadingClients(true);
      const { data, error } = await supabase
        .from('user') // Consulta directa a la tabla user
        .select('*')
        .eq('user_role', 'CLIENT');
      
      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingClients(false);
    }
  };

  const handleAssignToClient = async (clientId: string) => {
    setLoading(true);
    try {
      const inserts = selectedDepartments.map(d => ({
        "FK_client_id": clientId,
        "FK_department_id": d.department_id
      }));

      const { error } = await supabase
        .from('client_departments')
        .upsert(inserts, { onConflict: 'FK_client_id,FK_department_id' });

      if (error) throw error;
      
      setModalVisible(false);
      showAlert({
        title: "Éxito",
        message: "Departamentos asignados correctamente",
        buttons: [{ text: "OK", onPress: () => router.navigate('/(roles)/(admin)/(tabs)/home') }]
      });

    } catch (error: any) {
      showAlert({ title: "Error", message: "No se pudo asignar los departamentos" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Dar Acceso</Text>
      <Text style={{ textAlign: 'center', color: colors.textSecondary, marginBottom: 30 }}>
        Habilitar {selectedDepartments.length} departamentos
      </Text>

      <View style={{ gap: 20 }}>
        <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]} onPress={() => setQrVisible(true)}>
          <MaterialCommunityIcons name="qrcode" size={40} color={colors.primary} />
          <Text style={[styles.cardText, { color: colors.text }]}>Mostrar QR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]} onPress={() => setModalVisible(true)}>
          <MaterialCommunityIcons name="account-group" size={40} color={colors.primary} />
          <Text style={[styles.cardText, { color: colors.text }]}>Asignar a Cliente</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL QR */}
      <Modal visible={qrVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: 'white' }]}>
            <Text style={styles.modalTitle}>Escanea para acceder</Text>
            <QRCode value={qrPayload} size={200} />
            <TouchableOpacity onPress={() => setQrVisible(false)} style={styles.closeBtn}>
              <Text style={{ color: 'white' }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL CLIENTES */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={[styles.container, { backgroundColor: colors.background, padding: 20 }]}>
          <Text style={[styles.title, { marginTop: 50, color: colors.text }]}>Selecciona Cliente</Text>
          
          {loadingClients ? (
             <ActivityIndicator size="large" color={colors.primary} style={{marginTop: 20}} />
          ) : (
            <FlatList
              data={clients}
              keyExtractor={item => item.user_id}
              contentContainerStyle={{ paddingBottom: 50 }}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.clientItem, { backgroundColor: colors.card }]}
                  onPress={() => handleAssignToClient(item.user_id)}
                  disabled={loading}
                >
                  <View>
                    <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 16 }}>
                      {item.user_name || 'Sin Nombre'}
                    </Text>
                    <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                      {item.user_email || 'Sin Email'}
                    </Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={{textAlign:'center', color: colors.textSecondary, marginTop: 20}}>No hay clientes registrados</Text>
              }
            />
          )}
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
            <Text style={{ color: 'white' }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

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
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  card: { padding: 30, borderRadius: BorderRadius.lg, alignItems: "center", gap: 10, elevation: 3 },
  cardText: { fontSize: 16, fontWeight: "bold" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { padding: 30, borderRadius: 20, alignItems: "center", width: '85%' },
  modalTitle: { fontSize: 18, marginBottom: 20, fontWeight: 'bold', color: '#000' },
  clientItem: { padding: Spacing.lg, borderRadius: BorderRadius.md, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  closeBtn: { marginTop: 10, backgroundColor: '#ef4444', padding: 12, borderRadius: BorderRadius.md, alignItems: 'center', minWidth: 100 }
});