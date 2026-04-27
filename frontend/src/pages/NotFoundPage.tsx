import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { LivroDosLivrosSeal } from '@/components/LivroDosLivrosSeal'
import { usePageTitle } from '@/hooks/usePageTitle'

export function NotFoundPage() {
    usePageTitle('Página não encontrada')

    return (
        <div className="container-codice flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
            <LivroDosLivrosSeal size={120} className="mb-8" />
            <p className="font-display text-7xl font-light text-cinza-quente">404</p>
            <h1 className="mt-6 font-display text-2xl text-tinta">
                Esse livro parece ter sido retirado da estante.
            </h1>
            <p className="mt-3 max-w-md font-body text-base text-tinta-leve">
                A página que você procura não está mais no acervo ou nunca existiu.
            </p>
            <Button asChild variant="outline" className="mt-8">
                <Link to="/">Voltar à vitrine</Link>
            </Button>
        </div>
    )
}
