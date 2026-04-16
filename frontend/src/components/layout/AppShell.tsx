import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'

export function AppShell() {
    const { isAuthenticated, user, logout } = useAuth()

    return (
        <div className="min-h-screen bg-[#F7F3EC]">
            <header className="border-b border-[#2A2420]/10">
                <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
                    <Link to="/" className="font-serif text-xl text-[#2A2420]">
                        códice
                    </Link>

                    <nav className="flex items-center gap-2">
                        {isAuthenticated ? (
                            <>
                                <Link to="/perfil" className="text-sm text-[#2A2420]/70 hover:text-[#2A2420]">
                                    {user?.name}
                                </Link>
                                <Button variant="ghost" size="sm" onClick={logout}>
                                    Sair
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link to="/login">Entrar</Link>
                                </Button>
                                <Button variant="outline" size="sm" asChild>
                                    <Link to="/cadastro">Criar conta</Link>
                                </Button>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    )
}
