# Códice — Referência Técnica Completa

Documento técnico para contextualização de IAs e desenvolvedores. Descreve arquitetura, stack, estrutura de código, modelo de dados, endpoints, identidade visual e histórico completo de construção.

Última atualização: Abril 2026.

---

## 1. Visão geral do produto

Códice é um marketplace brasileiro de livros usados com foco em obras acadêmicas, clássicos e edições raras. Diferencia-se de marketplaces generalistas (Mercado Livre, Estante Virtual) pela curadoria editorial, identidade bibliófila e tratamento do livro como obra com história — não como produto genérico.

Posicionamento: curadoria sobre catálogo, acervo acadêmico em destaque, cuidado de bibliotecário. O site se posiciona como livraria curada, não como vitrine de e-commerce.

Público: sebos físicos de São Paulo (supply), estudantes e pesquisadores (demand), leitores bibliófilos, colecionadores.

Fase atual: MVP (Fase 0 + Fase 1). Sem pagamento integrado — o marketplace funciona como vitrine de anúncios com contato direto via mensageria interna. Pagamento e logística entram na Fase 3.

Fundador solo com formação em Sistemas de Informação. Desenvolvimento com Claude Code como ferramenta principal.

---

## 2. Stack técnica

### Backend

| Camada | Tecnologia | Versão |
|---|---|---|
| Linguagem | Java | 21 |
| Framework | Spring Boot | 3.4.x |
| ORM | Spring Data JPA + Hibernate | 6.x |
| Banco de dados | PostgreSQL | 16 |
| Migrations | Flyway | Community |
| Autenticação | Spring Security + JWT (jjwt) | 0.12.x |
| Validação | Jakarta Bean Validation | 3.x |
| Cache | Caffeine | 3.x |
| HTTP client | Spring RestClient | (nativo) |
| Storage | AWS SDK v2 (S3-compatible → Cloudflare R2) | 2.25.x |
| Build | Maven | 3.9.x |

Package base: `br.com.codice.api`

### Frontend

| Camada | Tecnologia | Versão |
|---|---|---|
| Build tool | Vite | 5.x |
| Framework | React | 18.x |
| Linguagem | TypeScript | 5.x |
| Estilização | Tailwind CSS | v4 |
| Componentes UI | shadcn/ui | latest (style: new-york) |
| State (servidor) | TanStack Query | 5.x |
| Roteamento | React Router | 6.x |
| Formulários | React Hook Form + Zod | 7.x / 3.x |
| Path alias | `@/*` → `src/*` |

### Infraestrutura

| Componente | Provedor | Detalhes |
|---|---|---|
| Backend (API) | Railway | Container Docker, auto-deploy via main |
| Banco (Postgres) | Railway | Gerenciado, extensões pg_trgm + pgvector + pgcrypto |
| Frontend (SPA) | Vercel | Deploy automático, SPA rewrite |
| Storage (fotos) | Cloudflare R2 | S3-compatible, presigned upload |
| Domínio | Registro.br | codice.com.br (quando configurado) |

### Extensões PostgreSQL ativas

- `pgcrypto` — gen_random_uuid() para UUIDs
- `pg_trgm` — similarity() para busca fuzzy de livros sem ISBN
- `vector` — preparado para RAG do Livro dos Livros (Fase 2, não implementado ainda)

---

## 3. Estrutura do repositório

Monorepo em `codice/`:

