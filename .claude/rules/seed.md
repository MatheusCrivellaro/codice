---
description: Regras do seed de dados do Códice
paths:
  - "backend/src/main/resources/seed/**/*.json"
  - "backend/src/main/java/br/com/codice/api/admin/SeedService.java"
  - "backend/src/main/java/br/com/codice/api/admin/SeedController.java"
---

# Seed — catálogo e dados de teste

Conteúdo atual do seed: `codice-technical-reference.md` §9. Cerca de 100 livros, 12 sellers, 150-200 listings.

## Critérios editoriais (inegociáveis)

O seed **não é dado de teste genérico**. É vitrine do posicionamento do Códice. Qualquer adição precisa passar em:

1. **Obras reais.** Nada de "Título Exemplo" ou "Autor Fictício". Livros que existem, autores que existem, editoras que existem.
2. **Foco acadêmico e literário brasileiro.** Preserve a distribuição: Literatura Brasileira, Filosofia, Sociologia e Antropologia, Direito, História, Letras e Crítica Literária, Psicologia e Psicanálise, Educação e Pedagogia. Sem YA, sem autoajuda, sem romance de banca.
3. **Sinopses originais.** Escritas no tom do Códice (ver `codice-brand-reference.md` — caloroso-sóbrio, sem clichê de orelha comercial). Nunca copie sinopse de editora ou Wikipedia.
4. **Sellers paulistanos.** 12 sellers existentes, 8 sebos + 4 pessoas físicas, todos em São Paulo capital, bairros variados. Se adicionar seller, mantenha a proporção e cidade.
5. **Distribuição de status dos listings:** ~70% ACTIVE, ~15% PENDING_REVIEW, ~10% PAUSED, ~5% SOLD. Reflete o estado real de um marketplace com moderação.
6. **Preços realistas.** R$ 8 a R$ 200. Edição rara e sebo universitário na ponta alta, livro comum na ponta baixa. Centavos, sempre (`"priceCents": 3500` para R$ 35,00).

## Estrutura dos arquivos

Três arquivos em `backend/src/main/resources/seed/`:

- `books.json` — obras canônicas.
- `sellers.json` — vendedores (users + perfis).
- `listings.json` — ofertas, referenciando book e seller por slug.

Ordem de carga no `SeedService`: books → sellers → listings. Listings pode referenciar apenas book e seller já carregados.

## Referências cruzadas

Use slug de referência, não UUID. UUIDs mudam entre execuções; slug é estável.

```json
// listings.json
{
  "bookSlug": "grande-sertao-veredas",
  "sellerSlug": "sebo-da-vila",
  "priceCents": 4500,
  "condition": "MUITO_BOM"
}
```

Slug do book: gerado a partir do título + autor (ver `SlugService` no backend). Use o mesmo que o `SlugService` geraria, ou deixe o seed calcular.

## Fotos

Fotos placeholder via `picsum.photos` com seed estável:

```
https://picsum.photos/seed/livro-{slug}-1/800/1200
```

Seed estável = mesma imagem em cada execução. Nunca use `picsum.photos/random` — quebra consistência entre rebuilds.

Seller `bannerImageUrl` e `avatarImageUrl` também picsum com seed próprio.

## O que NÃO fazer no seed

- Não gere livros com LLM sem curadoria. Inventar obra é pior que deixar catálogo menor.
- Não use Lorem Ipsum em sinopse. Escreva ou omita.
- Não adicione área acadêmica nova sem decisão explícita minha. As 8 existentes são a estrutura editorial — área nova muda o shape do site.
- Não misture livros de ficção genérica (bestsellers comerciais) no seed. Códice é acervo curado, não lista da Amazon.
- Não rode `/admin/seed` em produção sem confirmar. Operação é idempotente mas cara.

## Expansão incremental

Para adicionar 1 livro novo: adicione ao `books.json`, gere 1-3 listings em sebos diferentes no `listings.json`, rode `/admin/seed` local. Para adicionar área acadêmica nova: confirme comigo primeiro.
