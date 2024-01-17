import { useQuery, useMutation } from "@tanstack/react-query"
// import {  getAllBloodTypes, } from "../api/userpadsa"


import { getUsers, getUser, createUser, disableUser, enableUser, actualizaUser } from '../api/user';

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











// export const useBloodTypes = () => {
//     return useQuery ({
//         queryKey: ['blood-types'],
//         queryFn: getAllBloodTypes
//     })
// }