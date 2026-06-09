import { Contact, FormContact, MultipleContact } from "./interfaces/contact";
import { ResponsePagination } from "./interfaces/response";
import { instance } from "./rh";

export const getContacts = async (employeeID: string, take: number, skip: number) => {
    const { data } = await instance.get<ResponsePagination<Contact>>(`employees/${employeeID}/contacts`, { params: { take: take, skip: skip } });
    return data;
}

export const createContacts = async ({data: dataSend, employeeID}: { employeeID: string, data: MultipleContact }) => {
    const { data } = await instance.post<Array<Contact>>(`employees/${employeeID}/contacts`, dataSend)
    return data;
}

export const updateContact = async ({data: dataSend, contactID, employeeID}: { employeeID: string, contactID: number, data: Partial<FormContact> }) => {
    const { data } = await instance.patch<Contact>(`employees/${employeeID}/contacts/${contactID}`, dataSend);
    return data;
}

export const deleteContact = async ({contactID, employeeID}: {employeeID: string, contactID: number}) => {
    const { data } = await instance.delete<Contact>(`employees/${employeeID}/contacts/${contactID}`);
    return data;
}
