import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { QueryParams } from "../api/interfaces/queryParams"
import { createEmployee, getEmployees, getEmployeesByArea, getEmployeesByCourse, getEmployeesByDepartment, getEmployeesByEnterprise, getEmployeesByOffice, getEmployeesByPosition } from "../api/employee"
import { notification } from "antd"

export const useEmployees = (queryParams: QueryParams) => {
    return useQuery({
        queryKey: ['employees', { queryParams }],
        queryFn: () => getEmployees(queryParams),
        staleTime: (1000 * 60),
    })
}

export const useEmployeesByEnterprise = (enterpriseID: string, queryParams: QueryParams) => {
    return useQuery({
        queryKey: ['enterprises', enterpriseID, 'employees', { queryParams }],
        queryFn: () => getEmployeesByEnterprise(enterpriseID, queryParams),
        staleTime: (1000 * 60),
    })
}

export const useEmployeesByOffice = (officeID: number, queryParams: QueryParams) => {
    return useQuery({
        queryKey: ['offices', officeID, 'employees', { queryParams }],
        queryFn: () => getEmployeesByOffice(officeID, queryParams),
        staleTime: (1000 * 60),
    })
}

export const useEmployeesByDepartment = (officeID: number, queryParams: QueryParams) => {
    return useQuery({
        queryKey: ['departments', officeID, 'employees', { queryParams }],
        queryFn: () => getEmployeesByDepartment(officeID, queryParams),
        staleTime: (1000 * 60),
    })
}

export const useEmployeesByArea = (areaID: number, queryParams: QueryParams) => {
    return useQuery({
        queryKey: ['areas', areaID, 'employees', { queryParams }],
        queryFn: () => getEmployeesByArea(areaID, queryParams),
        staleTime: (1000 * 60),
    })
}

export const useEmployeesByPosition = (positionID: number, queryParams: QueryParams) => {
    return useQuery({
        queryKey: ['positions', positionID, 'employees', { queryParams }],
        queryFn: () => getEmployeesByPosition(positionID, queryParams),
        staleTime: (1000 * 60),
    })
}

export const useEmployeesByCourse = (courseID: number, queryParams: QueryParams) => {
    return useQuery({
        queryKey: ['courses', courseID, 'employees', { queryParams }],
        queryFn: () => getEmployeesByCourse(courseID, queryParams),
        staleTime: (1000 * 60),
    })
}

export const useInfiniteEmployees = (enabled: boolean, search: string) => {
    return useInfiniteQuery({
        queryKey: ['infinite-employees', { search }],
        queryFn: ({ pageParam = 0 }) => getEmployees({ take: 10, skip: pageParam * 10, search }),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            const totalLoaded = allPages.reduce((acc, page) => acc + page.data.length, 0);
            return totalLoaded < lastPage.total ? allPages.length : undefined;
        },
        enabled,
        staleTime: (1000 * 60)
    });
}

export const useCreateEmployee = (actions?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createEmployee,
        onSuccess(_, {name}) {
            notification.success({ message: `Empleado ${name} creado con exito`});
            queryClient.invalidateQueries({queryKey: ['employees']});
            actions && actions();
        },
    })
}