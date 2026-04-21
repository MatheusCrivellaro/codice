import { apiFetch, type ApiError } from '@/api/client'
import type { Page } from '@/api/listings'

export interface BookSearchResult {
    id: string
    slug: string
    title: string
    authors: string
    coverImageUrl: string | null
    academicAreas: string[]
    activeListingsCount: number
    lowestPriceCents: number | null
    relevanceScore: number | null
}

export interface ListingPhotoResponse {
    id: string
    url: string
    position: number
    photoType: string
}

export interface ListingOfferResponse {
    id: string
    sellerId: string
    sellerName: string
    sellerSlug: string
    sellerCity: string | null
    sellerState: string | null
    priceCents: number
    priceFormatted: string
    condition: string
    conditionLabel: string
    conditionNotes: string | null
    description: string | null
    photos: ListingPhotoResponse[]
    publishedAt: string | null
    interestCount: number
}

export interface BookDetailResponse {
    id: string
    slug: string
    title: string
    authors: string
    publisher: string | null
    publicationYear: number | null
    edition: string | null
    language: string | null
    isbn: string | null
    translator: string | null
    academicAreas: string[]
    synopsis: string | null
    coverImageUrl: string | null
    activeListingsCount: number
    listings: ListingOfferResponse[]
}

export interface SearchParams {
    q?: string
    area?: string
    condition?: string
    priceMin?: number
    priceMax?: number
    state?: string
    sort?: string
    page?: number
    size?: number
}

export function searchBooks(params: SearchParams): Promise<Page<BookSearchResult>> {
    const query = new URLSearchParams()
    if (params.q) query.set('q', params.q)
    if (params.area) query.set('area', params.area)
    if (params.condition) query.set('condition', params.condition)
    if (params.priceMin != null) query.set('priceMin', String(params.priceMin))
    if (params.priceMax != null) query.set('priceMax', String(params.priceMax))
    if (params.state) query.set('state', params.state)
    if (params.sort) query.set('sort', params.sort)
    if (params.page != null) query.set('page', String(params.page))
    if (params.size != null) query.set('size', String(params.size))
    const qs = query.toString()
    return apiFetch<Page<BookSearchResult>>(`/books/search${qs ? '?' + qs : ''}`)
}

export async function getBookBySlug(slug: string): Promise<BookDetailResponse | null> {
    try {
        return await apiFetch<BookDetailResponse>(`/books/${encodeURIComponent(slug)}`)
    } catch (err) {
        if ((err as ApiError).status === 404) {
            return null
        }
        throw err
    }
}

export function getAcademicAreas(): Promise<string[]> {
    return apiFetch<string[]>('/books/academic-areas')
}

export function getActiveStates(): Promise<string[]> {
    return apiFetch<string[]>('/sellers/active-states')
}
