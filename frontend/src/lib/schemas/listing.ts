import { z } from 'zod'

export const isbnSearchSchema = z.object({
    isbn: z.string().min(10, 'ISBN deve ter no minimo 10 caracteres').max(17, 'ISBN muito longo'),
})

export type IsbnSearchFormData = z.infer<typeof isbnSearchSchema>

export const manualBookSchema = z.object({
    title: z.string().min(1, 'Titulo e obrigatorio').max(300, 'Maximo 300 caracteres'),
    authors: z.string().min(1, 'Autor(es) e obrigatorio').max(500, 'Maximo 500 caracteres'),
    publisher: z.string().max(200).optional().or(z.literal('')),
    publicationYear: z.coerce.number().int().min(1400).max(new Date().getFullYear()).optional().or(z.literal(0).transform(() => undefined)),
    edition: z.string().max(50).optional().or(z.literal('')),
    language: z.string().optional().default('pt-BR'),
    translator: z.string().max(200).optional().or(z.literal('')),
    synopsis: z.string().max(5000).optional().or(z.literal('')),
})

export type ManualBookFormData = z.infer<typeof manualBookSchema>

export const CONDITIONS = [
    { value: 'NOVO', label: 'Novo', description: 'Nunca lido, sem marcas de uso' },
    { value: 'COMO_NOVO', label: 'Como novo', description: 'Lido com cuidado, sem marcas visíveis' },
    { value: 'MUITO_BOM', label: 'Muito bom', description: 'Pequenos sinais de uso, sem grifos ou anotações' },
    { value: 'BOM', label: 'Bom', description: 'Sinais normais de uso, pode ter leves marcas' },
    { value: 'ACEITAVEL', label: 'Aceitável', description: 'Desgaste visível, pode ter grifos ou anotações' },
] as const

export const CONDITION_VALUES = CONDITIONS.map(c => c.value)

export const listingDetailsSchema = z.object({
    priceReais: z.string().min(1, 'Preco e obrigatorio'),
    condition: z.enum(['NOVO', 'COMO_NOVO', 'MUITO_BOM', 'BOM', 'ACEITAVEL'], {
        message: 'Selecione o estado de conservacao',
    }),
    conditionNotes: z.string().max(1000, 'Maximo 1000 caracteres').optional().or(z.literal('')),
    description: z.string().max(2000, 'Maximo 2000 caracteres').optional().or(z.literal('')),
})

export type ListingDetailsFormData = z.infer<typeof listingDetailsSchema>

export const PHOTO_TYPES = [
    { value: 'COVER_FRONT', label: 'Capa frontal' },
    { value: 'SPINE_BACK', label: 'Lombada/contracapa' },
    { value: 'INNER_DETAIL', label: 'Detalhe interno' },
    { value: 'DEFECT', label: 'Defeito' },
    { value: 'TITLE_PAGE', label: 'Folha de rosto' },
    { value: 'OTHER', label: 'Outro' },
] as const

export const listingPhotoSchema = z.object({
    url: z.string().min(1, 'URL da foto e obrigatoria').max(500),
    photoType: z.string().min(1, 'Tipo da foto e obrigatorio'),
})

export const listingPhotosSchema = z.object({
    photos: z.array(listingPhotoSchema).min(1, 'Adicione pelo menos 1 foto').max(10, 'Maximo 10 fotos'),
})

export type ListingPhotosFormData = z.infer<typeof listingPhotosSchema>

export function parseReaisToCents(value: string): number {
    const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.')
    return Math.round(parseFloat(cleaned) * 100) || 0
}
