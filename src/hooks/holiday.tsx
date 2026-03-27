import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelHoliday, createConfig, createHoliday, deleteConfig, downloadFormatHoliday, getConfigHolidays, getHolidays, updateConfig } from "../api/holiday";
import { QueryParams } from "../api/interfaces/queryParams";
import { Button, notification } from "antd";
import { downloadFile } from "../helpers/download";

export const useInfiniteHolidays = (userID: string, enabled: boolean) => {
    return useInfiniteQuery({
        queryKey: ['users', userID, 'infinite-holidays'],
        queryFn: ({ pageParam }) => getHolidays(userID, { take: 10, skip: pageParam * 10 }),
        staleTime: 3000,
        initialPageParam: 0,
        enabled,
        getNextPageParam: (lastPage, allPages) => {
            const totalLoaded = allPages.reduce((acc, page) => acc + page.data.length, 0);
            return totalLoaded < lastPage.total ? allPages.length : undefined;
        },
    })
}

export const useHolidays = (userID: string, queryParams: QueryParams, enabled: boolean) => {
    return useQuery({
        queryKey: ['users', userID, 'holidays', { queryParams }],
        queryFn: () => getHolidays(userID!, queryParams),
        staleTime: 3000,
        enabled,
    })
}

export const useCreateHoliday = (actions?: () => void) => {
    const queryCLient = useQueryClient();
    const handleDownload = async (userID: string, holidayID: number) => {
        try {
            const { blob, headers } = await downloadFormatHoliday(userID, holidayID);
            downloadFile({ blob, headers})
        } catch (error) {
            notification.error({
                message: 'Error al descargar',
                description: 'No se pudo descargar el archivo'
            });
        }
    }
   
    return useMutation({
        mutationFn: createHoliday,
        onSuccess(data, { userID }) {
            notification.success({ message: data.message, actions: <Button type="primary" onClick={() => (handleDownload(userID, data.id))}>Descargar formato</Button> });
            queryCLient.invalidateQueries({ queryKey: ['users', userID, 'infinite-holidays'] });
            queryCLient.invalidateQueries({ queryKey: ['users', userID, 'holidays'] });
            actions && actions();
        },
    })
}

export const useCancelHoliday = () => {
    const queryCLient = useQueryClient();
    return useMutation({
        mutationFn: cancelHoliday,
        onSuccess(data, {userID}) {
            notification.success({message: data});
            queryCLient.invalidateQueries({ queryKey: ['users', userID, 'infinite-holidays'] });
            queryCLient.invalidateQueries({ queryKey: ['users', userID, 'holidays'] });
        },
    })
}

export const useConfigHolidays = () => {
    return useQuery({
        queryKey: ['config-holiday'],
        queryFn: getConfigHolidays
    })
}

export const useCreateConfig = () => {
    return useMutation({
        mutationFn: createConfig
    })
}

export const useUpdateConfig = () => {
    return useMutation({
        mutationFn: updateConfig
    })
}

export const useDeleteConfig = () => {
    return useMutation({
        mutationFn: deleteConfig
    })
}

