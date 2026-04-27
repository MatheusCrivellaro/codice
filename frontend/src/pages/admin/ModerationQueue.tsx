import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import * as adminApi from '@/api/admin'
import type { AdminListing } from '@/api/admin'
import { Price } from '@/components/Price'
import { formatCondition } from '@/lib/format'

export function ModerationQueue() {
    const queryClient = useQueryClient()
    const [pauseTarget, setPauseTarget] = useState<AdminListing | null>(null)
    const [pauseNote, setPauseNote] = useState('')

    const { data: listings = [], isLoading } = useQuery({
        queryKey: ['admin', 'listings', 'PENDING_REVIEW'],
        queryFn: () => adminApi.listAdminListings('PENDING_REVIEW'),
    })

    const approveMutation = useMutation({
        mutationFn: adminApi.approveListing,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'listings'] })
            toast.success('Oferta aprovada.')
        },
    })

    const pauseMutation = useMutation({
        mutationFn: ({ id, note }: { id: string; note: string }) =>
            adminApi.pauseListing(id, note),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'listings'] })
            toast.success('Oferta pausada.')
            setPauseTarget(null)
            setPauseNote('')
        },
    })

    function handlePauseConfirm() {
        if (!pauseTarget || !pauseNote.trim()) return
        pauseMutation.mutate({ id: pauseTarget.id, note: pauseNote.trim() })
    }

    if (isLoading) {
        return <p className="text-sm text-tinta-leve">Folheando a fila...</p>
    }

    if (listings.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <p className="text-lg text-tinta-leve">
                    Nenhuma oferta na fila. O acervo está em dia.
                </p>
            </div>
        )
    }

    return (
        <>
            <div className="grid gap-4">
                {listings.map((listing) => (
                    <div
                        key={listing.id}
                        className="rounded-lg bg-papel-profundo p-5 ring-1 ring-cinza-borda"
                    >
                        <div className="flex gap-4">
                            {listing.bookCoverImageUrl && (
                                <img
                                    src={listing.bookCoverImageUrl}
                                    alt={listing.bookTitle}
                                    className="h-32 w-24 shrink-0 rounded object-cover"
                                />
                            )}
                            <div className="min-w-0 flex-1">
                                <h3 className="font-display text-lg font-medium text-tinta">
                                    {listing.bookTitle}
                                </h3>
                                <p className="text-sm text-tinta-leve">{listing.bookAuthors}</p>
                                <p className="mt-1 text-sm text-tinta-leve">
                                    Vendedor: {listing.sellerName}
                                </p>
                                <div className="mt-2 flex flex-wrap items-baseline gap-3 text-sm">
                                    <Price cents={listing.priceCents} size="lg" className="text-bordo" />
                                    <span className="text-tinta-leve">
                                        {formatCondition(listing.condition)}
                                    </span>
                                </div>
                                {listing.description && (
                                    <p className="mt-2 text-sm text-tinta-leve line-clamp-2">
                                        {listing.description}
                                    </p>
                                )}
                                {listing.photoUrls.length > 0 && (
                                    <div className="mt-2 flex gap-2">
                                        {listing.photoUrls.slice(0, 3).map((url, i) => (
                                            <img
                                                key={i}
                                                src={url}
                                                alt={`Foto ${i + 1}`}
                                                className="h-16 w-16 rounded border border-cinza-borda object-cover"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 flex gap-2 border-t border-cinza-borda/60 pt-3">
                            <Button
                                size="sm"
                                onClick={() => approveMutation.mutate(listing.id)}
                                disabled={approveMutation.isPending}
                            >
                                Aprovar
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setPauseTarget(listing)}
                            >
                                Pausar
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={!!pauseTarget} onOpenChange={(open) => { if (!open) { setPauseTarget(null); setPauseNote('') } }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Pausar oferta</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-tinta-leve">
                        Informe o motivo da pausa para {pauseTarget?.bookTitle}:
                    </p>
                    <Textarea
                        value={pauseNote}
                        onChange={(e) => setPauseNote(e.target.value)}
                        placeholder="Ex: foto desfocada, descrição incompleta..."
                        rows={3}
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setPauseTarget(null); setPauseNote('') }}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handlePauseConfirm}
                            disabled={!pauseNote.trim() || pauseMutation.isPending}
                        >
                            Confirmar pausa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
