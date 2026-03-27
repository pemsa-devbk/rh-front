import { CreatePositionDTO, Position, UpdatePositionDTO } from "./interfaces/position";
import { QueryParams } from "./interfaces/queryParams";
import { ResponsePagination } from "./interfaces/response";
import { instance } from "./rh";


export const getAll = async(pagination: QueryParams) => {
    const { data } = await instance.get<ResponsePagination<Position>>(`/positions`, { params: pagination });
    return data;
}

export const getOne = async(areaID: number, positionID: number) => {
    const { data } = await instance.get<Position>(`areas/${areaID}/positions/${positionID}`);
    return data;
}

export const getByEnterprise = async (enterpriseID: string, pagination: QueryParams) => {
    const { data } = await instance.get<ResponsePagination<Position>>(`/enterprises/${enterpriseID}/positions`, { params: pagination });
    return data;
}

export const getByOffice = async (officeID: number, pagination: QueryParams) => {
    const { data } = await instance.get<ResponsePagination<Position>>(`/offices/${officeID}/positions`, { params: pagination });
    return data;
}

export const getByDepartment = async (departmentID: number, pagination: QueryParams) => {
    const { data } = await instance.get<ResponsePagination<Position>>(`/departments/${departmentID}/positions`, { params: pagination });
    return data;
}

export const getByArea = async (areaID: number, pagination: QueryParams) => {
    const { data } = await instance.get<ResponsePagination<Position>>(`/areas/${areaID}/positions`, { params: pagination });
    return data;
}

export const create = async ({areaID, body}:{body: CreatePositionDTO, areaID: number}) => {
    const { data } = await instance.post<Position>(`/areas/${areaID}/positions`, body);
    return data;
}

export const update = async ({areaID,body, positionID}: { body: UpdatePositionDTO, positionID: number, areaID: number }) => {
    const { data } = await instance.patch<Position>(`/areas/${areaID}/positions/${positionID}`, body);
    return data;
}

export const remove = async ({areaID,  positionID}:{positionID: number, areaID: number}) => {
    const { data } = await instance.delete<Position>(`/areas/${areaID}/position/${positionID}`);
    return data;
}