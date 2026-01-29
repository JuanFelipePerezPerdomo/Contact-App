import { supabase } from '@/src/lib/supabase';
import { Department, DepartmentInsert, DepartmentUpdate } from '@/src/types';
import { useEffect, useState } from 'react';

export function useDepartments() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDepartments = async () => {
        try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
            .from('department')
            .select('*')
            .order('department_name', { ascending: true }); 

        if (fetchError) throw fetchError;

        setDepartments(data || []);
        } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar departamentos');
        console.error('Error fetching departments:', err);
        } finally {
        setLoading(false);
        }
    };

    const fetchDepartmentById = async (id: number): Promise<Department | null> => {
        try {
        const { data, error: fetchError } = await supabase
            .from('department')
            .select('*')
            .eq('department_id', id) 
            .single();

        if (fetchError) throw fetchError;

        return data;
        } catch (err) {
        console.error('Error fetching department:', err);
        return null;
        }
    };

    const createDepartment = async (departmentData: DepartmentInsert): Promise<Department | null> => {
        try {
        const { data, error: insertError } = await supabase
            .from('department')
            .insert(departmentData)
            .select()
            .single();

        if (insertError) throw insertError;

        if (data) {
            setDepartments(prev => [...prev, data]);
        }

        return data;
        } catch (err) {
        console.error('Error creating department:', err);
        throw err;
        }
    };

    const updateDepartment = async (
        id: number, 
        updates: DepartmentUpdate
    ): Promise<Department | null> => {
        try {
        const { data, error: updateError } = await supabase
            .from('department')
            .update(updates)
            .eq('department_id', id) 
            .select()
            .single();

        if (updateError) throw updateError;

        if (data) {
            setDepartments(prev =>
            prev.map(dept => (dept.department_id === id ? data : dept))
            );
        }

        return data;
        } catch (err) {
        console.error('Error updating department:', err);
        throw err;
        }
    };

    const deleteDepartment = async (id: number): Promise<boolean> => {
        try {
        const { error: deleteError } = await supabase
            .from('department')
            .delete()
            .eq('department_id', id);

        if (deleteError) throw deleteError;

        setDepartments(prev => prev.filter(dept => dept.department_id !== id));

        return true;
        } catch (err) {
        console.error('Error deleting department:', err);
        throw err;
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    return {
        departments,
        loading,
        error,
        fetchDepartments,
        fetchDepartmentById,
        createDepartment,
        updateDepartment,
        deleteDepartment,
    };
}