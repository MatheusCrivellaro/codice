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

export function Price({ cents, className, size, asterisk }: PriceProps) {
    const { currency, number } = formatPriceParts(cents)
    return (
        <span
            className={cn(
                'inline-flex items-baseline font-display font-normal',
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
            <span className="mr-[0.18em] text-[0.65em] font-normal tracking-[0.05em]">
                {currency}
            </span>
            <span className="tabular-nums">{number}</span>
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
