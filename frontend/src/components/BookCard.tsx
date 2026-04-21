import { Link } from 'react-router-dom'
import { BookOpenIcon } from 'lucide-react'
import type { BookSearchResult } from '@/api/books'
import { formatPrice } from '@/lib/format'
import { AcademicAreaBadge } from '@/components/AcademicAreaBadge'

interface BookCardProps {
    book: BookSearchResult
}

export function BookCard({ book }: BookCardProps) {
    const hasMultipleOffers = book.activeListingsCount > 1

    return (
        <Link
            to={`/livro/${book.slug}`}
            className="group block rounded transition-shadow hover:shadow-sm"
        >
            <div className="aspect-[2/3] w-full overflow-hidden rounded bg-papel-profundo">
                {book.coverImageUrl ? (
                    <img
                        src={book.coverImageUrl}
                        alt={book.title}
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none'
                        }}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <BookOpenIcon className="size-8 text-cinza-quente/60" strokeWidth={1.25} />
                    </div>
                )}
            </div>
            <div className="mt-3">
                <h3 className="line-clamp-2 font-display text-base leading-snug font-normal text-tinta">
                    {book.title}
                </h3>
                <p className="mt-1 line-clamp-1 font-ui text-[13px] text-cinza-quente">
                    {book.authors}
                </p>
                <div className="mt-2 flex items-baseline gap-1.5">
                    {book.lowestPriceCents != null && (
                        <span className="font-display text-[15px] text-bordo">
                            {hasMultipleOffers
                                ? `a partir de ${formatPrice(book.lowestPriceCents)}`
                                : formatPrice(book.lowestPriceCents)}
                        </span>
                    )}
                </div>
                {book.academicAreas.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                        {book.academicAreas.slice(0, 2).map((area) => (
                            <AcademicAreaBadge key={area} area={area} />
                        ))}
                    </div>
                )}
            </div>
        </Link>
    )
}
