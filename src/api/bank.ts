import { Bank, BankingInformation, CreateBankingInformationDTO } from "./interfaces/banking";
import { QueryParams } from "./interfaces/queryParams";
import { ResponsePagination } from "./interfaces/response";
import { instance } from "./rh";

export const getAll = async (params: QueryParams) => {
    const {data} = await instance.get<ResponsePagination<Bank>>(`banks`, {params});
    return data;
}



export const getByEmployee = async (employeeID: string) => {
    const { data } = await instance.get<BankingInformation>(`employees/${employeeID}/banking-details`);
    return data;
}

export const updateByEmployee = async ({ employeeID, form }: { employeeID: string, form: Partial<CreateBankingInformationDTO> }) => {
    const { data } = await instance.patch<BankingInformation>(`employees/${employeeID}/banking-details`, form);
    return data;
}

export const createByEmployee = async ({ employeeID, form }: { employeeID: string, form: CreateBankingInformationDTO }) => {
    const { data } = await instance.post<BankingInformation>(`employees/${employeeID}/banking-details`, form);
    return data;
}