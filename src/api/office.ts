import { QueryParams } from "./interfaces/queryParams";
import { ResponsePagination } from "./interfaces/response";
import { instance } from "./rh";
import { CreateOfficeDto, Office, UpdateOfficeDTO} from './interfaces/office';

export const getAll = async (pagination: QueryParams) => {
    const {data} = await instance.get<ResponsePagination<Office>>(`offices`, {params: pagination});
    return data;
}

export const getOne = async (enterpriseID: string, officeID: number) => {
    const {data} = await instance.get<Office>(`enterprises/${enterpriseID}/offices/${officeID}`);
    return data;
}

export const getByEnterprice = async (id: string, pagination: QueryParams) => {
    const {data} = await instance.get<ResponsePagination<Office>>(`enterprises/${id}/offices`, {params: pagination});
    return data;
}

export const create = async({formOffice, enterpriseID}: {formOffice: CreateOfficeDto, enterpriseID: string}) => {
    const {data} = await instance.post<Office>(`/enterprises/${enterpriseID}/offices`, formOffice);
    return data;
}

export const update = async(params: {formOffice:UpdateOfficeDTO, enterpriseID: string, officeID: number}) => {
    const {data} = await instance.patch<Office>(`/enterprises/${params.enterpriseID}/offices/${params.officeID}`, params.formOffice);
    return data;
}

export const remove = async({enterpriseID, officeID}: {officeID: number, enterpriseID: string}) => {
    const {data} = await instance.delete<Office>(`/enterprises/${enterpriseID}/offices/${officeID}`);
    return data;
}