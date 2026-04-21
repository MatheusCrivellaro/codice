import { useEffect, useRef, useState, type DragEvent, type ChangeEvent } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { uploadPhoto } from '@/api/uploads'
import { PHOTO_TYPES } from '@/lib/schemas/listing'

export interface UploadedPhoto {
    id: string
    url: string
    localPreviewUrl?: string
    photoType: string
    uploading: boolean
    error?: string
}

interface PhotoUploaderProps {
    photos: UploadedPhoto[]
    onPhotosChange: (photos: UploadedPhoto[]) => void
    maxPhotos?: number
}

const MAX_SIZE_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ALLOWED_EXTS = ['.jpg', '.jpeg', '.png', '.webp']

const PHOTO_TYPE_TIPS: Record<string, string> = {
    COVER_FRONT: 'Foto da capa sobre superficie neutra, luz natural.',
    SPINE_BACK: 'Mostra desgaste e ISBN.',
    INNER_DETAIL: 'Paginas internas, grifos, anotacoes.',
    DEFECT: 'Enquadre o defeito de perto, com luz direta.',
    TITLE_PAGE: 'Folha de rosto completa.',
    OTHER: '',
}

function nextPhotoType(existing: UploadedPhoto[]): string {
    if (!existing.some(p => p.photoType === 'COVER_FRONT')) return 'COVER_FRONT'
    if (!existing.some(p => p.photoType === 'SPINE_BACK')) return 'SPINE_BACK'
    if (!existing.some(p => p.photoType === 'INNER_DETAIL')) return 'INNER_DETAIL'
    return 'OTHER'
}

function validateFile(file: File): string | null {
    if (!ALLOWED_TYPES.includes(file.type)) {
        return `Formato nao suportado (${file.type || 'desconhecido'}). Envie JPG, PNG ou WEBP.`
    }
    if (file.size > MAX_SIZE_BYTES) {
        return `Arquivo muito grande (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximo 5MB.`
    }
    return null
}

