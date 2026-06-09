import { CreateLicenseDTO, License } from "./interfaces/license";
import { instance } from "./rh";


export const getByEmployee = async (employeeID: string) => {
    const { data } = await instance.get<License>(`employees/${employeeID}/license`);
    return data;
}

export const updateByEmployee = async ({ employeeID, form }: { employeeID: string, form: Partial<CreateLicenseDTO> }) => {
    const { data } = await instance.patch<License>(`employees/${employeeID}/license`, form);
    return data;
}

export const createByEmployee = async ({ employeeID, form }: { employeeID: string, form: CreateLicenseDTO }) => {
    const { data } = await instance.post<License>(`employees/${employeeID}/license`, form);
    return data;
}