```
codice/
├── CLAUDE.md                    # Instruções permanentes para Claude Code
├── README.md
├── backend/
│   ├── Dockerfile               # Multi-stage: JDK build + JRE runtime
│   ├── .dockerignore
│   ├── pom.xml
│   ├── mvnw / .mvn/
│   ├── railway.toml
│   ├── ENV.md                   # Documentação de variáveis de ambiente
│   ├── README.md
│   ├── http/                    # Arquivos .http para testes manuais (IntelliJ)
│   │   ├── auth.http
│   │   ├── books-and-seed.http
│   │   ├── admin.http
│   │   ├── listings.http
│   │   ├── search.http
│   │   ├── lookup.http
│   │   ├── interests.http
│   │   ├── uploads.http
│   │   └── schema-smoke-test.sql
│   └── src/main/
│       ├── java/br/com/codice/api/
│       │   ├── ApiApplication.java
│       │   ├── config/
│       │   │   ├── CorsConfig.java
│       │   │   └── SecurityConfig.java
│       │   ├── common/
│       │   │   ├── GlobalExceptionHandler.java
│       │   │   ├── SlugService.java
│       │   │   └── PriceFormatter.java
│       │   ├── user/
│       │   │   ├── User.java (entity)
│       │   │   ├── UserRepository.java
│       │   │   └── UserController.java (GET /me)
│       │   ├── auth/
│       │   │   ├── AuthController.java
│       │   │   ├── dto/ (RegisterRequest, LoginRequest, AuthResponse, UserResponse)
│       │   │   └── jwt/
│       │   │       ├── JwtService.java
│       │   │       └── JwtAuthenticationFilter.java
│       │   ├── book/
│       │   │   ├── Book.java (entity)
│       │   │   ├── BookRepository.java
│       │   │   ├── BookController.java
│       │   │   └── dto/ (BookResponse, BookListItem, BookDetailResponse, BookSearchResult, BookFuzzyMatch)
│       │   ├── seller/
│       │   │   ├── Seller.java (entity)
│       │   │   ├── SellerRepository.java
│       │   │   ├── SellerController.java
│       │   │   └── dto/ (CreateSellerProfileRequest, SellerProfileResponse)
│       │   ├── listing/
│       │   │   ├── Listing.java (entity)
│       │   │   ├── ListingPhoto.java (entity)
│       │   │   ├── ListingRepository.java
│       │   │   ├── ListingService.java
│       │   │   ├── ListingController.java
│       │   │   └── dto/ (CreateListingRequest, ManualBookData, ListingPhotoInput, ListingResponse, etc.)
│       │   ├── lookup/
│       │   │   ├── LookupController.java
│       │   │   ├── BookLookupService.java
│       │   │   ├── IsbnValidator.java
│       │   │   ├── client/
│       │   │   │   ├── GoogleBooksClient.java
│       │   │   │   └── OpenLibraryClient.java
│       │   │   └── dto/ (BookLookupResponse)
│       │   ├── interest/
│       │   │   ├── InterestThread.java (entity)
│       │   │   ├── Message.java (entity)
│       │   │   ├── ThreadReadStatus.java (entity)
│       │   │   ├── InterestService.java
│       │   │   ├── InterestController.java
│       │   │   └── dto/ (CreateInterestRequest, SendMessageRequest, ThreadResponse, MessageResponse, UnreadCountResponse)
│       │   ├── storage/
│       │   │   ├── StorageService.java
│       │   │   ├── UploadController.java
│       │   │   └── dto/ (PresignedUploadRequest, PresignedUploadResponse)
│       │   └── admin/
│       │       ├── AdminBootstrapController.java
│       │       ├── AdminListingController.java
│       │       ├── SeedController.java
│       │       └── SeedService.java
│       └── resources/
│           ├── application.yml
│           ├── application-prod.yml
│           ├── db/migration/
│           │   ├── V1__baseline.sql
│           │   ├── V2__create_app_metadata.sql
│           │   ├── V3__create_users.sql
│           │   ├── V4__create_books.sql
│           │   ├── V5__create_sellers.sql
│           │   ├── V6__create_listings.sql
│           │   ├── V7__create_listing_photos.sql
│           │   ├── V8__add_admin_and_moderation_fields.sql
│           │   ├── V9__add_fulltext_search.sql
│           │   └── V10__create_interest_and_messages.sql
│           └── seed/
│               ├── books.json (~100 livros)
│               ├── sellers.json (12 sellers)
│               └── listings.json (~150-200 listings)
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
│   ├── components.json (shadcn)
│   ├── vercel.json
│   ├── .env.development
│   ├── .env.production
│   ├── public/
│   │   └── favicon.svg
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css (Tailwind + @theme tokens + shadcn variables + dark mode)
│       ├── api/
│       │   ├── client.ts (apiFetch com interceptor JWT + redirect 401)
│       │   ├── auth.ts
│       │   ├── books.ts
│       │   ├── listings.ts (inclui seller profile)
│       │   ├── interests.ts
│       │   ├── uploads.ts
│       │   └── admin.ts
│       ├── hooks/
│       │   ├── useAuth.ts (consome AuthContext)
│       │   ├── useHealth.ts
│       │   ├── useBookSearch.ts
│       │   ├── useBook.ts
│       │   ├── useAcademicAreas.ts
│       │   ├── useActiveStates.ts
│       │   ├── useUnreadCount.ts
│       │   ├── useThreads.ts
│       │   ├── useThreadMessages.ts
│       │   ├── useTheme.ts
│       │   └── usePageTitle.ts
│       ├── contexts/
│       │   └── auth-context.tsx
│       ├── lib/
│       │   ├── query-client.ts
│       │   ├── auth-storage.ts (localStorage wrapper)
│       │   ├── format.ts (formatPrice, formatCondition, formatListingStatus, formatProfileType, formatRelativeDate, formatMessageTime, formatMessageDate)
│       │   └── schemas/
│       │       ├── auth.ts (loginSchema, registerSchema)
│       │       ├── seller.ts
│       │       └── listing.ts
│       ├── components/
│       │   ├── ui/ (shadcn: button, input, card, form, badge, table, dialog, textarea, tabs, radio-group, avatar, sonner, select, separator, skeleton, alert, scroll-area, tooltip, sheet, dropdown-menu, pagination)
│       │   ├── layout/
│       │   │   └── AppShell.tsx (header responsivo + footer)
│       │   ├── ProtectedRoute.tsx
│       │   ├── ProtectedAdminRoute.tsx
│       │   ├── BookCard.tsx
│       │   ├── AcademicAreaBadge.tsx
│       │   ├── ConditionBadge.tsx
│       │   ├── PhotoGallery.tsx
│       │   ├── PhotoUploader.tsx
│       │   ├── ThemeToggle.tsx
│       │   └── chat/
│       │       ├── MessageBubble.tsx
│       │       ├── MessageInput.tsx
│       │       └── DateSeparator.tsx
│       └── pages/
│           ├── Home.tsx
│           ├── SearchPage.tsx
│           ├── BookPage.tsx
│           ├── LoginPage.tsx
│           ├── RegisterPage.tsx
│           ├── PerfilPage.tsx
│           ├── NotFoundPage.tsx
│           ├── sell/
│           │   ├── SellPage.tsx (wrapper de decisão por profileType)
│           │   ├── SellerDashboard.tsx
│           │   ├── SellerProfileForm.tsx
│           │   ├── CreateListingWizard.tsx (4 passos)
│           │   └── MyListings.tsx
│           ├── conversations/
│           │   ├── ConversationsPage.tsx (lista de threads)
│           │   └── ConversationDetailPage.tsx (chat)
│           └── admin/
│               ├── AdminLayout.tsx
│               ├── ModerationQueue.tsx
│               └── AllListings.tsx
├── infra/
│   ├── docker-compose.yml (Postgres 16 + Adminer)
│   ├── postgres/init/01-extensions.sql
│   └── README.md
└── docs/
    ├── README.md (índice da documentação)
    ├── claude-playbook.md (workflow operacional, web-only)
    ├── codice-technical-reference.md (este arquivo)
    ├── codice-brand-reference.md
    ├── Codice_Documento_Mestre.pdf
    ├── Codice_Brief_Livro_dos_Livros.pdf
    ├── Codice_Brief_Logo.pdf
    ├── adr/ (Architecture Decision Records)
    ├── deploy/
    │   ├── railway.md
    │   └── vercel.md
    └── prompts/
        ├── M13.md ... M24.md (prompts dos milestones para Claude Code)
        └── visual/V01..V03.md (prompts da trilha de identidade visual)
```

