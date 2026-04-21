import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'
import { useEffect, useRef } from 'react'

export function ProtectedAdminRoute() {
    const { isAuthenticated, isLoading, user } = useAuth()
    const location = useLocation()
    const toastShown = useRef(false)

    const shouldRedirectHome = isAuthenticated && !user?.isAdmin

    useEffect(() => {
        if (shouldRedirectHome && !toastShown.current) {
            toastShown.current = true
            toast.error('Acesso restrito')
        }
    }, [shouldRedirectHome])

    if (isLoading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <p className="text-sm text-tinta-leve">Carregando...</p>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />
    }

    if (!user?.isAdmin) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}
