import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useThreads } from '@/hooks/useThreads'
import { usePageTitle } from '@/hooks/usePageTitle'
import { formatRelativeDate, formatCondition } from '@/lib/format'

const threadStatusLabels: Record<string, string> = {
    OPEN: 'Aberta',
    CLOSED: 'Encerrada',
    SOLD: 'Vendido',
}

const threadStatusVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
    OPEN: 'default',
    CLOSED: 'secondary',
    SOLD: 'outline',
}

export function ConversationsPage() {
    usePageTitle('Conversas')
    const [page, setPage] = useState(0)
    const { data, isLoading, isError } = useThreads(page)

    if (isLoading) {
        return (
            <div className="container-codice max-w-[680px] py-8">
                <h1 className="mb-6 font-display text-3xl text-tinta">Conversas</h1>
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full rounded-lg" />
                    ))}
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="container-codice max-w-[680px] py-16 text-center">
                <p className="font-body text-tinta-leve">Algo se perdeu entre as páginas. Tente novamente em instantes.</p>
            </div>
        )
    }

    const threads = data?.content ?? []

    return (
        <div className="container-codice max-w-[680px] py-8">
            <h1 className="mb-6 font-display text-3xl text-tinta">Conversas</h1>

            {threads.length === 0 ? (
                <div className="py-16 text-center">
                    <p className="font-body text-tinta-leve">
                        Nenhuma conversa ainda. Quando você manifestar interesse em um livro, a conversa aparecerá aqui.
                    </p>
                </div>
            ) : (
                <>
                    <div className="space-y-1">
                        {threads.map((thread) => (
                            <Link
                                key={thread.id}
                                to={`/conversas/${thread.id}`}
                                className="flex gap-3 rounded-md p-4 transition-colors hover:bg-papel-profundo"
                            >
                                {/* Book cover thumbnail */}
                                <div className="h-16 w-12 shrink-0 overflow-hidden rounded bg-papel-profundo">
                                    {thread.bookCoverUrl ? (
                                        <img
                                            src={thread.bookCoverUrl}
                                            alt={thread.bookTitle}
                                            className="h-full w-full object-cover"
                                            onError={(e) => { e.currentTarget.style.display = 'none' }}
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <svg className="h-5 w-5 text-cinza-quente/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Thread info */}
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="truncate font-display text-base text-tinta">
                                                {thread.bookTitle}
                                            </p>
                                            <p className="font-ui text-xs text-tinta-leve">
                                                <span className="text-bordo">{thread.listingPriceFormatted}</span> — {formatCondition(thread.listingCondition)}
                                            </p>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-1.5">
                                            {thread.unreadCount > 0 && (
                                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-bordo px-1.5 font-ui text-[10px] font-medium text-papel">
                                                    {thread.unreadCount}
                                                </span>
                                            )}
                                            <Badge variant={threadStatusVariant[thread.status] ?? 'secondary'} className="text-[10px]">
                                                {threadStatusLabels[thread.status] ?? thread.status}
                                            </Badge>
                                        </div>
                                    </div>

                                    <p className="mt-0.5 font-ui text-xs text-cinza-quente">
                                        {thread.counterpartName} ({thread.counterpartType === 'seller' ? 'vendedor' : 'leitor'})
                                    </p>

                                    {thread.lastMessagePreview && (
                                        <p className="mt-1 truncate font-body text-xs text-tinta-leve">
                                            {thread.lastMessagePreview}
                                        </p>
                                    )}

                                    {thread.lastMessageAt && (
                                        <p className="mt-0.5 font-ui text-[10px] text-cinza-quente">
                                            {formatRelativeDate(thread.lastMessageAt)}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>

                    {data && data.totalPages > 1 && (
                        <div className="mt-6 flex justify-center gap-2">
                            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                                Anterior
                            </Button>
                            <span className="flex items-center text-sm text-tinta-leve">
                                {page + 1} de {data.totalPages}
                            </span>
                            <Button variant="outline" size="sm" disabled={page >= data.totalPages - 1} onClick={() => setPage(p => p + 1)}>
                                Próxima
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
