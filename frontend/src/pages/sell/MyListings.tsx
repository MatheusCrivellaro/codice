import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Price } from '@/components/Price'
import { LivroDosLivrosSeal } from '@/components/LivroDosLivrosSeal'
import { formatCondition, formatListingStatus } from '@/lib/format'
import { usePageTitle } from '@/hooks/usePageTitle'
import * as listingsApi from '@/api/listings'

const statusVariant: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    PENDING_REVIEW: 'secondary',
    ACTIVE: 'default',
    PAUSED: 'destructive',
    SOLD: 'outline',
}

export function MyListings() {
    usePageTitle('minhas ofertas')
    const [page, setPage] = useState(0)

    const { data, isLoading } = useQuery({
        queryKey: ['listings', 'mine', page],
        queryFn: () => listingsApi.getMyListings(page),
    })

    return (
        <div className="mx-auto max-w-2xl px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="font-display text-2xl text-tinta">minhas ofertas</h1>
                <Button asChild>
                    <Link to="/vender/novo">Anunciar um livro</Link>
                </Button>
            </div>

            {isLoading ? (
                <p className="font-body text-sm text-tinta-leve">Folheando suas ofertas…</p>
            ) : !data || data.content.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-center">
                    <LivroDosLivrosSeal size={96} className="mb-6" />
                    <p className="font-body text-tinta-leve">Nenhuma oferta ainda. Que tal anunciar o primeiro livro da sua estante?</p>
                    <Button asChild className="mt-4">
                        <Link to="/vender/novo">Anunciar um livro</Link>
                    </Button>
                </div>
            ) : (
                <>
                    <div className="space-y-3">
                        {data.content.map(listing => (
                            <Card key={listing.id}>
                                <CardContent className="flex items-center justify-between py-3">
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-tinta">{listing.bookTitle}</p>
                                        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                                            <Price cents={listing.priceCents} size="lg" className="text-bordo" />
                                            <span className="text-tinta-leve">
                                                {formatCondition(listing.condition)}
                                            </span>
                                            <Badge variant={statusVariant[listing.status] ?? 'secondary'}>
                                                {formatListingStatus(listing.status)}
                                            </Badge>
                                        </div>
                                        <p className="mt-1 text-xs text-cinza-quente">
                                            {new Date(listing.createdAt).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {data.totalPages > 1 && (
                        <div className="mt-6 flex justify-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === 0}
                                onClick={() => setPage(p => p - 1)}
                            >
                                Anterior
                            </Button>
                            <span className="flex items-center text-sm text-tinta-leve">
                                {page + 1} de {data.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page >= data.totalPages - 1}
                                onClick={() => setPage(p => p + 1)}
                            >
                                Próxima
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
