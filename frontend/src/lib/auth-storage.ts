// TODO: localStorage é vulnerável a XSS. Migrar para cookie httpOnly
// quando o backend suportar set-cookie no login/register.
const TOKEN_KEY = 'codice.auth.token'

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
    localStorage.removeItem(TOKEN_KEY)
}
