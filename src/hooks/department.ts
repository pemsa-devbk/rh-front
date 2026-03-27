import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { create, getAll, getByEnterprise, getByOffice, getOne, remove, update } from '../api/department';
import { notification } from 'antd';
import { QueryParams } from '../api/interfaces/queryParams';

type Actions = () => void; 

export const useCreateDepartment = (actions?: Actions) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: create,
        onSuccess({name}, {officeID}) {
            notification.success({ message: `El departamento ${name} fue creado`});
            queryClient.invalidateQueries({ queryKey: ['enterprises']});
            queryClient.invalidateQueries({ queryKey: ['offices'] });
            queryClient.invalidateQueries({queryKey: ['departments']});
            queryClient.invalidateQueries({ queryKey: ['offices', officeID] });
            queryClient.invalidateQueries({ queryKey: ['offices', officeID, 'departments'] });
            queryClient.invalidateQueries({ queryKey: ['offices', officeID, 'infinite-departments'] });
            actions && actions();
        },
    });
}

export const useUpdateDepartment = (actions?: Actions) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: update,
        onSuccess(_, {departmentID, officeID}) {
            notification.success({ message: `El departamento fue actualizado`});
            queryClient.invalidateQueries({queryKey: ['departments']});
            queryClient.invalidateQueries({queryKey: ['departments', departmentID]});
            queryClient.invalidateQueries({ queryKey: ['offices', officeID, 'departments'] });
            queryClient.invalidateQueries({ queryKey: ['offices', officeID, 'infinite-departments'] });
            actions && actions();
        },
    });
}

export const useDeleteDepartment = (actions?: Actions) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: remove,
        onSuccess({name}, {departmentID, officeID}) {
            notification.success({ message: `El departamento ${name} fue eliminado`});
            queryClient.invalidateQueries({ queryKey: ['enterprises']});
            queryClient.invalidateQueries({ queryKey: ['offices'] });
            queryClient.invalidateQueries({queryKey: ['departments']});
            queryClient.removeQueries({queryKey: ['departments', departmentID]});
            queryClient.invalidateQueries({ queryKey: ['offices', officeID] });
            queryClient.invalidateQueries({ queryKey: ['offices', officeID, 'departments'] });
            queryClient.invalidateQueries({ queryKey: ['offices', officeID, 'infinite-departments'] });
            actions && actions();
        },
    });
}

export const useDepartments = (queryParams: QueryParams) => {
    return useQuery({
        queryKey: ['departments', {queryParams}],
        queryFn: () => getAll(queryParams),
        staleTime: (1000 * 60),
    })
}

export const useDepartment = (officeID: number, departmentID: number) => {
    return useQuery({
        queryKey: ['offices', officeID, 'departments',  departmentID],
        queryFn: () => getOne(officeID, departmentID),
        staleTime: (1000 * 60),
    })
}

export const useDepartmentsByEnterprise = (enterpriseID: string, queryparams: QueryParams) => {
    return useQuery({
        queryKey: ['enterprises', enterpriseID, 'departments'],
        queryFn: () => getByEnterprise(enterpriseID, queryparams),
        staleTime: (1000 * 60),
    })
}

export const useDepartmentsByOffice = (officeID: number, queryparams: QueryParams) => {
    return useQuery({
        queryKey: ['offices', officeID, 'departments'],
        queryFn: () => getByOffice(officeID, queryparams),
        staleTime: (1000 * 60),
    })
}

export const useInfiniteDepartmentsByOffice = (officeID: number, enabled: boolean, search: string) => {
    return useInfiniteQuery({
        queryKey: ['offices', officeID, 'infinite-departments', {search}],
        queryFn: ({ pageParam }) => getByOffice( officeID,  {take: 10, skip: pageParam * 10, search}),
        staleTime: (1000 * 60),
        initialPageParam: 0,
        enabled,
        getNextPageParam: (lastPage, allPages) => {
            const totalLoaded = allPages.reduce((acc, page) => acc + page.data.length, 0);
            return totalLoaded < lastPage.total ? allPages.length : undefined;
        },
    })
}
