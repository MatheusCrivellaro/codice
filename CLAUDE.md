# Códice — Instruções para Claude Code

## Sobre o projeto

Marketplace brasileiro de livros usados com foco em obras acadêmicas, clássicos e edições raras. Identidade bibliófila, calma e premium. Solo founder, orçamento contido, MVP enxuto com fundação escalável.

Documento Mestre completo em `docs/Codice_Documento_Mestre.pdf`. Briefs de marca em `docs/Codice_Brief_Logo.pdf` e `docs/Codice_Brief_Livro_dos_Livros.pdf`.

## Stack

**Backend** (`backend/`):
- Java 21, Spring Boot 3.x, Maven
- Spring Data JPA + Hibernate, Flyway, Spring Security, Bean Validation
- PostgreSQL 16 (com extensões `pg_trgm` e `pgvector`)
- Testes: JUnit 5 + Testcontainers
- Package base: `br.com.codice.api`

**Frontend** (`frontend/`):
- Vite + React 18 + TypeScript
- Tailwind CSS v4, shadcn/ui (style: new-york, base: neutral)
- TanStack Query, React Router, React Hook Form + Zod
- Path alias: `@/*` → `src/*`

**Infra** (`infra/`):
- Docker Compose com Postgres 16 local (porta 5432)
- Produção: Railway (API + DB), Vercel (web), Cloudflare R2 (fotos)

## Convenções

**Commits:** Conventional Commits em português quando possível.
Exemplos: `feat(backend): cadastro de usuário com JWT`, `fix(frontend): corrige CORS no dev`, `chore: atualiza deps`.

**Branches:** trabalho direto em `main` nesta fase (solo founder, sem PRs formais).

**Nomes de arquivo:**
- Backend: pacotes em `snake_case` é *não*; seguir convenção Java (`camelCase` pra variáveis, `PascalCase` pra classes).
- Frontend: componentes em `PascalCase.tsx`, hooks em `useCamelCase.ts`, utilidades em `kebab-case.ts`.

**Estilo Java:**
- Records pra DTOs sempre que possível.
- Constructor injection (sem `@Autowired` em campo).
- Validação com `@Valid` + Bean Validation.
- Nunca usar `ddl-auto: update`. Schema é domínio do Flyway.
- Migrations versionadas com padrão `V{n}__descricao_em_snake_case.sql`.

**Estilo TypeScript:**
- Prefira `function Component()` a `const Component = () =>`.
- Imports absolutos com `@/`.
- Tipagem estrita, `any` só com justificativa em comentário.

## Restrições técnicas

- **Boring tech vence.** Não introduzir bibliotecas novas sem necessidade clara. Se existe solução com o que já está no projeto, usar.
- **Tier gratuito primeiro.** Qualquer serviço pago precisa de justificativa explícita.
- **Fundação escalável, MVP enxuto.** Não construir hoje o que não foi validado, mas estruturar de forma que crescer não exija reescrever.

## Identidade visual (referência rápida)

Paleta principal:
- Papel `#F7F3EC` — fundo claro
- Papel profundo `#EFE8DA`
- Tinta `#2A2420` — texto principal
- Bordô `#7A2E2E` — destaque (light mode)
- Dourado `#B89968` — destaque (dark mode)
- Cinza-quente `#A89F92`

Tipografia (quando entrar no projeto): Fraunces (títulos), Source Serif 4 (leitura longa), Inter (UI).

Tom de voz: caloroso-sóbrio. Vocabulário de biblioteca, não de e-commerce. "Estante" em vez de "carrinho", "acervo" em vez de "catálogo", "levar este livro" em vez de "comprar".

## Fase atual

Fase 0 (Fundação Técnica) → Fase 1 (MVP Público).

Ver roteiro de milestones no histórico da conversa. O protótipo **não** tem pagamento, logística, app mobile, recomendação algorítmica. Handoff vendedor↔comprador ainda a definir (mensageria interna provável).

## O que evitar

- Não inventar nomes de bibliotecas, APIs ou versões. Em caso de dúvida, perguntar.
- Não inflar o escopo de um milestone. Se surgir algo fora do objetivo declarado, apontar e seguir.
- Não criar abstrações "pro futuro" — só o que serve ao milestone atual.
- Não usar emojis em código, commit, UI ou documentação.