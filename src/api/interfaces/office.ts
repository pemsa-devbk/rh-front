import { Enterprise } from "./enterprise";

export interface Office {
    office_id: number;
    name: string;
    enterprise_id: string;
    total_departments: number;
    total_areas: number;
    total_positions: number;
    total_employees: number;
    enterprise_name?: string;
    // * only user interface
    enterprise: Enterprise;
}

export interface FormOffice {
    name: string;
    enterprise: {label: string, value: string};
}
export type CreateOfficeDto = Omit<FormOffice, 'enterprise'>;
export type UpdateOfficeDTO = Partial<CreateOfficeDto>;