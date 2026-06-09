import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getByEmployee, updateByEmployee } from "../api/license";
import { notification } from "antd";

export const useLicenseByEmployee = (employeeID: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['employee', employeeID, 'license'],
        queryFn: () => getByEmployee(employeeID),
        staleTime: 1000 * 30,
        enabled
    })
}

export const useUpdateLicense = (actions?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateByEmployee,
        onSuccess(_, {employeeID}) {
            notification.success({message: 'Se actualizo la información de licencia'});
            actions && actions();
            queryClient.invalidateQueries({queryKey: ['employee', employeeID, 'license']})
        },
        onError(error) {
            notification.error({message: error.message});
        },
    })
}
export const useCreateLicense = (actions?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateByEmployee,
        onSuccess(_, {employeeID}) {
            notification.success({message: 'Se añadio información de licencia'});
            actions && actions();
            queryClient.fetchQuery({queryKey: ['employee', employeeID, 'license']})
        },
        onError(error) {
            notification.error({message: error.message});
        },
    })
}
