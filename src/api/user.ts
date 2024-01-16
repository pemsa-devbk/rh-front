import { BloodType, Contact, ResponseCreateUser, ResponseUsers, User } from "./interfaces/users";
import { instance } from "./rh"


interface State {
    id:   number;
    name: string;
}


interface UserRoles{
    roles: Array<Array<string>>;
}



interface ResponseCreateContact {
    contact:Contact;
}

interface ResponseAllDatas {
    state:State[];


}


export const createUser = async (datas: FormData) =>{
    const{data} = await instance.post<ResponseCreateUser>(`users`,datas,);
    return data;
}

export const allStates = async () =>{
    const {data} = await instance.get<ResponseAllDatas>(`users`);
    return data;
}

export const getUsers = async () => {
    const {data} = await instance.get<ResponseUsers>('users');
    
    return data.users;
}

export const getUser = async (id:string) => {
    const {data} = await instance.get<{user:User}>(`/users/${id}`);
    
    return data.user;
}

export const createContact = async (dataS:{id:string; data:any}) => {
    const {data} = await instance.post<ResponseCreateContact>(`contact/${dataS.id}`, dataS.data);
    return data;
}

export const deleteContact = async (id:string ) => {
    const { data } = await instance.delete(`contact/${id}`);
    return data;
}
export const getContacts = async (id:string) => {
    const { data } = await instance.get<Contact>(`contact/${id}`);
    return data
}
 
export const actualizaContact = async (id:string) => {
    const { data } = await instance.patch<Contact>(`contact/${id}`);
    return data
}


export const getStates = async () =>{
    const {data} = await instance.get<{states:Array<State>}>('config/states');
    return data.states
}

export const getRoles = async () => {
    const {data} = await instance.get<UserRoles>('config/roles');
    return data.roles;
}

export const getAllBloodTypes = async () => {
    const { data } = await instance.get<BloodType>('config/blood-types');
    return data;
}


export const deleteSoftUser = async (id:string) =>{
    const {data} = await instance.delete(`users/${id}`);
    return data;
} 

export const reintegroUser = async (id:string) => {
    const {data} = await instance.patch(`users/reintegro/${id}`);
    return data;
}

export const actualizaUser = async (datas:{id:string; data:FormData}) => {
    const {data} = await instance.patch(`users/edit/${datas.id}`, datas.data);
    return data
}



