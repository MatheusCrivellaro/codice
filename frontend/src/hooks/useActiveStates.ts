import { useQuery } from '@tanstack/react-query'
import { getActiveStates } from '@/api/books'

export function useActiveStates() {
    return useQuery({
        queryKey: ['active-states'],
        queryFn: getActiveStates,
        staleTime: 5 * 60 * 1000,
    })
}
