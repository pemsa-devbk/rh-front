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