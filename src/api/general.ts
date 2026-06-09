import { instance } from "./rh";

interface Rol {
    value: string;
    description: string;
}

export interface SpecialUser {
    key: string;
    description: string;
    user_id: string | null;
    user_name: string | null;
}

export interface FormConfig {
    key: string;
    user_id: string;
}

export const getRoles = async () => {
    const { data } = await instance.get<{ roles: Array<Rol> }>('configuration/roles');
    return data.roles;
}

export const getConfig = async () => {
    const { data } = await instance.get<{ config: Array<SpecialUser> }>(`configuration/special-users`);
    return data.config;
}

export const updateConfig = async (params: FormConfig) => {
    const { data } = await instance.patch(`configuration/update-user`, params);
    return data;
}