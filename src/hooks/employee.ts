import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { QueryParams } from "../api/interfaces/queryParams"
import { createEmployee, getEmployee, getEmployees, getEmployeesByArea, getEmployeesByCourse, getEmployeesByDepartment, getEmployeesByEnterprise, getEmployeesByOffice, getEmployeesByPosition, updateEmployee } from "../api/employee"
import { notification } from "antd"

export const useEmployees = (queryParams: QueryParams) => {
    return useQuery({
        queryKey: ['employees', { queryParams }],
        queryFn: () => getEmployees(queryParams),
        staleTime: (1000 * 60),
    })
}
export const useEmployee = (employeeID: string) => {
    return useQuery({
        queryKey: ['employees', employeeID],
        queryFn: () => getEmployee(employeeID),
        staleTime: (1000 * 60)
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

export const useInfiniteEmployeesByCourse = (courseID: number, enabled: boolean, search: string) => {
    return useInfiniteQuery({
        queryKey: ['courses',courseID,'infinite-employees', { search }],
        queryFn: ({ pageParam = 0 }) => getEmployeesByCourse(courseID, { take: 10, skip: pageParam * 10, search }),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            const totalLoaded = allPages.reduce((acc, page) => acc + page.data.length, 0);
            return totalLoaded < lastPage.total ? allPages.length : undefined;
        },
        enabled
    });
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

export const useUpdateEmployee = (actions?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateEmployee,
        onSuccess(response, {employeeID}) {
            notification.success({ message: `Empleado ${response.name} actualizado`});
            if(response.user_id !== employeeID){ // cambio el ID
                queryClient.removeQueries({queryKey: ['employees', employeeID]});
                queryClient.fetchQuery({queryKey: ['employees', response.user_id]});
            }else{
                queryClient.invalidateQueries({queryKey: ['employees', employeeID]});
            }
            actions && actions();
        },
    })
}