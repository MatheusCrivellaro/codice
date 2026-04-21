import { useQuery } from '@tanstack/react-query'
import { getUnreadCount } from '@/api/interests'
import { useAuth } from '@/contexts/auth-context'

export function useUnreadCount() {
    const { isAuthenticated } = useAuth()

    const { data, isLoading } = useQuery({
        queryKey: ['unread-count'],
        queryFn: getUnreadCount,
        refetchInterval: 15_000,
        enabled: isAuthenticated,
    })

    return {
        totalUnread: data?.totalUnread ?? 0,
        isLoading,
    }
}
