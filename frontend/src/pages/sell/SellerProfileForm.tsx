import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Ornament } from '@/components/Ornament'
import { sellerProfileSchema, type SellerProfileFormData, UF_OPTIONS } from '@/lib/schemas/seller'
import * as listingsApi from '@/api/listings'
import type { ApiError } from '@/api/client'

export function SellerProfileForm() {
    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<SellerProfileFormData>({
        resolver: zodResolver(sellerProfileSchema),
    })

    const mutation = useMutation({
        mutationFn: listingsApi.createSellerProfile,
        onSuccess: () => {
            toast.success('Vitrine do sebo pronta.')
            queryClient.invalidateQueries({ queryKey: ['seller', 'me'] })
        },
        onError: (err) => {
            if ((err as ApiError).status === 409) {
                toast.error('Você já tem uma vitrine configurada.')
            } else {
                toast.error('Algo se perdeu entre as páginas. Tente novamente em instantes.')
            }
        },
    })

    function onSubmit(data: SellerProfileFormData) {
        mutation.mutate({
            publicName: data.publicName,
            description: data.description,
            city: data.city,
            state: data.state,
            neighborhood: data.neighborhood || undefined,
        })
    }

    return (
        <div className="container-codice max-w-lg py-12">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">monte a vitrine do seu sebo</CardTitle>
                    <CardDescription className="font-body">
                        Essas informações serão públicas na página da sua loja.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Ornament variant="rule" className="mx-auto mb-6 max-w-[140px]" />
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="publicName">Nome público</Label>
                            <Input id="publicName" {...register('publicName')} placeholder="Ex: Sebo da Esquina" />
                            {errors.publicName && <p className="text-sm text-red-600">{errors.publicName.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea
                                id="description"
                                {...register('description')}
                                placeholder="Conte em poucas linhas a história e o acervo do seu sebo."
                                rows={4}
                            />
                            {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">Cidade</Label>
                                <Input id="city" {...register('city')} />
                                {errors.city && <p className="text-sm text-red-600">{errors.city.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Estado</Label>
                                <Select onValueChange={(v) => setValue('state', v as SellerProfileFormData['state'])}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="UF" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {UF_OPTIONS.map((uf) => (
                                            <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.state && <p className="text-sm text-red-600">{errors.state.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="neighborhood">Bairro (opcional)</Label>
                            <Input id="neighborhood" {...register('neighborhood')} />
                        </div>

                        <Button type="submit" className="w-full" disabled={mutation.isPending}>
                            {mutation.isPending ? 'Criando vitrine...' : 'Abrir vitrine'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
