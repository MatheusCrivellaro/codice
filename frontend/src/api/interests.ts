import { apiFetch } from '@/api/client'
import type { Page } from '@/api/listings'

export interface ThreadResponse {
    id: string
    listingId: string
    bookTitle: string
    bookSlug: string
    bookCoverUrl: string | null
    listingPriceCents: number
    listingPriceFormatted: string
    listingCondition: string
    counterpartName: string
    counterpartType: 'seller' | 'buyer'
    status: string
    unreadCount: number
    lastMessagePreview: string | null
    lastMessageAt: string | null
    createdAt: string
}

export interface MessageResponse {
    id: string
    senderId: string
    senderName: string
    isMine: boolean
    content: string
    createdAt: string
}

export interface UnreadCountResponse {
    totalUnread: number
}

export interface CreateInterestInput {
    listingId: string
    message: string
}

export interface SendMessageInput {
    content: string
}

export function createInterest(input: CreateInterestInput): Promise<ThreadResponse> {
    return apiFetch<ThreadResponse>('/interests', {
        method: 'POST',
        body: JSON.stringify(input),
    })
}

export function getMyThreads(page: number = 0): Promise<Page<ThreadResponse>> {
    return apiFetch<Page<ThreadResponse>>(`/interests/threads?page=${page}&size=20`)
}

export function getThreadMessages(threadId: string, page: number = 0): Promise<Page<MessageResponse>> {
    return apiFetch<Page<MessageResponse>>(
        `/interests/threads/${threadId}/messages?page=${page}&size=50`
    )
}

export function sendMessage(threadId: string, input: SendMessageInput): Promise<MessageResponse> {
    return apiFetch<MessageResponse>(`/interests/threads/${threadId}/messages`, {
        method: 'POST',
        body: JSON.stringify(input),
    })
}

export function getUnreadCount(): Promise<UnreadCountResponse> {
    return apiFetch<UnreadCountResponse>('/interests/unread-count')
}
