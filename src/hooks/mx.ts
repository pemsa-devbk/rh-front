import { useQuery } from "@tanstack/react-query"
import { getColoniesByPostal } from "../api/mx"

export const useColoniesByPostal = (postalCode: string) => {
    return useQuery({
        queryKey: ['postal', postalCode, 'colonies'],
        queryFn: () => getColoniesByPostal(postalCode),
        staleTime: 1000 * 30,
        enabled: (postalCode.length === 5)
    })
}