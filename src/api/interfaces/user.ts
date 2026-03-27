import { Dayjs } from "dayjs";
import { Position } from "./position";

export interface User {
    user_id: string;
    name: string;
    update_at: string;
    deleted_at: string | null;
}

export interface User2 {
    user_id: string;
    name: string;
    phone: string | null;
    cell_phone: string | null;
    email: string | null;
    ext: string | null;
    gender: Gender;
    birthdate: Date;
    curp: string;
    address: string | null; 
    blood_type: BloodType | null;
    allergies: string | null;
    nss: string | null;
    cuip: string | null;
    rol: Rol;
    status: StatusUser;
    vacation_days: number;
    contract_date: Date;
    update_at: Date;
    deleted_at: Date;
    user_chief_id: string;
    position_id: number;
    userChief: User;
    position?: Position;
    courseUsers: Array<{haveProof: boolean, course_id: number, user_id: string}>
}


export enum StatusUser {
    baja = 0,
    activo = 1,
    vacaciones = 2,
}

export enum Gender {
    M = "M",
    F = 'F'
}

export enum BloodType {
    A = "A+",
    AN = "A-",
    BP = "B+",
    BN = "B-",
    AB = "AB+",
    ABN = "AB-",
    O = "O+",
    ON = "O-",
}

export enum Rol {
    SUPER_USER = 'super-user',
    ADMIN = 'admin',
    MANAGER = 'manager',
    QUERY = 'query',
    USER = 'user'
}

export interface FormUser{
    user_id: string;
    name: string;
    phone: string | null;
    ext: string | null;
    cell_phone: string | null;
    email: string | null;
    gender: Gender;
    birthdate: Dayjs; 
    curp: string;
    address: string | null;
    blood_type: BloodType | null;
    allergies: string | null;
    nss: string | null;
    cuip: string | null;
    rol: Rol;
    contract_date: Dayjs;
    position_id: number;
    user_chief_id: string | null;
    // * Extra solo para validaciones
    enterprise_id: string;
    office_id: number;
    area_id: number;
}
