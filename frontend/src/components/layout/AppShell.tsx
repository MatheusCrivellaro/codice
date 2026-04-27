import { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { MenuIcon, SearchIcon } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useUnreadCount } from '@/hooks/useUnreadCount'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Ornament } from '@/components/Ornament'
import { useTheme, type Theme } from '@/hooks/useTheme'

const THEME_OPTIONS: { value: Theme; label: string }[] = [
    { value: 'light', label: 'Claro' },
    { value: 'dark', label: 'Escuro' },
    { value: 'system', label: 'Sistema' },
]

function MobileThemeSection() {
    const { theme, setTheme } = useTheme()
    return (
        <div className="mt-4 border-t border-cinza-borda pt-4">
            <p className="mb-2 px-2 font-ui text-xs font-medium uppercase tracking-wider text-cinza-quente">
                Tema
            </p>
            <div className="flex gap-2 px-2">
                {THEME_OPTIONS.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => setTheme(opt.value)}
                        className={
                            theme === opt.value
                                ? 'flex-1 rounded-md bg-bordo py-2 font-ui text-xs text-papel'
                                : 'flex-1 rounded-md bg-papel py-2 font-ui text-xs text-tinta-leve hover:text-tinta'
                        }
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

export function AppShell() {
    const { isAuthenticated, user, logout } = useAuth()
    const { totalUnread } = useUnreadCount()
    const navigate = useNavigate()
    const [searchInput, setSearchInput] = useState('')
    const [mobileSearch, setMobileSearch] = useState('')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        const q = searchInput.trim()
        if (q) {
            navigate(`/buscar?q=${encodeURIComponent(q)}`)
        } else {
            navigate('/buscar')
        }
        setSearchInput('')
    }

    function handleMobileSearch(e: React.FormEvent) {
        e.preventDefault()
        const q = mobileSearch.trim()
        navigate(q ? `/buscar?q=${encodeURIComponent(q)}` : '/buscar')
        setMobileSearch('')
        setMobileMenuOpen(false)
    }

    function closeMenu() {
        setMobileMenuOpen(false)
    }

    function handleLogout() {
        logout()
        closeMenu()
    }

    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b border-cinza-borda bg-papel">
                <div className="container-codice flex h-16 items-center gap-6">
                    <Link
                        to="/"
                        className="shrink-0 font-display text-2xl tracking-tight text-tinta"
                    >
                        códice
                    </Link>

                    {/* Busca centrada — desktop */}
                    <form
                        onSubmit={handleSearch}
                        className="relative mx-auto hidden w-full max-w-sm md:block"
                    >
                        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-cinza-quente" />
                        <Input
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Buscar no acervo..."
                            className="h-9 pl-9 text-sm"
                        />
                    </form>

                    {/* Nav — desktop */}
                    <nav className="ml-auto hidden items-center gap-3 md:flex">
                        <ThemeToggle />
                        {isAuthenticated ? (
                            <>
                                {user?.profileType !== 'BUYER' && (
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link to="/vender">Anunciar</Link>
                                    </Button>
                                )}
                                <Link
                                    to="/conversas"
                                    className="relative font-ui text-sm text-tinta-leve hover:text-tinta"
                                >
                                    Conversas
                                    {totalUnread > 0 && (
                                        <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-bordo px-1 font-ui text-[10px] font-medium text-papel">
                                            {totalUnread}
                                        </span>
                                    )}
                                </Link>
                                {user?.isAdmin && (
                                    <Link
                                        to="/admin"
                                        className="font-ui text-sm text-tinta-leve hover:text-tinta"
                                    >
                                        Painel
                                    </Link>
                                )}
                                <Link
                                    to="/perfil"
                                    className="font-ui text-sm text-tinta-leve hover:text-tinta"
                                >
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

                    {/* Hambúrguer — mobile */}
                    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="ml-auto md:hidden"
                                aria-label="Abrir menu"
                            >
                                <MenuIcon className="size-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[280px]">
                            <SheetTitle className="sr-only">Menu</SheetTitle>

                            <form onSubmit={handleMobileSearch} className="relative">
                                <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-cinza-quente" />
                                <Input
                                    value={mobileSearch}
                                    onChange={(e) => setMobileSearch(e.target.value)}
                                    placeholder="Buscar no acervo..."
                                    className="h-10 pl-9"
                                    autoFocus={false}
                                />
                            </form>

                            <nav className="mt-2 flex flex-col">
                                <Link
                                    to="/buscar"
                                    onClick={closeMenu}
                                    className="rounded-md px-2 py-3 font-ui text-sm text-tinta hover:bg-papel-profundo"
                                >
                                    Acervo
                                </Link>
                                {isAuthenticated ? (
                                    <>
                                        {user?.profileType !== 'BUYER' && (
                                            <Link
                                                to="/vender"
                                                onClick={closeMenu}
                                                className="rounded-md px-2 py-3 font-ui text-sm text-tinta hover:bg-papel-profundo"
                                            >
                                                Anunciar
                                            </Link>
                                        )}
                                        <Link
                                            to="/conversas"
                                            onClick={closeMenu}
                                            className="flex items-center justify-between rounded-md px-2 py-3 font-ui text-sm text-tinta hover:bg-papel-profundo"
                                        >
                                            <span>Conversas</span>
                                            {totalUnread > 0 && (
                                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-bordo px-1.5 font-ui text-[10px] font-medium text-papel">
                                                    {totalUnread}
                                                </span>
                                            )}
                                        </Link>
                                        {user?.isAdmin && (
                                            <Link
                                                to="/admin"
                                                onClick={closeMenu}
                                                className="rounded-md px-2 py-3 font-ui text-sm text-tinta hover:bg-papel-profundo"
                                            >
                                                Painel
                                            </Link>
                                        )}
                                        <Link
                                            to="/perfil"
                                            onClick={closeMenu}
                                            className="rounded-md px-2 py-3 font-ui text-sm text-tinta hover:bg-papel-profundo"
                                        >
                                            Perfil
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            onClick={closeMenu}
                                            className="rounded-md px-2 py-3 font-ui text-sm text-tinta hover:bg-papel-profundo"
                                        >
                                            Entrar
                                        </Link>
                                        <Link
                                            to="/cadastro"
                                            onClick={closeMenu}
                                            className="rounded-md px-2 py-3 font-ui text-sm text-tinta hover:bg-papel-profundo"
                                        >
                                            Criar conta
                                        </Link>
                                    </>
                                )}
                            </nav>

                            <MobileThemeSection />

                            {isAuthenticated && (
                                <div className="mt-auto border-t border-cinza-borda pt-4">
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={handleLogout}
                                    >
                                        Sair
                                    </Button>
                                </div>
                            )}
                        </SheetContent>
                    </Sheet>
                </div>
            </header>

            <main className="flex-1">
                <Outlet />
            </main>

            <footer className="mt-auto bg-papel-profundo">
                <div className="container-codice py-12">
                    <Ornament variant="double-rule" className="mx-auto mb-8 max-w-[280px]" />
                    <p className="text-center font-ui text-[13px] text-cinza-quente">
                        Códice — livros usados com cuidado de bibliotecário.
                    </p>
                </div>
            </footer>
        </div>
    )
}