---

## 4. Modelo de dados

### Diagrama de entidades

```
users
├── id: UUID (PK)
├── email: VARCHAR(255) UNIQUE
├── password_hash: VARCHAR(255)
├── name: VARCHAR(120)
├── profile_type: VARCHAR(32) [BUYER | BOOKSTORE | INDIVIDUAL_SELLER]
├── is_admin: BOOLEAN DEFAULT false
├── consented_privacy_at: TIMESTAMPTZ
├── created_at: TIMESTAMPTZ
└── updated_at: TIMESTAMPTZ

sellers (1:1 opcional com users)
├── id: UUID (PK)
├── user_id: UUID UNIQUE → users(id) CASCADE
├── seller_type: VARCHAR(32) [BOOKSTORE | INDIVIDUAL]
├── public_name: VARCHAR(150)
├── slug: VARCHAR(120) UNIQUE
├── description: TEXT
├── banner_image_url: VARCHAR(500)
├── avatar_image_url: VARCHAR(500)
├── city: VARCHAR(120)
├── state: VARCHAR(2)
├── neighborhood: VARCHAR(120)
├── created_at: TIMESTAMPTZ
└── updated_at: TIMESTAMPTZ

books
├── id: UUID (PK)
├── slug: VARCHAR(200) UNIQUE NOT NULL
├── title: VARCHAR(300) NOT NULL
├── authors: TEXT NOT NULL
├── publisher: VARCHAR(200)
├── publication_year: SMALLINT
├── edition: VARCHAR(50)
├── language: VARCHAR(10) DEFAULT 'pt-BR'
├── isbn: VARCHAR(20) (UNIQUE parcial WHERE NOT NULL)
├── translator: VARCHAR(200)
├── academic_areas: TEXT[]
├── synopsis: TEXT
├── cover_image_url: VARCHAR(500)
├── search_vector: TSVECTOR (auto-atualizado por trigger)
├── created_at: TIMESTAMPTZ
└── updated_at: TIMESTAMPTZ

listings
├── id: UUID (PK)
├── seller_id: UUID → sellers(id) CASCADE
├── book_id: UUID → books(id) RESTRICT
├── price_cents: INTEGER CHECK > 0
├── condition: VARCHAR(20) [NOVO | COMO_NOVO | MUITO_BOM | BOM | ACEITAVEL]
├── condition_notes: TEXT
├── description: TEXT
├── status: VARCHAR(20) DEFAULT 'PENDING_REVIEW' [PENDING_REVIEW | ACTIVE | PAUSED | SOLD]
├── moderation_note: TEXT
├── published_at: TIMESTAMPTZ
├── created_at: TIMESTAMPTZ
└── updated_at: TIMESTAMPTZ

listing_photos
├── id: UUID (PK)
├── listing_id: UUID → listings(id) CASCADE
├── url: VARCHAR(500)
├── position: SMALLINT
├── photo_type: VARCHAR(20) [COVER_FRONT | SPINE_BACK | INNER_DETAIL | DEFECT | TITLE_PAGE | OTHER]
├── created_at: TIMESTAMPTZ
└── UNIQUE(listing_id, position)

interest_threads
├── id: UUID (PK)
├── listing_id: UUID → listings(id) CASCADE
├── buyer_id: UUID → users(id) CASCADE
├── status: VARCHAR(20) DEFAULT 'OPEN' [OPEN | CLOSED | SOLD]
├── last_message_at: TIMESTAMPTZ
├── created_at: TIMESTAMPTZ
├── updated_at: TIMESTAMPTZ
└── UNIQUE(listing_id, buyer_id)

messages
├── id: UUID (PK)
├── thread_id: UUID → interest_threads(id) CASCADE
├── sender_id: UUID → users(id) SET NULL
├── content: TEXT CHECK length > 0 AND length <= 2000
└── created_at: TIMESTAMPTZ

thread_read_status
├── thread_id: UUID → interest_threads(id) CASCADE  ┐ PK
├── user_id: UUID → users(id) CASCADE                ┘
└── last_read_at: TIMESTAMPTZ

app_metadata
├── key: VARCHAR(100) (PK)
└── value: TEXT
```

