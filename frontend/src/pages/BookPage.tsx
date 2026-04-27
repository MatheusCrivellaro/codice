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
import { Price } from '@/components/Price'
import { useBook } from '@/hooks/useBook'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAuth } from '@/contexts/auth-context'
import { createInterest } from '@/api/interests'
import { formatRelativeDate, formatCatalogNumber, formatEdition } from '@/lib/format'
import { renderEditorialText } from '@/lib/typography'
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
            toast.success('Interesse manifestado. Aguarde a resposta.')
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
                        <div className="rounded bg-papel-profundo shadow-sm dark:bg-moldura-capa">
                            <img
                                src={book.coverImageUrl}
                                alt={book.title}
                                className="w-full rounded object-contain"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                    const parent = e.currentTarget.parentElement
                                    if (parent) parent.classList.add('aspect-[2/3]', 'flex', 'items-center', 'justify-center')
                                }}
                            />
                        </div>
                    ) : (
                        <div className="flex aspect-[2/3] items-center justify-center rounded bg-papel-profundo dark:bg-moldura-capa">
                            <BookOpenIcon className="size-16 text-cinza-quente/60" strokeWidth={1.25} />
                        </div>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <p className="type-uiserif text-[13px] font-normal italic tracking-[0.08em] text-cinza-quente">
                        {book.slug}
                    </p>
                    <H1 className="mt-1 text-3xl md:text-4xl">{book.title}</H1>
                    <p className="mt-2 font-body text-base text-tinta-leve">{book.authors}</p>

                    {/* Marginalia editorial — ficha catalografica curta.
                        Cada metadado vira "entrada" com label small-caps em
                        type-uiserif num-lining (cinza-quente) e valor em
                        type-uiserif num-oldstyle. Rule fino acima separa
                        do bloco de autoria. Idioma omitido quando default
                        (pt-BR) — bibliotecario nao etiqueta o obvio. */}
                    <div className="mt-5 border-t border-cinza-borda/50 pt-3">
                        <dl className="flex flex-wrap gap-x-5 gap-y-1.5 type-uiserif text-sm text-tinta-leve">
                            {book.publisher && (
                                <div className="inline-flex items-baseline gap-1.5">
                                    <dt className="num-lining text-[10px] uppercase tracking-[0.12em] text-cinza-quente">editora</dt>
                                    <dd className="num-oldstyle">{book.publisher}</dd>
                                </div>
                            )}
                            {book.publicationYear && (
                                <div className="inline-flex items-baseline gap-1.5">
                                    <dt className="num-lining text-[10px] uppercase tracking-[0.12em] text-cinza-quente">ano</dt>
                                    <dd className="num-oldstyle">{book.publicationYear}</dd>
                                </div>
                            )}
                            {book.edition && (
                                <div className="inline-flex items-baseline gap-1.5">
                                    <dt className="num-lining text-[10px] uppercase tracking-[0.12em] text-cinza-quente">edição</dt>
                                    <dd className="num-oldstyle italic">{formatEdition(book.edition)}</dd>
                                </div>
                            )}
                            {book.language && book.language !== 'pt-BR' && (
                                <div className="inline-flex items-baseline gap-1.5">
                                    <dt className="num-lining text-[10px] uppercase tracking-[0.12em] text-cinza-quente">idioma</dt>
                                    <dd>{book.language}</dd>
                                </div>
                            )}
                            {book.translator && (
                                <div className="inline-flex items-baseline gap-1.5">
                                    <dt className="num-lining text-[10px] uppercase tracking-[0.12em] text-cinza-quente">tradução</dt>
                                    <dd className="italic">{book.translator}</dd>
                                </div>
                            )}
                            {book.isbn && (
                                <div className="inline-flex items-baseline gap-1.5">
                                    <dt className="num-lining text-[10px] uppercase tracking-[0.12em] text-cinza-quente">ISBN</dt>
                                    <dd className="num-lining">{book.isbn}</dd>
                                </div>
                            )}
                        </dl>
                    </div>

                    {book.academicAreas.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                            {book.academicAreas.map((area) => (
                                <AcademicAreaBadge key={area} area={area} clickable />
                            ))}
                        </div>
                    )}

                    <p className="mt-6 text-right type-uiserif num-lining text-[11px] tracking-[0.15em] text-cinza-quente">
                        Nº {formatCatalogNumber(book.id)}
                    </p>

                    {book.synopsis && (
                        <Prose className="mt-2">
                            {book.synopsis.split(/\n\s*\n/).map((paragraph, i) => (
                                <p key={i} className={i === 0 ? 'drop-cap' : undefined}>
                                    {renderEditorialText(paragraph)}
                                </p>
                            ))}
                        </Prose>
                    )}
                </div>
            </div>

            {/* Offers */}
            <div className="mt-12">
                {/* Asterismo: fim do conteudo editorial do livro como obra,
                    inicio do bloco transacional dos exemplares. Pausa
                    formal — mais forte que fleuron. */}
                <Ornament variant="asterism" className="mb-10" />
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
                        {(() => {
                            const minPrice = Math.min(...book.listings.map((l) => l.priceCents))
                            const showAsterisk = book.listings.length > 1
                            return book.listings.map((offer) => (
                            <div key={offer.id} className="rounded-lg bg-papel-profundo p-5 ring-1 ring-cinza-borda">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="min-w-0 flex-1 space-y-2">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <Price
                                                cents={offer.priceCents}
                                                size="xl"
                                                className="text-bordo"
                                                asterisk={showAsterisk && offer.priceCents === minPrice}
                                            />
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
                                            <p className="font-body text-sm text-tinta-leve">
                                                {renderEditorialText(offer.conditionNotes)}
                                            </p>
                                        )}

                                        {offer.description && (
                                            <p className="font-body text-sm text-tinta-leve">
                                                {renderEditorialText(offer.description)}
                                            </p>
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
                            ))
                        })()}
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
                                    <Price cents={interestTarget.priceCents} size="md" className="text-bordo" /> — {interestTarget.conditionLabel} — {interestTarget.sellerName}
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
