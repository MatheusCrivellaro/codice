import { formatCondition } from '@/lib/format'
import { Badge, type badgeVariants } from '@/components/ui/badge'
import type { VariantProps } from 'class-variance-authority'

interface ConditionBadgeProps {
    condition: string
}

type BadgeVariant = VariantProps<typeof badgeVariants>['variant']

const conditionVariant: Record<string, BadgeVariant> = {
    NOVO: 'condition-new',
    COMO_NOVO: 'condition-new',
    MUITO_BOM: 'condition-good',
    BOM: 'condition-good',
    ACEITAVEL: 'condition-acceptable',
}

export function ConditionBadge({ condition }: ConditionBadgeProps) {
    const variant = conditionVariant[condition] ?? 'secondary'
    return <Badge variant={variant}>{formatCondition(condition)}</Badge>
}
