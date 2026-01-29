import { supabase } from '@/src/lib/supabase';
import { Employee, EmployeeInsert, EmployeeUpdate, EmployeeWithDepartment } from '@/src/types';
import { useEffect, useState } from 'react';

export function useEmployees() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEmployees = async () => {
        try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
            .from('employee')
            .select('*')
            .order('employee_name', { ascending: true }); // Campo correcto

        if (fetchError) throw fetchError;

        setEmployees(data || []);
        } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar empleados');
        console.error('Error fetching employees:', err);
        } finally {
        setLoading(false);
        }
    };

    const fetchEmployeesWithDepartment = async (): Promise<EmployeeWithDepartment[]> => {
        try {
        const { data, error: fetchError } = await supabase
            .from('employee')
            .select(`
            *,
            department:FK_department_id (
                department_id,
                department_name,
                created_at
            )
            `)
            .order('employee_name', { ascending: true });

        if (fetchError) throw fetchError;

        return (data as EmployeeWithDepartment[]) || [];
        } catch (err) {
        console.error('Error fetching employees with department:', err);
        return [];
        }
    };

    const fetchEmployeesByDepartment = async (departmentId: number): Promise<Employee[]> => {
        try {
        const { data, error: fetchError } = await supabase
            .from('employee')
            .select('*')
            .eq('FK_department_id', departmentId) // FK correcto
            .order('employee_name', { ascending: true });

        if (fetchError) throw fetchError;

        return data || [];
        } catch (err) {
        console.error('Error fetching employees by department:', err);
        return [];
        }
    };

    const fetchEmployeeById = async (id: number): Promise<EmployeeWithDepartment | null> => {
        try {
        const { data, error: fetchError } = await supabase
            .from('employee')
            .select(`
            *,
            department:FK_department_id (
                department_id,
                department_name,
                created_at
            )
            `)
            .eq('id', id)
            .single();

        if (fetchError) throw fetchError;

        return data as EmployeeWithDepartment;
        } catch (err) {
        console.error('Error fetching employee:', err);
        return null;
        }
    };

    const createEmployee = async (employeeData: EmployeeInsert): Promise<Employee | null> => {
        try {
        const { data, error: insertError } = await supabase
            .from('employee')
            .insert(employeeData)
            .select()
            .single();

        if (insertError) throw insertError;

        if (data) {
            setEmployees(prev => [...prev, data]);
        }

        return data;
        } catch (err) {
        console.error('Error creating employee:', err);
        throw err;
        }
    };

    const updateEmployee = async (
        id: number,
        updates: EmployeeUpdate
    ): Promise<Employee | null> => {
        try {
        const { data, error: updateError } = await supabase
            .from('employee')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (updateError) throw updateError;

        if (data) {
            setEmployees(prev =>
            prev.map(emp => (emp.id === id ? data : emp))
            );
        }

        return data;
        } catch (err) {
        console.error('Error updating employee:', err);
        throw err;
        }
    };

    const deleteEmployee = async (id: number): Promise<boolean> => {
        try {
        const { error: deleteError } = await supabase
            .from('employee')
            .delete()
            .eq('id', id);

        if (deleteError) throw deleteError;

        setEmployees(prev => prev.filter(emp => emp.id !== id));

        return true;
        } catch (err) {
        console.error('Error deleting employee:', err);
        throw err;
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    return {
        employees,
        loading,
        error,
        fetchEmployees,
        fetchEmployeesWithDepartment,
        fetchEmployeesByDepartment,
        fetchEmployeeById,
        createEmployee,
        updateEmployee,
        deleteEmployee,
    };
}