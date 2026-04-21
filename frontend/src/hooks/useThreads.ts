import { useQuery } from '@tanstack/react-query'
import { getMyThreads } from '@/api/interests'

export function useThreads(page: number = 0) {
    return useQuery({
        queryKey: ['threads', page],
        queryFn: () => getMyThreads(page),
        refetchInterval: 15_000,
    })
}
