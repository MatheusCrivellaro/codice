import { z } from 'zod'

const UF_LIST = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const

export const sellerProfileSchema = z.object({
    publicName: z
        .string()
        .min(1, 'Nome publico e obrigatorio')
        .max(150, 'Maximo 150 caracteres'),
    description: z
        .string()
        .min(20, 'Descricao deve ter no minimo 20 caracteres')
        .max(2000, 'Maximo 2000 caracteres'),
    city: z
        .string()
        .min(1, 'Cidade e obrigatoria')
        .max(120, 'Maximo 120 caracteres'),
    state: z.enum(UF_LIST, { message: 'Selecione um estado' }),
    neighborhood: z
        .string()
        .max(120, 'Maximo 120 caracteres')
        .optional()
        .or(z.literal('')),
})

export type SellerProfileFormData = z.infer<typeof sellerProfileSchema>

export const UF_OPTIONS = UF_LIST
