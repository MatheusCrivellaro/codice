---
argument-hint: "[tudo | backend | frontend | caminho]"
description: Revisa staged changes contra as rules do projeto. Aponta violações, não corrige.
---

Revise mudanças contra as rules do projeto Códice.

## Escopo

- Sem argumento ou `$ARGUMENTS` vazio: `git diff --staged`.
- `$ARGUMENTS` = `tudo`: `git diff` (working tree inteira, staged + unstaged).
- `$ARGUMENTS` = `backend`: restringe a `backend/**`.
- `$ARGUMENTS` = `frontend`: restringe a `frontend/**`.
- `$ARGUMENTS` = caminho: restringe ao caminho dado.

Se o diff estiver vazio, pare e avise.

## Violações a procurar

Consulte as rules em `.claude/rules/` para a regra completa. Abaixo, o que **sempre** deve ser checado:

### Backend (`*.java`, `pom.xml`)
- `@Autowired` em campo ou construtor.
- Import de Lombok (`lombok.*`).
- Classe DTO com getters/setters em vez de record.
- `@Transactional` em controller.
- `ddl-auto` diferente de `validate` em `application.yml`.
- Cor de resposta HTTP construída manualmente (`ResponseEntity.status(500).body(...)`) em vez de lançar exceção.
- `BigDecimal` ou `double` para preço (deve ser `Integer priceCents`).
- Rota pública sendo adicionada sem configuração explícita no `SecurityConfig`.
- `GenerationType.AUTO` em `@GeneratedValue` (deve ser UUID via `gen_random_uuid()` na migration).

### Migrations (`*.sql`)
- Alteração de migration commitada (arquivo com número menor que o máximo anterior, modificado).
- Uso de `uuid_generate_v4()` (deve ser `gen_random_uuid()`).
- Tipo `ENUM` nativo do Postgres (deve ser `VARCHAR` + `CHECK`).
- `TIMESTAMP` sem timezone (deve ser `TIMESTAMPTZ`).
- `FOREIGN KEY` sem `ON DELETE` explícito.
- Numeração/nomenclatura fora do padrão `V{n}__descricao_em_snake_case.sql`.

### Frontend (`*.ts`, `*.tsx`)
- Componente exportado como arrow function no nível de módulo (`export const Component = () =>`). Deve ser `function Component()`.
- `any` sem comentário justificando.
- `useEffect` + `fetch` em vez de TanStack Query.
- `useState` guardando resposta de API.
- Leitura direta de token do `localStorage` fora de `lib/auth-storage.ts`.
- Import relativo profundo (`../../`). Deve ser `@/`.
- `window.location.href` para navegação (deve ser `useNavigate` ou `<Link>`).

### Styling (`*.tsx`, `*.css`)
- Cor hex inline em JSX (`className="bg-[#7A2E2E]"` ou `style={{ color: '#2A2420' }}`).
- `bg-red-*`, `text-red-*` em contexto destrutivo (deve ser `bg-destructive`, `text-destructive-foreground`).
- Uso simultâneo de token de marca e token shadcn no mesmo componente.
- `dark:` corrigindo cor base que deveria estar tokenizada.
- `font-display` ou `font-ui` como classe Tailwind (não existem — `font-heading`, `font-sans`).
- `max-w-[680px] mx-auto` em vez de `.prose-codice`.
- Componente shadcn editado sem comentário de porquê no topo.

### Geral
- Emoji em código, UI, copy, commit, documentação.
- Console.log ou System.out.println esquecido.
- TODO/FIXME sem issue ou data associada.

## Formato de saída

Para cada violação encontrada:

```
[severidade] arquivo:linha — descrição curta
  regra: <regra específica>.md
  trecho: <snippet curto>
```

Severidade:
- `bloqueia` — viola regra dura ou introduz dívida séria (secret hardcoded, migration alterada).
- `aponta` — violação de convenção que não quebra nada (arrow function em vez de `function`, `any` sem justificativa).
- `sugere` — melhoria não-obrigatória (consolidar formatter, extrair componente).

## Ao final

- Número total de violações por severidade.
- Sugestão de o que corrigir primeiro se houver `bloqueia`.

Não aplique nenhuma correção. Só aponte.
