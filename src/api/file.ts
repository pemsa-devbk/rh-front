import { File, FileEmployee } from "./interfaces/file";
import { instance } from "./rh";

export const getAll = async () => {
    const { data } = await instance.get<Array<File>>(`files`);
    return data;
}

export const getByEmployee = async (emploeeID: string) => {
    const { data } = await instance.get<Array<FileEmployee>>(`employees/${emploeeID}/files`);
    return data;
}

export const uploadFile = async ({ body, employeeID }: { employeeID: string, body: FormData }) => {
    const { data } = await instance.post(`employees/${employeeID}/files`, body);
    return data;
}

export const downloadFile = async({fileID, employeeID}: {fileID: number, employeeID: string}) => {
    const response = await instance.get<Blob>(`/employees/${employeeID}/files/${fileID}`, {
        responseType: 'blob',
        headers: {
            'Accept': 'application/pdf, image/*, application/octet-stream'
        }
    });
    return {blob: response.data, headers: response.headers}; 
}

export const donwloadCredential = async(employeeID: string, year?: string) => {
    const {data} = await instance.get<Blob>(`employees/${employeeID}/credential`, {responseType: "blob", params: {year}})
    return data;
}

export const donwloadSignature = async(employeeID: string) => {
    const {data} = await instance.get<Blob>(`employees/${employeeID}/signature`, {responseType: "blob"})
    return data;
}

export const reloadSignature = async(employeeID: string) => {
    const {data} = await instance.patch<Blob>(`employees/${employeeID}/signature`,null, {responseType: "blob"})
    return data;
}


// ! Se van a eliminar
export const getFiles = async (id: string, path: string = '') => {
    const { data } = await instance.get<{ content: Array<{ name: string; type: 'directory' | 'file'; }> }>(`files/docs/${id}/${path}`);
    return data.content;
}

export const deleteFile = async (dataSend: { id: string, path: string }) => {
    const { data } = await instance.delete(`files/docs/${dataSend.id}/${dataSend.path}`);
    return data;
}

export const renameFile = async (dataSend: { form: string, to: string }) => {
    const { data } = await instance.post(`files/rename`, dataSend);
    return data;
}

export const createDirectory = async (dataSend: { dir: string }) => {
    const { data } = await instance.post('files/create', dataSend);
    return data;
}



export const uploadFiles = async (id: string, dir: string, files: FormData) => {
    const { data } = await instance.post(`/files/upload/${id}${dir}`, files);
    return data;
}