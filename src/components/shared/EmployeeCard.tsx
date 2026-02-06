import { useTheme } from '@/src/hooks';
import { Employee } from '@/src/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EmployeeCardProps {
  employee: Employee;
  departmentName?: string;
  onPress?: (employee: Employee) => void;
  showActions?: boolean;
  onEdit?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
  showContactButtons?: boolean;
}

export function EmployeeCard({
  employee,
  departmentName,
  onPress,
  showActions = false,
  onEdit,
  onDelete,
  showContactButtons = false,
}: EmployeeCardProps) {
  const { colors } = useTheme();

  const isWithinWorkingHours = (): boolean => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMin;

    const [inHour, inMin] = employee.time_in.split(':').map(Number);
    const [outHour, outMin] = employee.time_out.split(':').map(Number);
    
    const workStartInMinutes = inHour * 60 + inMin;
    const workEndInMinutes = outHour * 60 + outMin;

    return currentTimeInMinutes >= workStartInMinutes && currentTimeInMinutes <= workEndInMinutes;
  };

  // MANEJAR LLAMADA CON VALIDACIÓN
  const handleCall = () => {
    if (!employee.phone) return;

    if (!isWithinWorkingHours()) {
      Alert.alert(
        'Fuera de horario',
        `${employee.employee_name} está disponible de ${employee.time_in} a ${employee.time_out}. ¿Deseas llamar de todas formas?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Llamar', 
            onPress: () => Linking.openURL(`tel:${employee.phone}`)
          },
        ]
      );
    } else {
      Linking.openURL(`tel:${employee.phone}`);
    }
  };

  const handleEmail = () => {
    if (employee.mail) {
      Linking.openURL(`mailto:${employee.mail}`);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={() => onPress?.(employee)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons
            name="account"
            size={40}
            color={colors.primary}
          />
        </View>

        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]}>
            {employee.employee_name}
          </Text>
          {employee.position && (
            <Text style={[styles.position, { color: colors.textSecondary }]}>
              {employee.position}
            </Text>
          )}
          {departmentName && (
            <Text style={[styles.department, { color: colors.textSecondary }]}>
               {departmentName}
            </Text>
          )}
          {/* Mostrar horario */}
          <Text style={[styles.schedule, { color: colors.textSecondary }]}>
            📅 {employee.time_in} - {employee.time_out}
          </Text>
          {/* Indicador de disponibilidad */}
          {showContactButtons && (
            <View style={styles.statusContainer}>
              <View 
                style={[
                  styles.statusDot, 
                  { backgroundColor: isWithinWorkingHours() ? '#22c55e' : '#ef4444' }
                ]} 
              />
              <Text style={[styles.statusText, { color: colors.textSecondary }]}>
                {isWithinWorkingHours() ? 'Disponible' : 'No disponible'}
              </Text>
            </View>
          )}
        </View>

        {showActions && (
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => onEdit?.(employee)}
              style={styles.actionButton}
            >
              <MaterialCommunityIcons name="pencil" size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onDelete?.(employee)}
              style={styles.actionButton}
            >
              <MaterialCommunityIcons name="delete" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        )}

        {showContactButtons && (
          <View style={styles.contactActions}>
            <TouchableOpacity
              onPress={handleCall}
              style={[
                styles.contactButton, 
                { 
                  backgroundColor: isWithinWorkingHours() 
                    ? colors.primary 
                    : '#9ca3af' 
                }
              ]}
            >
              <MaterialCommunityIcons name="phone" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleEmail}
              style={[styles.contactButton, { backgroundColor: colors.primary }]}
            >
              <MaterialCommunityIcons name="email" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  position: {
    fontSize: 14,
    marginBottom: 2,
  },
  department: {
    fontSize: 14,
    marginBottom: 2,
  },
  schedule: {
    fontSize: 12,
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  contactActions: {
    flexDirection: 'column',
    gap: 8,
  },
  contactButton: {
    padding: 8,
    borderRadius: 8,
  },
});