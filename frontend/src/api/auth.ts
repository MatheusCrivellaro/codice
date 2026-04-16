import { apiFetch } from '@/api/client'

export type ProfileType = 'BUYER' | 'BOOKSTORE' | 'INDIVIDUAL_SELLER'

export interface User {
    id: string
    email: string
    name: string
    profileType: ProfileType
}

export interface AuthResponse {
    token: string
    tokenType: string
    expiresInSeconds: number
    user: User
}

export interface RegisterInput {
    email: string
    password: string
    name: string
    profileType: ProfileType
    acceptedPrivacyPolicy: boolean
}

export interface LoginInput {
    email: string
    password: string
}

export function register(input: RegisterInput): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(input),
    })
}

export function login(input: LoginInput): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(input),
    })
}

export function getMe(): Promise<User> {
    return apiFetch<User>('/me')
}
