
export interface FormContact {
    contact: string;
    type: TypeContact;
    notes?: string;
}

export interface MultipleContact {
    contacts: FormContact[];
}

export interface Contact {
    contact_id: number;
    contact: string;
    type: TypeContact;
    notes: string;
    employee_id: string;
}

export enum TypeContact {
    CORREO = 1,
    TELEFONO = 2
}