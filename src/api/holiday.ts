import { FormHoliday, Holiday, HolidayConfig, HolidayCOnfigForm, HolidayResponseCreate } from "./interfaces/holiday";
import { QueryParams } from "./interfaces/queryParams";
import { ResponseMessage, ResponsePagination } from "./interfaces/response";
import { instance } from "./rh";

export const getHolidays = async (id: string, queryParams: QueryParams) => {
    const { data } = await instance.get<ResponsePagination<Holiday>>(`users/${id}/holidays`, { params: queryParams });
    return data;
}

export const cancelHoliday = async ({holidayID, userID}:{holidayID: number, userID: string}) => {
    const { data } = await instance.get<ResponseMessage>(`users/${userID}/holidays/${holidayID}`);
    return data.message;
}

export const downloadFormatHoliday = async (userID: string, holidayID: number) => {
    const response = await instance.get<Blob>(`users/${userID}/holidays/${holidayID}/format`, {
        responseType: 'blob',
        headers: {
            'Accept': 'application/pdf, image/*, application/octet-stream',
        }
    });
    return {blob: response.data, headers: response.headers};
}

export const createHoliday = async (params: { userID: string, data: FormHoliday }) => {
    const { data } = await instance.post<HolidayResponseCreate>(`users/${params.userID}/holidays`, params.data);
    return data;
}

export const uploadVoucher = async ({ id, formData }: { id: number, formData: FormData }) => {
    const { data } = await instance.post(`/holidays/${id}/voucher`, formData);
    return data;
}

export const getConfigHolidays = async () => {
    const { data } = await instance.get<{ config: HolidayConfig[] }>(`configuration/holiday`);
    return data.config;
}

export const createConfig = async (dataSend: HolidayCOnfigForm) => {
    const { data } = await instance.post(`configuration/holidays`, dataSend);
    return data;
}

export const updateConfig = async ({ dataSend, id }: { id: number, dataSend: Partial<HolidayCOnfigForm> }) => {
    const { data } = await instance.patch(`configuration/holidays/${id}`, dataSend);
    return data;
}

export const deleteConfig = async (id: number) => {
    const { data } = await instance.delete(`configuration/holidays/${id}`);
    return data;
}