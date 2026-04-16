import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/api/client'

interface HealthResponse {
    status: string
    components: {
        db: { status: string }
    }
}

export function useHealth() {
    return useQuery({
        queryKey: ['health'],
        queryFn: () => apiFetch<HealthResponse>('/actuator/health'),
        refetchInterval: 30_000, // poll a cada 30s
        retry: false,
    })
}