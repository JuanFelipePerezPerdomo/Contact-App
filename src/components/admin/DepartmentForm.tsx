import { Button, Input } from '@/src/components/ui';
import { useTheme } from '@/src/hooks';
import { DepartmentInsert, DepartmentUpdate } from '@/src/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { z } from 'zod';

const departmentSchema = z.object({
  department_name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

// ===
interface DepartmentFormProps<T extends DepartmentInsert | DepartmentUpdate> {
  initialData?: DepartmentUpdate;
  onSubmit: (data: T) => Promise<void>; // 👈 Ahora usa generic
  onCancel?: () => void;
  isEditing?: boolean;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export function DepartmentForm<T extends DepartmentInsert | DepartmentUpdate>({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
  onSuccess,
  onError,
}: DepartmentFormProps<T>) {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      department_name: initialData?.department_name || '',
    },
  });

  const handleFormSubmit = async (data: DepartmentFormData) => {
    try {
      setLoading(true);
      await onSubmit(data as T); // 👈 Cast a T
      
      if (onSuccess) {
        onSuccess(
          isEditing 
            ? 'Departamento actualizado correctamente' 
            : 'Departamento creado correctamente'
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
    <View style={styles.container}>
      <Controller
        control={control}
        name="department_name"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Nombre del Departamento"
            value={value}
            onChangeText={onChange}
            placeholder="Ej: Marketing, Ventas, IT"
            error={errors.department_name?.message}
            autoCapitalize="words"
          />
        )}
      />
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
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  buttons: {
    gap: 12,
    marginTop: 8,
  },
});