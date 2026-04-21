import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme, type Theme } from '@/hooks/useTheme'

const OPTIONS: { value: Theme; label: string }[] = [
    { value: 'light', label: 'Claro' },
    { value: 'dark', label: 'Escuro' },
    { value: 'system', label: 'Sistema' },
]

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const Icon = theme === 'system' ? MonitorIcon : resolvedTheme === 'dark' ? MoonIcon : SunIcon

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Alternar tema">
                    <Icon className="size-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-32">
                {OPTIONS.map((opt) => (
                    <DropdownMenuItem
                        key={opt.value}
                        onSelect={() => setTheme(opt.value)}
                        className={theme === opt.value ? 'text-bordo' : ''}
                    >
                        {opt.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
