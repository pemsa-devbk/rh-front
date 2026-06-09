import { File } from "./interfaces/file";
import { instance } from "./rh";

export const getAll = async() => {
    const {data} = await instance.get<Array<File>>(`files`);
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

export const downloadFile = async (id: string, dir: string) => {
    const { data } = await instance.get<Blob>(`files/download/${id}${dir}`,{
        responseType: 'blob'
    });
    return data;
}

export const uploadFiles = async(id: string, dir: string, files: FormData) => {
    const {data} = await instance.post(`/files/upload/${id}${dir}`, files);
    return data;
}