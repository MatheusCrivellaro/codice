import { getToken, clearToken } from '@/lib/auth-storage'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const token = getToken()
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...init?.headers as Record<string, string>,
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers,
    })

    if (response.status === 401 && token) {
        // Token expirado ou invalido — limpa e redireciona
        clearToken()
        window.location.href = '/login'
        throw new Error('Sessão expirada')
    }

    if (!response.ok) {
        const error = new Error(`API error: ${response.status}`)
        ;(error as ApiError).status = response.status
        throw error
    }

    return response.json()
}

export interface ApiError extends Error {
    status: number
}
