---
description: Convenções de frontend React/TypeScript do Códice
paths:
  - "frontend/src/**/*.ts"
  - "frontend/src/**/*.tsx"
  - "frontend/package.json"
---

# Frontend — React + TypeScript + TanStack Query

Estilização e tokens de marca: `frontend-styling.md`. Estado atual: `codice-technical-reference.md` §3.

## Estrutura de pastas

Organização por tipo, não por feature:

- `api/` — funções que chamam a API (um arquivo por feature: `books.ts`, `listings.ts`).
- `hooks/` — hooks customizados. `useNomeDoHook.ts`. Estado de servidor = hook que usa TanStack Query.
- `contexts/` — contexts do React. Padrão: `{nome}-context.tsx`.
- `lib/` — utilitários puros (formatters, schemas Zod, helpers).
- `lib/schemas/` — schemas Zod para formulários.
- `components/` — componentes compartilhados.
- `components/ui/` — apenas shadcn. Não crie componente próprio aqui.
- `pages/` — páginas roteadas. Arquivo por rota ou subpasta para rotas aninhadas.

Import absoluto com `@/`. Nunca `../../`.

```ts
import { Button } from "@/components/ui/button";
import { useBook } from "@/hooks/useBook";
```

## Componentes

`function Component()`, nunca arrow function no nível do módulo.

```tsx
export function BookCard({ book }: BookCardProps) { ... }
```

Arrow function ok para handlers inline e callbacks. Componente exportado é sempre `function`.

Arquivo `PascalCase.tsx`. Um componente por arquivo (exceto subcomponentes locais). Hooks `useCamelCase.ts`. Utils `kebab-case.ts`.

## TypeScript

Tipagem estrita. `any` apenas com comentário justificando.

Props como interface nomeada, não inline:

```tsx
interface BookCardProps {
  book: BookListItem;
  compact?: boolean;
}

export function BookCard({ book, compact }: BookCardProps) { ... }
```

Tipos do backend ficam em `api/*.ts` ao lado das funções que os consomem. Não crie pasta `types/` global.

## Estado de servidor: TanStack Query

**Toda chamada à API vai em um hook que usa TanStack Query.** Nunca `useEffect + fetch`. Nunca `useState` para guardar resposta de API.

```ts
// hooks/useBook.ts
export function useBook(slug: string) {
  return useQuery({
    queryKey: ["book", slug],
    queryFn: () => fetchBook(slug),
    enabled: !!slug,
  });
}
```

Query keys: array começando com o recurso em inglês, seguido de identificadores. Ex: `["listings", "mine"]`, `["thread", threadId, "messages"]`.

Para mutação: `useMutation` + `queryClient.invalidateQueries` no `onSuccess`. Não atualize cache manualmente exceto quando necessário por performance.

## Autenticação

`apiFetch` em `api/client.ts` já injeta JWT e trata 401 (redirect para login). Não duplique essa lógica. Para adicionar endpoint novo, crie função em `api/{feature}.ts` que usa `apiFetch`.

Estado do user: `useAuth()` (consome `auth-context.tsx`). Nunca leia token direto do localStorage em componente.

## Formulários

React Hook Form + Zod. Schema em `lib/schemas/{nome}.ts`, formulário consome via `zodResolver`.

```ts
// lib/schemas/listing.ts
export const createListingSchema = z.object({
  bookId: z.string().uuid(),
  priceCents: z.number().int().positive(),
  condition: z.enum(["NOVO", "COMO_NOVO", ...]),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
```

Mensagens de erro em português diretamente no schema.

Componentes shadcn para form: `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`. Já configurados, use o padrão.

## Roteamento

React Router v6. Rotas em `App.tsx` ou arquivo dedicado. Rotas protegidas envolvidas em `<ProtectedRoute>`. Rotas admin em `<ProtectedAdminRoute>`.

Navegação via `useNavigate`. Links via `<Link to="...">`. Nunca `window.location.href`.

## Formatters

Formatters em `lib/format.ts`: `formatPrice`, `formatCondition`, `formatListingStatus`, `formatRelativeDate`, etc. Antes de criar formatter novo, veja se já existe.

## O que não fazer

- Não instale biblioteca nova sem confirmar. TanStack Query cobre estado de servidor; Zod cobre validação; shadcn cobre UI. Se achar que falta coisa, pergunte.
- Não use `any` sem justificativa em comentário.
- Não crie hook para cada coisinha. Hook é para lógica reutilizável ou estado de servidor.
- Não armazene estado de servidor em Context. Context é para estado de UI compartilhado (tema, auth, sidebar).
- Não crie pasta `utils/`. É `lib/`.
