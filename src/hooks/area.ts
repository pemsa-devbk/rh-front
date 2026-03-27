import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { create, remove, getOne, getAll, getByEnterprise, getByOffice, update, getByDepartment } from "../api/area"
import {  QueryParams } from "../api/interfaces/queryParams"
import { notification } from "antd";

type Actions = () => void; 


export const useCreateArea = (actions?: Actions) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: create,
        onSuccess({name, department_id}) {
            notification.success({
                message: `El area ${name} fue creada`
            });
            queryClient.invalidateQueries({ queryKey: ['enterprises']});
            queryClient.invalidateQueries({ queryKey: ['offices'] });
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            queryClient.invalidateQueries({ queryKey: ['areas'] });
            queryClient.invalidateQueries({ queryKey: ['departments', department_id] });
            queryClient.invalidateQueries({ queryKey: ['departments', department_id, 'areas'] });
            queryClient.invalidateQueries({ queryKey: ['departments', department_id, 'infinite-areas'] });
            actions && actions();
        },
    })
}

export const useUpdateArea = (actions?: Actions) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: update,
        onSuccess({department_id, area_id}) {
            notification.success({
                message: `El area fue actualizada`
            });
            queryClient.invalidateQueries({ queryKey: ['areas'] });
            queryClient.invalidateQueries({ queryKey: ['departments', department_id, 'areas'] });
            queryClient.invalidateQueries({ queryKey: ['departments', department_id, 'areas', area_id] });
            queryClient.invalidateQueries({ queryKey: ['departments', department_id, 'infinite-areas'] });
            actions && actions();
        },
    })
}

export const useDeleteArea = (actions?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: remove,
        onSuccess({name, department_id, area_id}) {
            notification.success({
                message: `El area ${name} fue eliminada`
            });
            queryClient.invalidateQueries({ queryKey: ['enterprises']});
            queryClient.invalidateQueries({ queryKey: ['offices'] });
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            queryClient.invalidateQueries({ queryKey: ['areas'] });
            queryClient.invalidateQueries({ queryKey: ['departments', department_id] });
            queryClient.invalidateQueries({ queryKey: ['departments', department_id, 'areas'] });
            queryClient.invalidateQueries({ queryKey: ['departments', department_id, 'infinite-areas'] });
            queryClient.removeQueries({ queryKey: ['departments', department_id, 'areas', area_id] });
            actions && actions();
        },
    })
}

export const useAreas = (queryParams: QueryParams) => {
    return useQuery({
        queryKey: ['areas', {queryParams}],
        queryFn: () => getAll(queryParams),
        staleTime: 1000 * 30
    })
}

export const useArea = (departmentID: number, areaID: number) => {
    return useQuery({
        queryKey: ['departments', departmentID, 'areas', areaID],
        queryFn: () => getOne(departmentID, areaID),
        staleTime: 1000 * 30
    })
}

export const useAreasByEnterprise = (enterpriseID: string, queryParams: QueryParams) => {
    return useQuery({
        queryKey: ['enterprises',enterpriseID,'areas', {queryParams}],
        queryFn: () => getByEnterprise(enterpriseID, queryParams),
        staleTime: 1000 * 30
    })
}

export const useAreasByOffice = (officeID: number, queryParams: QueryParams) => {
    return useQuery({
        queryKey: ['offices',officeID,'areas', {queryParams}],
        queryFn: () => getByOffice(officeID, queryParams),
        staleTime: 1000 * 30
    })
}

export const useAreasByDepartment = (departmentID: number, queryParams: QueryParams) => {
    return useQuery({
        queryKey: ['departments',departmentID,'areas', {queryParams}],
        queryFn: () => getByDepartment(departmentID, queryParams),
        staleTime: 1000 * 30
    })
}


export const useInfiniteAreasByDepartment = (departmentID: number, enabled: boolean, search: string) => {
    return useInfiniteQuery({
        queryKey: ['departments', departmentID, 'infinite-areas', {search}],
        queryFn: ({ pageParam }) => getByDepartment( departmentID,  {take: 10, skip: pageParam * 10, search}),
        staleTime: 1000 * 30,
        initialPageParam: 0,
        enabled,
        getNextPageParam: (lastPage, allPages) => {
            const totalLoaded = allPages.reduce((acc, page) => acc + page.data.length, 0);
            return totalLoaded < lastPage.total ? allPages.length : undefined;
        },
    })
}

