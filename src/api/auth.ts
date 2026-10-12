import { User } from "./interfaces/user";
import { instance } from "./rh";

export interface LoginRequest{
    user_id: string;
    password: string;
}
interface AuthResponse{
    user: User,
    token: string;
}
interface CheckResponse{
    user: User
}
export const auth = async (dataRequest: LoginRequest) => {
    const {data} = await instance.post<AuthResponse>('auth/login', dataRequest);
    return data;
}

export const chetStatus = async() => {
    const {data} = await instance.get<CheckResponse>('auth/check');
    return data;
}

export const refreshToken = async () => {
    const {data} = await instance.post<{token: string}>(`auth/refresh`);
    return data;
}