import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import type { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { isbnSearchSchema, manualBookSchema, type IsbnSearchFormData, type ManualBookFormData } from '@/lib/schemas/listing'

type ManualBookFormInput = z.input<typeof manualBookSchema>
import * as listingsApi from '@/api/listings'
import type { BookLookupResponse, BookFuzzyMatch } from '@/api/listings'
import type { WizardBookData } from '@/pages/sell/CreateListingWizard'
import type { ApiError } from '@/api/client'

interface StepBookProps {
    initialData: WizardBookData
    onComplete: (data: WizardBookData) => void
}

export function StepBook({ initialData, onComplete }: StepBookProps) {
    const [tab, setTab] = useState<string>(initialData.isbn ? 'isbn' : 'manual')
    const [lookupResult, setLookupResult] = useState<BookLookupResponse | null>(initialData.lookupResult ?? null)
    const [isSearching, setIsSearching] = useState(false)

    return (
        <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="mb-6">
                <TabsTrigger value="isbn">Tenho o ISBN</TabsTrigger>
                <TabsTrigger value="manual">Preencher manualmente</TabsTrigger>
            </TabsList>

            <TabsContent value="isbn">
                <IsbnSearch
                    initialIsbn={initialData.isbn}
                    lookupResult={lookupResult}
                    isSearching={isSearching}
                    onSearch={async (isbn) => {
                        setIsSearching(true)
                        setLookupResult(null)
                        try {
                            const result = await listingsApi.lookupIsbn(isbn)
                            setLookupResult(result)
                        } catch (err) {
                            const status = (err as ApiError).status
                            if (status === 404) {
                                toast.error('Não encontramos esse ISBN. Preencha manualmente.')
                                setTab('manual')
                            } else if (status === 400) {
                                toast.error('ISBN inválido.')
                            } else {
                                toast.error('Algo se perdeu entre as páginas. Tente novamente em instantes.')
                            }
                        } finally {
                            setIsSearching(false)
                        }
                    }}
                    onConfirm={(isbn, result) => {
                        onComplete({ isbn, lookupResult: result })
                    }}
                    onManual={() => setTab('manual')}
                />
            </TabsContent>

            <TabsContent value="manual">
                <ManualEntry
                    initialData={initialData.manualBookData}
                    onComplete={(data) => {
                        onComplete({ manualBookData: data })
                    }}
                />
            </TabsContent>
        </Tabs>
    )
}

function IsbnSearch({
    initialIsbn,
    lookupResult,
    isSearching,
    onSearch,
    onConfirm,
    onManual,
}: {
    initialIsbn?: string
    lookupResult: BookLookupResponse | null
    isSearching: boolean
    onSearch: (isbn: string) => void
    onConfirm: (isbn: string, result: BookLookupResponse) => void
    onManual: () => void
}) {
    const { register, handleSubmit, getValues, formState: { errors } } = useForm<IsbnSearchFormData>({
        resolver: zodResolver(isbnSearchSchema),
        defaultValues: { isbn: initialIsbn ?? '' },
    })

    function onSubmit(data: IsbnSearchFormData) {
        onSearch(data.isbn)
    }

    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
                <div className="flex-1">
                    <Input
                        {...register('isbn')}
                        placeholder="Ex: 978-85-359-1172-5"
                        disabled={isSearching}
                    />
                    {errors.isbn && <p className="mt-1 text-sm text-red-600">{errors.isbn.message}</p>}
                </div>
                <Button type="submit" disabled={isSearching}>
                    {isSearching ? 'Buscando...' : 'Buscar'}
                </Button>
            </form>

            {lookupResult && (
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex gap-4">
                            {lookupResult.coverImageUrl && (
                                <img
                                    src={lookupResult.coverImageUrl}
                                    alt={lookupResult.title}
                                    className="h-32 w-24 shrink-0 rounded object-cover"
                                />
                            )}
                            <div className="min-w-0 flex-1">
                                <h3 className="font-display text-lg font-medium text-tinta">
                                    {lookupResult.title}
                                </h3>
                                <p className="text-sm text-tinta-leve">{lookupResult.authors}</p>
                                {lookupResult.publisher && (
                                    <p className="text-sm text-tinta-leve">{lookupResult.publisher}</p>
                                )}
                                {lookupResult.publicationYear && (
                                    <p className="text-sm text-tinta-leve">{lookupResult.publicationYear}</p>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <Button onClick={() => onConfirm(getValues('isbn'), lookupResult)}>
                                É este livro
                            </Button>
                            <Button variant="outline" onClick={onManual}>
                                Não é este, preencher manualmente
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

function ManualEntry({
    initialData,
    onComplete,
}: {
    initialData?: listingsApi.ManualBookData
    onComplete: (data: listingsApi.ManualBookData) => void
}) {
    const [academicAreas, setAcademicAreas] = useState<string[]>(initialData?.academicAreas ?? [])
    const [areaInput, setAreaInput] = useState('')
    const [fuzzySuggestions, setFuzzySuggestions] = useState<BookFuzzyMatch[]>([])

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ManualBookFormInput, unknown, ManualBookFormData>({
        resolver: zodResolver(manualBookSchema),
        defaultValues: {
            title: initialData?.title ?? '',
            authors: initialData?.authors ?? '',
            publisher: initialData?.publisher ?? '',
            publicationYear: initialData?.publicationYear ?? undefined,
            edition: initialData?.edition ?? '',
            language: initialData?.language ?? 'pt-BR',
            translator: initialData?.translator ?? '',
            synopsis: initialData?.synopsis ?? '',
        },
    })

    const titleValue = watch('title')

    const debouncedFuzzySearch = useCallback(() => {
        let timer: ReturnType<typeof setTimeout>
        return (title: string) => {
            clearTimeout(timer)
            if (title.length < 4) {
                setFuzzySuggestions([])
                return
            }
            timer = setTimeout(async () => {
                try {
                    const results = await listingsApi.searchBooksFuzzy(title)
                    setFuzzySuggestions(results)
                } catch {
                    setFuzzySuggestions([])
                }
            }, 500)
        }
    }, [])

    const searchFuzzy = useCallback(debouncedFuzzySearch(), [debouncedFuzzySearch])

    useEffect(() => {
        searchFuzzy(titleValue ?? '')
    }, [titleValue, searchFuzzy])

    function handleAreaKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            e.preventDefault()
            const value = areaInput.trim()
            if (value && !academicAreas.includes(value)) {
                setAcademicAreas([...academicAreas, value])
            }
            setAreaInput('')
        }
    }

    function removeArea(area: string) {
        setAcademicAreas(academicAreas.filter(a => a !== area))
    }

    function selectSuggestion(suggestion: BookFuzzyMatch) {
        setValue('title', suggestion.title)
        setValue('authors', suggestion.authors)
        setFuzzySuggestions([])
    }

    function onSubmit(data: ManualBookFormData) {
        const bookData: listingsApi.ManualBookData = {
            title: data.title,
            authors: data.authors,
            publisher: data.publisher || undefined,
            publicationYear: data.publicationYear || undefined,
            edition: data.edition || undefined,
            language: data.language || 'pt-BR',
            translator: data.translator || undefined,
            academicAreas: academicAreas.length > 0 ? academicAreas : undefined,
            synopsis: data.synopsis || undefined,
        }
        onComplete(bookData)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input id="title" {...register('title')} />
                {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
                {fuzzySuggestions.length > 0 && (
                    <div className="rounded-md border border-cinza-borda bg-superficie p-2">
                        <p className="mb-1 text-xs text-cinza-quente">Este livro já está no acervo?</p>
                        {fuzzySuggestions.map(s => (
                            <button
                                key={s.id}
                                type="button"
                                className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-papel-profundo"
                                onClick={() => selectSuggestion(s)}
                            >
                                <span className="font-medium">{s.title}</span>
                                <span className="text-tinta-leve"> — {s.authors}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="authors">Autor(es) *</Label>
                <Input id="authors" {...register('authors')} placeholder="Separe múltiplos autores com ;" />
                {errors.authors && <p className="text-sm text-red-600">{errors.authors.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="publisher">Editora</Label>
                    <Input id="publisher" {...register('publisher')} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="publicationYear">Ano</Label>
                    <Input id="publicationYear" type="number" {...register('publicationYear')} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="edition">Edição</Label>
                    <Input id="edition" {...register('edition')} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <Input id="language" {...register('language')} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="translator">Tradutor</Label>
                <Input id="translator" {...register('translator')} />
            </div>

            <div className="space-y-2">
                <Label>Áreas acadêmicas</Label>
                <Input
                    value={areaInput}
                    onChange={(e) => setAreaInput(e.target.value)}
                    onKeyDown={handleAreaKeyDown}
                    placeholder="Digite e aperte Enter para adicionar"
                />
                {academicAreas.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {academicAreas.map(area => (
                            <span
                                key={area}
                                className="inline-flex items-center gap-1 rounded bg-papel-profundo px-2 py-0.5 text-xs text-tinta"
                            >
                                {area}
                                <button
                                    type="button"
                                    className="text-cinza-quente hover:text-tinta"
                                    onClick={() => removeArea(area)}
                                >
                                    x
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="synopsis">Sinopse</Label>
                <Textarea id="synopsis" {...register('synopsis')} rows={3} />
            </div>

            <Button type="submit" className="w-full">Continuar</Button>
        </form>
    )
}
