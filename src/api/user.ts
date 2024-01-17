import { UserResponse, UsersResponse } from "./interfaces/response/user";
import { instance } from "./rh";


export const getUsers = async () => {
    const { data } = await instance.get<UsersResponse>('users');
    return data.users;
}

export const getUser = async (id: string) => {
    const { data } = await instance.get<UserResponse>(`/users/${id}`);
    return data.user;
}

export const createUser = async (datas: FormData) => {
    const { data } = await instance.post<UserResponse>(`users`, datas,);
    return data;
}

export const disableUser = async (id: string) => {
    const { data } = await instance.delete<UserResponse>(`users/${id}`);
    return data;
} 

export const enableUser = async (id: string) => {
    const { data } = await instance.patch<UserResponse>(`users/reintegro/${id}`);
    return data;
}

export const actualizaUser = async (datas: { id: string; data: FormData }) => {
    const { data } = await instance.patch<UserResponse>(`users/edit/${datas.id}`, datas.data);
    return data
}