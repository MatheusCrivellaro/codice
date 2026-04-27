const priceFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
})

export function formatPrice(cents: number): string {
    return priceFormatter.format(cents / 100)
}

const conditionLabels: Record<string, string> = {
    NOVO: 'Novo',
    COMO_NOVO: 'Como novo',
    MUITO_BOM: 'Muito bom',
    BOM: 'Bom',
    ACEITAVEL: 'Aceitável',
}

export function formatCondition(condition: string): string {
    return conditionLabels[condition] ?? condition
}

const statusLabels: Record<string, string> = {
    PENDING_REVIEW: 'Em revisão',
    ACTIVE: 'No acervo',
    PAUSED: 'Pausado',
    SOLD: 'Vendido',
}

export function formatListingStatus(status: string): string {
    return statusLabels[status] ?? status
}

const profileTypeLabels: Record<string, string> = {
    BUYER: 'Leitor',
    BOOKSTORE: 'Sebo',
    INDIVIDUAL_SELLER: 'Vendedor(a)',
}

export function formatProfileType(type: string): string {
    return profileTypeLabels[type] ?? type
}

export function formatRelativeDate(iso: string): string {
    const now = Date.now()
    const then = new Date(iso).getTime()
    const diffMs = now - then
    const diffMinutes = Math.floor(diffMs / 60_000)
    const diffHours = Math.floor(diffMs / 3_600_000)
    const diffDays = Math.floor(diffMs / 86_400_000)
    const diffWeeks = Math.floor(diffDays / 7)
    const diffMonths = Math.floor(diffDays / 30)

    if (diffMinutes < 1) return 'agora'
    if (diffMinutes < 60) return `há ${diffMinutes} min`
    if (diffHours < 24) return `há ${diffHours}h`
    if (diffDays === 1) return 'há 1 dia'
    if (diffDays < 7) return `há ${diffDays} dias`
    if (diffWeeks === 1) return 'há 1 semana'
    if (diffWeeks < 5) return `há ${diffWeeks} semanas`
    if (diffMonths === 1) return 'há 1 mês'
    return `há ${diffMonths} meses`
}

export function formatMessageTime(iso: string): string {
    const d = new Date(iso)
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function formatMessageDate(iso: string): string {
    const d = new Date(iso)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const target = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    const diffDays = Math.round((today.getTime() - target.getTime()) / 86_400_000)

    if (diffDays === 0) return 'Hoje'
    if (diffDays === 1) return 'Ontem'
    return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
}

/**
 * Normaliza valor de edicao para forma editorial: "42a ed." vira "42ª ed.",
 * "2nd ed" vira "2ª ed.", e descricoes adicionais ("revisada", "ampliada")
 * sao preservadas. Se o formato nao bater com o padrao reconhecido, devolve
 * o valor original para nao quebrar entradas livres do catalogo.
 */
export function formatEdition(value: string): string {
    const trimmed = value.trim()
    const match = trimmed.match(/^(\d+)\s*(?:[aªº]|nd|st|rd|th)?\s*(?:edition|edição|ed\.?)?\s*(.*)$/i)
    if (!match) return trimmed
    const number = match[1]
    const suffix = match[2].trim()
    const base = `${number}ª ed.`
    return suffix ? `${base} ${suffix}` : base
}

/**
 * Numero de catalogo curto derivado do UUID. Proxy editorial para a marca
 * de pagina de livro impresso ("No 0147"); nao representa numero sequencial
 * real — o backend so expoe UUID. Quatro digitos sao suficientes pra
 * legibilidade visual e estaveis para o mesmo livro entre sessoes.
 */
export function formatCatalogNumber(uuid: string): string {
    const hex = uuid.replace(/[^0-9a-f]/gi, '').slice(0, 8)
    if (hex.length === 0) return '0000'
    const num = parseInt(hex, 16) % 10000
    return num.toString().padStart(4, '0')
}

export function isSameDay(date1: string, date2: string): boolean {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    )
}
