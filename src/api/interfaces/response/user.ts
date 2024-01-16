import { Contact } from "./contact";

export interface UsersResponse {
    users: BasicUser[];
}

export interface UserResponse {
    user: User;
}

export interface BasicUser {
    id: string;
    name: string;
    curp: string;
    rol: Rol;
    status: boolean;
    createdAt: Date;
    state: State;
}

export interface User extends BasicUser{
    position: string;
    phone: string;
    address: string;
    birthdate: Date;
    bloodType: BloodType;
    allergies: string | null;
    nss: string | null;
    cuip: string | null;
    urlPhoto: string;
    upDateAt: Date;
    deletedAt: Date | null;
    misMovs: MISMOV[];
    userChief: UserChief;
    contacts: Contact[];
}
export enum BloodType {
    A = "A+",
    AN = "A-",
    BP = "B+",
    BN = "B-",
    ABP = "AB+",
    ABN = "AB-",
    OP = "O+",
    ON = "O-",
    
}

export enum Rol {
    SUPER_USER = 'super-user',
    ADMIN = 'admin',
    MANAGER = 'manager', 
    QUERY = 'query', 
    USER = 'user' 
}

export interface State {
    id: number;
    name: string;
}

interface UserChief {
    id: string;
    name: string;
}
interface MISMOV {
    id: number;
    createdAt: Date;
    createdBy: UserChief;
    movType: MOVType;
}
interface MOVType {
    nameMov: string;
}

