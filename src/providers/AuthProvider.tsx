import { Session } from "@supabase/supabase-js";
import { router } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

{/* Auth Provider es un provider personalizado que verifica si el usuario
    esta logueado, de no ser asi forzara la usuario a ir al login
    toda la aplicacion esta envulta en este provider por lo que siempre se asegurara
    que haya un token de sesion*/}
    //Cambios Importantes, ahora el provider manejara el tipo de sesion admin o cliente 

    type UserRole = 'ADMIN' | 'CLIENT' | null;

    type AuthData = {
    loading: boolean,
    session: Session | null;
    role: UserRole;
    userId: string | null;
}

const AuthContext  = createContext<AuthData>({
    loading: true,
    session: null,
    role: null,
    userId: null,
});

interface Props {
    children: React.ReactNode;
}

export default function AuthProvider(props: Props){
    const [loading, setLoading] = useState<boolean>(true);
    const [session, setSession] = useState<Session | null>(null);
    const [role, setRole] = useState<UserRole>(null);
    const [userId, setUserId] = useState<string | null>(null);

    // esta funcion intenta obtener el usuario de la tabla user, de no ser el caso llama otra funcion
    // mediante una promesa
    const fetchUserRole = async (authUserId: string): Promise<UserRole> => {
        try{
            const {data, error} = await supabase
                .from('user')
                .select('user_role')
                .eq('user_id', authUserId)
                .single();

            if(error){
                console.error('Error fetching role: ',error);
                // si por casualidad el usuario no existe en la tabla crea uno
                if (error.code === 'PGRST116'){
                    await createUserRecord(authUserId);
                    return 'CLIENT';
                }
                return null;
            }

            return data?.user_role ?? 'CLIENT'
        } catch (error) {
            console.error('Error in fetchUserRole: ', error);
            return null;
        }
    }

    //Funcion que crea un usuario si este no existe
    const createUserRecord = async (authUserId: string) => {
        try {
            const { error } = await supabase
                .from('user')
                .insert({
                    user_id: authUserId,
                    user_role: 'CLIENT'
                });

            if (error) {
                console.error('Error creating user record:', error);
            }
        }catch (error) {
            console.error('Error in createUserRecord: ', error)

        }
    }

    // esta funcion va a redirigir en base al rol
    const redirectByRole = (userRole: UserRole) => {
        if(userRole === 'ADMIN'){
            router.replace("/(roles)/(admin)/(tabs)/home")
        } else{
            router.replace("/(roles)/(client)/(tabs)/home")
        }
    }

    useEffect (() => {
        async function fetchSession() {
            const {error, data } = await supabase.auth.getSession();

            if (error){
                console.error('Error fetching session:', error);
                router.replace("/signin");
                setLoading(false);
                return;
            }

            if (data.session){
                setSession(data.session);
                setUserId(data.session.user.id);

                const userRole = await fetchUserRole(data.session.user.id);
                setRole(userRole);

                redirectByRole(userRole);
            } else{
                router.replace("/signin")
            }

            setLoading(false);
        }

        fetchSession();

        const  {data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            setSession(session);
            

            if (session){
                setUserId(session.user.id);
                const userRole = await fetchUserRole(session.user.id);
                setRole(userRole);

                if(event==="SIGNED_IN" || event==="TOKEN_REFRESHED"){
                    redirectByRole(userRole);
                }
            } else {
                setRole(null);
                setUserId(null);

                if (event === "SIGNED_OUT") {
                    router.replace("/signin");
                }
            }

            setLoading(false);
        });

        return () => {
            authListener?.subscription.unsubscribe();
        }
    }, []);

    return(
        <AuthContext.Provider value={{loading, session, role, userId}}>
            {props.children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);