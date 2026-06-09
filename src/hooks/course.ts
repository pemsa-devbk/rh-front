import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { QueryParams } from "../api/interfaces/queryParams"
import { createCourse, deleteCourse, getCourses, updateCourse, uploadProof, getCoursesByEmployee, assignEmployeesToCoruse, removeEmployeeToCourse } from "../api/course"
import { notification } from "antd"


export const useCourses = (queryParams: QueryParams) => {
    return useQuery({
        queryKey: ['courses', { queryParams }],
        queryFn: () => getCourses(queryParams),
        staleTime: 1000 * 60
    })
}

export const useCoursesByEmployee = (employeeID: string, queryParams: QueryParams, enabled = true) => {
    return useQuery({
        queryKey: ['employees', employeeID, 'courses', { queryParams }],
        queryFn: () => getCoursesByEmployee(employeeID, queryParams),
        enabled,
        staleTime: 1000 * 60
    })
}

export const useInfiniteCoursesByEmployee = (employeeID: string, enabled: boolean, search: string) => {
    return useInfiniteQuery({
        queryKey: ['employees',employeeID,'infinite-courses', { search }],
        queryFn: ({ pageParam = 0 }) => getCoursesByEmployee(employeeID, { take: 10, skip: pageParam * 10, search }),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            const totalLoaded = allPages.reduce((acc, page) => acc + page.data.length, 0);
            return totalLoaded < lastPage.total ? allPages.length : undefined;
        },
        enabled
    });
}


export const useCreateCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createCourse,
        onSuccess({name}) {
             notification.success({
                message: `El curso ${name} fue creado`
            });
            queryClient.invalidateQueries({ queryKey: ['courses'] });
        },
        onError(error) {
            notification.error({message: error.message});
        },
    })
}

export const useUpdateCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateCourse,
        onSuccess() {
            notification.success({
                message: `El curso fue actualizado`
            });
            queryClient.invalidateQueries({ queryKey: ['courses'] });
        },
        onError(error) {
            notification.error({message: error.message});
        },
    })
}

export const useDeleteCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteCourse,
        onSuccess({name}, courseID) {
            notification.success({
                message: `El curso ${name} fue eliminado`
            });
            queryClient.removeQueries({ queryKey: ['courses', courseID, 'infinite-employees'] })
            queryClient.invalidateQueries({ queryKey: ['courses'] });
        },
        onError(error) {
            notification.error({message: error.message});
        },
    })
}

export const useAssignEmployeesToCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: assignEmployeesToCoruse,
        onSuccess(data, { courseID }) {
            notification.success({
                message: data.message
            });
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            queryClient.invalidateQueries({ queryKey: ['courses', courseID, 'infinite-employees'] });
        },
        onError(error) {
            notification.error({message: error.message});
        },
    })
}

export const useRemoveEmployeesToCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: removeEmployeeToCourse,
        onSuccess(data, { courseID }) {
            notification.success({
                message: data.message
            });
            queryClient.invalidateQueries({ queryKey: ['courses', courseID, 'infinite-employees',] });
            queryClient.invalidateQueries({ queryKey: ['courses'] });
        },
        onError(error) {
            notification.error({message: error.message});
        },
    })
}

export const useUploadProof = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: uploadProof,
        onSuccess(data, {courseID}) {
             notification.success({
                message: data.message
            });
            queryClient.invalidateQueries({ queryKey: ['courses', courseID, 'infinite-employees',] });
            queryClient.invalidateQueries({ queryKey: ['courses'] });
        },
        onError(error) {
            notification.error({
                message: 'Error al subir el archivo',
                description: error.message || 'No se pudo subir el archivo'
            })
        },
    })
}