import { Button } from "@/src/components/ui/Button";
import { useDepartments, useTheme } from "@/src/hooks";
import { BorderRadius, Spacing } from "@/src/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";

export default function SelectDepartmentsScreen() {
  const { colors } = useTheme();
  const { departments, loading } = useDepartments();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelection = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(i => i !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const handleNext = () => {
    if (selectedIds.length === 0) return;
    const selected = departments.filter(d => selectedIds.includes(d.department_id));
    
    router.push({
      pathname: "/(roles)/(admin)/manage/share/distribute",
      params: { data: JSON.stringify(selected) }
    });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Seleccionar Departamentos</Text>
      
      <FlatList
        data={departments}
        keyExtractor={(item) => item.department_id.toString()}
        contentContainerStyle={{ padding: Spacing.md }}
        renderItem={({ item }) => {
          const isSelected = selectedIds.includes(item.department_id);
          return (
            <Pressable
              onPress={() => toggleSelection(item.department_id)}
              style={[
                styles.item,
                { 
                  backgroundColor: colors.card,
                  borderColor: isSelected ? colors.primary : 'transparent',
                }
              ]}
            >
              <Text style={{ fontSize: 16, color: colors.text, fontWeight: '500' }}>
                {item.department_name}
              </Text>
              <MaterialCommunityIcons 
                name={isSelected ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} 
                size={24} 
                color={isSelected ? colors.primary : colors.textTertiary} 
              />
            </Pressable>
          );
        }}
      />
      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <Button 
          title={`Continuar (${selectedIds.length})`} 
          onPress={handleNext} 
          disabled={selectedIds.length === 0}
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { fontSize: 22, fontWeight: "bold", padding: Spacing.lg },
  item: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    padding: Spacing.lg, marginBottom: Spacing.sm, borderRadius: BorderRadius.md, borderWidth: 2
  },
  footer: { padding: Spacing.lg, borderTopWidth: 1 },
});