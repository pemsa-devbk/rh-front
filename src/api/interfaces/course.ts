import { Dayjs } from "dayjs";

export interface Course{
    course_id: number;
    name: string;
    date_start: string;
    date_end: string;
    total_users?: number; // consulta de cursos
    have_proof?: boolean; // Solo para empleados
}

export interface FormCourse{
    name: string;
    date_start: string | Dayjs;
    date_end: string | Dayjs;
    users: Array<string>;
}

export interface FormUpdateCourse{
    name?: string;
    date_start?: string | Dayjs;
    date_end?: string | Dayjs;
}

export interface FormAssignEmployees {
    users: Array<string>;
}