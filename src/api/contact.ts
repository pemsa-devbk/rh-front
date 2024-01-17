import { instance } from "./rh";
import { CreateContact, UpdateContact } from './interfaces/request/contact';


export const createContact = async (dataS: { id: string; data: CreateContact }) => {
    const { data } = await instance.post(`contact/${dataS.id}`, dataS.data);
    return data;
}

export const deleteContact = async (id: string) => {
    const { data } = await instance.delete(`contact/${id}`);
    return data;
}

export const actualizaContact = async (dataS: { id: number, data: UpdateContact }) => {
    const {id} = dataS;
    const { data } = await instance.patch(`contact/edit/${id}`, dataS.data);
    return data
}