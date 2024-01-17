export interface CreateContact{
    contact: string;

    type: ValidContact;

    notes?: string;
}

export interface UpdateContact {
    contact?: string;

    type?: ValidContact;

    notes?: string;
}

export enum ValidContact {
    correo = 1,
    telefono = 2
}