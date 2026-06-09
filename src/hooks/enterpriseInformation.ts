import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getByEmployee, updateByEmployee } from "../api/enterpriseInformation"
import { notification } from "antd"

export const useEnterpriseInformationByEmployee = (employeeID: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['employee', employeeID, 'enterprise-information'],
        queryFn: () => getByEmployee(employeeID),
        staleTime: 1000 * 30,
        enabled
    })
}

export const useUpdateEnterpriseInformation = (actions?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateByEmployee,
        onSuccess(_, {employeeID}) {
            notification.success({message: 'Se actualizo la información empresarial'});
            actions && actions();
            queryClient.invalidateQueries({queryKey: ['employee', employeeID, 'enterprise-information']})
        },
        onError(error) {
            notification.error({message: error.message});
        },
    })
}