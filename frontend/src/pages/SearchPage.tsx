import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontalIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { BookCard } from '@/components/BookCard'
import { Ornament } from '@/components/Ornament'
import { AreaEmblem } from '@/components/AreaEmblem'
import { LivroDosLivrosSeal } from '@/components/LivroDosLivrosSeal'
import { useBookSearch } from '@/hooks/useBookSearch'
import { useAcademicAreas } from '@/hooks/useAcademicAreas'
import { useActiveStates } from '@/hooks/useActiveStates'
import { usePageTitle } from '@/hooks/usePageTitle'
import { formatCondition } from '@/lib/format'
import type { SearchParams } from '@/api/books'

const CONDITIONS = ['ACEITAVEL', 'BOM', 'MUITO_BOM', 'COMO_NOVO', 'NOVO'] as const

const SORT_OPTIONS = [
    { value: 'relevance', label: 'Relevancia' },
    { value: 'price_asc', label: 'Menor preco' },
    { value: 'price_desc', label: 'Maior preco' },
    { value: 'newest', label: 'Mais recentes' },
]

const FILTER_LABEL = 'mb-3 font-ui text-xs font-medium uppercase tracking-wider text-cinza-quente'

export function SearchPage() {
    usePageTitle('acervo')
    const [searchParams, setSearchParams] = useSearchParams()
    const [searchInput, setSearchInput] = useState(searchParams.get('q') ?? '')
    const [showAllAreas, setShowAllAreas] = useState(false)
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const [slideDirection, setSlideDirection] = useState<'forward' | 'backward'>('forward')

    const q = searchParams.get('q') ?? undefined
    const area = searchParams.get('area') ?? undefined
    const condition = searchParams.get('condition') ?? undefined
    const priceMinStr = searchParams.get('priceMin')
    const priceMaxStr = searchParams.get('priceMax')
    const state = searchParams.get('state') ?? undefined
    const sort = searchParams.get('sort') ?? undefined
    const pageStr = searchParams.get('page')
    const page = pageStr ? parseInt(pageStr, 10) : 0

    const priceMin = priceMinStr ? parseInt(priceMinStr, 10) * 100 : undefined
    const priceMax = priceMaxStr ? parseInt(priceMaxStr, 10) * 100 : undefined

    const params: SearchParams = { q, area, condition, priceMin, priceMax, state, sort, page, size: 20 }

    const { data, isLoading, isError } = useBookSearch(params)
    const { data: areas = [] } = useAcademicAreas()
    const { data: states = [] } = useActiveStates()

    function updateParam(key: string, value: string | undefined) {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev)
            if (value) {
                next.set(key, value)
            } else {
                next.delete(key)
            }
            next.delete('page')
            return next
        })
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        updateParam('q', searchInput.trim() || undefined)
    }

    function clearFilters() {
        setSearchInput('')
        setSearchParams({})
    }

    function setPage(p: number) {
        setSlideDirection(p > page ? 'forward' : 'backward')
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev)
            if (p > 0) {
                next.set('page', String(p))
            } else {
                next.delete('page')
            }
            return next
        })
    }

    const displayedAreas = showAllAreas ? areas : areas.slice(0, 8)
    const activeFilterCount = [area, condition, priceMinStr, priceMaxStr, state].filter(Boolean).length
    const hasFilters = !!(q || activeFilterCount > 0)

    const filterPanel = (
        <div className="space-y-5">
            {areas.length > 0 && (
                <>
                    <div>
                        <h3 className={FILTER_LABEL}>Área acadêmica</h3>
                        <div className="space-y-2">
                            {displayedAreas.map((a) => (
                                <label key={a} className="flex cursor-pointer items-center gap-2 font-ui text-sm text-tinta">
                                    <Checkbox
                                        checked={area === a}
                                        onCheckedChange={(checked) => updateParam('area', checked ? a : undefined)}
                                    />
                                    <AreaEmblem area={a} size={14} className="text-bordo/70" />
                                    <span>{a}</span>
                                </label>
                            ))}
                        </div>
                        {areas.length > 8 && (
                            <button
                                type="button"
                                className="mt-2 font-ui text-xs text-bordo hover:underline"
                                onClick={() => setShowAllAreas(!showAllAreas)}
                            >
                                {showAllAreas ? 'Ver menos' : 'Ver todas'}
                            </button>
                        )}
                    </div>
                    <Ornament variant="rule" className="opacity-40" />
                </>
            )}

            <div>
                <h3 className={FILTER_LABEL}>Faixa de preço</h3>
                <div className="flex items-center gap-2">
                    <div className="flex-1">
                        <Label className="font-ui text-xs text-tinta-leve">De R$</Label>
                        <Input
                            type="number"
                            min={0}
                            placeholder="0"
                            value={priceMinStr ?? ''}
                            onChange={(e) => updateParam('priceMin', e.target.value || undefined)}
                            className="h-9 text-sm"
                        />
                    </div>
                    <div className="flex-1">
                        <Label className="font-ui text-xs text-tinta-leve">Até R$</Label>
                        <Input
                            type="number"
                            min={0}
                            placeholder="999"
                            value={priceMaxStr ?? ''}
                            onChange={(e) => updateParam('priceMax', e.target.value || undefined)}
                            className="h-9 text-sm"
                        />
                    </div>
                </div>
            </div>

            <Ornament variant="rule" className="opacity-40" />

            <div>
                <h3 className={FILTER_LABEL}>Conservação mínima</h3>
                <div className="space-y-2">
                    {CONDITIONS.map((c) => (
                        <label key={c} className="flex cursor-pointer items-center gap-2 font-ui text-sm text-tinta">
                            <Checkbox
                                checked={condition === c}
                                onCheckedChange={(checked) => updateParam('condition', checked ? c : undefined)}
                            />
                            {formatCondition(c)}
                        </label>
                    ))}
                </div>
            </div>

            {states.length > 0 && (
                <>
                    <Ornament variant="rule" className="opacity-40" />
                    <div>
                        <h3 className={FILTER_LABEL}>Localização</h3>
                        <Select
                            value={state ?? '__all__'}
                            onValueChange={(v) => updateParam('state', v === '__all__' ? undefined : v)}
                        >
                            <SelectTrigger className="h-9 text-sm">
                                <SelectValue placeholder="Todos os estados" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="__all__">Todos os estados</SelectItem>
                                {states.map((s) => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </>
            )}

            {hasFilters && (
                <Button variant="ghost" size="sm" className="w-full" onClick={clearFilters}>
                    Limpar filtros
                </Button>
            )}
        </div>
    )

    return (
        <div className="container-codice py-8">
            <form onSubmit={handleSearch} className="mb-8 flex gap-2">
                <Input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Procure por título, autor ou tema…"
                    className="h-10 flex-1"
                />
                <Button type="submit">Buscar</Button>
            </form>

            <div className="flex gap-8">
                {/* Sidebar — desktop */}
                <aside className="sticky top-20 hidden w-60 shrink-0 self-start lg:block">
                    {filterPanel}
                </aside>

                <div className="min-w-0 flex-1">
                    {/* Running head editorial — contexto da busca/filtro em
                        type-uiserif (Fraunces opsz 14), oldstyle nums.
                        Sutil, cinza-quente, sem bg, sem sticky. So aparece
                        quando ha resultados e algum criterio definido. */}
                    {data && data.content.length > 0 && (q || area || data.totalPages > 1) && (
                        <p className="mb-3 type-uiserif num-oldstyle text-[12px] tracking-[0.1em] text-cinza-quente">
                            <span>acervo</span>
                            {q && (
                                <>
                                    <span aria-hidden="true" className="mx-2">·</span>
                                    <span className="italic">«{q}»</span>
                                </>
                            )}
                            {!q && area && (
                                <>
                                    <span aria-hidden="true" className="mx-2">·</span>
                                    <span>{area}</span>
                                </>
                            )}
                            {data.totalPages > 1 && (
                                <>
                                    <span aria-hidden="true" className="mx-2">·</span>
                                    <span>página {page + 1} de {data.totalPages}</span>
                                </>
                            )}
                        </p>
                    )}

                    <div className="mb-4 flex items-center justify-between gap-3">
                        <p className="font-ui text-sm text-cinza-quente">
                            {data
                                ? `${data.totalElements} livro${data.totalElements !== 1 ? 's' : ''} encontrado${data.totalElements !== 1 ? 's' : ''}`
                                : ''}
                        </p>
                        <div className="flex items-center gap-2">
                            {/* Filtros mobile */}
                            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="sm" className="lg:hidden">
                                        <SlidersHorizontalIcon className="size-4" />
                                        Filtros
                                        {activeFilterCount > 0 && (
                                            <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-bordo px-1 font-ui text-[10px] font-medium text-papel">
                                                {activeFilterCount}
                                            </span>
                                        )}
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[320px] overflow-y-auto">
                                    <SheetTitle>Filtros</SheetTitle>
                                    <div className="mt-2">{filterPanel}</div>
                                </SheetContent>
                            </Sheet>

                            <Select value={sort ?? ''} onValueChange={(v) => updateParam('sort', v || undefined)}>
                                <SelectTrigger className="h-9 w-44 text-sm">
                                    <SelectValue placeholder="Ordenar por" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SORT_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Ornament variant="rule" className="mb-8" />

                    {isLoading ? (
                        <div className="grid-acervo">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="aspect-[2/3] w-full rounded" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="py-16 text-center">
                            <p className="font-body text-tinta-leve">
                                Algo se perdeu entre as páginas. Tente novamente em instantes.
                            </p>
                        </div>
                    ) : !data || data.content.length === 0 ? (
                        <div className="flex flex-col items-center py-16 text-center">
                            <LivroDosLivrosSeal size={96} className="mb-6" />
                            <p className="font-body text-tinta-leve">
                                Nenhum livro com esse título no acervo agora.
                            </p>
                            <p className="mt-1 font-ui text-sm text-cinza-quente">
                                Quer que o Livro dos Livros sugira algo parecido?
                            </p>
                        </div>
                    ) : (
                        <>
                            <div
                                key={page}
                                className={`grid-acervo ${slideDirection === 'forward' ? 'page-in-right' : 'page-in-left'}`}
                            >
                                {data.content.map((book) => (
                                    <BookCard key={book.id} book={book} />
                                ))}
                            </div>

                            {data.totalPages > 1 && (
                                <div className="mt-10 flex items-center justify-center gap-3">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        disabled={page === 0}
                                        onClick={() => setPage(page - 1)}
                                    >
                                        Anterior
                                    </Button>
                                    <span className="type-uiserif num-oldstyle text-sm tracking-[0.05em] text-tinta-leve">
                                        página <span className="text-bordo">{page + 1}</span> de {data.totalPages}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        disabled={page >= data.totalPages - 1}
                                        onClick={() => setPage(page + 1)}
                                    >
                                        Próxima
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
