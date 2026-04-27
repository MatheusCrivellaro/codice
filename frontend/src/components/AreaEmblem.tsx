import type { ReactElement } from 'react'
import { cn } from '@/lib/utils'

type AreaKey =
    | 'literatura'
    | 'filosofia'
    | 'sociologia'
    | 'direito'
    | 'historia'
    | 'letras'
    | 'psicologia'
    | 'educacao'
    | 'default'

interface AreaEmblemProps {
    area: string
    size?: number
    className?: string
}

/**
 * Brasao geometrico em filete representando uma area academica.
 * Inspirado em marcas de impressor renascentistas em miniatura.
 * Cor herda do contexto via currentColor — tipicamente bordo/dourado
 * via token quando dentro de um Badge ou contexto editorial.
 */
export function AreaEmblem({ area, size = 16, className }: AreaEmblemProps) {
    const key = areaToKey(area)
    return (
        <svg
            viewBox="0 0 16 16"
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinejoin="miter"
            aria-hidden="true"
            className={cn('shrink-0', className)}
        >
            {EMBLEMS[key]}
        </svg>
    )
}

function areaToKey(area: string): AreaKey {
    const normalized = area
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
    if (
        normalized.startsWith('literatura') ||
        normalized.startsWith('classico') ||
        normalized.startsWith('naturalismo') ||
        normalized.startsWith('romantismo') ||
        normalized.startsWith('modernismo') ||
        normalized.startsWith('realismo') ||
        normalized.startsWith('poesia') ||
        normalized.startsWith('ficcao')
    ) return 'literatura'
    if (normalized.startsWith('filosofia')) return 'filosofia'
    if (
        normalized.startsWith('sociologia') ||
        normalized.startsWith('antropologia') ||
        normalized.startsWith('ciencias sociais')
    ) return 'sociologia'
    if (normalized.startsWith('direito')) return 'direito'
    if (normalized.startsWith('historia')) return 'historia'
    if (
        normalized.startsWith('letras') ||
        normalized.startsWith('critica') ||
        normalized.startsWith('linguistica')
    ) return 'letras'
    if (normalized.startsWith('psicologia') || normalized.startsWith('psicanalise')) return 'psicologia'
    if (normalized.startsWith('educacao') || normalized.startsWith('pedagogia')) return 'educacao'
    return 'default'
}

const EMBLEMS: Record<AreaKey, ReactElement> = {
    // Literatura Brasileira: circulo com ponto central
    literatura: (
        <>
            <circle cx="8" cy="8" r="6" />
            <circle cx="8" cy="8" r="1.1" fill="currentColor" stroke="none" />
        </>
    ),
    // Filosofia: triangulo com vertice pra cima, oco
    filosofia: <path d="M8 2 L14 13 L2 13 Z" />,
    // Sociologia e Antropologia: hexagono regular vertical
    sociologia: <path d="M8 2 L13.5 5 L13.5 11 L8 14 L2.5 11 L2.5 5 Z" />,
    // Direito: losango vertical alongado
    direito: <path d="M8 1.5 L13.5 8 L8 14.5 L2.5 8 Z" />,
    // Historia: circulo com filete horizontal cortando (linha do tempo)
    historia: (
        <>
            <circle cx="8" cy="8" r="6" />
            <line x1="2" y1="8" x2="14" y2="8" />
        </>
    ),
    // Letras e Critica Literaria: dois circulos concentricos
    letras: (
        <>
            <circle cx="8" cy="8" r="6" />
            <circle cx="8" cy="8" r="3" />
        </>
    ),
    // Psicologia e Psicanalise: espiral aproximada (meias-voltas crescentes)
    psicologia: (
        <path
            d="M 7 8 A 1 1 0 0 1 9 8 A 2 2 0 0 1 5 8 A 3 3 0 0 1 11 8"
            strokeLinecap="round"
        />
    ),
    // Educacao e Pedagogia: quadrado rotacionado 45° com ponto central
    educacao: (
        <>
            <path d="M8 3 L13 8 L8 13 L3 8 Z" />
            <circle cx="8" cy="8" r="1.1" fill="currentColor" stroke="none" />
        </>
    ),
    // Fallback: pequeno asterisco editorial
    default: (
        <>
            <line x1="8" y1="3" x2="8" y2="13" />
            <line x1="3" y1="8" x2="13" y2="8" />
        </>
    ),
}
