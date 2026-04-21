import type { MessageResponse } from '@/api/interests'
import { formatMessageTime } from '@/lib/format'

interface MessageBubbleProps {
    message: MessageResponse
}

export function MessageBubble({ message }: MessageBubbleProps) {
    return (
        <div className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[75%] rounded-xl px-3.5 py-2.5 ${
                    message.isMine
                        ? 'rounded-br-none bg-papel-profundo text-tinta'
                        : 'rounded-bl-none border border-cinza-borda bg-superficie text-tinta'
                }`}
            >
                {!message.isMine && (
                    <p className="mb-0.5 font-ui text-xs font-medium text-bordo">
                        {message.senderName}
                    </p>
                )}
                <p className="font-body text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                </p>
                <p className={`mt-1 text-right font-ui text-[10px] ${message.isMine ? 'text-tinta-leve' : 'text-cinza-quente'}`}>
                    {formatMessageTime(message.createdAt)}
                </p>
            </div>
        </div>
    )
}
