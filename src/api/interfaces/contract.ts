export enum ContractType{
    TEMPORARY  = 1,
    INDETERMINATE = 2,
}

export interface Contract{
    contract_id: number; 
    type: ContractType;
    validity: string | null;
    employee_id: string;
    created_at: string;
}


export interface CreateContractDTO {
    type: ContractType;
    validity?: string;
}