import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/providers/AuthProvider';
import { Department, DepartmentInsert, DepartmentUpdate } from '@/src/types';
import { useCallback, useEffect, useState } from 'react';

export function useDepartments() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { role, session } = useAuth(); 

    const fetchDepartments = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // === LÓGICA DE FILTRADO POR ROL ===
            if (role === 'CLIENT') {
                // Obtener IDs permitidos de la tabla intermedia
                const { data: links, error: linkError } = await supabase
                    .from('client_departments')
                    .select('FK_department_id')
                    .eq('FK_client_id', session?.user.id);

                if (linkError) throw linkError;

                const allowedIds = links?.map(l => l.FK_department_id) || [];

                if (allowedIds.length === 0) {
                    setDepartments([]);
                } else {
                    // Traer solo esos departamentos
                    const { data, error: fetchError } = await supabase
                        .from('department')
                        .select('*')
                        .in('department_id', allowedIds)
                        .order('department_name', { ascending: true });

                    if (fetchError) throw fetchError;
                    setDepartments(data || []);
                }
            } else {
                // ADMIN: Ve todo
                const { data, error: fetchError } = await supabase
                    .from('department')
                    .select('*')
                    .order('department_name', { ascending: true });

                if (fetchError) throw fetchError;
                setDepartments(data || []);
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar departamentos');
            console.error('Error fetching departments:', err);
        } finally {
            setLoading(false);
        }
    }, [role, session?.user.id]);

    // --- CRUD Admin ---
    const fetchDepartmentById = async (id: number): Promise<Department | null> => {
        try {
            const { data, error } = await supabase
                .from('department')
                .select('*')
                .eq('department_id', id)
                .single();
            if (error) throw error;
            return data;
        } catch (err) { console.error(err); return null; }
    };

    const createDepartment = async (dataInsert: DepartmentInsert): Promise<Department | null> => {
        try {
            const { data, error } = await supabase
                .from('department')
                .insert(dataInsert)
                .select().single();
            if (error) throw error;
            if (data) setDepartments(prev => [...prev, data]);
            return data;
        } catch (err) { console.error(err); throw err; }
    };

    const updateDepartment = async (id: number, updates: DepartmentUpdate): Promise<Department | null> => {
        try {
            const { data, error } = await supabase
                .from('department')
                .update(updates)
                .eq('department_id', id)
                .select().single();
            if (error) throw error;
            if (data) setDepartments(prev => prev.map(d => d.department_id === id ? data : d));
            return data;
        } catch (err) { console.error(err); throw err; }
    };

    const deleteDepartment = async (id: number): Promise<boolean> => {
        try {
            const { error } = await supabase
                .from('department')
                .delete()
                .eq('department_id', id);
            if (error) throw error;
            setDepartments(prev => prev.filter(d => d.department_id !== id));
            return true;
        } catch (err) { console.error(err); throw err; }
    };

    useEffect(() => {
        fetchDepartments();
    }, [fetchDepartments]);

    return {
        departments, loading, error, fetchDepartments,
        fetchDepartmentById, createDepartment, updateDepartment, deleteDepartment,
    };
}