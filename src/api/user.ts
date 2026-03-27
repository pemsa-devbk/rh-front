import { QueryParams } from "./interfaces/queryParams";
import { ResponsePagination } from "./interfaces/response";
import { FormUser, User } from "./interfaces/user";
import { instance } from "./rh";

export const getUsers = async (queryParams: QueryParams) => {
    const { data } = await instance.get<ResponsePagination<User>>('users', { params: queryParams });
    return data;
}
export const getUsersByEnterprise = async (enterpriseID: string, queryParams: QueryParams) => {
    const { data } = await instance.get<ResponsePagination<User>>(`enterprises/${enterpriseID}/users`, { params: queryParams });
    return data;
}
export const getUsersByOffice = async (officeID: number, queryParams: QueryParams) => {
    const { data } = await instance.get<ResponsePagination<User>>(`offices/${officeID}/users`, { params: queryParams });
    return data;
}
export const getUsersByArea = async (areaID: number, queryParams: QueryParams) => {
    const { data } = await instance.get<ResponsePagination<User>>(`areas/${areaID}/users`, { params: queryParams });
    return data;
}
export const getUsersByPosition = async (positionID: number, queryParams: QueryParams) => {
    const { data } = await instance.get<ResponsePagination<User>>(`positions/${positionID}/users`, { params: queryParams });
    return data;
}
export const getUsersByCourse = async (courseID: number, queryParams: QueryParams) => {
    const { data } = await instance.get<ResponsePagination<User>>(`courses/${courseID}/users`, { params: queryParams });
    return data;
}
export const createUser = async (datas: any) => {
    const { data } = await instance.post<User>(`users`, datas,);
    return data;
}
export const changeState = async (id: string) => {
    const { data } = await instance.patch(`users/status/${id}`);
    return data;
}

export const updateUser = async (datas: { id: string; data: Partial<FormUser> }) => {
    const { data } = await instance.patch<User>(`users/${datas.id}`, datas.data);
    return data
}

export const getUser = async (id: string) => {
    const { data } = await instance.get<User>(`/users/${id}`);
    return data;
}

export const updatePhoto = async(id: string, type: string, formData: FormData) => {
    const {data} = await instance.put(`users/${id}/${type}`, formData);
    return data;
}

export const getSignature = async(id: string) => {
    const {data} = await instance.get<Blob>(`users/${id}/signature`, {responseType: 'blob'});
    return data;
}

export const getCredential = async(id: string) => {
    const {data} = await instance.get<Blob>(`users/credencial/${id}`, {responseType: "blob"})
    return data;
}


interface Binnacle{
    binnacle_id: number;
    comment: string | null;
    created_at: Date;
    modified_user_id: string;
    modifierUser: {
        name: string;
    }
    modifier_user_id: string;
    type: string;
}
export const getBitacora = async (id: string, take: number, skip: number) => {
    const { data } = await instance.get<ResponsePagination<Binnacle>>(`user/${id}/binnacle`, { params: { take: take, skip: skip } });
    return data;
}

