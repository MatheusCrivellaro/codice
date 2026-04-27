---
description: Regras de uso dos arquivos .http para teste manual no IntelliJ
paths:
  - "backend/http/**/*.http"
---

# HTTP tests — IntelliJ REST Client

Arquivos `.http` para testar endpoints manualmente durante desenvolvimento. Ferramenta oficial: HTTP Client do IntelliJ/WebStorm/PyCharm.

## Arquivos existentes

- `auth.http` — register, login, me.
- `books-and-seed.http` — busca, detalhe, áreas acadêmicas.
- `listings.http` — criar, listar, meus.
- `search.http` — full-text, fuzzy, filtros.
- `lookup.http` — ISBN via Google Books / Open Library.
- `interests.http` — threads e mensagens.
- `uploads.http` — presigned URL.
- `admin.http` — bootstrap, seed, moderação.
- `schema-smoke-test.sql` — verificação de schema via SQL.

## Convenção do projeto

### Variáveis de ambiente

Use o `http-client.env.json` do IntelliJ para separar `dev` e `prod`. Variáveis esperadas:

- `{{baseUrl}}` — ex: `http://localhost:8080`.
- `{{adminSecret}}` — header `X-Admin-Secret` no `/admin/bootstrap`.

Nunca hardcode URL absoluta. Nunca commite token real.

### Variáveis de resposta

Padrão para reusar JWT entre requests:

```http
### Login
POST {{baseUrl}}/auth/login
Content-Type: application/json

{ "email": "admin@codice.local", "password": "senha123" }

> {% client.global.set("authToken", response.body.token); %}

### Me
GET {{baseUrl}}/me
Authorization: Bearer {{authToken}}
```

Variáveis globais: `authToken`, `listingId`, `threadId`, `bookSlug`. Reuse o mesmo nome entre arquivos quando fizer sentido.

### Ordem de execução

Dentro de cada arquivo, ordem típica:

1. Setup (login do usuário adequado).
2. Happy path em ordem lógica (criar → listar → buscar por id).
3. Casos de erro (sem token, campo inválido, recurso inexistente).

Arquivos têm dependência entre si: rode `auth.http` primeiro para popular `authToken`. Rode `admin.http > bootstrap` uma vez, rode `admin.http > seed` depois. Daí os outros funcionam.

## Ao adicionar endpoint novo

- Crie bloco no `.http` da feature correspondente (não misture features no mesmo arquivo).
- Inclua pelo menos: happy path, um caso de erro de validação, um caso de autorização faltante.
- Use `###` como separador, com título descritivo curto em português.
- Se o endpoint modifica estado, salve o ID retornado em variável global para requests seguintes.

## O que não colocar

- Credenciais reais, senhas de produção, tokens de API externos. Use placeholder ou variável de ambiente.
- Dados pessoais reais em exemplos de request.
- Request que dispara side-effect caro (seed em produção, delete em massa) sem marcação clara no comentário.