export function PhotoUploader({ photos, onPhotosChange, maxPhotos = 10 }: PhotoUploaderProps) {
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const photosRef = useRef(photos)

    useEffect(() => {
        photosRef.current = photos
    }, [photos])

    useEffect(() => {
        return () => {
            photosRef.current.forEach(p => {
                if (p.localPreviewUrl) URL.revokeObjectURL(p.localPreviewUrl)
            })
        }
    }, [])

    function updatePhoto(id: string, patch: Partial<UploadedPhoto>) {
        const next = photosRef.current.map(p => p.id === id ? { ...p, ...patch } : p)
        photosRef.current = next
        onPhotosChange(next)
    }

    async function handleFiles(files: FileList | File[]) {
        const fileList = Array.from(files)
        if (fileList.length === 0) return

        const remaining = maxPhotos - photosRef.current.length
        if (remaining <= 0) {
            toast.error(`Maximo ${maxPhotos} fotos.`)
            return
        }

        const toUpload = fileList.slice(0, remaining)
        if (fileList.length > remaining) {
            toast.warning(`Apenas as primeiras ${remaining} fotos foram adicionadas (limite de ${maxPhotos}).`)
        }

        const queued: Array<{ photo: UploadedPhoto; file: File }> = []
        for (const file of toUpload) {
            const error = validateFile(file)
            if (error) {
                toast.error(`${file.name}: ${error}`)
                continue
            }
            const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
            const localPreviewUrl = URL.createObjectURL(file)
            const photo: UploadedPhoto = {
                id,
                url: '',
                localPreviewUrl,
                photoType: nextPhotoType([...photosRef.current, ...queued.map(q => q.photo)]),
                uploading: true,
            }
            queued.push({ photo, file })
        }

        if (queued.length === 0) return

        onPhotosChange([...photosRef.current, ...queued.map(q => q.photo)])

        await Promise.all(queued.map(async ({ photo, file }) => {
            try {
                const result = await uploadPhoto(file)
                updatePhoto(photo.id, {
                    url: result.publicUrl,
                    uploading: false,
                })
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Falha no upload'
                updatePhoto(photo.id, {
                    uploading: false,
                    error: message,
                })
                toast.error(`${file.name}: ${message}`)
            }
        }))
    }

    function handleFileInputChange(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files) handleFiles(e.target.files)
        e.target.value = ''
    }

    function handleDrop(e: DragEvent<HTMLDivElement>) {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files) handleFiles(e.dataTransfer.files)
    }

    function handleDragOver(e: DragEvent<HTMLDivElement>) {
        e.preventDefault()
        setIsDragging(true)
    }

    function handleDragLeave(e: DragEvent<HTMLDivElement>) {
        e.preventDefault()
        setIsDragging(false)
    }

    function removePhoto(id: string) {
        const photo = photosRef.current.find(p => p.id === id)
        if (photo?.localPreviewUrl) URL.revokeObjectURL(photo.localPreviewUrl)
        onPhotosChange(photosRef.current.filter(p => p.id !== id))
    }

    function movePhoto(id: string, direction: -1 | 1) {
        const current = photosRef.current
        const index = current.findIndex(p => p.id === id)
        const newIndex = index + direction
        if (index < 0 || newIndex < 0 || newIndex >= current.length) return
        const next = [...current]
        ;[next[index], next[newIndex]] = [next[newIndex], next[index]]
        onPhotosChange(next)
    }

    const canAddMore = photos.length < maxPhotos

    return (
        <div className="space-y-4">
            {canAddMore && (
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`cursor-pointer rounded-md border-2 border-dashed p-6 text-center transition-colors ${
                        isDragging
                            ? 'border-bordo bg-papel-profundo'
                            : 'border-cinza-quente/60 bg-papel hover:border-bordo/50'
                    }`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={ALLOWED_EXTS.join(',')}
                        multiple
                        className="hidden"
                        onChange={handleFileInputChange}
                    />
                    <p className="text-sm text-tinta">
                        Arraste fotos ou <span className="font-medium text-bordo">clique para selecionar</span>
                    </p>
                    <p className="mt-1 text-xs text-cinza-quente">
                        JPG, PNG ou WEBP. Maximo 5MB por foto, ate {maxPhotos} fotos.
                    </p>
                </div>
            )}

            {photos.length > 0 && (
                <div className="space-y-3">
                    {photos.map((photo, index) => (
                        <div
                            key={photo.id}
                            className={`flex gap-3 rounded-md border p-3 ${
                                photo.error ? 'border-red-300 bg-red-50' : 'border-cinza-borda'
                            }`}
                        >
                            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded border border-cinza-borda bg-papel-profundo">
                                {(photo.localPreviewUrl || photo.url) && (
                                    <img
                                        src={photo.localPreviewUrl || photo.url}
                                        alt={`Foto ${index + 1}`}
                                        className="h-full w-full object-cover"
                                    />
                                )}
                                {photo.uploading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-tinta">Foto {index + 1}</span>
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => movePhoto(photo.id, -1)}
                                            disabled={index === 0}
                                            className="rounded px-1 text-xs text-tinta-leve hover:text-tinta disabled:opacity-30"
                                            aria-label="Mover para cima"
                                        >
                                            {'â†‘'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => movePhoto(photo.id, 1)}
                                            disabled={index === photos.length - 1}
                                            className="rounded px-1 text-xs text-tinta-leve hover:text-tinta disabled:opacity-30"
                                            aria-label="Mover para baixo"
                                        >
                                            {'â†“'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => removePhoto(photo.id)}
                                            className="ml-2 rounded px-1 text-xs text-red-600 hover:text-red-800"
                                        >
                                            Remover
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs">Tipo da foto</Label>
                                    <Select
                                        value={photo.photoType}
                                        onValueChange={(v) => updatePhoto(photo.id, { photoType: v })}
                                    >
                                        <SelectTrigger className="h-8 text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PHOTO_TYPES.map(pt => (
                                                <SelectItem key={pt.value} value={pt.value}>{pt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {PHOTO_TYPE_TIPS[photo.photoType] && (
                                        <p className="text-xs text-cinza-quente">{PHOTO_TYPE_TIPS[photo.photoType]}</p>
                                    )}
                                </div>

                                {photo.error && (
                                    <p className="text-xs text-red-600">{photo.error}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {canAddMore && photos.length > 0 && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                >
                    Adicionar mais fotos
                </Button>
            )}
        </div>
    )
}