### Relações

```
User 1 ─── 0..1 Seller
Seller 1 ─── * Listing
Book 1 ─── * Listing
Listing 1 ─── * ListingPhoto
Listing 1 ─── * InterestThread
User (buyer) 1 ─── * InterestThread
InterestThread 1 ─── * Message
User (sender) 1 ─── * Message
InterestThread * ─── * User (via ThreadReadStatus)
```

### Índices notáveis

- `books.isbn` — unique parcial WHERE isbn IS NOT NULL
- `books.title` — GIN com gin_trgm_ops (fuzzy match)
- `books.academic_areas` — GIN (filtro por array)
- `books.search_vector` — GIN (full-text search)
- `listings(status, created_at DESC)` — composto para listagem de ativos
- `listings(created_at DESC) WHERE status = 'PENDING_REVIEW'` — parcial para fila de moderação
- `sellers(state, city)` — filtro de localização

### Triggers

- `trigger_set_updated_at()` — atualiza `updated_at` em books, sellers, listings, interest_threads
- `books_search_vector_update()` — recalcula tsvector com pesos A (título), B (autores), C (sinopse), D (editora)

---

## 5. Endpoints da API

### Públicos (sem autenticação)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/actuator/health` | Healthcheck |
| POST | `/auth/register` | Cadastro de usuário |
| POST | `/auth/login` | Login, retorna JWT |
| GET | `/books/search` | Busca full-text com filtros (q, area, condition, priceMin, priceMax, state, sort) |
| GET | `/books/{slug}` | Detalhes do livro com ofertas ativas |
| GET | `/books/academic-areas` | Áreas acadêmicas distintas com oferta ativa |
| GET | `/books/search/fuzzy` | Busca fuzzy por título via pg_trgm |
| GET | `/sellers/active-states` | UFs com sellers ativos |
| GET | `/lookup/isbn/{isbn}` | Lookup de metadados via Google Books / Open Library |

