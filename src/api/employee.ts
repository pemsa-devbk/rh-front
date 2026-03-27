import { CreateEmployeeDTO, Employee } from "./interfaces/employee";
import { QueryParams } from "./interfaces/queryParams";
import { ResponsePagination } from "./interfaces/response";
import { instance } from "./rh";

export const getEmployees = async (queryParams: QueryParams) => {
    const { data } = await instance.get<ResponsePagination<Employee>>('employees', { params: queryParams });
    return data;
}

export const getEmployeesByEnterprise = async (enterpriseID: string, queryParams: QueryParams) => {
    const { data } = await instance.get<ResponsePagination<Employee>>(`enterprises/${enterpriseID}/employees`, { params: queryParams });
    return data;
}

export const getEmployeesByOffice = async (officeID: number, queryParams: QueryParams) => {
    const { data } = await instance.get<ResponsePagination<Employee>>(`offices/${officeID}/employees`, { params: queryParams });
    return data;
}


export const getEmployeesByDepartment = async (departmentID: number, queryParams: QueryParams) => {
    const { data } = await instance.get<ResponsePagination<Employee>>(`departments/${departmentID}/employees`, { params: queryParams });
    return data;
}

export const getEmployeesByArea = async (areaID: number, queryParams: QueryParams) => {
    const { data } = await instance.get<ResponsePagination<Employee>>(`areas/${areaID}/employees`, { params: queryParams });
    return data;
}

export const getEmployeesByPosition = async (positionID: number, queryParams: QueryParams) => {
    const { data } = await instance.get<ResponsePagination<Employee>>(`positions/${positionID}/employees`, { params: queryParams });
    return data;
}

export const getEmployeesByCourse = async (courseID: number, queryParams: QueryParams) => {
    const { data } = await instance.get<ResponsePagination<Employee>>(`courses/${courseID}/employees`, { params: queryParams });
    return data;
}

export const createEmployee = async (formEmployee: CreateEmployeeDTO) => {
    const {data} = await instance.post<Employee>(`employees`, formEmployee);
    return data;
}