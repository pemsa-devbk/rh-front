import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelHoliday, createConfig, createHoliday, deleteConfig, downloadProofHoliday, getConfigHolidays, getHolidaysByEmployee, updateConfig, uploadProof } from "../api/holiday";
import { QueryParams } from "../api/interfaces/queryParams";
import { Button, notification } from "antd";
import { downloadFile } from "../helpers/download";

export const useInfiniteHolidaysByEmployee = (employeeID: string, enabled: boolean = true) => {
    return useInfiniteQuery({
        queryKey: ['employees', employeeID, 'infinite-holidays'],
        queryFn: ({ pageParam }) => getHolidaysByEmployee(employeeID, { take: 10, skip: pageParam * 10 }),
        staleTime: 3000,
        initialPageParam: 0,
        enabled,
        getNextPageParam: (lastPage, allPages) => {
            const totalLoaded = allPages.reduce((acc, page) => acc + page.data.length, 0);
            return totalLoaded < lastPage.total ? allPages.length : undefined;
        },
    })
}

export const useHolidays = (employeeID: string, queryParams: QueryParams, enabled: boolean) => {
    return useQuery({
        queryKey: ['employees', employeeID, 'holidays', { queryParams }],
        queryFn: () => getHolidaysByEmployee(employeeID!, queryParams),
        staleTime: 3000,
        enabled,
    })
}

export const useCreateHoliday = (actions?: () => void) => {
    const queryCLient = useQueryClient();
    const handleDownload = async (employeeID: string, holidayID: number) => {
        try {
            const { blob, headers } = await downloadProofHoliday({employeeID, holidayID});
            downloadFile({ blob, headers })
        } catch (error) {
            notification.error({
                message: 'Error al descargar',
                description: 'No se pudo descargar el archivo'
            });
        }
    }

    return useMutation({
        mutationFn: createHoliday,
        onSuccess(data, { employeeID }) {
            notification.success({ message: data.message, actions: <Button type="primary" onClick={() => (handleDownload(employeeID, data.id))}>Descargar formato</Button> });
            queryCLient.invalidateQueries({ queryKey: ['employees', employeeID, 'infinite-holidays'] });
            queryCLient.invalidateQueries({ queryKey: ['employees', employeeID, 'holidays'] });
            actions && actions();
        },
    })
}

export const useCancelHoliday = () => {
    const queryCLient = useQueryClient();
    return useMutation({
        mutationFn: cancelHoliday,
        onSuccess(data, { employeeID }) {
            notification.success({ message: data });
            queryCLient.invalidateQueries({ queryKey: ['employees', employeeID, 'infinite-holidays'] });
            queryCLient.invalidateQueries({ queryKey: ['employees', employeeID, 'holidays'] });
        },
    })
}

export const useUploadProof = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: uploadProof,
        onSuccess(data, { employeeID }) {
            notification.success({
                message: data.message
            });
            queryClient.invalidateQueries({ queryKey: ['employees', employeeID, 'infinite-holidays'] });
            queryClient.invalidateQueries({ queryKey: ['employees', employeeID, 'holidays'] });
        },
        onError(error) {
            notification.error({
                message: 'Error al subir el archivo',
                description: error.message || 'No se pudo subir el archivo'
            })
        },
    })
}

// * Configuración de vacaciones 
export const useConfigHolidays = () => {
    return useQuery({
        queryKey: ['config-holidays'],
        queryFn: getConfigHolidays
    })
}

export const useCreateConfig = (actions?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createConfig,
        onSuccess() {
            notification.success({ message: 'Se creo la configuración' });
            queryClient.invalidateQueries({ queryKey: ['config-holidays'] })
            actions && actions();
        },
        onError(error) {
            notification.error({ message: error.message });
        },
    })
}

export const useUpdateConfig = (actions?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateConfig,
        onSuccess() {
            notification.success({ message: 'Se actualizo la configuración' });
            queryClient.invalidateQueries({ queryKey: ['config-holidays'] })
            actions && actions();
        },
        onError(error) {
            notification.error({ message: error.message });
        },
    })
}

export const useDeleteConfig = (actions?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteConfig,
        onSuccess() {
            notification.success({ message: 'Se elimino la configuración' });
            queryClient.invalidateQueries({ queryKey: ['config-holidays'] })
            actions && actions();
        },
        onError(error) {
            notification.error({ message: error.message });
        },
    })
}

