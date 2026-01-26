import { Button, Card, Input } from "@/src/components/ui";
import { useTheme } from "@/src/hooks";
import { Spacing, Typography } from "@/src/theme";
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import { z } from "zod";

import { supabase } from "@/src/lib/supabase";

const SignInSchema = z.object({
        email: z.string().email("Correo electrónico inválido"),
        password: z.string()
        .min(6,"La contraseña debe tener al menos 6 caracteres")
        .max(50, "La contraseña no puede exceder 50 caracteres")
    });

    type SignInForm = z.infer<typeof SignInSchema>

export default function signin(){

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { control, handleSubmit, formState: {errors}} = useForm<SignInForm>({
        resolver: zodResolver(SignInSchema)
    })

    const onSubmit = async (data:SignInForm) => {

        try {
            setLoading(true);
            setError(null);

            const { error: loginError } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password
            })

            if(loginError){
                throw loginError;
            }
            
        } catch(err){
            setError(err instanceof Error ? err.message : 'Ha ocurrido un error');
        } finally {
            setLoading(false);
        }
    }

    const { colors } = useTheme();
    
    return(
        <KeyboardAvoidingView
        style={styles.container}>
            <View>
                <Text>
                    Este es el login
                </Text>
            </View>
            <Card style={styles.card}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                    Iniciar sesión
                </Text>

               <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.form}>
                            <Input
                                label="Correo Electronico"
                                value={value}
                                onChangeText={onChange}
                                placeholder="Inserte su correo"
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="email-address"
                                error={errors.email?.message}
                            />
                        </View>
                        
                    )}
                />
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.form}>
                            <Input
                                label="Contraseña"
                                value={value}
                                onChangeText={onChange}
                                placeholder="Inserte su contraseña"
                                autoCapitalize="none"
                                autoCorrect={false}
                                secureTextEntry
                                error={errors.password?.message}
                            />
                        </View>
                    )}
                />

                <Button
                    title="Iniciar Sesion"
                    onPress={handleSubmit(onSubmit)}
                    disabled={loading}
                    fullWidth
                    size="large"
                />
                 <View style={styles.footer}>
                    <Text style={styles.footerText}>
                    ¿No tienes una cuenta?{' '}
                    <Link href="/signup">
                        <Text style={styles.linkText}>Regístrate</Text>
                    </Link>
                    </Text>
                </View>
            </Card>
        </KeyboardAvoidingView>
    );
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        marginBottom: Spacing.xl,
    },
    cardTitle: {
        ...Typography.h3,
        marginBottom: Spacing.lg,
    },
    form: {
        gap: Spacing.lg,
    },
    errorText: {
    color: '#dc2626',
    textAlign: 'center',
    fontFamily: 'Roboto',
    },
    errorMessage: {
        color: '#dc2626',
        fontSize: 14,
        fontFamily: 'Roboto',
    },
    footer: {
        padding: 5,
        alignItems: 'center',
    },
    footerText: {
        fontFamily: 'Roboto',
        color: '#666',
    },
    linkText: {
        color: '#6366f1',
        fontFamily: 'RobotoBold',
    },
});