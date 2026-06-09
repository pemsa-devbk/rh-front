
export interface Enterprise {
    enterprise_id: string;
    name: string;
    address: string;
    total_offices: number;
    total_departments: number;
    signature_id: string | null;
    total_areas: number;
    total_positions: number;
    total_employees: number;
}

export interface CreateEnterpriseDTO{
    name: string;
    address: string;
    signature: FormSignature;
}
export type UpdateEnterpriseDTO = Partial<CreateEnterpriseDTO>;

// * Signature
export interface FormSignature{
    url_logo: string;
    color_text: string;
    background: string;
    text_first_section: string;
    text_second_section: string;
    text_third_section: string;
    first_color_first_section: string | null;
    second_color_first_section: string | null;
    first_color_third_section: string | null;
    second_color_third_section: string | null;
    extra_text: string | null;
    color_extra: string | null;
    vertical_text: string | null;
    color_vertical_text: string | null;
}
export type FormEnterprise = Omit<CreateEnterpriseDTO, 'signature'> & FormSignature;

export interface Signature{
    signature_id: string;
    url_logo: string;
    background: string;
    color_text: string;
    extra_text: string | null;
    color_extra: string | null;
    text_first_section: string;
    first_color_first_section: string | null;
    second_color_first_section: string | null;
    text_second_section: string;
    text_third_section: string;
    first_color_third_section: string | null;
    second_color_third_section: string | null;
    vertical_text: string | null;
    color_vertical_text: string | null;
    enterprise_id: string;
}

export interface FormGetSignature{
    name: string;
    phone: string | null;
    ext: string | null;
    cell_phone: string | null;
    position: string | null;
}