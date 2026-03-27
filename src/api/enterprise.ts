import { CreateEnterpriseDTO, Enterprise, FormGetSignature, FormSignature, Signature, UpdateEnterpriseDTO } from "./interfaces/enterprise";
import { QueryParams } from "./interfaces/queryParams";
import { ResponsePagination } from "./interfaces/response";
import { instance } from "./rh";

export const getAll = async (params: QueryParams) => {
    const { data } = await instance.get<ResponsePagination<Enterprise>>(`enterprises`, { params });
    return data;
}

export const getOne = async(enterpriseID: string) => {
    const { data } = await instance.get<Enterprise>(`enterprises/${enterpriseID}`);
    return data;
}

export const create = async (body: CreateEnterpriseDTO) => {
    const { data } = await instance.post<Enterprise>(`/enterprises`, body);
    return data;
}

export const update = async ({ body, enterpriseID }: { enterpriseID: string, body: UpdateEnterpriseDTO }) => {
    const { data } = await instance.patch<Enterprise>(`/enterprises/${enterpriseID}`, body);
    return data;
}

export const remove = async (enterpriseID: string) => {
    const { data } = await instance.delete<Enterprise>(`/enterprises/${enterpriseID}`);
    return data;
}

// * Signature
export const priviewSignature = async ({ id, body }: { id: string, body: FormSignature }) => {
    const { data } = await instance.post(`/enterprise/${id}/preview_signature`, body, { responseType: 'blob' });
    return data;
}

export const createSignature = async ({ id, body }: { id: string, body: FormSignature }) => {
    const { data } = await instance.post(`/enterprise/${id}/create_signature`, body);
    return data;
}

export const updateSignature = async ({ id, body }: { id: string, body: FormSignature }) => {
    const { data } = await instance.patch(`/signature/${id}`, body);
    return data;
}

export const getSignature = async (id: string) => {
    const { data } = await instance.get<Signature>(`signature/${id}`);
    return data;
}
export const downloadSignature = async (id: string, form: FormGetSignature) => {
    const { data } = await instance.post(`enterprise/${id}/download_signature`, form, { responseType: 'blob' });
    return data;
}