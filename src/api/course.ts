import { Course, FormAssignEmployees, FormCourse, FormUpdateCourse } from "./interfaces/course";
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

export const getCoursesByEmployee = async(employeeID: string, pagination: QueryParams) => {
    const {data} = await instance.get<ResponsePagination<Course>>(`employees/${employeeID}/courses`, {params: pagination});
    return data;
}
// ! revisar el form
export const assignEmployeesToCoruse = async({courseID, formAssignEmployees}: {courseID: number, formAssignEmployees: FormAssignEmployees}) => {
    const {data} = await instance.post<ResponseMessage>(`courses/${courseID}/employees`, formAssignEmployees );
    return data;
}

export const removeEmployeeToCourse = async ({courseID, employeeID}: {courseID: number, employeeID: string}) => {   
    const {data} = await instance.delete<ResponseMessage>(`courses/${courseID}/employees/${employeeID}`);
    return data;
}

export const uploadProof = async({courseID, formData,employeeID}: {courseID: number, employeeID: string, formData: FormData}) => {
    const {data} = await instance.post<ResponseMessage>(`/courses/${courseID}/employees/${employeeID}/proof`, formData);
    return data;
}

export const downloadProof = async({courseID, employeeID}: {courseID: number, employeeID: string}) => {
    const response = await instance.get<Blob>(`/courses/${courseID}/employees/${employeeID}/proof`, {
        responseType: 'blob',
        headers: {
            'Accept': 'application/pdf, image/*, application/octet-stream'
        }
    });
    return {blob: response.data, headers: response.headers}; 
}
