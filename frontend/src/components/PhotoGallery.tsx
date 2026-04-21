import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import type { ListingPhotoResponse } from '@/api/books'

interface PhotoGalleryProps {
    photos: ListingPhotoResponse[]
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
    const [selected, setSelected] = useState<ListingPhotoResponse | null>(null)

    if (photos.length === 0) return null

    return (
        <>
            <div className="flex gap-2">
                {photos.map((photo) => (
                    <button
                        key={photo.id}
                        type="button"
                        onClick={() => setSelected(photo)}
                        className="h-16 w-16 shrink-0 overflow-hidden rounded border border-cinza-borda transition-opacity hover:opacity-80"
                    >
                        <img
                            src={photo.url}
                            alt={`Foto ${photo.position + 1}`}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none'
                            }}
                        />
                    </button>
                ))}
            </div>

            <Dialog open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null) }}>
                <DialogContent className="max-w-2xl p-2">
                    {selected && (
                        <img
                            src={selected.url}
                            alt={`Foto ${selected.position + 1}`}
                            className="w-full rounded object-contain"
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
