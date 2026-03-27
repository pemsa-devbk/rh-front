import { DefaultOptionType } from "./general";

export enum ContractType{
    TEMPORARY  = 1,
    INDETERMINATE = 2,
}

export interface ContractForm {
    enterprise: DefaultOptionType<string>;
    office: DefaultOptionType<number>;
    department: DefaultOptionType<number>;
    area: DefaultOptionType<number>;
    position: DefaultOptionType<number>;
    user_chief?: DefaultOptionType<string>;

    salary: number;
    cp_csf: string;
    date_entry: Date;
    have_uniform?: boolean;
    cuip?: string;
    num_infonavit?: string;
    type_contract: ContractType;
    validity?: Date;
}

export interface CreateContractDTO {
    type: ContractType;
    validity?: Date;
}