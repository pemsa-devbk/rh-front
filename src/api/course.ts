import { Course, FormAssignUsers, FormCourse, FormUpdateCourse } from "./interfaces/course";
import { QueryParams } from "./interfaces/queryParams";
import { ResponseMessage, ResponsePagination } from "./interfaces/response";
import { instance } from "./rh";


export const getCourses = async(pagination: QueryParams) => {
    const {data} = await instance.get<ResponsePagination<Course>>(`courses`, {params: pagination});
    return data;
}

export const createCourse = async(formCourse: FormCourse) => {
    const {data} = await instance.post<Course>(`courses`, formCourse);
    return data;
}

export const updateCourse = async({courseID, formCourse}: {formCourse: FormUpdateCourse, courseID: number}) => {
    const {data} = await instance.patch<Course>(`courses/${courseID}`, formCourse);
    return data;
}

export const deleteCourse = async(courseID: number) => {
    const {data} = await instance.delete<Course>(`courses/${courseID}`);
    return data;
}

export const getCoursesFromUser = async(userID: string, pagination: QueryParams) => {
    const {data} = await instance.get<ResponsePagination<Course>>(`users/${userID}/courses`, {params: pagination});
    return data;
}

export const assignUsersToCoruse = async({courseID, formUsersAssign}: {courseID: number, formUsersAssign: FormAssignUsers}) => {
    const {data} = await instance.post<ResponseMessage>(`courses/${courseID}/users`, formUsersAssign );
    return data;
}

export const removeUserToCourse = async ({courseID, userID}: {courseID: number, userID: string}) => {   
    const {data} = await instance.delete<ResponseMessage>(`courses/${courseID}/users/${userID}`);
    return data;
}

export const uploadProof = async({courseID, formData,userID}: {courseID: number, userID: string, formData: FormData}) => {
    const {data} = await instance.post<ResponseMessage>(`/courses/${courseID}/users/${userID}/proof`, formData);
    return data;
}

export const downloadProof = async({courseID, userID}: {courseID: number, userID: string}) => {
    const response = await instance.get<Blob>(`/courses/${courseID}/users/${userID}/proof`, {
        responseType: 'blob',
        headers: {
            'Accept': 'application/pdf, image/*, application/octet-stream'
        }
    });
    return {blob: response.data, headers: response.headers}; 
}
