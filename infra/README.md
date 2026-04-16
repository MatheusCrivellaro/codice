# Infra — Códice

## Postgres local

Sobe Postgres 16 (com pgvector) e Adminer:

```bash
cd infra
docker compose up -d
```

- **Postgres:** `localhost:5432`, db `codice`, user `codice`, senha `codice_dev`
- **Adminer:** http://localhost:8081 (server: `postgres`)

Logs:

```bash
docker compose logs -f postgres
```

Parar:

```bash
docker compose down
```

Apagar tudo (inclusive dados):

```bash
docker compose down -v
```

As extensões `pg_trgm` e `vector` são criadas automaticamente no primeiro boot
(via `infra/postgres/init/01-extensions.sql`).