### Autenticados (requer Bearer JWT)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/me` | Dados do usuário logado |
| POST | `/sellers/profile` | Criar perfil de seller (BOOKSTORE obrigatório, INDIVIDUAL auto-provisionado) |
| GET | `/sellers/me` | Perfil de seller do usuário logado |
| POST | `/listings` | Criar anúncio (listing + book se necessário) |
| GET | `/listings/mine` | Anúncios do seller logado |
| POST | `/uploads/presign` | Gerar URL pré-assinada para upload de foto |
| POST | `/uploads/presign-batch` | Gerar múltiplas URLs pré-assinadas |
| POST | `/interests` | Manifestar interesse (cria thread + primeira mensagem) |
| GET | `/interests/threads` | Listar threads do usuário (buyer + seller) |
| GET | `/interests/threads/{id}/messages` | Mensagens de uma thread (marca como lida) |
| POST | `/interests/threads/{id}/messages` | Enviar mensagem |
| GET | `/interests/unread-count` | Total de threads com mensagens não lidas |

### Admin (requer Bearer JWT + role ADMIN)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/admin/bootstrap` | Promover user a admin (requer header X-Admin-Secret) |
| POST | `/admin/seed` | Popular banco com dados de teste |
| GET | `/admin/listings` | Listar todos os listings (filtro por status) |
| POST | `/admin/listings/{id}/approve` | PENDING_REVIEW → ACTIVE |
| POST | `/admin/listings/{id}/pause` | ACTIVE → PAUSED (com nota opcional) |
| POST | `/admin/listings/{id}/resume` | PAUSED → ACTIVE |

### Autenticação

JWT com 7 dias de expiração. Claims: `sub` (userId), `email`, `profileType`, `isAdmin`. Header: `Authorization: Bearer <token>`.

Tipos de perfil: `BUYER` (só compra), `BOOKSTORE` (sebo, precisa de perfil de seller antes de anunciar), `INDIVIDUAL_SELLER` (pessoa física, seller auto-provisionado no primeiro anúncio).

---

## 6. Fluxos principais

### Cadastro e autenticação
1. User se registra com email, senha, nome, profileType, aceite de privacidade
2. Backend retorna JWT → frontend salva em localStorage → auto-login
3. JWT injetado em toda request autenticada via interceptor no apiFetch

### Cadastro de anúncio (listing)
1. Vendedor acessa /vender
2. Se BOOKSTORE sem perfil → formulário de perfil de seller → POST /sellers/profile
3. Se INDIVIDUAL_SELLER → seller auto-provisionado no backend
4. Wizard de 4 passos: ISBN ou manual → detalhes → fotos (upload real via R2) → revisão
5. POST /listings → listing nasce PENDING_REVIEW
6. Admin aprova no painel → listing vira ACTIVE com published_at

### Resolução de book no cadastro
1. Se ISBN fornecido: busca book existente por ISBN → se não existe, lookup Google Books → fallback Open Library → se achou, cria book → se não achou e tem dados manuais, cria com dados manuais
2. Se sem ISBN: dados manuais obrigatórios → fuzzy match por pg_trgm → se match forte (>0.8), reusa → senão cria novo

### Busca e navegação
1. Home: hero com busca + grid de livros recentes + áreas acadêmicas
2. Busca: full-text via tsvector (pesos: título A, autores B, sinopse C, editora D) → fallback fuzzy se 0 resultados
3. Filtros cumulativos: área, condição (hierárquica), preço, UF do seller
4. Página do livro: detalhes + lista de ofertas ativas ordenadas por preço

