import { cn } from '@/lib/utils'

type PriceSize = 'sm' | 'md' | 'lg' | 'xl'

interface PriceProps {
    cents: number
    className?: string
    size?: PriceSize
    /** Marcador editorial sutil (asterisco fino) antes do valor. Reservado para
        marcar a oferta mais barata na BookPage; nao usar como badge generico. */
    asterisk?: boolean
}

const SIZE_CLASS: Record<PriceSize, string> = {
    sm: 'text-[15px]',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-2xl',
}

// Eixo optico do Fraunces: preco grande (xl) usa opsz 144 (display);
// preços pequenos usam opsz 14 (UI). Brief V03 §3.3.
const SIZE_AXIS: Record<PriceSize, string> = {
    sm: 'type-uiserif',
    md: 'type-uiserif',
    lg: 'type-uiserif',
    xl: 'type-display',
}

export function Price({ cents, className, size, asterisk }: PriceProps) {
    const { currency, number } = formatPriceParts(cents)
    const axis = size ? SIZE_AXIS[size] : 'type-uiserif'
    return (
        <span
            className={cn(
                'inline-flex items-baseline',
                axis,
                size && SIZE_CLASS[size],
                className
            )}
        >
            {asterisk && (
                <span
                    aria-hidden="true"
                    className="mr-[0.25em] text-[0.7em] leading-none opacity-75"
                >
                    ∗
                </span>
            )}
            <span className="type-uiserif num-lining mr-[0.18em] text-[0.65em] tracking-[0.05em]">
                {currency}
            </span>
            <span className="num-lining">{number}</span>
        </span>
    )
}

function formatPriceParts(cents: number): { currency: string; number: string } {
    const value = cents / 100
    const parts = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).formatToParts(value)

    let currency = 'R$'
    const numberParts: string[] = []
    for (const part of parts) {
        if (part.type === 'currency') {
            currency = part.value
        } else if (part.type === 'literal') {
            continue
        } else {
            numberParts.push(part.value)
        }
    }
    return { currency, number: numberParts.join('') }
}
