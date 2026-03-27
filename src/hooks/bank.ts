import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { QueryParams } from "../api/interfaces/queryParams"
import { getAll } from "../api/bank"

export const useBanks = (params: QueryParams) => {
    return useQuery({
        queryKey: ['banks', params],
        queryFn: () => getAll(params),
        staleTime: 1000 * 30
    })
}

export const useInfiniteBanks = (enabled: boolean, search: string) => {
    return useInfiniteQuery({
        queryKey: ['banks', 'infinite-areas', {search}],
        queryFn: ({ pageParam }) => getAll( {take: 10, skip: pageParam * 10, search}),
        staleTime: 1000 * 30,
        initialPageParam: 0,
        enabled,
        getNextPageParam: (lastPage, allPages) => {
            const totalLoaded = allPages.reduce((acc, page) => acc + page.data.length, 0);
            return totalLoaded < lastPage.total ? allPages.length : undefined;
        },
    })
}
