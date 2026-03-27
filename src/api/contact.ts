import { Contact, FormContact, MultipleContact } from "./interfaces/contact";
import { ResponsePagination } from "./interfaces/response";
import { instance } from "./rh";

export const getContacts = async (userID: string, take: number, skip: number) => {
    const { data } = await instance.get<ResponsePagination<Contact>>(`users/${userID}/contacts`, { params: { take: take, skip: skip } });
    return data;
}

export const createContacts = async ({data: dataSend, userID}: { userID: string, data: MultipleContact }) => {
    const { data } = await instance.post<Array<Contact>>(`users/${userID}/contacts`, dataSend)
    return data;
}

export const updateContact = async ({data: dataSend, contactID, userID}: { userID: string, contactID: number, data: Partial<FormContact> }) => {
    const { data } = await instance.patch<Contact>(`users/${userID}/contacts/${contactID}`, dataSend);
    return data;
}

export const deleteContact = async ({contactID, userID}: {userID: string, contactID: number}) => {
    const { data } = await instance.delete<Contact>(`/users/${userID}/contacts/${contactID}`);
    return data;
}
