import { useAuth } from '@/contexts/auth-context'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { SellerProfileForm } from '@/pages/sell/SellerProfileForm'
import { SellerDashboard } from '@/pages/sell/SellerDashboard'
import * as listingsApi from '@/api/listings'

export function SellPage() {
    usePageTitle('Anunciar')
    const { user } = useAuth()

    if (user?.profileType === 'BUYER') {
        return (
            <div className="container-codice max-w-lg py-12">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Esta seção é para quem anuncia</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="font-body text-sm text-tinta-leve">
                            Leitores não anunciam livros por aqui. Se quiser anunciar, altere seu perfil para sebo ou vendedor.
                        </p>
                        <Button asChild>
                            <Link to="/">Voltar para o acervo</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (user?.profileType === 'BOOKSTORE') {
        return <BookstoreSellPage />
    }

    return <SellerDashboard />
}

function BookstoreSellPage() {
    const { data: profile, isLoading } = useQuery({
        queryKey: ['seller', 'me'],
        queryFn: listingsApi.getMySellerProfile,
    })

    if (isLoading) {
        return (
            <div className="container-codice max-w-lg space-y-4 py-12">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-32 w-full" />
            </div>
        )
    }

    if (!profile) {
        return <SellerProfileForm />
    }

    return <SellerDashboard profile={profile} />
}
