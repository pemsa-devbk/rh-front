import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import { getUsers, getUser, createUser, updateUser, changeState, getBitacora, getUsersByEnterprise, getUsersByOffice, getUsersByArea, getUsersByPosition, getUsersByCourse } from '../api/user';
import { QueryParams } from "../api/interfaces/queryParams";
import { notification } from "antd";

// users
export const useUsers = (queryParams: QueryParams) => {
    return useQuery({
        queryKey: ['users', { queryParams }],
        queryFn: () => getUsers(queryParams),
        staleTime: 3000,
    })
}

export const useUsersByEnterprise = (enterpriseID: string, queryParams: QueryParams) => {
    return useQuery({
        queryKey: ['enterprises', enterpriseID, 'users', { queryParams }],
        queryFn: () => getUsersByEnterprise(enterpriseID, queryParams),
        staleTime: 3000,
    })
}
export const useUsersByOffice = (officeID: number, queryParams: QueryParams) => {
    return useQuery({
        queryKey: ['offices', officeID, 'users', { queryParams }],
        queryFn: () => getUsersByOffice(officeID, queryParams),
        staleTime: 3000,
    })
}
export const useUsersByArea = (areaID: number, queryParams: QueryParams) => {
    return useQuery({
        queryKey: ['areas', areaID, 'users', { queryParams }],
        queryFn: () => getUsersByArea(areaID, queryParams),
        staleTime: 3000,
    })
}
export const useUsersByPosition = (positionID: number, queryParams: QueryParams) => {
    return useQuery({
        queryKey: ['positions', positionID, 'users', { queryParams }],
        queryFn: () => getUsersByPosition(positionID, queryParams),
        staleTime: 3000,
    })
}
export const useUsersByCourse = (courseID: number, queryParams: QueryParams) => {
    return useQuery({
        queryKey: ['courses', courseID, 'users', { queryParams }],
        queryFn: () => getUsersByCourse(courseID, queryParams),
        staleTime: 3000,
    })
}

export const useInfiniteUsers = (enabled: boolean, search: string) => {
    return useInfiniteQuery({
        queryKey: ['infinite-users', { search }],
        queryFn: ({ pageParam = 0 }) => getUsers({ take: 10, skip: pageParam * 10, search }),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            const totalLoaded = allPages.reduce((acc, page) => acc + page.data.length, 0);
            return totalLoaded < lastPage.total ? allPages.length : undefined;
        },
        enabled
    });
}

export const useInfiniteUsersByCourse = (courseID: number, enabled: boolean, search: string) => {
    return useInfiniteQuery({
        queryKey: ['courses',courseID,'infinite-users', { search }],
        queryFn: ({ pageParam = 0 }) => getUsersByCourse(courseID, { take: 10, skip: pageParam * 10, search }),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            const totalLoaded = allPages.reduce((acc, page) => acc + page.data.length, 0);
            return totalLoaded < lastPage.total ? allPages.length : undefined;
        },
        enabled
    });
}

export const useCreateUser = (actions?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createUser,
        onSuccess({name}) {
            notification.success({
                message: `Empleado ${name} fue creado`
            });
            queryClient.invalidateQueries({ queryKey: ['users'] });
            actions && actions();
        },
    })
}

export const useChangeState = () => {
    return useMutation({
        mutationFn: changeState
    })
}

export const useUpDateUser = (actions?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateUser,
        onSuccess({user_id}) {
             notification.success({
                message: `Empleado actualizado`
            });
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['users', user_id] });
            actions && actions();
        },
    })
}

export const useBitacora = (id?: string) => {
    return useInfiniteQuery({
        queryKey: ['bitacora', id],
        queryFn: ({ pageParam }) => getBitacora(id!, 10, pageParam * 10),
        staleTime: 3000,
        initialPageParam: 0,
        enabled: !!id,
        getNextPageParam: (lastPage, allPages) => {
            const totalLoaded = allPages.reduce((acc, page) => acc + page.data.length, 0);
            return totalLoaded < lastPage.total ? allPages.length : undefined;
        },
    })
}



export const useUser = (id: string) => {
    return useQuery({
        queryKey: ['users', id],
        queryFn: () => getUser(id),
    })
}
