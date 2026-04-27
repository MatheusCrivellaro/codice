import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Ornament } from '@/components/Ornament'
import { PhotoUploader, type UploadedPhoto } from '@/components/PhotoUploader'
import type { WizardPhotoData } from '@/pages/sell/CreateListingWizard'

interface StepPhotosProps {
    initialData: WizardPhotoData[]
    onComplete: (data: WizardPhotoData[]) => void
    onBack: () => void
}

export function StepPhotos({ initialData, onComplete, onBack }: StepPhotosProps) {
    const [photos, setPhotos] = useState<UploadedPhoto[]>(initialData)

    function handleContinue() {
        if (photos.length === 0) {
            toast.error('Adicione ao menos uma foto do livro.')
            return
        }
        if (photos.some(p => p.uploading)) {
            toast.error('Aguarde os uploads terminarem.')
            return
        }
        const failed = photos.filter(p => p.error || !p.url)
        if (failed.length > 0) {
            toast.error('Remova ou refaça as fotos com erro antes de continuar.')
            return
        }
        onComplete(photos)
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="type-headline text-xl text-tinta">fotos do exemplar</h2>
                <Ornament variant="rule" className="mt-2" />
            </div>
            <p className="text-sm text-tinta-leve">
                Fotos nítidas e bem iluminadas mostram o livro como ele é — e ajudam a encontrar quem está procurando.
            </p>

            <PhotoUploader photos={photos} onPhotosChange={setPhotos} />

            <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onBack}>Voltar</Button>
                <Button className="flex-1" onClick={handleContinue}>Continuar</Button>
            </div>
        </div>
    )
}
