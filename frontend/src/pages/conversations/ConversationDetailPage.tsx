import { useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { MessageBubble } from '@/components/chat/MessageBubble'
import { DateSeparator } from '@/components/chat/DateSeparator'
import { MessageInput } from '@/components/chat/MessageInput'
import { Price } from '@/components/Price'
import { Ornament } from '@/components/Ornament'
import { useThreadMessages } from '@/hooks/useThreadMessages'
import { useThreads } from '@/hooks/useThreads'
import { usePageTitle } from '@/hooks/usePageTitle'
import { sendMessage } from '@/api/interests'
import { formatCondition, isSameDay } from '@/lib/format'
import type { MessageResponse } from '@/api/interests'

export function ConversationDetailPage() {
    const { threadId } = useParams<{ threadId: string }>()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { data: messagesData, isLoading } = useThreadMessages(threadId ?? '', 0)
    const { data: threadsData } = useThreads(0)

    // Find this thread's metadata from the threads list
    const thread = threadsData?.content.find(t => t.id === threadId)
    usePageTitle(thread ? `Conversa sobre ${thread.bookTitle}` : 'Conversa')

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const prevMessageCountRef = useRef(0)
    const isInitialLoadRef = useRef(true)

    const isAtBottom = useCallback(() => {
        const el = scrollContainerRef.current
        if (!el) return true
        return el.scrollHeight - el.scrollTop - el.clientHeight < 100
    }, [])

    const scrollToBottom = useCallback((smooth: boolean) => {
        messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' })
    }, [])

    // Invalidate unread-count when messages are loaded (backend marks as read)
    useEffect(() => {
        if (messagesData) {
            queryClient.invalidateQueries({ queryKey: ['unread-count'] })
        }
    }, [messagesData, queryClient])

    // Scroll behavior
    const messages = messagesData?.content ?? []
    useEffect(() => {
        if (messages.length === 0) return

        if (isInitialLoadRef.current) {
            scrollToBottom(false)
            isInitialLoadRef.current = false
            prevMessageCountRef.current = messages.length
            return
        }

        if (messages.length > prevMessageCountRef.current && isAtBottom()) {
            scrollToBottom(true)
        }
        prevMessageCountRef.current = messages.length
    }, [messages, scrollToBottom, isAtBottom])

    const sendMutation = useMutation({
        mutationFn: (content: string) => sendMessage(threadId!, { content }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['thread-messages', threadId] })
            queryClient.invalidateQueries({ queryKey: ['threads'] })
            // Scroll after a short delay for the new message to render
            setTimeout(() => scrollToBottom(true), 100)
        },
        onError: () => {
            toast.error('Algo se perdeu entre as páginas. Tente novamente em instantes.')
        },
    })

    const threadClosed = thread?.status !== 'OPEN'

    return (
        <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-[680px] flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3">
                <Button variant="ghost" size="sm" onClick={() => navigate('/conversas')}>
                    ←
                </Button>
                {thread ? (
                    <>
                        {thread.bookCoverUrl && (
                            <div className="h-10 w-8 shrink-0 overflow-hidden rounded bg-papel-profundo">
                                <img
                                    src={thread.bookCoverUrl}
                                    alt={thread.bookTitle}
                                    className="h-full w-full object-cover"
                                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                                />
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <Link
                                to={`/livro/${thread.bookSlug}`}
                                className="truncate font-display text-base text-tinta hover:text-bordo"
                            >
                                {thread.bookTitle}
                            </Link>
                            <p className="font-ui text-xs text-tinta-leve">
                                <Price cents={thread.listingPriceCents} className="text-[13px] text-bordo" /> — {formatCondition(thread.listingCondition)} — {thread.counterpartName}
                            </p>
                        </div>
                    </>
                ) : (
                    <Skeleton className="h-10 w-48" />
                )}
            </div>
            <Ornament variant="double-rule" tone="borda" />

            {/* Messages area */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 py-4">
                {isLoading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                                <Skeleton className="h-12 w-48 rounded-lg" />
                            </div>
                        ))}
                    </div>
                ) : messages.length === 0 ? (
                    <p className="py-8 text-center font-body text-sm text-cinza-quente">
                        A conversa começa aqui.
                    </p>
                ) : (
                    <div className="space-y-2">
                        {messages.map((msg: MessageResponse, idx: number) => {
                            const showDate = idx === 0 || !isSameDay(messages[idx - 1].createdAt, msg.createdAt)
                            return (
                                <div key={msg.id}>
                                    {showDate && <DateSeparator date={msg.createdAt} />}
                                    <MessageBubble message={msg} />
                                </div>
                            )
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input area */}
            {threadClosed && thread ? (
                <div className="border-t border-cinza-borda px-4 py-3 text-center font-body text-sm text-cinza-quente">
                    Esta conversa foi encerrada.
                </div>
            ) : (
                <MessageInput
                    onSend={(content) => sendMutation.mutate(content)}
                    loading={sendMutation.isPending}
                />
            )}
        </div>
    )
}
