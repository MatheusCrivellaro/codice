import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { BookOpenIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { H1, H2, Prose } from '@/components/ui/typography'
import { AcademicAreaBadge } from '@/components/AcademicAreaBadge'
import { ConditionBadge } from '@/components/ConditionBadge'
import { PhotoGallery } from '@/components/PhotoGallery'
import { Ornament } from '@/components/Ornament'
import { useBook } from '@/hooks/useBook'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAuth } from '@/contexts/auth-context'
import { createInterest } from '@/api/interests'
import { formatPrice, formatRelativeDate } from '@/lib/format'
import type { ListingOfferResponse } from '@/api/books'

export function BookPage() {
    const { slug } = useParams<{ slug: string }>()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { isAuthenticated } = useAuth()
    const { data: book, isLoading, isError } = useBook(slug ?? '')
    usePageTitle(book?.title)

    const [interestTarget, setInterestTarget] = useState<ListingOfferResponse | null>(null)
    const [interestMessage, setInterestMessage] = useState('')

    const interestMutation = useMutation({
        mutationFn: createInterest,
        onSuccess: (thread) => {
            toast.success('Interesse enviado')
            queryClient.invalidateQueries({ queryKey: ['threads'] })
            setInterestTarget(null)
            setInterestMessage('')
            navigate(`/conversas/${thread.id}`)
        },
        onError: (err: Error & { status?: number }) => {
            if (err.status === 400) {
                toast.error('Esse livro já é seu — não precisa demonstrar interesse.')
            } else {
                toast.error('Algo se perdeu entre as páginas. Tente novamente em instantes.')
            }
        },
    })

    function handleInterestClick(offer: ListingOfferResponse) {
        if (!isAuthenticated) {
            toast.info('Entre para manifestar interesse neste livro.')
            navigate('/login')
            return
        }
        setInterestTarget(offer)
        setInterestMessage('')
    }

    function handleInterestSubmit() {
        if (!interestTarget || !interestMessage.trim()) return
        interestMutation.mutate({
            listingId: interestTarget.id,
            message: interestMessage.trim(),
        })
    }

    if (isLoading) {
        return (
            <div className="container-codice max-w-4xl py-8">
                <div className="flex flex-col gap-8 md:flex-row">
                    <Skeleton className="aspect-[2/3] w-full max-w-[300px] rounded shadow-sm" />
                    <div className="flex-1 space-y-3">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="mt-4 h-20 w-full" />
                    </div>
                </div>
            </div>
        )
    }

    if (isError || !book) {
        return (
            <div className="container-codice max-w-4xl py-16 text-center">
                <p className="font-display text-xl text-tinta">
                    Esse livro parece ter sido retirado da estante.
                </p>
                <p className="mt-2 font-body text-sm text-tinta-leve">
                    Talvez ele tenha encontrado um novo leitor(a).
                </p>
            </div>
        )
    }

    return (
        <div className="container-codice max-w-4xl py-8">
            {/* Book info */}
            <div className="flex flex-col gap-8 md:flex-row">
                <div className="mx-auto w-full max-w-[300px] shrink-0 self-start md:mx-0">
                    {book.coverImageUrl ? (
                        <img
                            src={book.coverImageUrl}
                            alt={book.title}
                            className="w-full rounded object-contain shadow-sm"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none'
                                const parent = e.currentTarget.parentElement
                                if (parent) parent.classList.add('bg-papel-profundo', 'aspect-[2/3]', 'flex', 'items-center', 'justify-center', 'rounded')
                            }}
                        />
                    ) : (
                        <div className="flex aspect-[2/3] items-center justify-center rounded bg-papel-profundo">
                            <BookOpenIcon className="size-16 text-cinza-quente/60" strokeWidth={1.25} />
                        </div>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <H1 className="text-3xl md:text-4xl">{book.title}</H1>
                    <p className="mt-2 font-body text-base text-tinta-leve">{book.authors}</p>

                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-ui text-sm text-tinta-leve">
                        {book.publisher && <span>{book.publisher}</span>}
                        {book.publicationYear && <span>{book.publicationYear}</span>}
                        {book.edition && <span>{book.edition}</span>}
                        {book.language && <span>{book.language}</span>}
                        {book.translator && <span>Trad.: {book.translator}</span>}
                        {book.isbn && <span>ISBN {book.isbn}</span>}
                    </div>

                    {book.academicAreas.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                            {book.academicAreas.map((area) => (
                                <AcademicAreaBadge key={area} area={area} clickable />
                            ))}
                        </div>
                    )}

                    {book.synopsis && (
                        <Prose className="mt-6">
                            <p>{book.synopsis}</p>
                        </Prose>
                    )}
                </div>
            </div>

            {/* Offers */}
            <div className="mt-12">
                <Ornament variant="fleuron" className="mb-10 mx-auto max-w-[460px]" />
                <H2 className="text-xl md:text-2xl">
                    {book.listings.length === 0
                        ? 'Ofertas disponíveis'
                        : book.listings.length === 1
                            ? '1 oferta'
                            : `${book.listings.length} ofertas`}
                </H2>

                {book.listings.length === 0 ? (
                    <p className="mt-4 font-body text-sm text-tinta-leve">
                        Nenhuma oferta deste livro no acervo agora.
                    </p>
                ) : (
                    <div className="mt-6 space-y-4">
                        {book.listings.map((offer) => (
                            <div key={offer.id} className="rounded-lg bg-papel-profundo p-5 ring-1 ring-cinza-borda">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="min-w-0 flex-1 space-y-2">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="font-display text-2xl text-bordo">
                                                {formatPrice(offer.priceCents)}
                                            </span>
                                            <ConditionBadge condition={offer.condition} />
                                            {offer.interestCount > 0 && (
                                                <span className="font-ui text-xs text-cinza-quente">
                                                    {offer.interestCount === 1 ? '1 interessado' : `${offer.interestCount} interessados`}
                                                </span>
                                            )}
                                        </div>

                                        <div className="font-ui text-sm text-tinta-leve">
                                            <span>{offer.sellerName}</span>
                                            {(offer.sellerCity || offer.sellerState) && (
                                                <span className="ml-2 text-cinza-quente">
                                                    {[offer.sellerCity, offer.sellerState].filter(Boolean).join('/')}
                                                </span>
                                            )}
                                        </div>

                                        {offer.conditionNotes && (
                                            <p className="font-body text-sm text-tinta-leve">{offer.conditionNotes}</p>
                                        )}

                                        {offer.description && (
                                            <p className="font-body text-sm text-tinta-leve">{offer.description}</p>
                                        )}

                                        {offer.photos.length > 0 && (
                                            <PhotoGallery photos={offer.photos} />
                                        )}

                                        {offer.publishedAt && (
                                            <p className="font-ui text-xs text-cinza-quente">
                                                {formatRelativeDate(offer.publishedAt)}
                                            </p>
                                        )}
                                    </div>

                                    <div className="shrink-0">
                                        <Button
                                            className="whitespace-nowrap"
                                            onClick={() => handleInterestClick(offer)}
                                        >
                                            Tenho interesse
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Interest dialog */}
            <Dialog open={!!interestTarget} onOpenChange={(open) => { if (!open) { setInterestTarget(null); setInterestMessage('') } }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Manifestar interesse</DialogTitle>
                    </DialogHeader>
                    {interestTarget && (
                        <div className="space-y-3">
                            <div className="rounded-md bg-papel-profundo p-3 ring-1 ring-cinza-borda">
                                <p className="font-display text-base text-tinta">{book.title}</p>
                                <p className="font-ui text-sm text-tinta-leve">
                                    <span className="font-display text-bordo">{formatPrice(interestTarget.priceCents)}</span> — {interestTarget.conditionLabel} — {interestTarget.sellerName}
                                </p>
                            </div>
                            <Textarea
                                value={interestMessage}
                                onChange={(e) => setInterestMessage(e.target.value)}
                                placeholder="Apresente-se e combine os detalhes."
                                rows={4}
                                maxLength={2000}
                            />
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setInterestTarget(null); setInterestMessage('') }}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleInterestSubmit}
                            disabled={!interestMessage.trim() || interestMutation.isPending}
                        >
                            {interestMutation.isPending ? 'Enviando...' : 'Enviar interesse'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