### Manifestação de interesse
1. Comprador clica "Tenho interesse" na oferta → dialog com textarea → POST /interests
2. Backend cria thread (UNIQUE por listing+buyer) + primeira mensagem
3. Vendedor vê badge de não lidas no header → abre /conversas → lê mensagem
4. Troca de mensagens via polling (15s threads, 5s mensagens ativas)
5. Leitura marca como lida via ThreadReadStatus (last_read_at vs message.created_at)

### Upload de fotos
1. Frontend pede presigned URL → POST /uploads/presign
2. Frontend faz PUT direto no Cloudflare R2 com o arquivo
3. Frontend usa publicUrl retornada no CreateListingRequest

### Moderação
1. Admin acessa /admin/moderacao → vê listings PENDING_REVIEW
2. Pode aprovar (→ ACTIVE), pausar com nota (→ PAUSED), ou despausar (→ ACTIVE)
3. Listings ACTIVE aparecem no catálogo público, PAUSED/PENDING não

---

## 7. Identidade visual

Fonte operacional única: [`codice-brand-reference.md`](./codice-brand-reference.md). Cobre paleta (light/dark), tipografia (Fraunces / Source Serif 4 / Inter), tokens Tailwind, layout, tom de voz, vocabulário, mascote e logo.

Documentos canônicos (PDF) em `docs/Codice_Documento_Mestre.pdf`, `docs/Codice_Brief_Livro_dos_Livros.pdf` e `docs/Codice_Brief_Logo.pdf` — consulte se o `.md` de brand não cobrir.

---

## 8. Configuração e variáveis de ambiente

### Desenvolvimento local

```bash
# Subir Postgres
cd infra && docker compose up -d

# Subir backend
cd backend && ./mvnw spring-boot:run

# Subir frontend
cd frontend && npm run dev
```

Postgres: localhost:5432, db `codice`, user `codice`, senha `codice_dev`.
Backend: http://localhost:8080
Frontend: http://localhost:5173
Adminer: http://localhost:8081

### Variáveis de ambiente (produção)

| Variável | Componente | Descrição |
|---|---|---|
| DATABASE_URL | Backend | JDBC URL do Postgres |
| DATABASE_USERNAME | Backend | User do Postgres |
| DATABASE_PASSWORD | Backend | Senha do Postgres |
| PORT | Backend | Porta HTTP |
| JWT_SECRET | Backend | Secret JWT (min 256 bits) |
| ADMIN_SEED_SECRET | Backend | Secret do header X-Admin-Secret |
| GOOGLE_BOOKS_API_KEY | Backend | API key do Google Books |
| CORS_ALLOWED_ORIGINS | Backend | Origins permitidos (CSV) |
| SPRING_PROFILES_ACTIVE | Backend | `prod` |
| R2_ENDPOINT | Backend | Endpoint S3 do Cloudflare R2 |
| R2_ACCESS_KEY | Backend | Access key do R2 |
| R2_SECRET_KEY | Backend | Secret key do R2 |
| R2_BUCKET | Backend | Nome do bucket |
| R2_PUBLIC_URL | Backend | URL pública do bucket |
| VITE_API_URL | Frontend | URL base da API (build time) |

---

## 9. Dados de seed

O seed contém ~100 livros reais brasileiros e traduzidos, distribuídos em 8 áreas acadêmicas:

- Literatura Brasileira (~20): Machado, Clarice, Guimarães Rosa, Graciliano, Jorge Amado...
- Filosofia (~15): Platão, Nietzsche, Heidegger, Arendt, Foucault, Deleuze, Marilena Chauí...
- Sociologia e Antropologia (~15): Bourdieu, Florestan Fernandes, Darcy Ribeiro, Lévi-Strauss, Milton Santos...
- Direito (~12): Kelsen, Bobbio, Miguel Reale, Barroso, Lênio Streck...
- História (~12): Boris Fausto, Hobsbawm, Lilia Schwarcz, Laura de Mello e Souza...
- Letras e Crítica Literária (~10): Antonio Candido, Roberto Schwarz, Bakhtin, Alfredo Bosi...
- Psicologia e Psicanálise (~8): Freud, Lacan, Winnicott, Maria Rita Kehl...
- Educação e Pedagogia (~8): Paulo Freire, Vygotsky, Piaget, Dermeval Saviani...

12 sellers fictícios (8 sebos + 4 pessoas físicas), todos em São Paulo capital com bairros variados.

