import { useQuery, useMutation } from "@tanstack/react-query"
import { actualizaContact, createContact, deleteContact, getAllBloodTypes, getContacts, getRoles, getStates } from "../api/user"


import { getUsers, getUser, createUser, disableUser, enableUser, actualizaUser } from '../api/usern';

// users
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

export const useUpDateUser = () => {
    return useMutation({
        mutationFn: actualizaUser
    })
}


export const useDisabledUser = () => {
    return useMutation({
        mutationFn: disableUser
    })
}

export const useEnableUser = () => {
    return useMutation({
        mutationFn: enableUser
    })
}








export const useCreateContact = () => {
    return useMutation({
        mutationFn: createContact
    })
}

export const useDeleteContact = ( ) => {
    return useMutation({
        mutationFn: deleteContact
    })
}
 export const useContact = () => {
    return useMutation({
        mutationFn: getContacts
    })
 }

 export const useUpDateContact = () => {
    return useMutation ({
        mutationFn: actualizaContact
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