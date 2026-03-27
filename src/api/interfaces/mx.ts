
export interface States{
    code_state: string;
    name: string;
    total_municipalities: number;
    total_colonies: number;
    total_addresses: number;
}

export interface Municipality{
    municipality_id: string;
    name: string;
    code_municipality: string;
    code_state: string;
    total_colonies: number;
    total_addresses: number;
}

export interface Colony{
    colony_id: number;
    name: string;
    code_settlement: string;
    postal_code: string;
    municipality_id: string;
    
    municipality_name?: string;
    code_state?: string;
    settlement_name?: string;
    state_name?: string;
    total_addresses?: string;
}


export interface PostalCode {
    state_name: string;
    code_state: string;
    municipality_name: string;
    municipality_id: string;
    colonies: Colony[];
}




