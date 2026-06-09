import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { create, remove, getOne, getAll, getSignature, update, updateSignature } from "../api/enterprise";
import { QueryParams } from "../api/interfaces/queryParams";
import { notification } from "antd";


export const useEnterprises = (queryParams: QueryParams) => {
    return useQuery({
        queryKey: ['enterprises', queryParams],
        queryFn: () => getAll(queryParams),
        staleTime: (1000 * 60),
    })
}

export const useEnterprise = (enterpriseID: string) => {
    return useQuery({
        queryKey: ['enterprises', enterpriseID],
        queryFn: () => getOne(enterpriseID),
        staleTime: (1000 * 60),
    })
}

export const useCreateEnterpise = ( actions?: () => void ) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: create,
        onSuccess({name}) {
            notification.success({
                message: `La empresa ${name} fue creado`
            });
            actions && actions();
            queryClient.invalidateQueries({ queryKey: ['enterprises'] });
            queryClient.invalidateQueries({ queryKey: ['infinite-enterprises'] });
        },
        onError(error) {
            notification.error({message: error.message});
        },
    })
}

export const useUpdateEnterpise = (actions?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: update,
        onSuccess(_, { enterpriseID }) {
            notification.success({
                message: `La empresa fue actualizada`
            });
            queryClient.invalidateQueries({ queryKey: ['enterprises'] });
            queryClient.invalidateQueries({ queryKey: ['enterprises', enterpriseID] });
            queryClient.invalidateQueries({ queryKey: ['infinite-enterprises'] });
            actions && actions();
        },
        onError(error) {
            notification.error({message: error.message});
        },
    })
}

export const useDeleteEnterpise = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: remove,
        onSuccess({name, enterprise_id}) {
            notification.success({
                message: `La empresa ${name} fue eliminada`
            });
            queryClient.invalidateQueries({ queryKey: ['enterprises'] });
            queryClient.removeQueries({queryKey: ['enterprises', enterprise_id]})
            queryClient.invalidateQueries({ queryKey: ['infinite-enterprises'] });
        },
        onError(error) {
            notification.error({message: error.message});
        },
    })
}

export const useInfiniteEnterprises = (enabled: boolean, search: string) => {
    return useInfiniteQuery({
        queryKey: ['infinite-enterprises', { search }],
        queryFn: ({ pageParam }) => getAll({ take: 10, skip: pageParam * 10, search }),
        staleTime: (1000 * 60),
        initialPageParam: 0,
        enabled,
        getNextPageParam: (lastPage, allPages) => {
            const totalLoaded = allPages.reduce((acc, page) => acc + page.data.length, 0);
            return totalLoaded < lastPage.total ? allPages.length : undefined;
        },
        
    })
}

// * Signature
export const useUpdateSignature = () => {
    return useMutation({
        mutationFn: updateSignature
    })
}

export const useSignature = (id?: string) => {
    return useQuery({
        queryKey: ['enterprises', id, 'signature'],
        queryFn: () => getSignature(id!),
        enabled: !!id,
        staleTime: 300
    })
}