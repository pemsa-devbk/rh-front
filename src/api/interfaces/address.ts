import { DefaultOptionType } from "./general";

export interface Address{
    postal_code: string;
    colony_name: string;
    settlement_name: string;
    municipality_name: string;
    state_name: string;
    street: string;
    references: string | null;
    employee_id: string;
    colony_id: number;
}

export interface AddressForm {
    colony: DefaultOptionType<number>;
    state: string;
    municipality: string;
    postal_code: string;
    street: string;
    references: string | null;
}

export type CreateAddressDTO = Omit<AddressForm, 'colony' | 'state' | 'municipality' | 'postal_code'> & {
    colony_id: number;
}; 