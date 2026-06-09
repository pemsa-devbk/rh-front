import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { create, remove, getOne, getAll, getByArea, getByEnterprise, getByOffice, update, getByDepartment } from "../api/position"
import { QueryParams } from "../api/interfaces/queryParams"
import { notification } from "antd";

export const useCreatePosition = (actions?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: create,
        onSuccess({ name, area_id }) {
            notification.success({
                message: `El puesto ${name} fue creado`
            });
            queryClient.invalidateQueries({ queryKey: ['enterprises'] });
            queryClient.invalidateQueries({ queryKey: ['offices'] });
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            queryClient.invalidateQueries({ queryKey: ['areas'] });
            queryClient.invalidateQueries({ queryKey: ['positions'] });
            queryClient.invalidateQueries({ queryKey: ['areas', area_id] });
            queryClient.invalidateQueries({ queryKey: ['areas', area_id, 'positions'] });
            queryClient.invalidateQueries({ queryKey: ['areas', area_id, 'infinite-positions'] });
            actions && actions();
        },
        onError(error) {
            notification.error({message: error.message});
        },
    })
}

export const useUpdatePosition = (actions?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: update,
        onSuccess({ area_id, position_id }) {
            notification.success({
                message: `El puesto fue actualizado`
            });
            queryClient.invalidateQueries({ queryKey: ['positions'] });
            queryClient.invalidateQueries({ queryKey: ['areas', area_id, 'positions'] });
            queryClient.invalidateQueries({ queryKey: ['areas', area_id, 'positions', position_id] });
            queryClient.invalidateQueries({ queryKey: ['areas', area_id, 'infinite-positions'] });
            actions && actions();
        },
        onError(error) {
            notification.error({message: error.message});
        },
    })
}

export const useDeletePosition = (actions?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: remove,
        onSuccess({ name, area_id, position_id }) {
            notification.success({
                message: `El puesto ${name} fue eliminado`
            });
            queryClient.invalidateQueries({ queryKey: ['enterprises'] });
            queryClient.invalidateQueries({ queryKey: ['offices'] });
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            queryClient.invalidateQueries({ queryKey: ['areas'] });
            queryClient.invalidateQueries({ queryKey: ['positions'] });
            queryClient.invalidateQueries({ queryKey: ['areas', area_id, 'positions'] });
            queryClient.invalidateQueries({ queryKey: ['areas', area_id, 'infinite-positions'] });
            queryClient.removeQueries({ queryKey: ['areas', area_id, 'positions', position_id] });
            actions && actions();
        },
        onError(error) {
            notification.error({message: error.message});
        },
    })
}

export const usePositions = (queryParams: QueryParams) => {
    return useQuery({
        queryKey: ['positions', { queryParams }],
        queryFn: () => getAll(queryParams),
        staleTime: 1000 * 30
    })
}

export const usePosition = (areaID: number, positionID: number) => {
    return useQuery({
        queryKey: ['areas', areaID, 'positions', positionID],
        queryFn: () => getOne(areaID, positionID),
        staleTime: 1000 * 30
    })
}

export const usePositionsByEnterprise = (enterpriseID: string, queryParams: QueryParams) => {
    return useQuery({
        queryKey: ['enterprises', enterpriseID, 'positions', { queryParams }],
        queryFn: () => getByEnterprise(enterpriseID, queryParams),
        staleTime: 1000 * 30
    })
}

export const usePositionsByOffice = (officeID: number, queryParams: QueryParams) => {
    return useQuery({
        queryKey: ['offices', officeID, 'positions', { queryParams }],
        queryFn: () => getByOffice(officeID, queryParams),
        staleTime: 1000 * 30
    })
}
export const usePositionsByDepartment = (departmentID: number, queryParams: QueryParams) => {
    return useQuery({
        queryKey: ['departments', departmentID, 'positions', { queryParams }],
        queryFn: () => getByDepartment(departmentID, queryParams),
        staleTime: 1000 * 30
    })
}
export const usePositionsByArea = (areaID: number, queryParams: QueryParams) => {
    return useQuery({
        queryKey: ['areas', areaID, 'positions', { queryParams }],
        queryFn: () => getByArea(areaID, queryParams),
        staleTime: 1000 * 30
    })
}

export const useInfinitePositionsByArea = (areaID: number, enabled: boolean, search: string) => {
    return useInfiniteQuery({
        queryKey: ['areas', areaID, 'infinite-positions', { search }],
        queryFn: ({ pageParam }) => getByArea(areaID!, { take: 10, skip: pageParam * 10, search }),
        staleTime: 1000 * 30,
        initialPageParam: 0,
        enabled,
        getNextPageParam: (lastPage, allPages) => {
            const totalLoaded = allPages.reduce((acc, page) => acc + page.data.length, 0);
            return totalLoaded < lastPage.total ? allPages.length : undefined;
        },
    })
}

