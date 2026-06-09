import { Binnacle } from "./interfaces/binnacle";
import { QueryParams } from "./interfaces/queryParams";
import { ResponsePagination } from "./interfaces/response";
import { instance } from "./rh";


export const getByModified = async (employeeID: string, params: QueryParams) => {
    const { data } = await instance.get<ResponsePagination<Binnacle>>(`users/${employeeID}/binnacles/modified`, {params});
    return data;
}

export const getByModifier = async (employeeID: string, params: QueryParams) => {
    const { data } = await instance.get<ResponsePagination<Binnacle>>(`users/${employeeID}/binnacles/modifier`, {params});
    return data;
}
