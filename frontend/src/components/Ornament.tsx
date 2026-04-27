import { cn } from '@/lib/utils'

type OrnamentVariant = 'rule' | 'double-rule' | 'fleuron' | 'asterism' | 'dinkus'
type OrnamentTone = 'bordo' | 'borda'

interface OrnamentProps {
    variant?: OrnamentVariant
    /** bordo (default): destaque editorial. borda: divisor neutro de UI. */
    tone?: OrnamentTone
    className?: string
}

// Dark mode usa opacidade reduzida — em fundo escuro, qualquer cor
// saturada se destaca mais que em fundo claro. Brief V03 §3.1.
const LINE_TONE: Record<OrnamentTone, string> = {
    bordo: 'bg-bordo/65 dark:bg-bordo/45',
    borda: 'bg-cinza-borda/60 dark:bg-cinza-borda/40',
}

const FLEURON_TONE: Record<OrnamentTone, string> = {
    bordo: 'text-bordo/70 dark:text-bordo/55',
    borda: 'text-cinza-borda/70 dark:text-cinza-borda/45',
}

// Losango unitario reutilizado em fleuron, asterism e dinkus. Stroke 1,
// fill none, miter — mesma familia visual em qualquer escala.
function Lozenge({ size = 8 }: { size?: number }) {
    const half = size / 2
    const inset = size * 0.1
    return (
        <svg
            viewBox={`0 0 ${size} ${size}`}
            width={size}
            height={size}
            fill="none"
            className="shrink-0"
        >
            <path
                d={`M${half} ${inset} L${size - inset} ${half} L${half} ${size - inset} L${inset} ${half} Z`}
                stroke="currentColor"
                strokeWidth="1"
                strokeLinejoin="miter"
            />
        </svg>
    )
}

export function Ornament({ variant = 'rule', tone = 'bordo', className }: OrnamentProps) {
    const line = LINE_TONE[tone]

    if (variant === 'rule') {
        return (
            <div
                role="separator"
                aria-hidden="true"
                className={cn('h-px w-full', line, className)}
            />
        )
    }

    if (variant === 'double-rule') {
        return (
            <div
                role="separator"
                aria-hidden="true"
                className={cn('w-full', className)}
            >
                <div className={cn('h-px w-full', line)} />
                <div className={cn('mt-[3px] h-px w-full', line)} />
            </div>
        )
    }

    if (variant === 'fleuron') {
        return (
            <div
                role="separator"
                aria-hidden="true"
                className={cn('flex w-full items-center gap-4', className)}
            >
                <div className={cn('h-px flex-1', line)} />
                <span className={cn(FLEURON_TONE[tone])}>
                    <Lozenge size={13} />
                </span>
                <div className={cn('h-px flex-1', line)} />
            </div>
        )
    }

    if (variant === 'asterism') {
        // Tres losangos em arranjo triangular (apex superior). Tradicional
        // marca de fim-de-capitulo: pausa narrativa formal, sem linhas.
        return (
            <div
                role="separator"
                aria-hidden="true"
                className={cn('flex w-full justify-center', className)}
            >
                <span className={cn('inline-flex flex-col items-center gap-1', FLEURON_TONE[tone])}>
                    <Lozenge size={7} />
                    <span className="inline-flex gap-3">
                        <Lozenge size={7} />
                        <Lozenge size={7} />
                    </span>
                </span>
            </div>
        )
    }

    // dinkus: tres losangos em linha horizontal centralizada — pausa
    // narrativa mais leve, equivalente tipografico de "* * *".
    return (
        <div
            role="separator"
            aria-hidden="true"
            className={cn('flex w-full items-center justify-center gap-3', className)}
        >
            <span className={cn(FLEURON_TONE[tone])}>
                <Lozenge size={7} />
            </span>
            <span className={cn(FLEURON_TONE[tone])}>
                <Lozenge size={7} />
            </span>
            <span className={cn(FLEURON_TONE[tone])}>
                <Lozenge size={7} />
            </span>
        </div>
    )
}
