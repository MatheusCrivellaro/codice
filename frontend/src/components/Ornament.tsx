import { cn } from '@/lib/utils'

type OrnamentVariant = 'rule' | 'double-rule' | 'fleuron'

interface OrnamentProps {
    variant?: OrnamentVariant
    className?: string
}

export function Ornament({ variant = 'rule', className }: OrnamentProps) {
    if (variant === 'rule') {
        return (
            <div
                role="separator"
                aria-hidden="true"
                className={cn('h-px w-full bg-bordo/65', className)}
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
                <div className="h-px w-full bg-bordo/65" />
                <div className="mt-[3px] h-px w-full bg-bordo/65" />
            </div>
        )
    }

    return (
        <div
            role="separator"
            aria-hidden="true"
            className={cn('flex w-full items-center gap-4', className)}
        >
            <div className="h-px flex-1 bg-bordo/65" />
            <svg
                viewBox="0 0 14 14"
                width="13"
                height="13"
                fill="none"
                className="shrink-0 text-bordo/70"
            >
                <path
                    d="M7 1.2 L12.8 7 L7 12.8 L1.2 7 Z"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinejoin="miter"
                />
            </svg>
            <div className="h-px flex-1 bg-bordo/65" />
        </div>
    )
}
