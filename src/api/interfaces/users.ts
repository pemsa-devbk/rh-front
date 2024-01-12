export interface ResponseUsers {
    users: User[];
}

export interface SimpleUser {
    id: string;
    name: string;
    position: string;
    phone?: string;
    birthdate: Date;
    curp: string;
    address?:  string;
    bloodType: BloodType ;
    allergies?: Allergies ;
    nss?:  string;
    urlPhoto: string;
    cuip?:  string;
    rol: Rol;
    status: boolean;
    upDateAt: Date;
    createdAt: Date;
    deletedAt?: Date;
    state?: State ;
}

interface UserChief {
    name: string;
    id: string;
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
