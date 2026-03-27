import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { QueryParams } from "../api/interfaces/queryParams"
import { assignUsersToCoruse, createCourse, deleteCourse, getCourses, getCoursesFromUser, removeUserToCourse, updateCourse, uploadProof } from "../api/course"
import { notification } from "antd"


export const useCourses = (queryParams: QueryParams) => {
    return useQuery({
        queryKey: ['courses', { queryParams }],
        queryFn: () => getCourses(queryParams),
        staleTime: 1000 * 60
    })
}

export const useCoursesByUser = (userID: string, queryParams: QueryParams, enabled = true) => {
    return useQuery({
        queryKey: ['users', userID, 'courses', { queryParams }],
        queryFn: () => getCoursesFromUser(userID, queryParams),
        enabled,
        staleTime: 1000 * 60
    })
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
            queryClient.removeQueries({ queryKey: ['courses', courseID, 'infinite-users'] })
            queryClient.invalidateQueries({ queryKey: ['courses'] });
        },
    })
}

export const useAssignUsersToCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: assignUsersToCoruse,
        onSuccess(data, { courseID }) {
            notification.success({
                message: data.message
            });
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            queryClient.invalidateQueries({ queryKey: ['courses', courseID, 'infinite-users'] });
        },
    })
}

export const useRemoveUsersToCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: removeUserToCourse,
        onSuccess(data, { courseID }) {
            notification.success({
                message: data.message
            });
            queryClient.invalidateQueries({ queryKey: ['courses', courseID, 'infinite-users',] });
            queryClient.invalidateQueries({ queryKey: ['courses'] });
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
            queryClient.invalidateQueries({ queryKey: ['courses', courseID, 'infinite-users',] });
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