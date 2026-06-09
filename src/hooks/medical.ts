import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createByEmployee, getByEmployee, updateByEmployee } from "../api/medical"
import { notification } from "antd"

export const useMedicalByEmployee = (employeeID: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['employee', employeeID, 'medical'],
        queryFn: () => getByEmployee(employeeID),
        staleTime: 1000 * 30,
        enabled
    })
}

export const useUpdateMedical = (actions?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateByEmployee,
        onSuccess(_, {employeeID}) {
            notification.success({message: 'Se actualizo la información medica'});
            actions && actions();
            queryClient.invalidateQueries({queryKey: ['employee', employeeID, 'medical']})
        },
        onError(error) {
            notification.error({message: error.message});
        },
    })
}

export const useCreateMedical = (actions?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createByEmployee,
        onSuccess(_, {employeeID}) {
            notification.success({message: 'Se agrego información medica'});
            actions && actions();
            queryClient.fetchQuery({queryKey: ['employee', employeeID, 'medical']})
        },
        onError(error) {
            notification.error({message: error.message});
        },
    })
}