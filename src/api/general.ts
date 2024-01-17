import { instance } from "./rh";

interface State {
    id: number;
    name: string;
}
interface UserRoles {
    roles: Array<Array<string>>;
}


export const getStates = async () => {
    const { data } = await instance.get<{ states: Array<State> }>('config/states');
    return data.states
}

export const getRoles = async () => {
    const { data } = await instance.get<UserRoles>('config/roles');
    return data.roles;
}