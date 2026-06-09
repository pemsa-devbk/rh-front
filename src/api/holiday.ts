import { FormHoliday, Holiday, HolidayConfig, HolidayConfigForm, HolidayResponseCreate } from "./interfaces/holiday";
import { QueryParams } from "./interfaces/queryParams";
import { ResponseMessage, ResponsePagination } from "./interfaces/response";
import { instance } from "./rh";

export const getHolidaysByEmployee = async (employeeID: string, queryParams: QueryParams) => {
    const { data } = await instance.get<ResponsePagination<Holiday>>(`employees/${employeeID}/holidays`, { params: queryParams });
    return data;
}

export const cancelHoliday = async ({ holidayID, employeeID }: { holidayID: number, employeeID: string }) => {
    const { data } = await instance.patch<ResponseMessage>(`employees/${employeeID}/holidays/${holidayID}/cancel`);
    return data.message;
}

export const createHoliday = async ({ employeeID, form }: { employeeID: string, form: FormHoliday }) => {
    const { data } = await instance.post<HolidayResponseCreate>(`employees/${employeeID}/holidays`, form);
    return data;
}

export const uploadProof = async ({ holidayID, employeeID, formData }: { employeeID: string, holidayID: number, formData: FormData }) => {
    const { data } = await instance.post(`/employees/${employeeID}/holidays/${holidayID}/proof`, formData);
    return data;
}


export const downloadProofHoliday = async ({employeeID, holidayID}:{employeeID: string, holidayID: number}) => {
    const response = await instance.get<Blob>(`employees/${employeeID}/holidays/${holidayID}/proof`, {
        responseType: 'blob',
        headers: {
            'Accept': 'application/pdf, image/*, application/octet-stream',
        }
    });
    return { blob: response.data, headers: response.headers };
}

// * Configuración de vacaciones
export const getConfigHolidays = async () => {
    const { data } = await instance.get<{ config: HolidayConfig[] }>(`configuration/holidays`);
    return data.config;
}

export const createConfig = async (dataSend: HolidayConfigForm) => {
    const { data } = await instance.post(`configuration/holidays`, dataSend);
    return data;
}

export const updateConfig = async ({ dataSend, id }: { id: number, dataSend: Partial<HolidayConfigForm> }) => {
    const { data } = await instance.patch(`configuration/holidays/${id}`, dataSend);
    return data;
}

export const deleteConfig = async (id: number) => {
    const { data } = await instance.delete(`configuration/holidays/${id}`);
    return data;
}