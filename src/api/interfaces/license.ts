export enum LicenseType{
    COMMERCIAL  = 1,
    PRIVATE = 2,
}

export interface License{
    issue_date: string;
    type: LicenseType;
    validity: string;
    employee_id: string;
}

export interface CreateLicenseDTO{
    issue_date: string;
    type: LicenseType;
    validity: string;
}