import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'

interface AcademicAreaBadgeProps {
    area: string
    clickable?: boolean
}

export function AcademicAreaBadge({ area, clickable = false }: AcademicAreaBadgeProps) {
    if (clickable) {
        return (
            <Badge asChild variant="academic-area" className="transition-colors hover:border-bordo/30 hover:text-bordo">
                <Link to={`/buscar?area=${encodeURIComponent(area)}`}>{area}</Link>
            </Badge>
        )
    }

    return <Badge variant="academic-area">{area}</Badge>
}
