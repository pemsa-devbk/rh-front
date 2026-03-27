
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

export interface Medical{
    blood_type: BloodType | null;
    allergies: string | null;
    nss: string | null;
    diseases: string | null;
    user_id: string;
}

export type CreateMedicalDTO = Omit<Medical, 'user_id'>;