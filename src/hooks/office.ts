import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { QueryParams } from "../api/interfaces/queryParams"
import { create, remove, getOne, getAll, getByEnterprice, update } from "../api/office"
import { notification } from "antd";

export const useCreateOffice = ( actions?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: create,
        onSuccess({ name, enterprise_id }) {
            notification.success({
                message: `La oficina ${name} fue creada`
            });
            queryClient.invalidateQueries({ queryKey: ['enterprises'] });
            queryClient.invalidateQueries({ queryKey: ['enterprises', enterprise_id, 'offices'] });
            queryClient.invalidateQueries({ queryKey: ['enterprises', enterprise_id] });
            queryClient.invalidateQueries({ queryKey: ['enterprises', enterprise_id, 'infinite-offices'] });
            queryClient.invalidateQueries({ queryKey: ['offices'] });
            actions && actions();
            
        },
        onError(error) {
            notification.error({message: error.message});
        },
    })
}

export const useUpdateOffice = (actions?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: update,
        onSuccess({ office_id, enterprise_id }) {
            notification.success({ message: `La oficina fue actualizada` });
            queryClient.invalidateQueries({ queryKey: ['offices'] });
            queryClient.invalidateQueries({ queryKey: ['enterprises', enterprise_id, 'offices', office_id] });
            queryClient.invalidateQueries({ queryKey: ['enterprises', enterprise_id, 'infinite-offices'] });
            actions && actions();
        },
        onError(error) {
            notification.error({message: error.message});
        },
    })
}

export const useDeleteOffice = (actions?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: remove,
        onSuccess({name, enterprise_id, office_id}) {
            notification.success({ message: `La oficina ${name} fue eliminada` });
            queryClient.invalidateQueries({ queryKey: ['enterprises'] });
            queryClient.invalidateQueries({ queryKey: ['enterprise', enterprise_id, 'offices'] });
            queryClient.invalidateQueries({ queryKey: ['enterprises', enterprise_id] });
            queryClient.invalidateQueries({ queryKey: ['enterprises', enterprise_id, 'infinite-offices'] });
            queryClient.invalidateQueries({ queryKey: ['offices'] });
            queryClient.removeQueries({ queryKey: ['enterprises', enterprise_id, 'offices', office_id] });
            actions && actions();
        },
        onError(error) {
            notification.error({message: error.message});
        },
    })
}

export const useOffices = (queryParams: QueryParams) => {
    return useQuery({
        queryKey: ['offices', queryParams],
        queryFn: () => getAll(queryParams),
        staleTime: (1000 * 60),
    })
}

export const useOffice = (enterpriseID: string, officeID: number) => {
    return useQuery({
        queryKey: ['enterprises', enterpriseID, 'offices', officeID],
        queryFn: () => getOne(enterpriseID, officeID),
        staleTime: (1000 * 60),
    })
}

export const useOfficesByEnterprise = (enterpriseID: string, queryParams: QueryParams) => {
    return useQuery({
        queryKey: ['enterprises', enterpriseID, 'offices', queryParams],
        queryFn: () => getByEnterprice(enterpriseID, queryParams),
        staleTime: (1000 * 60),
    })
}

export const useInfiniteOfficesByEnterprice = (id: string, enabled: boolean, search: string) => {
    return useInfiniteQuery({
        queryKey: ['enterprises', id, 'infinite-offices', { search }],
        queryFn: ({ pageParam }) => getByEnterprice(id, { take: 10, skip: pageParam * 10, search }),
        staleTime: (1000 * 60),
        initialPageParam: 0,
        enabled: !!id && enabled,
        getNextPageParam: (lastPage, allPages) => {
            const totalLoaded = allPages.reduce((acc, page) => acc + page.data.length, 0);
            return totalLoaded < lastPage.total ? allPages.length : undefined;
        },
    })
}