import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type { ProfileType } from '@/api/auth'

const PROFILE_LABELS: Record<ProfileType, string> = {
    BUYER: 'Comprador(a)',
    BOOKSTORE: 'Sebo',
    INDIVIDUAL_SELLER: 'Vendedor(a)',
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase()
}

export function PerfilPage() {
    const { user, logout } = useAuth()

    if (!user) return null

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="items-center text-center">
                    <Avatar size="lg" className="mb-2">
                        <AvatarFallback className="bg-[#7A2E2E] text-white">
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <CardTitle className="font-serif text-xl text-[#2A2420]">
                        {user.name}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-[#2A2420]/60">E-mail</span>
                            <span className="text-[#2A2420]">{user.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#2A2420]/60">Perfil</span>
                            <span className="text-[#2A2420]">{PROFILE_LABELS[user.profileType]}</span>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full" onClick={logout}>
                        Sair
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
