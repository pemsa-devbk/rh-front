import { CreateEmployeeDTO, Employee, UpdateEmployeeDTO, UpdatePasswordDTO } from "./interfaces/employee";
import { QueryParams } from "./interfaces/queryParams";
import { ResponsePagination } from "./interfaces/response";
import { instance } from "./rh";

export const getEmployees = async (queryParams: Partial<QueryParams>) => {
    const { data } = await instance.get<ResponsePagination<Employee>>('employees', { params: queryParams });
    return data;
}

export const getEmployee = async(employeeID: string) => {
    const {data} = await instance.get<Employee>(`employees/${employeeID}`);
    return data;
}

export const getMeProfile = async() => {
    const {data} = await instance.get<Employee>(`me`);
    return data;
}

export const getEmployeesByEnterprise = async (enterpriseID: string, queryParams: Partial<QueryParams>) => {
    const { data } = await instance.get<ResponsePagination<Employee>>(`enterprises/${enterpriseID}/employees`, { params: queryParams });
    return data;
}

export const getEmployeesByOffice = async (officeID: number, queryParams: Partial<QueryParams>) => {
    const { data } = await instance.get<ResponsePagination<Employee>>(`offices/${officeID}/employees`, { params: queryParams });
    return data;
}


export const getEmployeesByDepartment = async (departmentID: number, queryParams: Partial<QueryParams>) => {
    const { data } = await instance.get<ResponsePagination<Employee>>(`departments/${departmentID}/employees`, { params: queryParams });
    return data;
}

export const getEmployeesByArea = async (areaID: number, queryParams: Partial<QueryParams>) => {
    const { data } = await instance.get<ResponsePagination<Employee>>(`areas/${areaID}/employees`, { params: queryParams });
    return data;
}

export const getEmployeesByPosition = async (positionID: number, queryParams: Partial<QueryParams>) => {
    const { data } = await instance.get<ResponsePagination<Employee>>(`positions/${positionID}/employees`, { params: queryParams });
    return data;
}

export const getEmployeesByCourse = async (courseID: number, queryParams: Partial<QueryParams>) => {
    const { data } = await instance.get<ResponsePagination<Employee>>(`courses/${courseID}/employees`, { params: queryParams });
    return data;
}

export const createEmployee = async (formEmployee: CreateEmployeeDTO) => {
    const {data} = await instance.post<Employee>(`employees`, formEmployee);
    return data;
}

export const updateEmployee = async ({form, employeeID}: {form: UpdateEmployeeDTO, employeeID: string}) => {
    const {data} = await instance.patch<Employee>(`employees/${employeeID}`, form);
    return data;
}

export const updatePassword = async({confirm_password, ...form}: UpdatePasswordDTO) => {
    const {data} = await instance.put(`employees/me/password`, form);
    return data;
}