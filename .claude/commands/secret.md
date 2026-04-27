---
description: Auditoria rápida de secrets commitados por acidente
---

Audite o repositório em busca de secrets ou credenciais que não deveriam estar commitadas.

## Escopo

Rode contra o estado atual do working tree + staged. Inclua todos os arquivos rastreados pelo git. Ignore:
- `node_modules/`, `target/`, `.git/`, `dist/`, `.idea/`, `.vscode/`.
- Binários (`*.pdf`, `*.png`, `*.jpg`, `*.ico`).

## Alvos específicos

### 1. application.yml / application-prod.yml

Variáveis sensíveis devem sempre referenciar `${ENV_VAR}`, nunca valor literal. Verifique:

- `spring.datasource.password`
- `codice.jwt.secret`
- `codice.admin.seed-secret`
- `codice.storage.r2.access-key` / `secret-key`
- `codice.lookup.google-books.api-key`

Se qualquer um tiver valor que **não começa com `${`**, é violação.

Um placeholder óbvio como `changeme`, `dev-only`, `local-secret`, `placeholder` aponte como `sugere` (não é vazamento real, mas deveria migrar para env var).

### 2. Arquivos .env e variantes

Procure:
- `.env`, `.env.local`, `.env.production` commitados (deveria estar no `.gitignore`).
- `backend/.env`, `frontend/.env` commitados.
- Arquivos `*.env*` rastreados pelo git exceto `.env.example` e `.env.development` (este último é ok por convenção do projeto).

### 3. Tokens e chaves inline em código

Procure padrões em `*.java`, `*.ts`, `*.tsx`, `*.yml`, `*.properties`:

- String longa começando com `ey` (JWT).
- `AWS_` / `r2_` seguido de string longa em maiúsculas.
- `AIza...` (Google API key).
- `sk_live_`, `sk_test_` (Stripe), `pk_live_`, `pk_test_`.
- Constantes com nome contendo `SECRET`, `TOKEN`, `PASSWORD`, `KEY` atribuídas a literal de mais de 16 caracteres.
- URLs de webhook com token embutido.

### 4. Arquivos .http

Em `backend/http/*.http`:
- Variável `adminSecret` com valor literal (deve vir de `http-client.env.json`, não commitada).
- Headers `Authorization: Bearer ey...` com token real em vez de `{{authToken}}`.
- Request body com senha real em vez de placeholder.

### 5. .gitignore

Verifique que o `.gitignore` cobre:
- `.env` e variantes.
- `http-client.private.env.json` (convenção do IntelliJ para secrets locais).
- `application-local.yml` se existir.

Se faltar entrada, aponte como `sugere`.

## Formato de saída

```
[severidade] arquivo:linha — descrição
  trecho: <snippet mascarado — mostre só primeiros 8 chars do secret>
```

Severidade:
- `bloqueia` — secret real exposto. Pare tudo, este precisa ser rotacionado antes de qualquer coisa.
- `aponta` — placeholder que deveria virar env var ou arquivo que deveria estar no gitignore.
- `sugere` — melhoria preventiva no `.gitignore`.

## Ao final

- Contagem por severidade.
- Se houver `bloqueia`:
  1. **Não sugira apagar do working tree e commitar** — o secret continua no histórico do git.
  2. Sugira: rotacionar o secret imediatamente no serviço correspondente, atualizar env vars em Railway e Vercel, e só então remover do código.
  3. Opcionalmente, sugira `git filter-repo` para reescrever histórico. Aponte que é operação destrutiva e que só vale se o repo for privado ou acabou de ser commitado.

Não tente corrigir nada automaticamente. Aponte.
