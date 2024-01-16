export interface CreateContact{
    contact: string;

    type: ValidContact;

    ntes: string;
}

export enum ValidContact {
    correo = 1,
    telefono = 2
}