import { DefaultOptionType } from "./general";

export interface Address{
    street: string;
    references: string;
    user_id: string;
    colony_id: number;
}

export interface AddressForm {
    colony: DefaultOptionType<number>;
    postal_code: string;
    street: string;
    references: string;
    state: string;
    municipality: string;
}

export type CreateAddressDTO = Omit<AddressForm, 'colony' | 'state' | 'municipality' | 'postal_code'> & {
    colony_id: number;
}; 