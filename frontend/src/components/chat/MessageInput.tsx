import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'

interface MessageInputProps {
    onSend: (content: string) => void
    disabled?: boolean
    loading?: boolean
}

export function MessageInput({ onSend, disabled, loading }: MessageInputProps) {
    const [value, setValue] = useState('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const autoResize = useCallback(() => {
        const el = textareaRef.current
        if (!el) return
        el.style.height = 'auto'
        el.style.height = Math.min(el.scrollHeight, 96) + 'px'
    }, [])

    function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setValue(e.target.value)
        autoResize()
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    function handleSend() {
        const trimmed = value.trim()
        if (!trimmed || loading) return
        onSend(trimmed)
        setValue('')
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
        }
    }

    const remaining = 2000 - value.length

    return (
        <div className="flex gap-2 border-t border-cinza-borda bg-papel p-3">
            <div className="relative min-w-0 flex-1">
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Escreva sua mensagem..."
                    disabled={disabled}
                    rows={1}
                    className="w-full resize-none rounded-md border border-cinza-borda bg-superficie px-3 py-2 font-ui text-sm text-tinta placeholder:text-cinza-quente focus:border-bordo focus:ring-2 focus:ring-bordo/20 focus:outline-none disabled:opacity-50"
                    style={{ maxHeight: '96px' }}
                />
                {remaining <= 200 && (
                    <span className={`absolute bottom-1 right-2 font-ui text-[10px] ${remaining < 0 ? 'text-red-500' : 'text-cinza-quente'}`}>
                        {remaining}
                    </span>
                )}
            </div>
            <Button
                size="sm"
                onClick={handleSend}
                disabled={disabled || loading || !value.trim() || value.length > 2000}
                className="self-end"
            >
                {loading ? '...' : 'Enviar'}
            </Button>
        </div>
    )
}
