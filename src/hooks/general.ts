import { useQuery } from "@tanstack/react-query"
import { getRoles, getStates } from "../api/general"

export const useStates = () => {
    return useQuery({
        queryKey: ['states'],
        queryFn: getStates,
    })
}


export const useRoles = () => {
    return useQuery({
        queryKey: ['roles'],
        queryFn: getRoles
    })
}