import { Link } from 'react-router-dom'
import { BookOpenIcon } from 'lucide-react'
import type { BookSearchResult } from '@/api/books'
import { AcademicAreaBadge } from '@/components/AcademicAreaBadge'
import { Price } from '@/components/Price'

interface BookCardProps {
    book: BookSearchResult
}

export function BookCard({ book }: BookCardProps) {
    const hasMultipleOffers = book.activeListingsCount > 1

    return (
        <Link
            to={`/livro/${book.slug}`}
            className="group block border-l-2 border-bordo/25 pl-3 transition-[transform,box-shadow] duration-[180ms] ease-out hover:translate-x-[2px] hover:shadow-[0_2px_4px_rgba(0,0,0,0.08)] dark:border-bordo/15 dark:hover:shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
        >
            <div className="aspect-[2/3] w-full overflow-hidden rounded-sm bg-papel-profundo">
                {book.coverImageUrl ? (
                    <img
                        src={book.coverImageUrl}
                        alt={book.title}
                        className="h-full w-full object-cover"
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
                        <span className="inline-flex items-baseline gap-1 text-bordo">
                            {hasMultipleOffers && (
                                <span className="font-ui text-[12px] text-cinza-quente">
                                    a partir de
                                </span>
                            )}
                            <Price cents={book.lowestPriceCents} size="sm" />
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
