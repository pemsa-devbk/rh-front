import { Area } from "./area";
import { DefaultOptionType } from "./general";

export interface Position {
    name: string;
    position_id: number;
    total_employees: string;
    area_id: number;
    area_name?: string;
    department_id?: number;
    department_name?: string;
    office_id?: number;
    office_name?: string;
    enterprise_id?: string;
    enterprise_name?: string;
    // * Only user interface
    area?: Area;
}

export interface FormPosition {
    name: string;
    enterprise: DefaultOptionType<string>;
    office: DefaultOptionType<number>;
    department: DefaultOptionType<number>;
    area: DefaultOptionType<number>;
}


export type CreatePositionDTO = Omit<FormPosition, 'enterprise' | 'office' | 'department' | 'area'>
export type UpdatePositionDTO = Partial<CreatePositionDTO>;
