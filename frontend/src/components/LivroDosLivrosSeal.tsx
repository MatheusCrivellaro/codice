import { cn } from '@/lib/utils'

interface LivroDosLivrosSealProps {
    size?: number
    className?: string
}

/**
 * Selo placeholder do Livro dos Livros: silhueta minima de livro em pe,
 * com lombada lateral esquerda sugerida por linha vertical. Geometria
 * pura, sem rosto, sem detalhes de capa, sem bracos — e signo de livro,
 * nao ilustracao do mascote.
 *
 * Quando a ilustracao final do mascote chegar (brief
 * docs/Codice_Brief_Livro_dos_Livros.pdf), este componente sera
 * substituido sem retrabalho nas chamadas. Cor herda do contexto via
 * currentColor — tipicamente bordo (light) / dourado (dark).
 */
export function LivroDosLivrosSeal({ size = 120, className }: LivroDosLivrosSealProps) {
    return (
        <svg
            viewBox="0 0 120 120"
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="miter"
            aria-hidden="true"
            className={cn('text-bordo/70 dark:text-bordo/55', className)}
        >
            <rect x="38" y="20" width="44" height="80" />
            <line x1="44" y1="20" x2="44" y2="100" />
        </svg>
    )
}
