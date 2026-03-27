import { AddressForm, CreateAddressDTO } from "./address";
import { BankingInformationForm, CreateBankingInformationDTO } from "./banking";
import { ContractForm, CreateContractDTO } from "./contract";
import { CreateEnterpiseInformationDTO } from "./enterpiseInformation";
import { CreateLicenseDTO, LicenseType } from "./license";
import { CreateMedicalDTO } from "./medical";
import { User } from "./user";

export enum MaritalStatus{
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
    enterprise_id?:               string;
    enterprise_name?:             string;
    office_id?:                   number;
    office_name?:                 string;
    department_id?:               number;
    department_name?:             string;
    area_id?:                     number;
    area_name?:                   string;
    position_name?:               string;
    have_proof?:                  boolean;
    gender:                       Gender;
    birthdate:                    Date;
    curp:                         string;
    status:                       StatusUser;
    rfc:                          string;
    cuip:                         string | null;
    num_children:                 number;
    vacation_days:                number;
    boss_id:                      string | null;
    have_uniform:                 boolean;
    num_infonavit:                string | null;
    marital_status:               MaritalStatus;
    place_registration:           string;
    salary:                       number;
    cp_csf:                       string;
    date_entry:                   Date;
    position_id:                  number;
}


export interface StepOneForm {
    user_id: string;
    name: string;
    gender: Gender;
    birthdate: string;
    curp: string;
    rfc: string;
    num_children?: number;
    role_id: number; // TODO
    marital_status: MaritalStatus;
    place_registration: string;
    have_license: boolean;
    type_license: LicenseType;
    issue_date: Date;
    validity_license: Date;
}

export type EmployeForm = StepOneForm & CreateMedicalDTO & AddressForm & ContractForm & CreateEnterpiseInformationDTO & BankingInformationForm;


export type CreateEmployeeDTO = Omit<StepOneForm, 'have_license' | 'type_contract' | 'issue_date' | 'validity_license' | 'type_license'> & {
    position_id: number;
    user_chief_id: string;
    // * Restante
    salary: number;
    cp_csf: string;
    date_entry: Date;
    have_uniform?: boolean;
    cuip?: string;
    num_infonavit?: string;
    // * Relaciones
    contract?: CreateContractDTO;
    address?: CreateAddressDTO;
    medical?: CreateMedicalDTO;
    enterpiseInformation?: CreateEnterpiseInformationDTO;
    banking?: CreateBankingInformationDTO;
    license?: CreateLicenseDTO;
}