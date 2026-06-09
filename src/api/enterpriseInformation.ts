import { CreateEnterpiseInformationDTO, EnterpiseInformation } from "./interfaces/enterpiseInformation";
import { instance } from "./rh"

export const getByEmployee = async (employeeID: string) => {
    const { data } = await instance.get<EnterpiseInformation>(`employees/${employeeID}/enterprise-information`);
    return data;
}

export const updateByEmployee = async ({ employeeID, form }: { employeeID: string, form: Partial<CreateEnterpiseInformationDTO> }) => {
    const { data } = await instance.patch<EnterpiseInformation>(`employees/${employeeID}/enterprise-information`, form);
    return data;
}