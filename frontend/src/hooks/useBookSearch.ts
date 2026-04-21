import { useQuery } from '@tanstack/react-query'
import { searchBooks, type SearchParams } from '@/api/books'

export function useBookSearch(params: SearchParams) {
    return useQuery({
        queryKey: ['books', 'search', params],
        queryFn: () => searchBooks(params),
    })
}
