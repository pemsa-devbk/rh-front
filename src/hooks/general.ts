import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getRoles, getConfig, updateConfig } from "../api/general"
import { notification } from "antd"


export const useRoles = () => {
    return useQuery({
        queryKey: ['roles'],
        queryFn: getRoles
    })
}
export const useSpecialUsers = () => {
    return useQuery({
        queryKey: ['config-users'],
        queryFn: getConfig
    })
}

export const useUpdateConfig = (actions?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateConfig,
        onSuccess() {
            notification.success({
                message: 'Se actualizo la configuración'
            });
            queryClient.invalidateQueries({ queryKey: ['config-users'] });
            actions && actions();
        },
    })
}