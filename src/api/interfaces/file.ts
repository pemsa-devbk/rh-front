export interface File{
    file_id: number;
    name: string;
    key: string;
    valid_mime_types: string;
    max_size: string;
    is_required: boolean;
    description: string | null;
    is_active: boolean;
    can_removed: boolean;
    created_at: string;
}

export interface FileEmployee{
    file_id: number;
    name: string,
    key: string,
    valid_mime_types: string,
    max_size: number,
    is_required: boolean,
    description: string | null,
    is_active: boolean,
    is_cropped: boolean,
    aspect_ratio: number,
    updated_at: string | null,
    expires_on: string | null,
    name_employee_uploaded: string | null,
    user_id_employee_uploaded: string | null,
}