# Variáveis de ambiente — Backend (produção)

Todas as variáveis abaixo são lidas pelo profile `prod` (`application-prod.yml`). Em dev, o profile default (`application.yml`) não depende delas.

| Variável | Obrigatória | Descrição |
|---|---|---|
| `SPRING_PROFILES_ACTIVE` | Sim | Setar como `prod`. O Dockerfile já define por padrão. |
| `DATABASE_URL` | Sim | JDBC URL do Postgres. Formato esperado: `jdbc:postgresql://host:port/db`. Ver nota sobre Railway abaixo. |
| `DATABASE_USERNAME` | Sim | Usuário do Postgres. |
| `DATABASE_PASSWORD` | Sim | Senha do Postgres. |
| `PORT` | Não | Porta HTTP. Default `8080`. Railway injeta automaticamente. |
| `JWT_SECRET` | Sim | Secret do JWT, mínimo 256 bits. Gerar com `openssl rand -base64 48`. |
| `ADMIN_SEED_SECRET` | Sim | Secret do header `X-Admin-Secret` pra bootstrap do primeiro admin. |
| `GOOGLE_BOOKS_API_KEY` | Não | API key do Google Books. Sem ela o lookup funciona com quota anônima reduzida. |
| `CORS_ALLOWED_ORIGINS` | Sim | Origins permitidos, separados por vírgula. Ex: `https://codice.com.br,https://www.codice.com.br`. |
| `R2_ENDPOINT` | Sim | Endpoint S3 do Cloudflare R2. Formato: `https://<account-id>.r2.cloudflarestorage.com`. |
| `R2_ACCESS_KEY` | Sim | Access Key ID do token R2 (gerar em Cloudflare Dashboard → R2 → Manage R2 API Tokens). |
| `R2_SECRET_KEY` | Sim | Secret Access Key do token R2. |
| `R2_BUCKET` | Não | Nome do bucket. Default `codice-uploads`. |
| `R2_PUBLIC_URL` | Sim | URL base pública do bucket. Ex: `https://pub-<hash>.r2.dev` ou custom domain. |

## Nota sobre `DATABASE_URL` no Railway

Railway expõe o Postgres como `DATABASE_URL` no formato `postgresql://user:pass@host:port/db` (sem o prefixo `jdbc:`). Spring Data espera `jdbc:postgresql://...`.

Duas opções pra resolver no Dashboard → Variables do serviço do backend:

1. **Variáveis separadas (recomendado)**: usar Reference Variables do Postgres e montar a URL:
   - `DATABASE_URL` = `jdbc:postgresql://${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}`
   - `DATABASE_USERNAME` = `${{Postgres.PGUSER}}`
   - `DATABASE_PASSWORD` = `${{Postgres.PGPASSWORD}}`

2. **Copiar manualmente** os valores do Postgres do Railway e colar no serviço do backend, prefixando com `jdbc:`.

## Dev local sem R2 configurado

Em dev, se `R2_ENDPOINT` estiver vazio, o bean do presigner não é criado e o endpoint `/uploads/presign` retorna 503. Os demais endpoints funcionam normalmente. Pra testar upload ponta a ponta em dev, configurar R2 ou apontar pra um bucket de teste.

## Gerar secrets

```bash
openssl rand -base64 48   # JWT_SECRET
openssl rand -base64 32   # ADMIN_SEED_SECRET
```

Não commitar valores reais no repositório.
