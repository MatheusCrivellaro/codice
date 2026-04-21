import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatCondition } from '@/lib/format'
import { PHOTO_TYPES } from '@/lib/schemas/listing'
import type { WizardBookData, WizardDetailsData, WizardPhotoData } from '@/pages/sell/CreateListingWizard'

interface StepReviewProps {
    bookData: WizardBookData
    detailsData: WizardDetailsData
    photosData: WizardPhotoData[]
    onSubmit: () => void
    onBack: () => void
    isSubmitting: boolean
}

function photoTypeLabel(value: string): string {
    return PHOTO_TYPES.find(pt => pt.value === value)?.label ?? value
}

export function StepReview({ bookData, detailsData, photosData, onSubmit, onBack, isSubmitting }: StepReviewProps) {
    const bookTitle = bookData.lookupResult?.title ?? bookData.manualBookData?.title ?? ''
    const bookAuthors = bookData.lookupResult?.authors ?? bookData.manualBookData?.authors ?? ''
    const bookPublisher = bookData.lookupResult?.publisher ?? bookData.manualBookData?.publisher
    const bookYear = bookData.lookupResult?.publicationYear ?? bookData.manualBookData?.publicationYear
    const coverUrl = bookData.lookupResult?.coverImageUrl

    return (
        <div className="space-y-6">
            <h2 className="font-display text-xl text-tinta">Confira antes de publicar</h2>

            <Card>
                <CardContent className="pt-4 space-y-4">
                    <div>
                        <h3 className="text-xs font-medium uppercase text-cinza-quente">Livro</h3>
                        <div className="mt-2 flex gap-4">
                            {coverUrl && (
                                <img src={coverUrl} alt={bookTitle} className="h-24 w-18 shrink-0 rounded object-cover" />
                            )}
                            <div>
                                <p className="font-display text-lg font-medium text-tinta">{bookTitle}</p>
                                <p className="text-sm text-tinta-leve">{bookAuthors}</p>
                                {bookPublisher && <p className="text-sm text-tinta-leve">{bookPublisher}</p>}
                                {bookYear && <p className="text-sm text-tinta-leve">{bookYear}</p>}
                                {bookData.isbn && <p className="text-xs text-cinza-quente">ISBN: {bookData.isbn}</p>}
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="text-xs font-medium uppercase text-cinza-quente">Detalhes da oferta</h3>
                        <div className="mt-2 space-y-1">
                            <p className="text-sm">
                                <span className="text-tinta-leve">Preço: </span>
                                <span className="font-display text-bordo">R$ {detailsData.priceReais}</span>
                            </p>
                            <p className="text-sm">
                                <span className="text-tinta-leve">Conservação: </span>
                                {formatCondition(detailsData.condition)}
                            </p>
                            {detailsData.conditionNotes && (
                                <p className="text-sm">
                                    <span className="text-tinta-leve">Observações: </span>
                                    {detailsData.conditionNotes}
                                </p>
                            )}
                            {detailsData.description && (
                                <p className="text-sm">
                                    <span className="text-tinta-leve">Descrição: </span>
                                    {detailsData.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="text-xs font-medium uppercase text-cinza-quente">
                            Fotos ({photosData.length})
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {photosData.map((photo, i) => (
                                <div key={i} className="space-y-1">
                                    <img
                                        src={photo.url}
                                        alt={`Foto ${i + 1}`}
                                        className="h-20 w-20 rounded border border-cinza-borda object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none'
                                            ;(e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden')
                                        }}
                                    />
                                    <p className="hidden max-w-[80px] truncate text-xs text-cinza-quente">{photo.url}</p>
                                    <p className="text-xs text-cinza-quente">{photoTypeLabel(photo.photoType)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Button className="w-full" onClick={onSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Publicando...' : 'Publicar oferta'}
            </Button>
            <p className="text-center text-xs text-cinza-quente">
                Sua oferta será revisada antes de aparecer no acervo.
            </p>

            <Button type="button" variant="outline" onClick={onBack} className="w-full">
                Voltar
            </Button>
        </div>
    )
}