~150-200 listings distribuídos: ~70% ACTIVE, ~15% PENDING_REVIEW, ~10% PAUSED, ~5% SOLD. Preços realistas (R$ 8-200). Condições variadas. Fotos placeholder via picsum.photos.

---

## 10. Convenções de código

### Backend (Java)
- Records para DTOs
- Constructor injection (sem @Autowired em campo)
- Validação com @Valid + Bean Validation
- @Transactional no service, nunca no controller
- Migrations Flyway: `V{n}__descricao_em_snake_case.sql`
- ddl-auto: validate (Hibernate valida, nunca altera schema)
- Sem Lombok

### Frontend (TypeScript)
- `function Component()` (não arrow function para componentes)
- Imports absolutos com `@/`
- Tipagem estrita, `any` só com justificativa
- Componentes em PascalCase.tsx, hooks em useCamelCase.ts
- Estado de servidor via TanStack Query (não local state pra dados da API)
- Formulários via React Hook Form + Zod
- Estilos via Tailwind utilities + tokens da marca

### Commits
- Conventional Commits: `feat(backend): ...`, `fix(frontend): ...`, `chore: ...`
- Trabalho direto em main (solo founder)

---

## 11. Histórico de milestones

Cada milestone = 1 sessão de trabalho de 1-2h, entrega verificável ao final.

### Fase 0 — Fundação Técnica

| # | Nome | Entrega | Duração |
|---|---|---|---|
| M01 | Repositório e estrutura | Monorepo no GitHub com backend/, frontend/, infra/, docs/ | 30min |
| M02 | Postgres local | Docker Compose com PG16 + pgvector + pg_trgm + Adminer | 30min |
| M03 | Bootstrap Spring Boot | Spring Boot 3 + healthcheck /actuator/health conectando no PG | 1h |
| M04 | Primeira migration Flyway | Pipeline Flyway confirmado com tabela app_metadata | 20min |
| M05 | Bootstrap React | Vite + React + TS + Tailwind + shadcn + TanStack Query + React Router | 1h |
| M06 | Front↔Back conectados | Frontend chama /actuator/health, mostra status online/offline, CORS configurado | 30min |
| M07 | Auth backend | Tabela users, POST /auth/register, POST /auth/login, GET /me, JWT 7d, bcrypt, 3 perfis | 1.5h |
| M08 | Auth frontend | Páginas /login, /cadastro, /perfil, JWT em localStorage, ProtectedRoute, auto-login pós-cadastro | 1.5h |

### Fase 1 — MVP Público

| # | Nome | Entrega | Duração |
|---|---|---|---|
| M09 | Schema de domínio | Migrations V4-V7: books, sellers, listings, listing_photos com FKs, índices, triggers | 1h |
| M10 | Entities + seed + API de books | Entities JPA, repositórios, SlugService, seed de 8 livros, GET /books, GET /books/{slug} | 1.5h |
| M11 | Admin + moderação | Role ADMIN no JWT, bootstrap de admin, painel frontend com fila de moderação e listagem | 2h |
| M12 | Lookup de ISBN | GET /lookup/isbn/{isbn} via Google Books + fallback Open Library, cache Caffeine 24h | 1h |
| M13 | Cadastro de anúncio (backend) | POST /listings com resolução de book (ISBN/manual/fuzzy), auto-provision de seller, perfil de seller | 1.5h |
| M14 | Cadastro de anúncio (frontend) | Wizard de 4 passos: ISBN→dados→fotos→revisão, perfil de seller pra BOOKSTORE, meus anúncios | 2h |
| M15 | Busca + página do livro | Full-text search com tsvector, filtros (área, preço, condição, UF), home redesenhada, página do livro com ofertas | 2h |
| M16 | Mensageria (backend) | Tabelas interest_threads + messages + thread_read_status, endpoints CRUD, unread count | 1.5h |
| M17 | Mensageria (frontend) | Botão "Tenho interesse" funcional, tela de conversas, chat com polling, badge de não lidas | 2h |

### Deploy e Storage

| # | Nome | Entrega | Duração |
|---|---|---|---|
| M18 | Deploy backend | Dockerfile multi-stage, application-prod.yml, CORS via env var, docs de deploy Railway | 1h |
| M19 | Upload de fotos (R2) | Presigned upload via Cloudflare R2, PhotoUploader no frontend, fotos reais nos listings | 1.5h |
| M20 | Deploy frontend | vercel.json com SPA rewrite, meta tags, página 404, docs de deploy Vercel | 1h |

