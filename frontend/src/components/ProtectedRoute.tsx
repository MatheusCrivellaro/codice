import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'

export function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuth()
    const location = useLocation()

    if (isLoading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <p className="font-body text-sm text-tinta-leve">Folheando o acervo…</p>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />
    }

    return <Outlet />
}
