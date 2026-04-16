import { z } from 'zod'

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'E-mail é obrigatório')
        .email('E-mail inválido'),
    password: z
        .string()
        .min(8, 'Senha deve ter no mínimo 8 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const registerSchema = z.object({
    name: z
        .string()
        .min(2, 'Nome deve ter no mínimo 2 caracteres'),
    email: z
        .string()
        .min(1, 'E-mail é obrigatório')
        .email('E-mail inválido'),
    password: z
        .string()
        .min(8, 'Senha deve ter no mínimo 8 caracteres'),
    profileType: z.enum(['BUYER', 'BOOKSTORE', 'INDIVIDUAL_SELLER'], {
        message: 'Escolha um tipo de perfil',
    }),
    acceptedPrivacyPolicy: z.literal(true, {
        message: 'Aceite a política de privacidade para continuar',
    }),
})

export type RegisterFormData = z.infer<typeof registerSchema>
