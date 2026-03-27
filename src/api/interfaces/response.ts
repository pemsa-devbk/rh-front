export interface ResponsePagination<T>{
    data: T[];
    total: number;
}

export interface ResponseMessage{
    message: string;
}