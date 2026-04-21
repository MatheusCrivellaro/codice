import { useQuery } from '@tanstack/react-query'
import { getThreadMessages } from '@/api/interests'

export function useThreadMessages(threadId: string, page: number = 0) {
    return useQuery({
        queryKey: ['thread-messages', threadId, page],
        queryFn: () => getThreadMessages(threadId, page),
        refetchInterval: 5_000,
        enabled: !!threadId,
    })
}
