export interface EnterpiseInformation {
    email: string;
    phone: string | null;
    cell_phone: string | null;
    ext: string | null;
    employee_id: string;
}

export interface CreateEnterpiseInformationDTO {
    email: string;
    phone: string | null;
    cell_phone: string | null;
    ext: string | null;
}

export interface UpdateEnterpriseInformationDTO{
    email?: string;
    phone?: string | null;
    cell_phone?: string | null;
    ext?: string | null;
}
