export interface EnterpiseInformation {
    email: string;
    phone: string | null;
    cell_phone: string | null;
    ext: string | null;
    user_id: string;
}

export type CreateEnterpiseInformationDTO = Omit<EnterpiseInformation, 'user_id'>;