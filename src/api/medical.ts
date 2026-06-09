import { CreateMedicalDTO, Medical } from "./interfaces/medical";
import { instance } from "./rh"

export const getByEmployee = async (employeeID: string) => {
    const { data } = await instance.get<Medical>(`employees/${employeeID}/medical`);
    return data;
}

export const updateByEmployee = async ({ employeeID, form }: { employeeID: string, form: Partial<CreateMedicalDTO> }) => {
    const { data } = await instance.patch<Medical>(`employees/${employeeID}/medical`, form);
    return data;
}

export const createByEmployee = async ({ employeeID, form }: { employeeID: string, form: CreateMedicalDTO }) => {
    const { data } = await instance.post<Medical>(`employees/${employeeID}/medical`, form);
    return data;
}