import { Area, CreateAreaDTO, UpdateAreaDTO } from "./interfaces/area";
import { QueryParams } from "./interfaces/queryParams";
import { ResponsePagination } from "./interfaces/response";
import { instance } from "./rh";

export const getAll = async (pagination: QueryParams) => {
    const {data} = await instance.get<ResponsePagination<Area>>(`areas`, {params: pagination});
    return data;
}

export const getOne = async (departmentID: number, areaID: number) => {
    const {data} = await instance.get<Area>(`departments/${departmentID}/areas/${areaID}`);
    return data;
}

export const getByEnterprise = async (enterpriseID: string, pagination: QueryParams) => {
    const {data} = await instance.get<ResponsePagination<Area>>(`enterprises/${enterpriseID}/areas`, {params: pagination});
    return data;
}

export const getByOffice = async (officeID: number, pagination: QueryParams) => {
    const {data} = await instance.get<ResponsePagination<Area>>(`offices/${officeID}/areas`, {params: pagination});
    return data;
}

export const getByDepartment = async (departmentID: number, pagination: QueryParams) => {
    const {data} = await instance.get<ResponsePagination<Area>>(`departments/${departmentID}/areas`, {params: pagination});
    return data;
}

export const create = async({body, departmentID}:{body:CreateAreaDTO, departmentID: number}) => {
    const {data} = await instance.post<Area>(`/departments/${departmentID}/areas`, body);
    return data;
}

export const update = async({areaID,body,departmentID}: {body:UpdateAreaDTO, areaID: number, departmentID: number}) => {
    const {data} = await instance.patch<Area>(`/departments/${departmentID}/areas/${areaID}`, body);
    return data;
}

export const remove = async({areaID, departmentID}: {areaID: number, departmentID: number}) => {
    const {data} = await instance.delete<Area>(`/departments/${departmentID}/areas/${areaID}`);
    return data;
}