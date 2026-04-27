import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/auth-context'
import { loginSchema, type LoginFormData } from '@/lib/schemas/auth'
import type { ApiError } from '@/api/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Ornament } from '@/components/Ornament'
import { usePageTitle } from '@/hooks/usePageTitle'

export function LoginPage() {
    usePageTitle('Entrar')
    const { login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const from = (location.state as { from?: string })?.from ?? '/'

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    })

    async function onSubmit(data: LoginFormData) {
        try {
            await login(data)
            navigate(from, { replace: true })
        } catch (err) {
            const status = (err as ApiError).status
            if (status === 401) {
                toast.error('E-mail ou senha incorretos.')
            } else {
                toast.error('Erro ao entrar. Tente novamente.')
            }
        }
    }

    return (
        <div className="container-codice flex min-h-[60vh] items-center justify-center py-12">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="font-display text-2xl text-tinta">
                        Entrar no acervo
                    </CardTitle>
                    <CardDescription className="font-body">
                        Acesse sua conta para explorar o acervo.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Ornament variant="rule" className="mx-auto mb-6 max-w-[140px]" />
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                                placeholder="Sua senha"
                                {...register('password')}
                            />
                            {errors.password && (
                                <p className="text-xs text-destructive">{errors.password.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Entrando...' : 'Entrar'}
                        </Button>

                        <p className="text-center font-ui text-sm text-tinta-leve">
                            Não tem conta?{' '}
                            <Link to="/cadastro" className="text-bordo hover:underline">
                                Criar uma.
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
