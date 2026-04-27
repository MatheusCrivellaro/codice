import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Ornament } from '@/components/Ornament'
import { formatProfileType, formatCatalogNumber } from '@/lib/format'
import { usePageTitle } from '@/hooks/usePageTitle'

function getInitials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase()
}

export function PerfilPage() {
    usePageTitle('meu perfil')
    const { user, logout } = useAuth()

    if (!user) return null

    return (
        <div className="container-codice flex min-h-[60vh] items-center justify-center py-12">
            <Card className="w-full max-w-[480px]">
                <CardHeader className="items-center text-center">
                    <Avatar className="mb-3 size-20 bg-papel-profundo">
                        <AvatarFallback className="bg-papel-profundo font-display text-[28px] font-normal text-bordo">
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-2xl">{user.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                    <Ornament variant="fleuron" className="mx-auto max-w-[180px]" />
                    <div className="space-y-2 font-ui text-sm">
                        <div className="flex justify-between">
                            <span className="text-cinza-quente">E-mail</span>
                            <span className="text-tinta">{user.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-cinza-quente">Perfil</span>
                            <span className="text-tinta">{formatProfileType(user.profileType)}</span>
                        </div>
                    </div>

                    <p className="text-right font-ui text-[11px] tabular-nums tracking-[0.15em] text-cinza-quente">
                        Nº {formatCatalogNumber(user.id)}
                    </p>

                    <Button variant="outline" onClick={logout}>
                        Sair
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
