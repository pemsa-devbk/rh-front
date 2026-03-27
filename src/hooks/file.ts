import { useMutation, useQuery } from "@tanstack/react-query"
import { createDirectory, deleteFile, getFiles, renameFile } from "../api/file"

export const useGetFiles = (id?: string, path?: string) => {
    return useQuery({
        queryKey: ['files', id, path],
        queryFn: () => getFiles(id!, path),
        staleTime: 3000,
        enabled: !!id
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