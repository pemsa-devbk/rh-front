import { Bank } from "./interfaces/banking";
import { QueryParams } from "./interfaces/queryParams";
import { ResponsePagination } from "./interfaces/response";
import { instance } from "./rh";

export const getAll = async (params: QueryParams) => {
    const {data} = await instance.get<ResponsePagination<Bank>>(`banks`, {params});
    return data;
}