import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Stepper } from '@/components/ui/stepper'
import { Ornament } from '@/components/Ornament'
import { StepBook } from '@/pages/sell/steps/StepBook'
import { StepDetails } from '@/pages/sell/steps/StepDetails'
import { StepPhotos } from '@/pages/sell/steps/StepPhotos'
import { StepReview } from '@/pages/sell/steps/StepReview'
import * as listingsApi from '@/api/listings'
import type { BookLookupResponse, ManualBookData } from '@/api/listings'
import type { ApiError } from '@/api/client'
import { parseReaisToCents } from '@/lib/schemas/listing'
import type { UploadedPhoto } from '@/components/PhotoUploader'
import { usePageTitle } from '@/hooks/usePageTitle'

export interface WizardBookData {
    isbn?: string
    manualBookData?: ManualBookData
    lookupResult?: BookLookupResponse
}

export interface WizardDetailsData {
    priceReais: string
    condition: string
    conditionNotes?: string
    description?: string
}

export type WizardPhotoData = UploadedPhoto

const STEPS = ['Livro', 'Detalhes', 'Fotos', 'Revisão']

export function CreateListingWizard() {
    usePageTitle('anunciar um livro')
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [bookData, setBookData] = useState<WizardBookData>({})
    const [detailsData, setDetailsData] = useState<WizardDetailsData | null>(null)
    const [photosData, setPhotosData] = useState<WizardPhotoData[]>([])

    const submitMutation = useMutation({
        mutationFn: listingsApi.createListing,
        onSuccess: () => {
            toast.success('Oferta enviada. Em breve passa pelas mãos do bibliotecário.')
            navigate('/vender/anuncios')
        },
        onError: (err) => {
            const status = (err as ApiError).status
            if (status === 400) {
                toast.error((err as Error).message || 'Dados inválidos.')
            } else if (status === 403) {
                toast.error('Compradores não anunciam livros. Se quiser anunciar, altere seu perfil.')
            } else {
                toast.error('Algo se perdeu entre as páginas. Tente novamente em instantes.')
            }
        },
    })

    function handleBookComplete(data: WizardBookData) {
        setBookData(data)
        setStep(2)
    }

    function handleDetailsComplete(data: WizardDetailsData) {
        setDetailsData(data)
        setStep(3)
    }

    function handlePhotosComplete(data: WizardPhotoData[]) {
        setPhotosData(data)
        setStep(4)
    }

    function handleSubmit() {
        if (!detailsData) return

        const request: listingsApi.CreateListingRequest = {
            isbn: bookData.isbn || undefined,
            manualBookData: bookData.manualBookData || undefined,
            priceCents: parseReaisToCents(detailsData.priceReais),
            condition: detailsData.condition,
            conditionNotes: detailsData.conditionNotes || undefined,
            description: detailsData.description || undefined,
            photos: photosData.map((p, i) => ({
                url: p.url,
                position: i,
                photoType: p.photoType,
            })),
        }

        submitMutation.mutate(request)
    }

    return (
        <div className="container-codice max-w-[640px] py-8">
            <h1 className="font-display text-3xl text-tinta">anunciar um livro</h1>
            <Ornament variant="rule" className="mt-3 mb-8" />
            <div className="mb-10">
                <Stepper steps={STEPS} currentStep={step} />
            </div>

            {step === 1 && (
                <StepBook initialData={bookData} onComplete={handleBookComplete} />
            )}
            {step === 2 && (
                <StepDetails
                    initialData={detailsData}
                    onComplete={handleDetailsComplete}
                    onBack={() => setStep(1)}
                />
            )}
            {step === 3 && (
                <StepPhotos
                    initialData={photosData}
                    onComplete={handlePhotosComplete}
                    onBack={() => setStep(2)}
                />
            )}
            {step === 4 && (
                <StepReview
                    bookData={bookData}
                    detailsData={detailsData!}
                    photosData={photosData}
                    onSubmit={handleSubmit}
                    onBack={() => setStep(3)}
                    isSubmitting={submitMutation.isPending}
                />
            )}
        </div>
    )
}
