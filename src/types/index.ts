// src/types/index.ts
import { Database } from './database.types';

// Solo exportas los types que necesitas
export type Employee = Database['public']['Tables']['employee']['Row'];
export type Department = Database['public']['Tables']['department']['Row'];
export type User = Database['public']['Tables']['user']['Row'];

// Types para insert (sin id, created_at, etc.)
export type EmployeeInsert = Database['public']['Tables']['employee']['Insert'];
export type DepartmentInsert = Database['public']['Tables']['department']['Insert'];

// Types para update (todo opcional)
export type EmployeeUpdate = Database['public']['Tables']['employee']['Update'];
export type DepartmentUpdate = Database['public']['Tables']['department']['Update'];

// Enums
export type UserRole = Database['public']['Enums']['UserType'];

// Este export es de Empleados con su departamento asociado se usa para Joins
export type EmployeeWithDepartment = Employee & {
  department: Department;
};

// Formularios
export type DepartmentFormData = Omit<Department, 'id' | 'created_at'>;
export type EmployeeFormData = Omit<Employee, 'id' | 'created_at'>;

// Types no relacionados con la DB:
export { DEFAULT_SETTINGS } from "./settings";
export type { Settings, ThemeMode } from "./settings";
