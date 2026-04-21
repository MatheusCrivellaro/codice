import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { SellerProfileResponse } from '@/api/listings'

interface SellerDashboardProps {
    profile?: SellerProfileResponse | null
}

export function SellerDashboard({ profile }: SellerDashboardProps) {
    return (
        <div className="container-codice max-w-lg py-12">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Minha vitrine</CardTitle>
                    {profile && (
                        <p className="font-ui text-sm text-tinta-leve">
                            {profile.publicName} ({profile.slug})
                        </p>
                    )}
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button asChild className="w-full">
                        <Link to="/vender/novo">Anunciar um livro</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                        <Link to="/vender/anuncios">Minhas ofertas</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
