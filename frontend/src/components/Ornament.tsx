import { cn } from '@/lib/utils'

type OrnamentVariant = 'rule' | 'double-rule' | 'fleuron'
type OrnamentTone = 'bordo' | 'borda'

interface OrnamentProps {
    variant?: OrnamentVariant
    /** bordo (default): destaque editorial. borda: divisor neutro de UI. */
    tone?: OrnamentTone
    className?: string
}

const LINE_TONE: Record<OrnamentTone, string> = {
    bordo: 'bg-bordo/65',
    borda: 'bg-cinza-borda/60',
}

const FLEURON_TONE: Record<OrnamentTone, string> = {
    bordo: 'text-bordo/70',
    borda: 'text-cinza-borda/70',
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

    return (
        <div
            role="separator"
            aria-hidden="true"
            className={cn('flex w-full items-center gap-4', className)}
        >
            <div className={cn('h-px flex-1', line)} />
            <svg
                viewBox="0 0 14 14"
                width="13"
                height="13"
                fill="none"
                className={cn('shrink-0', FLEURON_TONE[tone])}
            >
                <path
                    d="M7 1.2 L12.8 7 L7 12.8 L1.2 7 Z"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinejoin="miter"
                />
            </svg>
            <div className={cn('h-px flex-1', line)} />
        </div>
    )
}
