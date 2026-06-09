import { CreateAddressDTO } from "./address";
import { CreateBankingInformationDTO } from "./banking";
import { ContractType, CreateContractDTO } from "./contract";
import { CreateEnterpiseInformationDTO } from "./enterpiseInformation";
import { DefaultOptionType } from "./general";
import { CreateLicenseDTO, LicenseType } from "./license";
import { BloodType, CreateMedicalDTO } from "./medical";
import { User } from "./user";

export enum MaritalStatus {
    SINGLE = 1,
    MARRIED = 2,
    DIVORCED = 3,
    WIDOWER = 4,
    CONCUBINAGE = 5
}

export enum StatusUser {
    baja = 0,
    activo = 1,
    vacaciones = 2,
}

export enum Gender {
    MASCULINO = "M",
    FEMENINO = 'F'
}

export interface Employee extends User {
    enterprise_id?: string;
    enterprise_name?: string;
    office_id?: number;
    office_name?: string;
    department_id?: number;
    department_name?: string;
    area_id?: number;
    area_name?: string;
    position_name?: string;
    
    gender: Gender;
    birthdate: string;
    curp: string;
    status: StatusUser;
    rfc: string;
    cuip: string | null;
    num_children: number;
    vacation_days: number;
    boss_id: string | null;
    boss_name: string | null;
    have_uniform: boolean;
    num_infonavit: string | null;
    marital_status: MaritalStatus;
    place_registration: string;
    salary: number;
    cp_csf: string;
    date_entry: string;
    position_id: number;
    email: string;
    cell_phone: string;
    have_alimony: boolean;
    cred_fonacot: string;
    have_proof?: boolean; // Solo para cursos
}

// * Información basica
export interface StepOneForm {
    name: string;
    birthdate: string;
    curp: string;
    rfc: string;
    marital_status: MaritalStatus;
    email: string;
    cell_phone: string;
    place_registration: string;
    num_children?: number;
    gender: Gender;
    have_license: boolean;
    type_license: LicenseType;
    issue_date: string;
    validity_license: string;
    role_id: number; // TODO
}
// * Informacion de dirección
export interface StepTwoForm {
    postal_code: string;
    state: string;
    municipality: string;
    colony: DefaultOptionType<number>;
    street: string;
    references: string;
}
// * Información Medica
export interface StepThree {
    blood_type: BloodType | null;
    allergies: string | null;
    nss: string | null;
    diseases: string | null;
}
// * infromación de contrato 
export interface StepFour {
    user_id: string;
    enterprise: DefaultOptionType<string>;
    office: DefaultOptionType<number>;
    department: DefaultOptionType<number>;
    area: DefaultOptionType<number>;
    position: DefaultOptionType<number>;
    boss?: DefaultOptionType<string>;

    salary: number;
    cp_csf: string;
    date_entry: string;
    type_contract: ContractType;
    validity_contract?: string;
    have_uniform?: boolean;
    cuip?: string;
    num_infonavit?: string;
    cred_fonacot?: string;
    have_alimony: boolean;
}
// * información empresa
export interface StepFive {
    email_enterprise: string;
    phone_enterprise: string | null;
    cell_phone_enterprise: string | null;
    ext: string | null;
}
// * infromación bancaria 
export interface StepSix {
    bank: DefaultOptionType<number>;
    CLABE: string;
    account_number: string;
}

export type EmployeForm = StepOneForm & StepTwoForm & StepThree & StepFour & StepFive & StepSix;


export type CreateEmployeeDTO = Omit<StepOneForm, 'have_license' | 'issue_date' | 'validity_license' | 'type_license'> & {
    user_id: string;
    // TODO role:id
    position_id: number;
    boss_id: string;
    have_uniform?: boolean;
    num_infonavit?: string;

    // * Restante
    salary: number;
    cp_csf: string;
    date_entry: string;
    cuip?: string;
    have_alimony: boolean;
    cred_fonacot?: string;

    // * Relaciones
    contract?: CreateContractDTO;
    address?: CreateAddressDTO;
    medical?: CreateMedicalDTO;
    enterpiseInformation?: CreateEnterpiseInformationDTO;
    banking?: CreateBankingInformationDTO;
    license?: CreateLicenseDTO;
}
export interface UpdateEmployeeForm {
    // user_id?: string;
    name?: string;
    gender?: Gender;
    birthdate?: string;
    curp?: string;
    rfc?: string;
    cuip?: string | null;
    num_children?: number;
    have_uniform?: boolean;
    num_infonavit?: string | null;
    marital_status?: MaritalStatus;
    place_registration?: string;
    salary?: number;
    cp_csf?: string;
    date_entry?: string;
    email?: string;
    cell_phone?: string;
    have_alimony?: boolean;
    cred_fonacot?: string;

    boss?: DefaultOptionType<string>;
    enterprise?: DefaultOptionType<string>;
    office?: DefaultOptionType<number>;
    department?: DefaultOptionType<number>;
    area?: DefaultOptionType<number>;
    position?: DefaultOptionType<number>;
}
export interface UpdateEmployeeDTO {
    // * Datos para el formulario basico
    // user_id?: string;
    name?: string;
    gender?: Gender;
    birthdate?: string;
    curp?: string;
    rfc?: string;
    marital_status?: MaritalStatus;
    cuip?: string | null;
    num_children?: number;
    place_registration?: string;
    email?: string;
    cell_phone?: string;
    cp_csf?: string;
    num_infonavit?: string | null;
    have_alimony?: boolean;
    cred_fonacot?: string;
    
    //* Datos para el formulario de otros
    boss_id?: string | null;
    have_uniform?: boolean;
    salary?: number;
    date_entry?: string;
    position_id?: number;

}