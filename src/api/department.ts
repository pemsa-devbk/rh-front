import { CreateDepartmentDTO, Department, UpdateDepartmentDTO } from "./interfaces/department";
import { QueryParams } from "./interfaces/queryParams";
import { ResponsePagination } from "./interfaces/response";
import { instance } from './rh';


export const getAll = async(params: QueryParams) => {
    const {data} = await instance.get<ResponsePagination<Department>>(`departments`, {params});
    return data;
}

export const getByEnterprise = async(enterpriseID: string, params: QueryParams) => {
    const {data} = await instance.get<ResponsePagination<Department>>(`enterprises/${enterpriseID}/departments`, {params});
    return data;
}

export const getByOffice = async(officeID: number, params: QueryParams) => {
    const {data} = await instance.get<ResponsePagination<Department>>(`offices/${officeID}/departments`, {params});
    return data;
}

export const getOne = async(officeID: number, departmentID: number) => {
    const {data} = await instance.get<Department>(`offices/${officeID}/departments/${departmentID}`);
    return data;
}

export const create = async({officeID, body}: {officeID: number, body: CreateDepartmentDTO}) => {
    const {data} = await instance.post<Department>(`offices/${officeID}/departments`, body);
    return data;
}


export const update = async({body, departmentID, officeID}: {officeID: number, body: UpdateDepartmentDTO, departmentID: number}) => {
    const {data} = await instance.patch<Department>(`offices/${officeID}/departments/${departmentID}`, body);
    return data;
}

export const remove = async({departmentID, officeID}: {officeID: number, departmentID: number}) => {
    const {data} = await instance.delete<Department>(`offices/${officeID}/departments/${departmentID}`);
    return data;
}