import { useTheme } from "@/src/hooks";
import { DepartmentInsert, DepartmentUpdate } from "@/src/types";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Input } from "../ui";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const departmentSchema = z.object({
    department_name: z
        .string()
        .min(2,"El nombre del departamento debe tener minimo 2 caracteres")
        .max(100,"El nombre del departamento no puede sobre pasar los 100 caracteres")
});

type DepartmentFormData = z.infer<typeof departmentSchema>

interface DepartmentFormProps {
    initialData?: DepartmentUpdate;
    onSubmit: (data: DepartmentInsert | DepartmentUpdate) => Promise<void>
    onCancel?: () => void;
    isEditing?: boolean;
}

export function DepartmentForm({
    initialData,
    onSubmit,
    onCancel,
    isEditing = false,
}: DepartmentFormProps) {
    const { colors } = useTheme();
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<DepartmentFormData>({
        resolver: zodResolver(departmentSchema),
        defaultValues: {
            department_name: initialData?.department_name || '',
        },
    });

    const handleFormSubmit = async (data: DepartmentFormData) => {
        try{
            setLoading(true);
            await onSubmit(data);

            Alert.alert(
                'Exito',
                isEditing 
                ? 'El Departamento se actualizo con exito' 
                : 'El Departamento se creo con Exito'
            );
        } catch (error) {
            Alert.alert(
                'Error',
                error instanceof Error ? error.message : 'Ocurrio un Error'
            );
        } finally {
            setLoading(false);
        }
    };

    return(
        <View style={styles.container}>
            <Controller
                control={control}
                name="department_name"
                render={({ field: { onChange, value } }) => (
                    <Input
                        label="Nombre del departamento"
                        value={value}
                        onChangeText={onChange}
                        placeholder="Ej: I+D, Marketing, etc..."
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
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
});