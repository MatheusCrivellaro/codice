import { useQuery } from '@tanstack/react-query'
import { getBookBySlug } from '@/api/books'

export function useBook(slug: string) {
    return useQuery({
        queryKey: ['books', slug],
        queryFn: () => getBookBySlug(slug),
        enabled: !!slug,
    })
}
