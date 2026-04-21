import { useEffect } from 'react'

const BASE = 'códice'

export function usePageTitle(title?: string) {
    useEffect(() => {
        document.title = title ? `${title} — ${BASE}` : BASE
    }, [title])
}
