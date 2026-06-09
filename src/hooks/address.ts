import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getByEmployee, updateByEmployee } from "../api/address"
import { notification } from "antd"

export const useAddressByEmployee = (employeeID: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['employee', employeeID, 'address'],
        queryFn: () => getByEmployee(employeeID),
        staleTime: 1000 * 30,
        enabled
    })
}

export const useUpdateAddress = (actions?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateByEmployee,
        onSuccess(_, {employeeID}) {
            notification.success({message: 'Se actualizo la información de dirección'});
            actions && actions();
            queryClient.invalidateQueries({queryKey: ['employee', employeeID, 'address']})
        },
        onError(error) {
            notification.error({message: error.message});
        },
    })
}