import { useMutation } from "@tanstack/react-query"
import { actualizaContact, createContact, deleteContact } from "../api/contact"

export const useCreateContact = () => {
    return useMutation({
        mutationFn: createContact
    })
}

export const useDeleteContact = () => {
    return useMutation({
        mutationFn: deleteContact
    })
}

export const useUpDateContact = () => {
    return useMutation({
        mutationFn: actualizaContact
    })
}
