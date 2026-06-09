import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createContacts, deleteContact, getContacts, updateContact } from "../api/contact";
import { notification } from 'antd';

export const useContactsByEmployee = (employeeID: string, enabled: boolean = true) => {
    return useInfiniteQuery({
        queryKey: ['employees', employeeID,'contacts'],
        queryFn: ({ pageParam }) => getContacts(employeeID, 10, pageParam * 10),
        staleTime: 3000,
        initialPageParam: 0,
        enabled,
        getNextPageParam: (lastPage, allPages) => {
            const totalLoaded = allPages.reduce((acc, page) => acc + page.data.length, 0);
            return totalLoaded < lastPage.total ? allPages.length : undefined;
        },
    })
}

export const useCreateContacts = ( actions?: () => void ) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createContacts,
        onSuccess(_, variables) {
            notification.success({
                message: 'Los contactos han sido creados'
            });
            actions && actions();
            queryClient.invalidateQueries({ queryKey: ['employees', variables.employeeID, 'contacts'] });
        },
    })
}

export const useDeleteContact = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteContact,
        onSuccess({contact}, variables) {
            notification.success({
                message: `El contacto ${contact} fue eliminado`
            });
            queryClient.invalidateQueries({ queryKey: ['employees', variables.employeeID, 'contacts'] });
        },
    })
}

export const useUpdateContact = ( actions?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateContact,
        onSuccess(_, variables) {
             notification.success({
                message: `El contacto se actualizo`
            });
            actions && actions();
            queryClient.invalidateQueries({ queryKey: ['employees', variables.employeeID, 'contacts'] });
        },
    })
}
