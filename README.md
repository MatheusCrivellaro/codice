# Códice

Marketplace de livros usados com foco em obras acadêmicas, clássicos e edições raras.
Identidade bibliófila, calma e premium.

## Estrutura

- `backend/` — API REST em Spring Boot 3 + Java 21 + PostgreSQL 16
- `frontend/` — SPA em React + TypeScript + Vite
- `infra/` — Docker Compose, scripts e configurações de infraestrutura
- `docs/` — Documento Mestre, briefs de marca e decisões arquiteturais

## Stack

**Backend:** Java 21, Spring Boot 3.x, Spring Data JPA, Flyway, PostgreSQL 16
**Frontend:** Vite, React, TypeScript, TanStack Query, shadcn/ui, Tailwind
**Infra:** Railway (API + DB), Vercel (web), Cloudflare R2 (storage)

## Status

MVP (Fase 0 + Fase 1) — em deploy.

## Como rodar

Instruções por subprojeto:
- [Backend](./backend/README.md) _(em breve)_
- [Frontend](./frontend/README.md) _(em breve)_

## Produção

- **Frontend:** https://codice.com.br (Vercel)
- **API:** https://api.codice.com.br (Railway)

Ver [docs/deploy-vercel.md](./docs/deploy-vercel.md) e [docs/deploy-railway.md](./docs/deploy-railway.md) para setup de deploy.
