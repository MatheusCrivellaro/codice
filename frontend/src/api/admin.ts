import { apiFetch } from '@/api/client'

export type ListingStatus = 'PENDING_REVIEW' | 'ACTIVE' | 'PAUSED' | 'SOLD'

export type BookCondition = 'NOVO' | 'COMO_NOVO' | 'MUITO_BOM' | 'BOM' | 'ACEITAVEL'

export interface AdminListing {
    id: string
    bookTitle: string
    bookAuthors: string
    bookCoverImageUrl: string | null
    sellerName: string
    priceCents: number
    condition: BookCondition
    conditionNotes: string | null
    description: string | null
    status: ListingStatus
    moderationNote: string | null
    publishedAt: string | null
    createdAt: string
    photoUrls: string[]
}

export function listAdminListings(status?: ListingStatus): Promise<AdminListing[]> {
    const params = status ? `?status=${status}` : ''
    return apiFetch<AdminListing[]>(`/admin/listings${params}`)
}

export function approveListing(id: string): Promise<AdminListing> {
    return apiFetch<AdminListing>(`/admin/listings/${id}/approve`, {
        method: 'POST',
    })
}

export function pauseListing(id: string, note: string): Promise<AdminListing> {
    return apiFetch<AdminListing>(`/admin/listings/${id}/pause`, {
        method: 'POST',
        body: JSON.stringify({ note }),
    })
}

export function resumeListing(id: string): Promise<AdminListing> {
    return apiFetch<AdminListing>(`/admin/listings/${id}/resume`, {
        method: 'POST',
    })
}
