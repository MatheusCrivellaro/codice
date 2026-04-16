import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useHealth } from '@/hooks/useHealth'
import { useAuth } from '@/contexts/auth-context'

export function Home() {
    const { data, isLoading: healthLoading } = useHealth()
    const { isAuthenticated, user } = useAuth()

    const isOnline = data?.status === 'UP'
    const dbOnline = data?.components?.db?.status === 'UP'

    return (
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
            <Card className="w-96">
                <CardHeader>
                    <CardTitle className="text-[#2A2420] font-serif text-2xl">
                        códice
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-[#2A2420]/70 text-sm">
                        Marketplace de livros usados com curadoria bibliófila.
                    </p>

                    {isAuthenticated && user ? (
                        <div className="space-y-3">
                            <p className="text-sm text-[#2A2420]">
                                Bem-vindo(a), {user.name}.
                            </p>
                            <Button variant="outline" className="w-full" asChild>
                                <Link to="/perfil">Ver meu perfil</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="outline" className="flex-1" asChild>
                                <Link to="/login">Entrar</Link>
                            </Button>
                            <Button className="flex-1" asChild>
                                <Link to="/cadastro">Criar conta</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="mt-6 flex items-center gap-3 text-xs text-[#2A2420]/40">
                <div className="flex items-center gap-1.5">
                    <span
                        className={`inline-block h-1.5 w-1.5 rounded-full ${
                            healthLoading
                                ? 'bg-yellow-500'
                                : isOnline
                                    ? 'bg-emerald-500'
                                    : 'bg-red-500'
                        }`}
                    />
                    <span>API: {healthLoading ? 'verificando...' : isOnline ? 'online' : 'offline'}</span>
                </div>

                {data && (
                    <div className="flex items-center gap-1.5">
                        <span
                            className={`inline-block h-1.5 w-1.5 rounded-full ${
                                dbOnline ? 'bg-emerald-500' : 'bg-red-500'
                            }`}
                        />
                        <span>DB: {dbOnline ? 'online' : 'offline'}</span>
                    </div>
                )}
            </div>
        </div>
    )
}
