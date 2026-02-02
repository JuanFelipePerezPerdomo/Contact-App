import { Button, Input } from '@/src/components/ui';
import { useTheme } from '@/src/hooks';
import { Department, EmployeeInsert, EmployeeUpdate } from '@/src/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';

const employeeSchema = z.object({
  employee_name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  
  mail: z
    .string()
    .email('Email inválido'),
  
  phone: z
    .string()
    .min(7, 'Teléfono inválido')
    .max(20, 'Teléfono muy largo'),
  
  position: z
    .string()
    .min(2, 'El cargo debe tener al menos 2 caracteres')
    .max(100, 'El cargo no puede exceder 100 caracteres'),
  
  time_in: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      'Formato inválido. Usa HH:MM (ej: 09:00)'
    ),
  
  time_out: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      'Formato inválido. Usa HH:MM (ej: 17:00)'
    ),
  
  FK_department_id: z
    .number({ error: 'Debes seleccionar un departamento' })
    .positive('Debes seleccionar un departamento'),
})
.refine(
  (data) => {
    const [inHour, inMin] = data.time_in.split(':').map(Number);
    const [outHour, outMin] = data.time_out.split(':').map(Number);
    
    const timeIn = inHour * 60 + inMin;
    const timeOut = outHour * 60 + outMin;
    
    return timeOut > timeIn;
  },
  {
    message: 'La hora de salida debe ser después de la hora de entrada',
    path: ['time_out'],
  }
);

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeFormProps<T extends EmployeeInsert | EmployeeUpdate> {
  initialData?: EmployeeUpdate;
  departments: Department[];
  onSubmit: (data: T) => Promise<void>; // 👈 Generic
  onCancel?: () => void;
  isEditing?: boolean;
  preselectedDepartmentId?: number;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export function EmployeeForm<T extends EmployeeInsert | EmployeeUpdate>({
  initialData,
  departments,
  onSubmit,
  onCancel,
  isEditing = false,
  preselectedDepartmentId,
  onSuccess,
  onError,
}: EmployeeFormProps<T>) {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      employee_name: initialData?.employee_name || '',
      mail: initialData?.mail || '',
      phone: initialData?.phone || '',
      position: initialData?.position || '',
      time_in: initialData?.time_in || '09:00',
      time_out: initialData?.time_out || '17:00',
      FK_department_id: initialData?.FK_department_id || preselectedDepartmentId || 0,
    },
  });

  const handleFormSubmit = async (data: EmployeeFormData) => {
    try {
      setLoading(true);
      await onSubmit(data as T); // 👈 Cast a T
      
      if (onSuccess) {
        onSuccess(
          isEditing 
            ? 'Empleado actualizado correctamente' 
            : 'Empleado creado correctamente'
        );
      }
    } catch (error) {
      if (onError) {
        onError(error instanceof Error ? error.message : 'Ocurrió un error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        {/* Nombre */}
        <Controller
          control={control}
          name="employee_name"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Nombre Completo"
              value={value}
              onChangeText={onChange}
              placeholder="Ej: Juan Pérez"
              error={errors.employee_name?.message}
              autoCapitalize="words"
            />
          )}
        />

        {/* Email */}
        <Controller
          control={control}
          name="mail"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Correo Electrónico"
              value={value}
              onChangeText={onChange}
              placeholder="juan.perez@empresa.com"
              error={errors.mail?.message}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          )}
        />

        {/* Teléfono */}
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Teléfono"
              value={value}
              onChangeText={onChange}
              placeholder="+34 123 456 789"
              error={errors.phone?.message}
              keyboardType="phone-pad"
            />
          )}
        />

        {/* Cargo */}
        <Controller
          control={control}
          name="position"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Cargo / Posición"
              value={value}
              onChangeText={onChange}
              placeholder="Ej: Gerente de Marketing"
              error={errors.position?.message}
              autoCapitalize="words"
            />
          )}
        />

        {/* Hora de entrada */}
        <Controller
          control={control}
          name="time_in"
          render={({ field: { onChange, value } }) => (
            <View>
              <Input
                label="Hora de Entrada"
                value={value}
                onChangeText={onChange}
                placeholder="09:00"
                error={errors.time_in?.message}
                keyboardType="numbers-and-punctuation"
              />
              <Text style={styles.hint}>Formato: HH:MM (24 horas)</Text>
            </View>
          )}
        />

        {/* Hora de salida */}
        <Controller
          control={control}
          name="time_out"
          render={({ field: { onChange, value } }) => (
            <View>
              <Input
                label="Hora de Salida"
                value={value}
                onChangeText={onChange}
                placeholder="17:00"
                error={errors.time_out?.message}
                keyboardType="numbers-and-punctuation"
              />
              <Text style={styles.hint}>Formato: HH:MM (24 horas)</Text>
            </View>
          )}
        />

        {/* Departamento */}
        <Controller
          control={control}
          name="FK_department_id"
          render={({ field: { onChange, value } }) => (
            <View style={styles.pickerContainer}>
              <Text style={[styles.label, { color: colors.text }]}>
                Departamento
              </Text>
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                style={[styles.picker, { color: colors.text }]}
              >
                <Picker.Item label="Selecciona un departamento" value={0} />
                {departments.map(dept => (
                  <Picker.Item
                    key={dept.department_id}
                    label={dept.department_name}
                    value={dept.department_id}
                  />
                ))}
              </Picker>
              {errors.FK_department_id && (
                <Text style={styles.errorText}>
                  {errors.FK_department_id.message}
                </Text>
              )}
            </View>
          )}
        />

        {/* Botones */}
        <View style={styles.buttons}>
          {onCancel && (
            <Button
              title="Cancelar"
              onPress={onCancel}
              variant="outline"
              fullWidth
              disabled={loading}
            />
          )}
          <Button
            title={isEditing ? 'Actualizar' : 'Crear'}
            onPress={handleSubmit(handleFormSubmit)}
            disabled={loading}
            fullWidth
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    gap: 16,
    padding: 16,
  },
  pickerContainer: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  picker: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 4,
  },
  buttons: {
    gap: 12,
    marginTop: 8,
  },
});