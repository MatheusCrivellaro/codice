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

const PROFILE_OPTIONS = [
    {
        value: 'BUYER' as const,
        label: 'Comprador(a)',
        description: 'Quero levar livros pra casa',
    },
    {
        value: 'BOOKSTORE' as const,
        label: 'Sebo',
        description: 'Sou de um sebo',
    },
    {
        value: 'INDIVIDUAL_SELLER' as const,
        label: 'Vendedor(a)',
        description: 'Vou anunciar livros pessoalmente',
    },
]

export function RegisterPage() {
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
                toast.error('Este e-mail já está cadastrado.')
            } else {
                toast.error('Erro ao criar conta. Tente novamente.')
            }
        }
    }

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4 py-8">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="font-serif text-xl text-[#2A2420]">
                        Criar uma conta
                    </CardTitle>
                    <CardDescription>
                        Junte-se ao acervo. Escolha como deseja participar.
                    </CardDescription>
                </CardHeader>
                <CardContent>
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
                                placeholder="No mínimo 8 caracteres"
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
                                                className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#2A2420]/10 p-3 hover:bg-[#EFE8DA]/50"
                                            >
                                                <RadioGroupItem value={option.value} className="mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-[#2A2420]">
                                                        {option.label}
                                                    </p>
                                                    <p className="text-xs text-[#2A2420]/60">
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
                                <Label htmlFor="privacy" className="text-sm font-normal leading-snug text-[#2A2420]/80">
                                    Li e concordo com a{' '}
                                    <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
                                        <DialogTrigger asChild>
                                            <button
                                                type="button"
                                                className="text-[#7A2E2E] underline underline-offset-2 hover:no-underline"
                                            >
                                                política de privacidade
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Política de privacidade</DialogTitle>
                                                <DialogDescription>
                                                    Última atualização: em breve
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-3 text-sm text-[#2A2420]/80">
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
                                    {' '}do Códice.
                                </Label>
                            </div>
                            {errors.acceptedPrivacyPolicy && (
                                <p className="text-xs text-destructive">{errors.acceptedPrivacyPolicy.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Criando conta...' : 'Criar conta'}
                        </Button>

                        <p className="text-center text-sm text-[#2A2420]/60">
                            Já tem conta?{' '}
                            <Link to="/login" className="text-[#7A2E2E] hover:underline">
                                Entrar.
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
