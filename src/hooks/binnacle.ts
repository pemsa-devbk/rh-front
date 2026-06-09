import { useInfiniteQuery } from "@tanstack/react-query";
import { getByModified, getByModifier } from "../api/binnacle";


export const useInfiniteBinnacleModifier = (employeeID: string, enabled: boolean) => {
return useInfiniteQuery({
        queryKey: ['employees', employeeID, 'infinite-binnacle', 'modifier'],
        queryFn: ({ pageParam }) => getByModifier( employeeID,  {take: 10, skip: pageParam * 10}),
        staleTime: 1000 * 30,
        initialPageParam: 0,
        enabled,
        getNextPageParam: (lastPage, allPages) => {
            const totalLoaded = allPages.reduce((acc, page) => acc + page.data.length, 0);
            return totalLoaded < lastPage.total ? allPages.length : undefined;
        },
    })
}

export const useInfiniteBinnacleModified = (employeeID: string, enabled: boolean) => {
return useInfiniteQuery({
        queryKey: ['employees', employeeID, 'infinite-binnacle', 'modified'],
        queryFn: ({ pageParam }) => getByModified( employeeID,  {take: 10, skip: pageParam * 10}),
        staleTime: 1000 * 30,
        initialPageParam: 0,
        enabled,
        getNextPageParam: (lastPage, allPages) => {
            const totalLoaded = allPages.reduce((acc, page) => acc + page.data.length, 0);
            return totalLoaded < lastPage.total ? allPages.length : undefined;
        },
    })
}