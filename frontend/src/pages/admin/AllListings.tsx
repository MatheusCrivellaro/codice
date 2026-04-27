import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import * as adminApi from '@/api/admin'
import type { AdminListing, ListingStatus } from '@/api/admin'
import { Price } from '@/components/Price'
import { Ornament } from '@/components/Ornament'
import { formatCondition, formatListingStatus } from '@/lib/format'

const statusFilters: { value: string; label: string }[] = [
    { value: 'ALL', label: 'Todos' },
    { value: 'PENDING_REVIEW', label: 'Pendentes' },
    { value: 'ACTIVE', label: 'Ativos' },
    { value: 'PAUSED', label: 'Pausados' },
    { value: 'SOLD', label: 'Vendidos' },
]

const statusBadgeVariant: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    PENDING_REVIEW: 'secondary',
    ACTIVE: 'default',
    PAUSED: 'destructive',
    SOLD: 'outline',
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('pt-BR')
}

export function AllListings() {
    const queryClient = useQueryClient()
    const [filter, setFilter] = useState('ALL')
    const [pauseTarget, setPauseTarget] = useState<AdminListing | null>(null)
    const [pauseNote, setPauseNote] = useState('')

    const statusParam = filter === 'ALL' ? undefined : (filter as ListingStatus)

    const { data: listings = [], isLoading } = useQuery({
        queryKey: ['admin', 'listings', filter],
        queryFn: () => adminApi.listAdminListings(statusParam),
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

    const resumeMutation = useMutation({
        mutationFn: adminApi.resumeListing,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'listings'] })
            toast.success('Oferta reativada.')
        },
    })

    function handlePauseConfirm() {
        if (!pauseTarget || !pauseNote.trim()) return
        pauseMutation.mutate({ id: pauseTarget.id, note: pauseNote.trim() })
    }

    function renderActions(listing: AdminListing) {
        switch (listing.status) {
            case 'PENDING_REVIEW':
                return (
                    <div className="flex gap-1">
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => approveMutation.mutate(listing.id)}
                            disabled={approveMutation.isPending}
                        >
                            Aprovar
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => setPauseTarget(listing)}
                        >
                            Pausar
                        </Button>
                    </div>
                )
            case 'ACTIVE':
                return (
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => setPauseTarget(listing)}
                    >
                        Pausar
                    </Button>
                )
            case 'PAUSED':
                return (
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => resumeMutation.mutate(listing.id)}
                        disabled={resumeMutation.isPending}
                    >
                        Reativar
                    </Button>
                )
            default:
                return null
        }
    }

    return (
        <>
            <div>
                <h2 className="type-headline text-xl text-tinta">todas as ofertas</h2>
                <Ornament variant="rule" className="mt-2 mb-6" />
            </div>

            <Tabs value={filter} onValueChange={setFilter}>
                <TabsList>
                    {statusFilters.map((sf) => (
                        <TabsTrigger key={sf.value} value={sf.value}>
                            {sf.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            <div className="mt-4">
                {isLoading ? (
                    <p className="text-sm text-tinta-leve">Folheando o acervo...</p>
                ) : listings.length === 0 ? (
                    <p className="py-8 text-center text-sm text-tinta-leve">
                        Nenhuma oferta neste filtro.
                    </p>
                ) : (
                    <div className="rounded-md border border-cinza-borda/60">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="type-uiserif">Livro</TableHead>
                                    <TableHead className="type-uiserif">Vendedor</TableHead>
                                    <TableHead className="type-uiserif">Preço</TableHead>
                                    <TableHead className="type-uiserif">Conservação</TableHead>
                                    <TableHead className="type-uiserif">Status</TableHead>
                                    <TableHead className="type-uiserif">Criado em</TableHead>
                                    <TableHead className="type-uiserif w-[120px]">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {listings.map((listing) => (
                                        <TableRow key={listing.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium text-tinta">
                                                        {listing.bookTitle}
                                                    </p>
                                                    <p className="text-xs text-tinta-leve">
                                                        {listing.bookAuthors}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {listing.sellerName}
                                            </TableCell>
                                            <TableCell>
                                                <Price cents={listing.priceCents} className="text-bordo" />
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {formatCondition(listing.condition)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={statusBadgeVariant[listing.status] ?? 'secondary'}>
                                                    {formatListingStatus(listing.status)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-tinta-leve">
                                                {formatDate(listing.createdAt)}
                                            </TableCell>
                                            <TableCell>{renderActions(listing)}</TableCell>
                                        </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
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
