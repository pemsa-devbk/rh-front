import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { QueryParams } from "../api/interfaces/queryParams"
import { createByEmployee, getAll, getByEmployee, updateByEmployee } from "../api/bank"
import { notification } from "antd"

export const useBanks = (params: QueryParams) => {
    return useQuery({
        queryKey: ['banks', params],
        queryFn: () => getAll(params),
        staleTime: 1000 * 30
    })
}

export const useInfiniteBanks = (enabled: boolean, search: string) => {
    return useInfiniteQuery({
        queryKey: ['banks', 'infinite-areas', {search}],
        queryFn: ({ pageParam }) => getAll( {take: 10, skip: pageParam * 10, search}),
        staleTime: 1000 * 30,
        initialPageParam: 0,
        enabled,
        getNextPageParam: (lastPage, allPages) => {
            const totalLoaded = allPages.reduce((acc, page) => acc + page.data.length, 0);
            return totalLoaded < lastPage.total ? allPages.length : undefined;
        },
    })
}


export const useBankingByEmployee = (employeeID: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['employee', employeeID, 'banking-information'],
        queryFn: () => getByEmployee(employeeID),
        staleTime: 1000 * 30,
        enabled
    })
}

export const useUpdateBanking = (actions?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateByEmployee,
        onSuccess(_, {employeeID}) {
            notification.success({message: 'Se actualizo la información empresarial'});
            actions && actions();
            queryClient.invalidateQueries({queryKey: ['employee', employeeID, 'banking-information']})
        },
        onError(error) {
            notification.error({message: error.message});
        },
    })
}

export const useCreateBanking = (actions?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createByEmployee,
        onSuccess(_, {employeeID}) {
            notification.success({message: 'Se añadio información bancaria al empleado'});
            actions && actions();
            queryClient.fetchQuery({queryKey: ['employee', employeeID, 'banking-information']})
        },
        onError(error) {
            notification.error({message: error.message});
        },
    })
}
