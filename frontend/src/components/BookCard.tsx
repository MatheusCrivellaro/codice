import { useState } from 'react'
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
    const [coverFailed, setCoverFailed] = useState(false)

    return (
        <Link
            to={`/livro/${book.slug}`}
            className="group block border-l-2 border-bordo/25 pl-3 transition-colors duration-[200ms] ease-out hover:border-bordo/55 dark:border-bordo/15 dark:hover:border-bordo/35"
        >
            <div className="capa-livro aspect-[2/3] w-full overflow-hidden rounded-sm bg-papel-profundo transition-[transform,box-shadow] duration-[220ms] ease-out group-hover:-translate-y-[2px] dark:bg-moldura-capa">
                {book.coverImageUrl ? (
                    coverFailed ? (
                        <div className="flex h-full flex-col items-center justify-center px-4 py-6 text-center">
                            <span className="type-display line-clamp-5 text-[15px] leading-tight text-tinta">
                                {book.title}
                            </span>
                        </div>
                    ) : (
                        <img
                            src={book.coverImageUrl}
                            alt={book.title}
                            className="h-full w-full object-cover"
                            onError={() => setCoverFailed(true)}
                        />
                    )
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
                <p className="type-uiserif mt-1 line-clamp-1 text-[13px] text-cinza-quente">
                    {book.authors}
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                    {book.lowestPriceCents != null && (
                        <span className="inline-flex items-baseline gap-1.5 text-bordo">
                            {hasMultipleOffers && (
                                <span className="type-uiserif text-[11px] tracking-[0.08em] text-cinza-quente uppercase">
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
