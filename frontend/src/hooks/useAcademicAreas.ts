import { useQuery } from '@tanstack/react-query'
import { getAcademicAreas } from '@/api/books'

export function useAcademicAreas() {
    return useQuery({
        queryKey: ['academic-areas'],
        queryFn: getAcademicAreas,
        staleTime: 5 * 60 * 1000,
    })
}
