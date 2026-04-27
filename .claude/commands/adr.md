---
argument-hint: "título curto da decisão"
description: Cria um Architecture Decision Record em docs/adr/
---

Crie um ADR para a decisão: `$ARGUMENTS`.

## Ordem de execução

1. **Liste ADRs existentes** em `docs/adr/`. Se o diretório não existir, crie-o.

2. **Determine a próxima numeração.** 4 dígitos, sequencial, começando em `0001`. Se o último é `0003-xxx.md`, o próximo é `0004`.

3. **Gere o slug** do título: kebab-case, sem acento, minúsculo, sem stopwords óbvias (de, do, da, o, a). Ex: `"Book e Listing separados"` → `book-listing-separados`.

4. **Antes de escrever o conteúdo**, pergunte:
   - Qual é o problema ou situação que motivou a decisão? (contexto)
   - Quais alternativas foram consideradas? Liste pelo menos duas — "não fazer nada" conta.
   - Qual foi a decisão?
   - Quais as consequências? Especificamente: o que esta decisão fecha (trade-off aceito) e o que mantém em aberto.
   - Status: `proposta`, `aceita`, `superada por ADR-NNNN`, `revertida`.

   Se alguma resposta vier genérica ou vazia, insista. ADR vago não serve.

5. **Gere o arquivo** `docs/adr/NNNN-{slug}.md` seguindo o template:

```markdown
# ADR NNNN — {Título}

Status: {proposta | aceita | superada por ADR-NNNN | revertida}
Data: YYYY-MM-DD

## Contexto

{2-5 parágrafos explicando o problema e o que torna a decisão necessária}

## Alternativas consideradas

- **{Alternativa A}** — {descrição curta e por que foi descartada}
- **{Alternativa B}** — {descrição curta e por que foi descartada}
- **{Alternativa escolhida}** — referenciada na próxima seção

## Decisão

{parágrafo direto: o que foi decidido}

## Consequências

- {o que esta decisão torna mais fácil}
- {o que esta decisão torna mais difícil}
- {o que esta decisão fecha — trade-off aceito}
- {o que esta decisão mantém em aberto}

## Referências

- `codice-technical-reference.md` §{N} se aplicável
- ADRs relacionadas, PRs, links externos
```

6. **Preencha a data** com a data de hoje no formato `YYYY-MM-DD`.

7. **Mostre o conteúdo final** antes de criar o arquivo. Espere aprovação.

8. Após criar, sugira:
   - Adicionar referência ao ADR em `codice-technical-reference.md` §13 (Decisões arquiteturais relevantes), se a decisão for de peso.
   - Commit: `docs: ADR NNNN — {título}`.

## Quando NÃO criar ADR

- Decisão trivial ou que segue convenção já estabelecida.
- Escolha de biblioteca padrão (shadcn, TanStack Query) que não tem alternativa real considerada.
- Fix de bug, refactor sem implicação arquitetural.

Se `$ARGUMENTS` cair em um desses, aponte e pergunte se quero seguir mesmo assim.
