import { DefaultOptionType } from "./general";

export interface Department {
    responsible_name: string | null;
    office_name?: string;
    enterprise_id?: string;
    enterprise_name?: string;
    department_id: number;
    name: string;
    office_id: number;
    responsible_user_id: string | null;
    total_areas: number;
    total_positions: number;
    total_employees: number;
}


export interface FormDepartment {
    name: string;
    responsible_user?: DefaultOptionType<string>;
    enterprise: DefaultOptionType<string>;
    office: DefaultOptionType<number>;
}
export type FormUpdateDepartment = Omit<FormDepartment, 'enterprise' | 'office'>
export type CreateDepartmentDTO = Omit<FormDepartment, 'office' | 'enterprise' | 'responsible_user'> & {
    responsible_user_id?: string | null;
};
export type UpdateDepartmentDTO = Partial<CreateDepartmentDTO>;
