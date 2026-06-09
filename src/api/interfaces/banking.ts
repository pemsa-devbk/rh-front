import { DefaultOptionType } from "./general";

export interface BankingInformation {
    CLABE: string;
    account_number: string;
    employee_id: string;
    bank_id: number;
    bank_name: string;
}

export interface BankingInformationForm {
    bank: DefaultOptionType<number>;
    CLABE: string;
    account_number: string;
}

export type CreateBankingInformationDTO = Omit<BankingInformationForm, 'bank'> &{ 
    bank_id: number;
}

export interface Bank {
    bank_id: number;
    name: string;
    institution_key: string;
    total_users: number;
}
