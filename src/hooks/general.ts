import { useMutation, useQuery } from "@tanstack/react-query"
import { getRoles, getConfig, updateConfig } from "../api/general"


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

export const useUpdateConfig = () => {
    return useMutation({
        mutationFn: updateConfig
    })
}