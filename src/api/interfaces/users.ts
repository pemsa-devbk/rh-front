export interface ResponseUsers {
    users: User[];
}

export interface SimpleUser {
    id: string;
    name: string;
    position: string;
    phone: null | string;
    birthdate: Date;
    curp: string;
    address: null | string;
    bloodType: BloodType ;
    allergies: Allergies | null;
    nss: null | string;
    urlPhoto: string;
    cuip: null | string;
    rol: Rol;
    status: boolean;
    upDateAt: Date;
    createdAt: Date;
    deletedAt: null;
    state: State | null;
}

interface UserChief {
    name: string;
}
export interface ResponseBloodTypes{
    bloodTypes: BloodType[];
}

export interface User extends SimpleUser {
    userChief: UserChief | null;
    state: State;
    contacts?: Contact[];
    misMovs?: MISMOV[];
}

export interface Contact {
    id: number;
    contact: string;
    type: number;
    notes: string;
}

interface MISMOV {
    id: number;
    createdAt: Date;
}

export enum Allergies {
    AllergiesNinguna = "Ninguna",
    Empty = "",
    Ninguna = "Ninguna ",
}

export enum BloodType {
    A = "A+",
    AN= "A-",
    BP = "B+",
    BN = "B-",
    ABP = "AB+",
    ABN = "AB-",
    OP = "O+",
    ON = "O-",
    Empty = "",
}

export enum Rol {
    Admin = "Admin",
    User = "user",
}

export interface State {
    id: number;
    name: string;
}

export interface ResponseCreateUser {
    createUser: User;
}
