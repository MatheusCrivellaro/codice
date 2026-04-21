import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { listingDetailsSchema, CONDITIONS, type ListingDetailsFormData } from '@/lib/schemas/listing'
import type { WizardDetailsData } from '@/pages/sell/CreateListingWizard'

interface StepDetailsProps {
    initialData: WizardDetailsData | null
    onComplete: (data: WizardDetailsData) => void
    onBack: () => void
}

export function StepDetails({ initialData, onComplete, onBack }: StepDetailsProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ListingDetailsFormData>({
        resolver: zodResolver(listingDetailsSchema),
        defaultValues: {
            priceReais: initialData?.priceReais ?? '',
            condition: initialData?.condition as ListingDetailsFormData['condition'] ?? undefined,
            conditionNotes: initialData?.conditionNotes ?? '',
            description: initialData?.description ?? '',
        },
    })

    const conditionValue = watch('condition')

    function onSubmit(data: ListingDetailsFormData) {
        onComplete({
            priceReais: data.priceReais,
            condition: data.condition,
            conditionNotes: data.conditionNotes || undefined,
            description: data.description || undefined,
        })
    }

    function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
        let value = e.target.value.replace(/[^\d,]/g, '')
        const parts = value.split(',')
        if (parts.length > 2) {
            value = parts[0] + ',' + parts.slice(1).join('')
        }
        if (parts[1] && parts[1].length > 2) {
            value = parts[0] + ',' + parts[1].substring(0, 2)
        }
        setValue('priceReais', value)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="font-display text-xl text-tinta">Detalhes da oferta</h2>

            <div className="space-y-2">
                <Label htmlFor="priceReais">Preço *</Label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-cinza-quente">R$</span>
                    <Input
                        id="priceReais"
                        {...register('priceReais')}
                        onChange={handlePriceChange}
                        className="pl-10"
                        placeholder="Ex: 35,00"
                    />
                </div>
                {errors.priceReais && <p className="text-sm text-red-600">{errors.priceReais.message}</p>}
            </div>

            <div className="space-y-3">
                <Label>Conservação *</Label>
                <RadioGroup
                    value={conditionValue}
                    onValueChange={(v) => setValue('condition', v as ListingDetailsFormData['condition'])}
                >
                    {CONDITIONS.map(c => (
                        <label
                            key={c.value}
                            className="flex cursor-pointer items-start gap-3 rounded-md border border-cinza-borda p-3 hover:bg-papel-profundo/60 has-[data-state=checked]:border-bordo has-[data-state=checked]:bg-bordo/5"
                        >
                            <RadioGroupItem value={c.value} className="mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-tinta">{c.label}</p>
                                <p className="text-xs text-tinta-leve">{c.description}</p>
                            </div>
                        </label>
                    ))}
                </RadioGroup>
                {errors.condition && <p className="text-sm text-red-600">{errors.condition.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="conditionNotes">Observações (opcional)</Label>
                <Textarea
                    id="conditionNotes"
                    {...register('conditionNotes')}
                    placeholder="Marcas, grifos ou detalhes que o leitor precisa saber."
                    rows={3}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Conte mais sobre este exemplar."
                    rows={3}
                />
            </div>

            <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onBack}>Voltar</Button>
                <Button type="submit" className="flex-1">Continuar</Button>
            </div>
        </form>
    )
}
