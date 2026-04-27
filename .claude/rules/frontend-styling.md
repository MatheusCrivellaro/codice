---
description: Tokens, dark mode e estilização do Códice com Tailwind v4 + shadcn
paths:
  - "frontend/src/**/*.tsx"
  - "frontend/src/**/*.css"
  - "frontend/components.json"
---

# Styling — Tailwind v4 + shadcn + tokens Códice

Identidade visual completa: `codice-brand-reference.md`. Este arquivo foca em **como usar os tokens que já existem** em `frontend/src/index.css`.

## Como o sistema está montado

Dois níveis de token coexistem em `index.css`:

1. **Tokens da marca** (`@theme`): `--color-papel`, `--color-papel-profundo`, `--color-tinta`, `--color-bordo`, `--color-cinza-quente`, `--color-cinza-borda`, `--color-superficie`. Usados em CSS custom e utilitários da marca.
2. **Tokens shadcn** (`:root` e `.dark`): `--primary`, `--background`, `--foreground`, `--card`, `--muted`, `--border`, etc. Usados por componentes shadcn e classes Tailwind equivalentes (`bg-primary`, `text-foreground`, etc).

Os dois estão conectados: `--primary` mapeia para o bordô no light e para o dourado no dark. `--background` mapeia para papel no light, fundo escuro no dark.

## Regra de ouro

- **Em componente shadcn ou próximo deles (layouts padrão):** use tokens shadcn via utilitária Tailwind. `bg-primary`, `text-foreground`, `border-border`, `bg-muted`.
- **Em componente customizado que expressa identidade da marca** (hero, página do livro, cabeçalho da conversa): use tokens da marca. `bg-papel`, `text-tinta`, `border-cinza-borda`.

Não misture os dois no mesmo componente. Se precisar misturar, pare e pergunte.

## Dark mode

Toggle via classe `.dark` no `<html>`. Não mude isso.

Os tokens shadcn são redefinidos em `.dark {}`. Os tokens da marca também — `--color-papel` vira `#1A1714`, `--color-bordo` vira dourado `#B89968`. Ao usar `bg-papel`, o comportamento dark é automático.

**Nunca hardcode cor hex em JSX.** Nunca escreva `className="bg-[#7A2E2E]"`. Use o token.

**Nunca use variante `dark:` para corrigir uma cor que deveria estar tokenizada.** Se você está escrevendo `bg-white dark:bg-gray-900`, o token certo é `bg-background` ou `bg-papel`. `dark:` é aceitável para nuance visual (opacidade, hover específico), não para cor base.

## Classes utilitárias de fonte

Atenção: as classes Tailwind vêm dos aliases em `@theme inline`, não dos nomes das variáveis da marca.

| Para usar | Classe Tailwind | Mapeia para |
|---|---|---|
| Fraunces (títulos, display) | `font-heading` | `--font-display` |
| Source Serif (leitura longa) | `font-serif` | `--font-body` |
| Inter (UI) | `font-sans` | `--font-ui` |

Não existe `font-display` nem `font-ui` no Tailwind — só no CSS. Se precisar usar a variável direta no CSS, é `var(--font-display)`.

Títulos `h1/h2/h3` já herdam `font-display` via `@layer base`. Não precisa repetir `font-heading` neles.

## Componentes utilitários já definidos

Antes de criar class custom, veja se o que você quer é um destes:

- **`.prose-codice`** — bloco de leitura longa. Source Serif 17px, line-height 1.6, max-width 680px. Use em sinopses, descrições, textos editoriais.
- **`.container-codice`** — container de página. Max-width 1280px, padding horizontal 24px, centralizado. Use como wrapper de página.

Se escrever `max-w-[680px] mx-auto`, pare. Provavelmente é `prose-codice` ou `container-codice`.

## shadcn

Projeto usa shadcn/ui estilo `new-york`, base `neutral`. Componentes em `components/ui/`. **Não edite um componente shadcn sem motivo real** — se editou, deixe comentário no topo do arquivo explicando o porquê, para sobrevivência em reinstall.

Componente novo shadcn: use CLI ou copie da documentação, coloque em `components/ui/`, não customize antes de usar uma vez.

## Proibido

Conforme `codice-brand-reference.md`: sem gradiente, sem sombra berrante, sem glassmorphism, sem neumorphism, sem hover com glow, sem emoji em UI, sem cor hex inline.

Destrutivo (erro, delete) usa o token `--destructive`/`bg-destructive`/`text-destructive-foreground`. Não use `red-500`, `red-600`.

## Responsividade

Mobile-first. Breakpoints padrão Tailwind. Grid de livros: 4 colunas desktop, 3 tablet, 2 mobile, gap 24px. Max-width de leitura 680px. Max-width de conteúdo 1280px (use `container-codice`).
