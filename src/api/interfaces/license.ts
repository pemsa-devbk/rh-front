export enum LicenseType{
    COMMERCIAL  = 1,
    PRIVATE = 2,
}

export interface CreateLicenseDTO{
    issue_date: Date;
    type: LicenseType;
    validity: Date;
}