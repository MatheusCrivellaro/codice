---
description: Regras de Flyway, schema e Postgres do Códice
paths:
  - "backend/src/main/resources/db/migration/**/*.sql"
---

# Migrations — Flyway + Postgres 16

Schema completo e índices existentes: `codice-technical-reference.md` §4. Consulte antes de alterar estrutura.

## Regras duras

- **Nunca altere migration commitada.** Se V7 já foi aplicada em qualquer ambiente, ela é imutável. Mudança = nova migration `V{n+1}__descricao.sql`.
- **Nunca use `flyway:clean`.** Nem local, nem dev, nem produção. Para recomeçar local, dropa o container e sobe de novo.
- **Nunca escreva SQL específico de Hibernate** (`hibernate_sequence`, DDL auto-gerado). `ddl-auto` é `validate`. O schema é SQL puro, escrito por você.

## Numeração e nomenclatura

Formato: `V{n}__descricao_em_snake_case.sql`. Duas underscores entre número e descrição. Descrição curta, em português, imperativa. Migration atual máxima: V10. Próxima é V11.

Exemplos válidos:
- `V11__add_listing_seller_index.sql`
- `V12__create_favorites_table.sql`

Exemplos inválidos:
- `V11_add_index.sql` (uma underscore só)
- `V11__AddIndex.sql` (camelCase)
- `V11__add-index.sql` (kebab)

## Extensões disponíveis

Já instaladas em V1 baseline e provisionadas pelo `infra/postgres/init/01-extensions.sql`:

- `pgcrypto` — use `gen_random_uuid()` para PKs, não `uuid_generate_v4()`.
- `pg_trgm` — use `similarity()` e operador `%` para fuzzy match.
- `vector` — instalada mas não usada. Para Fase 2 (RAG).

Não tente instalar extensão nova sem confirmar.

## Triggers existentes

- `trigger_set_updated_at()` — aplicado em `books`, `sellers`, `listings`, `interest_threads`. Para tabela nova com `updated_at`, reuse:

```sql
CREATE TRIGGER set_updated_at_on_nova_tabela
BEFORE UPDATE ON nova_tabela
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
```

- `books_search_vector_update()` — atualiza `search_vector` em `books`. Pesos: A (title), B (authors), C (synopsis), D (publisher). Não mexa sem entender o impacto na busca.

## Convenções de schema

- **IDs:** `UUID PRIMARY KEY DEFAULT gen_random_uuid()`.
- **Timestamps:** `TIMESTAMPTZ`, nunca `TIMESTAMP` sem timezone. Default `now()` para `created_at`.
- **Preços:** `INTEGER` em centavos com `CHECK (price_cents > 0)`.
- **Enums:** `VARCHAR(N)` com `CHECK` constraint listando valores válidos. Não use tipo ENUM nativo do Postgres — dor pra migrar.
- **FKs:** sempre declare `ON DELETE` explícito (`CASCADE`, `RESTRICT`, ou `SET NULL`). Sem default implícito.
- **Textos opcionais:** `TEXT` com `NULL` permitido, não `VARCHAR` com tamanho arbitrário.

## Índices

- Índice composto para listagem: `(status, created_at DESC)` — padrão de `listings`.
- Índice parcial para fila: `WHERE status = 'X'` — padrão de moderação.
- GIN para array: `USING gin(coluna)` — padrão de `books.academic_areas`.
- GIN para trigram: `USING gin(coluna gin_trgm_ops)` — padrão de `books.title`.
- Unique parcial para campo opcional: `UNIQUE (isbn) WHERE isbn IS NOT NULL` — padrão de `books.isbn`.

Nome do índice: `idx_{tabela}_{coluna(s)}` ou `uq_{tabela}_{coluna}` para único.

## Estrutura de uma migration

```sql
-- V11__descricao.sql

-- 1. Tabela nova (se houver)
CREATE TABLE IF NOT EXISTS nova_tabela (...);

-- 2. Índices
CREATE INDEX IF NOT EXISTS idx_nova_tabela_campo ON nova_tabela(campo);

-- 3. Trigger de updated_at (se aplicável)
CREATE TRIGGER set_updated_at_on_nova_tabela
BEFORE UPDATE ON nova_tabela
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- 4. Dados iniciais (se aplicável, sem excessos)
INSERT INTO app_metadata (key, value) VALUES ('feature_flag', 'false') ON CONFLICT DO NOTHING;
```

`IF NOT EXISTS` em create para migration ser idempotente em caso de retry — mas isso não substitui a regra de não alterar migration commitada.

## O que evitar

- `ALTER TABLE ... ADD COLUMN ... NOT NULL` sem default em tabela com dados — a migration quebra. Ou crie com default, ou faça em dois passos.
- `DROP TABLE` ou `DROP COLUMN` sem confirmação explícita minha.
- SQL específico de outro SGBD (MySQL, SQL Server). Postgres 16, apenas.
