import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { AreaEmblem } from '@/components/AreaEmblem'

interface AcademicAreaBadgeProps {
    area: string
    clickable?: boolean
}

export function AcademicAreaBadge({ area, clickable = false }: AcademicAreaBadgeProps) {
    if (clickable) {
        return (
            <Badge asChild variant="academic-area" className="transition-colors hover:border-bordo/30 hover:text-bordo">
                <Link to={`/buscar?area=${encodeURIComponent(area)}`}>
                    <AreaEmblem area={area} size={12} className="text-bordo/70" />
                    {area}
                </Link>
            </Badge>
        )
    }

    return (
        <Badge variant="academic-area">
            <AreaEmblem area={area} size={12} className="text-bordo/70" />
            {area}
        </Badge>
    )
}
