import type { ReactNode } from 'react'

// Aspas retas (") em texto editorial viram curvas tipograficas (" "),
// destacadas em bordo / dourado peso medio. Heuristica simples de
// alternancia abre/fecha — sinopses e descricoes raramente tem aspa
// dentro de aspa, e o brief manda priorizar legibilidade tipografica
// sobre robustez do parser.
export function renderEditorialText(text: string): ReactNode[] {
    const nodes: ReactNode[] = []
    let buffer = ''
    let nextIsOpen = true
    let key = 0
    for (const ch of text) {
        if (ch === '"') {
            if (buffer) {
                nodes.push(buffer)
                buffer = ''
            }
            const quote = nextIsOpen ? '“' : '”'
            nodes.push(
                <span key={key++} className="font-medium text-bordo">
                    {quote}
                </span>,
            )
            nextIsOpen = !nextIsOpen
        } else {
            buffer += ch
        }
    }
    if (buffer) nodes.push(buffer)
    return nodes
}
