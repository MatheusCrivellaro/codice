import { apiFetch, type ApiError } from '@/api/client'

export interface BookLookupResponse {
    title: string
    authors: string
    publisher: string | null
    publicationYear: number | null
    edition: string | null
    language: string | null
    isbn: string
    synopsis: string | null
    coverImageUrl: string | null
    source: string
    rawPageCount: number | null
}

export interface BookFuzzyMatch {
    id: string
    slug: string
    title: string
    authors: string
    score: number
}

export interface ManualBookData {
    title: string
    authors: string
    publisher?: string
    publicationYear?: number
    edition?: string
    language?: string
    translator?: string
    academicAreas?: string[]
    synopsis?: string
}

export interface ListingPhotoInput {
    url: string
    position: number
    photoType: string
}

export interface CreateListingRequest {
    isbn?: string
    manualBookData?: ManualBookData
    priceCents: number
    condition: string
    conditionNotes?: string
    description?: string
    photos: ListingPhotoInput[]
}

export interface ListingPhotoResponse {
    id: string
    url: string
    position: number
    photoType: string
}

export interface ListingResponse {
    id: string
    bookId: string
    bookTitle: string
    bookAuthors: string
    bookSlug: string
    sellerId: string
    sellerName: string
    priceCents: number
    priceFormatted: string
    condition: string
    conditionNotes: string | null
    description: string | null
    status: string
    photos: ListingPhotoResponse[]
    createdAt: string
}

export interface Page<T> {
    content: T[]
    totalElements: number
    totalPages: number
    number: number
    size: number
}

export interface CreateSellerProfileRequest {
    publicName: string
    description: string
    city: string
    state: string
    neighborhood?: string
}

export interface SellerProfileResponse {
    id: string
    publicName: string
    slug: string
    sellerType: string
    description: string
    city: string
    state: string
    neighborhood: string | null
    bannerImageUrl: string | null
    avatarImageUrl: string | null
    createdAt: string
}

export function lookupIsbn(isbn: string): Promise<BookLookupResponse> {
    return apiFetch<BookLookupResponse>(`/lookup/isbn/${encodeURIComponent(isbn)}`)
}

export function searchBooksFuzzy(title: string): Promise<BookFuzzyMatch[]> {
    return apiFetch<BookFuzzyMatch[]>(`/books/search/fuzzy?title=${encodeURIComponent(title)}`)
}

export function createListing(data: CreateListingRequest): Promise<ListingResponse> {
    return apiFetch<ListingResponse>('/listings', {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export function getMyListings(page: number = 0): Promise<Page<ListingResponse>> {
    return apiFetch<Page<ListingResponse>>(`/listings/mine?page=${page}`)
}

export function createSellerProfile(data: CreateSellerProfileRequest): Promise<SellerProfileResponse> {
    return apiFetch<SellerProfileResponse>('/sellers/profile', {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export async function getMySellerProfile(): Promise<SellerProfileResponse | null> {
    try {
        return await apiFetch<SellerProfileResponse>('/sellers/me')
    } catch (err) {
        if ((err as ApiError).status === 404) {
            return null
        }
        throw err
    }
}
