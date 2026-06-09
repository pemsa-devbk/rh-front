import { Contract, CreateContractDTO} from "./interfaces/contract";
import { instance } from "./rh";



export const getByEmployee = async (employeeID: string) => {
    const { data } = await instance.get<Array<Contract>>(`employees/${employeeID}/contracts`);
    return data;
}

export const createByEmployee = async({employeeID, form}: {form: CreateContractDTO, employeeID: string}) => {
    const {data} = await instance.post<Contract>(`employees/${employeeID}/contracts`, form);
    return data;
}

export const deleteByEmployee = async ({ employeeID, contractID }: { employeeID: string, contractID: number }) => {
    const { data } = await instance.delete<Contract>(`employees/${employeeID}/contracts/${contractID}`);
    return data;
}