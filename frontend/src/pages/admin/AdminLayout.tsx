import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { usePageTitle } from '@/hooks/usePageTitle'

const navItems = [
    { to: '/admin/moderacao', label: 'Fila de moderação' },
    { to: '/admin/listings', label: 'Todas as ofertas' },
]

export function AdminLayout() {
    usePageTitle('Administração')

    return (
        <div className="container-codice py-8">
            <h1 className="mb-8 font-display text-3xl text-tinta">Painel administrativo</h1>

            <div className="flex flex-col gap-6 md:flex-row md:gap-8">
                <nav className="flex shrink-0 flex-col gap-1 rounded-lg bg-papel-profundo p-3 md:w-[200px] md:self-start md:p-4">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                cn(
                                    'rounded-md px-3 py-2 font-ui text-sm transition-colors',
                                    isActive
                                        ? 'bg-bordo text-papel'
                                        : 'text-tinta-leve hover:bg-papel hover:text-tinta'
                                )
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="min-w-0 flex-1">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
