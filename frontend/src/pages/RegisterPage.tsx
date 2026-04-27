import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/auth-context'
import { registerSchema, type RegisterFormData } from '@/lib/schemas/auth'
import type { ApiError } from '@/api/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Ornament } from '@/components/Ornament'
import { usePageTitle } from '@/hooks/usePageTitle'

const PROFILE_OPTIONS = [
    {
        value: 'BUYER' as const,
        label: 'Quero encontrar livros',
        description: 'Navegar, buscar e levar livros pra casa',
    },
    {
        value: 'BOOKSTORE' as const,
        label: 'Represento um sebo',
        description: 'Anunciar e gerenciar o acervo do meu sebo',
    },
    {
        value: 'INDIVIDUAL_SELLER' as const,
        label: 'Quero anunciar meus livros',
        description: 'Desencalhar a estante, anunciar exemplares pessoais',
    },
]

export function RegisterPage() {
    usePageTitle('criar conta')
    const { register: registerUser } = useAuth()
    const navigate = useNavigate()
    const [privacyOpen, setPrivacyOpen] = useState(false)

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    })

    async function onSubmit(data: RegisterFormData) {
        try {
            await registerUser(data)
            navigate('/', { replace: true })
        } catch (err) {
            const status = (err as ApiError).status
            if (status === 409) {
                toast.error('Este e-mail já está em uma conta.')
            } else {
                toast.error('Erro ao criar conta. Tente novamente.')
            }
        }
    }

    return (
        <div className="container-codice flex min-h-[60vh] items-center justify-center py-12">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="font-display text-2xl text-tinta">
                        criar uma conta
                    </CardTitle>
                    <CardDescription className="font-body">
                        Junte-se ao acervo. Escolha como deseja participar.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Ornament variant="rule" className="mx-auto mb-6 max-w-[140px]" />
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="name">Nome</Label>
                            <Input
                                id="name"
                                placeholder="Seu nome"
                                {...register('name')}
                            />
                            {errors.name && (
                                <p className="text-xs text-destructive">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                {...register('email')}
                            />
                            {errors.email && (
                                <p className="text-xs text-destructive">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Ao menos 8 caracteres"
                                {...register('password')}
                            />
                            {errors.password && (
                                <p className="text-xs text-destructive">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Como você quer participar?</Label>
                            <Controller
                                name="profileType"
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        {PROFILE_OPTIONS.map((option) => (
                                            <label
                                                key={option.value}
                                                className="flex cursor-pointer items-start gap-3 rounded-md border border-cinza-borda p-3 hover:bg-papel-profundo/60"
                                            >
                                                <RadioGroupItem value={option.value} className="mt-0.5" />
                                                <div>
                                                    <p className="font-ui text-sm font-medium text-tinta">
                                                        {option.label}
                                                    </p>
                                                    <p className="font-ui text-xs text-tinta-leve">
                                                        {option.description}
                                                    </p>
                                                </div>
                                            </label>
                                        ))}
                                    </RadioGroup>
                                )}
                            />
                            {errors.profileType && (
                                <p className="text-xs text-destructive">{errors.profileType.message}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-start gap-2">
                                <Controller
                                    name="acceptedPrivacyPolicy"
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox
                                            id="privacy"
                                            checked={field.value === true}
                                            onCheckedChange={(checked) => field.onChange(checked === true)}
                                            className="mt-0.5"
                                        />
                                    )}
                                />
                                <Label htmlFor="privacy" className="font-ui text-sm font-normal leading-snug text-tinta">
                                    Li e concordo com a{' '}
                                    <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
                                        <DialogTrigger asChild>
                                            <button
                                                type="button"
                                                className="text-bordo underline underline-offset-2 hover:no-underline"
                                            >
                                                política de privacidade do Códice
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Política de privacidade</DialogTitle>
                                                <DialogDescription>
                                                    Última atualização: em breve
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-3 font-body text-sm text-tinta">
                                                <p>
                                                    O Códice coleta apenas os dados necessários para o funcionamento
                                                    do marketplace: nome, e-mail e tipo de perfil. Suas informações
                                                    não são compartilhadas com terceiros para fins publicitários.
                                                </p>
                                                <p>
                                                    A política completa será publicada antes do lançamento público
                                                    da plataforma. Ao criar sua conta, você concorda com os termos
                                                    descritos acima.
                                                </p>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                    .
                                </Label>
                            </div>
                            {errors.acceptedPrivacyPolicy && (
                                <p className="text-xs text-destructive">{errors.acceptedPrivacyPolicy.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Criando conta...' : 'Criar conta'}
                        </Button>

                        <p className="text-center font-ui text-sm text-tinta-leve">
                            Já tem conta?{' '}
                            <Link to="/login" className="text-bordo hover:underline">
                                Entrar.
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