### Seed e Polimento

| # | Nome | Entrega | Duração |
|---|---|---|---|
| M21 | Seed expandido | ~100 livros reais, 12 sebos SP, ~150-200 listings, dados em JSON, sinopses originais | 2h |
| M22 | Design tokens | Fontes (Fraunces, Source Serif 4, Inter), paleta no Tailwind, shadcn customizado | 1.5h |
| M23 | Layout e responsividade | AppShell com header/footer, grid responsivo, todas as páginas polidas mobile-first | 2h |
| M24 | Dark mode + microcopy | Toggle claro/escuro/sistema, vocabulário do Códice aplicado, estados vazios com personalidade, favicon | 2h |

### Totais

- **24 milestones completados**
- **~32 horas de trabalho estimadas**
- **10 migrations Flyway**
- **~100 livros no catálogo de seed**
- **~30 endpoints na API**
- **~25 páginas/componentes de página no frontend**

---

## 12. O que NÃO existe ainda (fora do MVP)

Funcionalidades explicitamente adiadas conforme Documento Mestre:

- **Pagamento real** — gateway, taxa, checkout (Fase 3)
- **Logística** — integração com Correios, envio (Fase 3)
- **Avaliação pós-compra** — reputação de vendedor (Fase 3)
- **Livro dos Livros (chat IA)** — RAG sobre catálogo, recomendação conversacional (Fase 2)
- **Biblioteca pessoal** — livros que o user possui, "disponível para venda" em 1 clique (Fase 2)
- **Favoritos / estante** — salvar livros de interesse (Fase 2)
- **Email transacional** — confirmações, notificações de interesse (Fase 2)
- **Edição de perfil / listing** — atualizar dados após criação
- **Recuperação de senha** — fluxo de reset
- **Verificação de email** — confirmação de cadastro
- **OAuth / social login**
- **Refresh token** — JWT simples com 7d
- **App mobile nativo** — PWA ou React Native (Fase 3-4)
- **SEO** — schema.org, sitemap, meta tags dinâmicas por página
- **Analytics** — tracking de eventos
- **Importação em massa** — CSV de catálogo para sebos (Fase 4)
- **OCR de estante** — identificação visual de livros por foto
- **Recomendação algorítmica** — ML baseado em histórico
- **Bloqueio/report** — moderação de usuários abusivos
- **Busca por similaridade vetorial** — pgvector pra embeddings (Fase 2)
- **Notificação push / email de mensagens**
- **WebSocket / SSE** — real-time (mensageria usa polling)

---

## 13. Decisões arquiteturais relevantes

1. **Boring tech** — Postgres em vez de banco vetorial exótico, Spring Boot em vez de framework novo, React em vez de hype.
2. **Book vs Listing separados** — Book é a obra canônica, Listing é uma oferta concreta de um exemplar. Vários listings apontam pro mesmo book.
3. **ISBN nullable** — livros raros e antigos não têm ISBN. Busca fuzzy por pg_trgm resolve duplicatas.
4. **Preço em centavos** — INTEGER, não DECIMAL. Evita ponto flutuante.
5. **Seller como tabela separada** — extensão opcional de users. Nem todo user é seller.
6. **PENDING_REVIEW obrigatório** — curadoria como diferencial. Gargalo manual aceito.
7. **Mensageria interna** — não revela contato pessoal. Protege dados, gera métricas.
8. **JWT em localStorage** — vulnerável a XSS, aceitável no MVP. TODO: migrar pra cookie httpOnly.
9. **Polling, não WebSocket** — 15s threads, 5s chat ativo. Simples, funcional.
10. **Upload via presigned URL** — frontend faz PUT direto no R2, backend não toca no arquivo.
11. **Full-text + fuzzy como fallback** — tsvector com pesos pra relevância, pg_trgm quando 0 resultados.
12. **Auto-provision de seller** — INDIVIDUAL_SELLER ganha seller automaticamente no primeiro anúncio. BOOKSTORE precisa preencher perfil.
13. **Dark mode: bordô → dourado** — decisão estética do Doc Mestre, bordô em fundo escuro "vira sangue".

---

*Documento gerado em abril de 2026. Reflete o estado do projeto após conclusão do milestone M24.*
