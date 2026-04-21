import { useEffect, useState, useCallback } from 'react'

export type Theme = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'codice.theme'

function readStoredTheme(): Theme {
    if (typeof window === 'undefined') return 'system'
    const value = window.localStorage.getItem(STORAGE_KEY)
    if (value === 'light' || value === 'dark' || value === 'system') return value
    return 'system'
}

function systemPrefersDark(): boolean {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyClass(resolved: ResolvedTheme) {
    const root = document.documentElement
    if (resolved === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
}

export function useTheme() {
    const [theme, setThemeState] = useState<Theme>(() => readStoredTheme())
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
        const stored = readStoredTheme()
        if (stored === 'system') return systemPrefersDark() ? 'dark' : 'light'
        return stored
    })

    useEffect(() => {
        const resolved: ResolvedTheme =
            theme === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : theme
        setResolvedTheme(resolved)
        applyClass(resolved)
    }, [theme])

    useEffect(() => {
        if (theme !== 'system') return
        const mql = window.matchMedia('(prefers-color-scheme: dark)')
        const handler = (e: MediaQueryListEvent) => {
            const resolved: ResolvedTheme = e.matches ? 'dark' : 'light'
            setResolvedTheme(resolved)
            applyClass(resolved)
        }
        mql.addEventListener('change', handler)
        return () => mql.removeEventListener('change', handler)
    }, [theme])

    const setTheme = useCallback((next: Theme) => {
        window.localStorage.setItem(STORAGE_KEY, next)
        setThemeState(next)
    }, [])

    return { theme, setTheme, resolvedTheme }
}
