import { useQuery, useMutation } from "@tanstack/react-query"
import { actualizaUser, createContact, createUser, deleteSoftUser, getAllBloodTypes, getRoles, getStates, getUser, getUsers, reintegroUser } from "../api/user"


export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: getUsers,
        staleTime:3000
    })
}

export const useUser = (id:string) => {
    return useQuery ({
        queryKey: ['user', id],
        queryFn: () => getUser(id),
    })
}


export const useCreateUser = () => {
    return useMutation({
        mutationFn: createUser
    })
}

export const useCreateContact = () => {
    return useMutation({
        mutationFn: createContact
    })
}

export const useDeleteUser = () => {
    return useMutation({
        mutationFn: deleteSoftUser
    })
}

export const useReintegroUser = () => {
    return useMutation({
        mutationFn: reintegroUser
    })
}


export const useUpDateUser = () => {
    return useMutation({
        mutationFn: actualizaUser
    })
}


export const useStates = () => {
    return useQuery ({
        queryKey: ['states'],
        queryFn: getStates,
    })
}


export const useRoles = () => {
    return useQuery ({
        queryKey: ['roles'],
        queryFn: getRoles
    })
}

export const useBloodTypes = () => {
    return useQuery ({
        queryKey: ['blood-types'],
        queryFn: getAllBloodTypes
    })
}