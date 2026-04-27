# Deploy no Railway — Backend

Este guia cobre o deploy manual do backend Spring Boot no Railway, com Postgres gerenciado e auto-deploy por push no `main`.

## Pré-requisitos

- Conta no GitHub com o repositório `codice` acessível.
- Conta no Railway (https://railway.app). Hobby plan (~US$ 5/mês) é o mínimo recomendado pra projeto sério; free trial dá pra validar.

## Setup inicial (uma vez)

### 1. Criar projeto e conectar repositório

1. Railway Dashboard → **New Project** → **Deploy from GitHub repo**.
2. Autorizar o GitHub se ainda não estiver conectado.
3. Selecionar o repositório `codice`.
4. Railway vai criar o projeto. Clicar no serviço criado e ir em **Settings**:
   - **Root Directory**: `backend`
   - **Watch Paths** (opcional): `backend/**` (evita rebuild em mudanças só no frontend)
5. Railway detecta o `Dockerfile` automaticamente. O `railway.toml` já define healthcheck e restart policy.

### 2. Adicionar Postgres

1. No mesmo projeto, clicar em **New** → **Database** → **Add PostgreSQL**.
2. Railway provisiona um Postgres 16 e expõe variáveis `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`, `DATABASE_URL` (formato `postgresql://...`, sem `jdbc:`).

### 3. Habilitar extensões do Postgres

Railway Postgres não habilita extensões automaticamente. Antes do primeiro deploy (ou antes do Flyway rodar), conectar no Postgres e habilitar:

1. No serviço do Postgres → **Data** (ou **Connect** → copiar a connection string pra usar em `psql` local).
2. Executar:

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS vector;
```

Se `vector` não existir nesse Postgres (Railway pode não ter pgvector habilitado por padrão), o Flyway vai falhar na migration que depende dele. Nesse caso, verificar a imagem do Postgres no Railway e, se necessário, abrir um ticket ou migrar pra outro provider.

### 4. Configurar Cloudflare R2 (storage de fotos)

O backend usa R2 pra hospedar fotos dos anúncios. Fazer antes do deploy do backend.

1. Cloudflare Dashboard → **R2** → **Create bucket**. Nome sugerido: `codice-uploads`. Location: Automatic.
2. No bucket criado → **Settings** → **Public Access**:
   - Habilitar **Allow Access** via `r2.dev` subdomain (gera URL pública `https://pub-<hash>.r2.dev`). Copiar essa URL.
   - Alternativa: conectar custom domain (ex: `fotos.codice.com.br`) — mais limpo mas exige DNS configurado.
3. No bucket → **Settings** → **CORS policy** → adicionar:
   ```json
   [
     {
       "AllowedOrigins": ["http://localhost:5173", "https://<seu-dominio-frontend>"],
       "AllowedMethods": ["PUT", "GET"],
       "AllowedHeaders": ["Content-Type"],
       "MaxAgeSeconds": 3600
     }
   ]
   ```
   Ajustar `AllowedOrigins` conforme os domínios que farão upload.
4. **R2** → **Manage R2 API Tokens** → **Create API Token**:
   - Permissions: **Object Read & Write**
   - Specify bucket: `codice-uploads` (escopo mínimo)
   - Copiar **Access Key ID**, **Secret Access Key**, e o **Endpoint** do jurisdicional (formato `https://<account-id>.r2.cloudflarestorage.com`).

Guardar os 4 valores: Access Key, Secret Key, Endpoint, Public URL. Vão no Railway no próximo passo.

### 5. Configurar variáveis de ambiente do backend

No serviço do backend → **Variables**, adicionar:

| Variável | Valor |
|---|---|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `DATABASE_URL` | `jdbc:postgresql://${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}` |
| `DATABASE_USERNAME` | `${{Postgres.PGUSER}}` |
| `DATABASE_PASSWORD` | `${{Postgres.PGPASSWORD}}` |
| `JWT_SECRET` | gerar com `openssl rand -base64 48` |
| `ADMIN_SEED_SECRET` | gerar com `openssl rand -base64 32` |
| `GOOGLE_BOOKS_API_KEY` | sua chave (opcional) |
| `CORS_ALLOWED_ORIGINS` | ex: `https://codice.vercel.app` — ajustar quando tiver domínio final |
| `R2_ENDPOINT` | `https://<account-id>.r2.cloudflarestorage.com` (do passo 4) |
| `R2_ACCESS_KEY` | Access Key ID do token R2 |
| `R2_SECRET_KEY` | Secret Access Key do token R2 |
| `R2_BUCKET` | `codice-uploads` (ou o nome que você usou) |
| `R2_PUBLIC_URL` | `https://pub-<hash>.r2.dev` (ou custom domain) |

`PORT` é injetado pelo Railway automaticamente, não precisa setar.

A sintaxe `${{Postgres.PGHOST}}` é a Reference Variable do Railway — assume que o serviço do Postgres se chama `Postgres` (nome padrão). Se tiver nome diferente, ajustar.

### 6. Primeiro deploy

Ao salvar as variáveis, Railway dispara o deploy. Acompanhar em **Deployments** → logs.

Build típico: 2–4 minutos (primeiro deploy baixa dependências Maven).
Runtime: a JVM demora ~15–30s pra aquecer em cold start no Hobby plan.

## Verificar

Após deploy, o Railway gera um domínio `*.up.railway.app` (visível em **Settings** → **Networking** → **Generate Domain** se não apareceu ainda).

```
curl https://<nome-do-servico>.up.railway.app/actuator/health
```

Deve retornar:
```json
{"status":"UP"}
```

Sem detalhes de componentes — em `prod`, `show-details: never`.

## Deploy contínuo

Todo push na branch `main` que altere arquivos dentro de `backend/` redeploya automaticamente (se Watch Paths estiver configurado).

## Troubleshooting

- **App não sobe / exit code 1**: checar Railway Logs. Geralmente variável faltando ou `DATABASE_URL` sem prefixo `jdbc:`.
- **Flyway falha com `function gen_random_uuid() does not exist`**: extensão `pgcrypto` não habilitada. Ver seção 3.
- **Flyway falha em migration que usa `vector`**: extensão `vector` não disponível. Ver seção 3.
- **CORS bloqueado no browser**: `CORS_ALLOWED_ORIGINS` não inclui o domínio do frontend. Atualizar e redeployar.
- **Cold start lento (~15–30s)**: normal no Hobby plan. Pra produção séria, considerar plano pago com instâncias always-on.
- **`/actuator/health` retorna 404**: profile `prod` não ativado. Verificar `SPRING_PROFILES_ACTIVE=prod`.
- **Build falha em `chmod +x mvnw`**: arquivo não foi copiado com permissões corretas do Git. Rodar `git update-index --chmod=+x backend/mvnw && git commit -m "fix: permissão mvnw"` e push.
- **`/uploads/presign` retorna 503**: variáveis R2 não configuradas. Conferir `R2_ENDPOINT`, `R2_ACCESS_KEY`, `R2_SECRET_KEY`, `R2_PUBLIC_URL`.
- **Upload do browser falha com CORS**: política CORS do bucket R2 não inclui o domínio do frontend. Ver passo 4.3.
- **Upload retorna 403 do R2**: token R2 sem permissão de write ou não escopado pro bucket certo. Regerar no Cloudflare Dashboard.

## O que este guia NÃO cobre (próximos milestones)

- Domínio custom (M20).
- Monitoring, alertas, métricas além do healthcheck.
- Backup automatizado do Postgres (plano pago do Railway faz automático).
- CI próprio além do auto-deploy do Railway.
