import { formatMessageDate } from '@/lib/format'

interface DateSeparatorProps {
    date: string
}

export function DateSeparator({ date }: DateSeparatorProps) {
    return (
        <div className="flex items-center gap-3 py-2">
            <div className="h-px flex-1 bg-cinza-borda" />
            <span className="font-ui text-xs text-cinza-quente">{formatMessageDate(date)}</span>
            <div className="h-px flex-1 bg-cinza-borda" />
        </div>
    )
}
