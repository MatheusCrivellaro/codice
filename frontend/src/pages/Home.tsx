import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { H2 } from '@/components/ui/typography'
import { BookCard } from '@/components/BookCard'
import { AcademicAreaBadge } from '@/components/AcademicAreaBadge'
import { Ornament } from '@/components/Ornament'
import { useBookSearch } from '@/hooks/useBookSearch'
import { useAcademicAreas } from '@/hooks/useAcademicAreas'
import { usePageTitle } from '@/hooks/usePageTitle'

export function Home() {
    usePageTitle()
    const navigate = useNavigate()
    const [searchInput, setSearchInput] = useState('')
    const { data: booksData, isLoading: booksLoading } = useBookSearch({ sort: 'newest', size: 8 })
    const { data: areas = [] } = useAcademicAreas()

    function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        const q = searchInput.trim()
        if (q) {
            navigate(`/buscar?q=${encodeURIComponent(q)}`)
        } else {
            navigate('/buscar')
        }
    }

    return (
        <div>
            {/* Hero */}
            <section className="container-codice flex flex-col items-center px-4 pt-20 pb-16">
                <h1 className="brand-codice text-4xl text-tinta md:text-5xl">códice</h1>
                <p className="mt-3 text-center font-body text-lg text-cinza-quente">
                    Livros usados com cuidado de bibliotecário.
                </p>

                <form onSubmit={handleSearch} className="relative mt-10 w-full max-w-[480px]">
                    <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-cinza-quente" />
                    <Input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Buscar por título, autor ou tema…"
                        className="h-12 pr-24 pl-11 text-base"
                    />
                    <Button
                        type="submit"
                        size="sm"
                        className="absolute top-1/2 right-1.5 -translate-y-1/2"
                    >
                        Buscar
                    </Button>
                </form>

                <p className="mt-4 font-ui text-[13px] tracking-wide text-cinza-quente">
                    Acadêmicos, clássicos e edições raras
                </p>
            </section>

            <div className="container-codice">
                <Ornament variant="fleuron" className="mx-auto max-w-[420px]" />
            </div>

            {/* Curadoria */}
            <section className="container-codice pt-10 pb-12">
                <div className="mb-6 flex items-end justify-between">
                    <H2 className="text-2xl md:text-[28px]">No acervo agora</H2>
                </div>

                {booksLoading ? (
                    <div className="grid-acervo">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="aspect-[2/3] w-full rounded" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : booksData && booksData.content.length > 0 ? (
                    <div className="grid-acervo">
                        {booksData.content.map((book) => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                ) : (
                    <p className="py-8 text-center font-body text-sm text-tinta-leve">
                        O acervo está sendo preparado. Volte em breve.
                    </p>
                )}

                <div className="mt-6 flex justify-end">
                    <Link
                        to="/buscar"
                        className="font-ui text-sm text-bordo hover:underline"
                    >
                        Ver todo o acervo →
                    </Link>
                </div>
            </section>

            {/* Áreas */}
            {areas.length > 0 && (
                <section className="container-codice pt-4 pb-16">
                    <Ornament variant="rule" className="mb-10" />
                    <H2 className="mb-6 text-2xl md:text-[28px]">Áreas de destaque</H2>
                    <div className="flex flex-wrap gap-2">
                        {areas.map((area) => (
                            <AcademicAreaBadge key={area} area={area} clickable />
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}
