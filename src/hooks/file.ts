import { useMutation, useQuery } from "@tanstack/react-query"
import { getAll ,createDirectory, deleteFile, renameFile, getByEmployee } from "../api/file"

export const useGetFiles = () => {
    return useQuery({
        queryKey: ['files'],
        queryFn: () => getAll(),
        staleTime: 3000,
    })
}

export const useFilesByEmployee = (employeeID: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['employee', employeeID, 'files'],
        queryFn: () => getByEmployee(employeeID),
        staleTime: 3000,
        enabled
    })
}


export const useDeleteFile = () => {
    return useMutation({
        mutationFn: deleteFile,
    })
}

export const useRenameFile = () => {
    return useMutation({
        mutationFn: renameFile
    })
}

export const useCreateDirectory = () => {
    return useMutation({
        mutationFn: createDirectory
    })
}