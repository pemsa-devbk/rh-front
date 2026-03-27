import { DefaultOptionType } from "./general";
import { Office } from "./office";

export interface Area {
    responsible_name: string | null;
    department_name?: string;
    office_id?: number;
    office_name?: string;
    enterprise_id?: string;
    enterprise_name?: string;
    area_id: number;
    name: string;
    responsible_user_id: string | null;
    department_id: number;
    total_positions: number;
    total_employees: number;
    // * Only user interface
    office?: Office; 
}

export interface FormArea {
    name: string;
    responsible_user?: DefaultOptionType<string>;
    enterprise: DefaultOptionType<string>;
    office: DefaultOptionType<number>;
    department: DefaultOptionType<number>;
}

export type FormUpdateArea = Omit<FormArea, 'enterprise' | 'office' | 'department'>

export type CreateAreaDTO = Omit<FormArea, 'responsible_user' | 'enterprise' | 'office' | 'department'> & {
    responsible_user_id?: string | null;
}

export type UpdateAreaDTO = Partial<CreateAreaDTO>;