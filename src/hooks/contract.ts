import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getByEmployee, deleteByEmployee, createByEmployee } from "../api/contract"
import { notification } from "antd"



export const useContractsByEmployee = (employeeID: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['employee', employeeID, 'contracts'],
        queryFn: () => getByEmployee(employeeID),
        staleTime: 1000 * 30,
        enabled
    })
}

export const useCreateContract = (actions?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createByEmployee,
        onSuccess(_, {employeeID}) {
            notification.success({message: 'Se creo el contrato'});
            actions && actions();
            queryClient.invalidateQueries({queryKey: ['employee', employeeID, 'contracts']})
        },
        onError(error) {
            notification.error({message: error.message});
        },
    })
}

export const useDeleteContract = (actions?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteByEmployee,
        onSuccess(_, {employeeID}) {
            notification.success({message: 'Se elimino el contrato'});
            actions && actions();
            queryClient.invalidateQueries({queryKey: ['employee', employeeID, 'contracts']})
        },
        onError(error) {
            notification.error({message: error.message});
        },
    })
}
