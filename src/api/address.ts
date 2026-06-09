import { Address, CreateAddressDTO } from "./interfaces/address";
import { instance } from "./rh"

export const getByEmployee = async (employeeID: string) => {
    const { data } = await instance.get<Address>(`employees/${employeeID}/address`);
    return data;
}

export const updateByEmployee = async ({ employeeID, form }: { employeeID: string, form: Partial<CreateAddressDTO> }) => {
    const { data } = await instance.patch<Address>(`employees/${employeeID}/address`, form);
    return data;
}