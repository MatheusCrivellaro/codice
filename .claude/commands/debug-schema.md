---
description: Roda smoke test de schema contra o Postgres local e reporta divergências
---

Inspecione o schema do Postgres local.

## Ordem de execução

1. **Confira que o Postgres está rodando** localmente via Docker Compose:
   ```bash
   docker compose -f infra/docker-compose.yml ps
   ```
   Se não estiver up, pare e avise: "Suba o Postgres com `cd infra && docker compose up -d` antes."

2. **Rode o smoke test** do schema:
   ```bash
   docker compose -f infra/docker-compose.yml exec -T postgres \
     psql -U codice -d codice -f - < backend/http/schema-smoke-test.sql
   ```

3. **Verifique Flyway**. Rode a query abaixo para ver o histórico:
   ```sql
   SELECT installed_rank, version, description, success, installed_on
   FROM flyway_schema_history
   ORDER BY installed_rank;
   ```

4. **Liste tabelas, índices e extensões atuais**:
   ```sql
   -- Tabelas
   SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

   -- Extensões
   SELECT extname, extversion FROM pg_extension;

   -- Índices por tabela
   SELECT tablename, indexname, indexdef
   FROM pg_indexes
   WHERE schemaname = 'public'
   ORDER BY tablename, indexname;

   -- Triggers
   SELECT event_object_table AS table, trigger_name, action_timing, event_manipulation
   FROM information_schema.triggers
   WHERE trigger_schema = 'public'
   ORDER BY event_object_table;
   ```

5. **Compare com o estado esperado** descrito em `codice-technical-reference.md` §4:
   - Tabelas esperadas: `users`, `sellers`, `books`, `listings`, `listing_photos`, `interest_threads`, `messages`, `thread_read_status`, `app_metadata`, `flyway_schema_history`.
   - Extensões: `pgcrypto`, `pg_trgm`, `vector`.
   - Triggers: `trigger_set_updated_at` em `books`, `sellers`, `listings`, `interest_threads`; `books_search_vector_update` em `books`.
   - Migrations aplicadas com `success = true`: V1 a V10 (ou superior, conforme o estado atual).

## Reporte

Após rodar, produza um relatório em 3 seções:

**Estado atual** — tabelas, extensões, triggers, última migration aplicada.

**Divergências** — para cada item em `technical-reference` §4 que não bate com o estado real, reporte:
```
[falta | extra | divergente] <item> — <esperado> vs <atual>
```

**Ação sugerida** — se houver divergência:
- `falta` + migration não aplicada → rode `./mvnw flyway:migrate` e tente de novo.
- `falta` + migration aplicada com `success = false` → pare e me avise antes de agir.
- `extra` → provavelmente mudança estrutural não documentada. Sugira atualizar `technical-reference` §4.
- `divergente` → pare, me avise, nunca tente "corrigir" via SQL direto.

## Regras

- Nunca rode `ALTER TABLE`, `DROP`, `TRUNCATE` ou qualquer DDL em resposta a divergência. Migration resolve schema.
- Nunca rode `flyway:clean`, `flyway:repair` sem me perguntar.
- Se o banco estiver vazio (sem nem `flyway_schema_history`), sugira `./mvnw flyway:migrate` e peça confirmação antes.
