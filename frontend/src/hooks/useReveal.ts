import { useEffect, useRef, useState } from 'react'

// Revelacao progressiva via IntersectionObserver. Dispara uma vez
// quando o elemento entra na viewport e desconecta o observer. Usado
// em paginas com seccoes verticais (Home) para fade vertical sutil
// — limite duro: 200ms, 6px, opacity-only. Sem stagger, sem parallax.
// Visualmente neutralizado por prefers-reduced-motion via CSS.
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
    const ref = useRef<T>(null)
    const [revealed, setRevealed] = useState(false)

    useEffect(() => {
        if (!ref.current || revealed) return
        const node = ref.current
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setRevealed(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.08 },
        )
        observer.observe(node)
        return () => observer.disconnect()
    }, [revealed])

    return { ref, revealed }
}
