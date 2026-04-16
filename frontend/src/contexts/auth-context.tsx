import { createContext, useContext, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import * as authApi from '@/api/auth'
import { getToken, setToken, clearToken } from '@/lib/auth-storage'
import type { User, LoginInput, RegisterInput } from '@/api/auth'

interface AuthContextValue {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    login: (input: LoginInput) => Promise<void>
    register: (input: RegisterInput) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const { data: user = null, isLoading } = useQuery({
        queryKey: ['me'],
        queryFn: authApi.getMe,
        enabled: !!getToken(),
        retry: false,
        staleTime: 1000 * 60 * 5,
        meta: { skipAuthRedirect: true },
    })

    const login = useCallback(async (input: LoginInput) => {
        const response = await authApi.login(input)
        setToken(response.token)
        queryClient.setQueryData(['me'], response.user)
    }, [queryClient])

    const register = useCallback(async (input: RegisterInput) => {
        const response = await authApi.register(input)
        setToken(response.token)
        queryClient.setQueryData(['me'], response.user)
    }, [queryClient])

    const logout = useCallback(() => {
        clearToken()
        queryClient.setQueryData(['me'], null)
        queryClient.removeQueries({ queryKey: ['me'] })
        navigate('/login')
    }, [queryClient, navigate])

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isAuthenticated: !!user,
            login,
            register,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de AuthProvider')
    }
    return context
}
