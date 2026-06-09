import { useMutation, useQuery } from "@tanstack/react-query"
import { getAll ,createDirectory, deleteFile, getFiles, renameFile } from "../api/file"

export const useGetFiles = () => {
    return useQuery({
        queryKey: ['files'],
        queryFn: () => getAll(),
        staleTime: 3000,
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