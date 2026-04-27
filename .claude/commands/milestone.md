---
argument-hint: "M{N} {título curto}"
description: Abre um novo milestone no padrão Códice (docs/prompts/M{N}.md)
---

Inicie o milestone `$ARGUMENTS`.

## Ordem de execução

1. **Extraia número e título** do argumento. Ex: `M25 adicionar favoritos` → número `M25`, título `adicionar favoritos`.

2. **Confira que o milestone não existe ainda** em `docs/prompts/`. Se já existe, pare e avise.

3. **Liste os milestones anteriores** numerando até `M24`. Verifique que `$ARGUMENTS` é contínuo (sem pular número). Se houver salto, pergunte antes de seguir.

4. **Antes de criar o arquivo**, pergunte:
   - Qual é o problema de negócio que este milestone resolve? (uma frase)
   - Há decisões de produto pendentes que bloqueiam a execução? Liste-as explicitamente.
   - Este milestone mexe em schema (nova migration)? Em endpoint novo? Em frontend? Em ambos?
   - Qual o critério objetivo de "M{N} ok"? (o que você vai testar antes de fechar)
   - Há dependência de milestone anterior ou de configuração de infra (R2, Railway, env var nova)?

5. Com as respostas, crie `docs/prompts/M{N}.md` seguindo o esqueleto abaixo.

## Esqueleto obrigatório

```markdown
# M{N} — {Título}

Leia o CLAUDE.md antes de começar.

## Objetivo

{uma frase, escopo claro}

## Fora de escopo

{lista explícita do que NÃO entra — citado pelo usuário + o que for consequência óbvia}

## Contexto

{referências a milestones anteriores, entities, services, migrations existentes relevantes}

## Decisões já tomadas

{decisões de produto/arquitetura confirmadas na abertura do milestone}

## Implementação

{estrutura sugerida: arquivos a criar/editar, endpoints, schema de DTO, componentes}

## Critério de pronto

{checklist objetivo — o que precisa funcionar para declarar "M{N} ok"}

## Pegadinhas conhecidas

{lista de erros recorrentes do Claude Code relacionados ao escopo — veja exemplos nos M07-M17}

## Commit sugerido

```bash
git commit -m "{tipo}({escopo}): {descrição} (M{N})"
```
```

## Antes de gerar o arquivo

- **Plano antes de código.** Mostre o conteúdo completo do arquivo antes de criar. Espere eu confirmar.
- Consulte as rules relevantes (`.claude/rules/backend.md`, `migrations.md`, `frontend.md`, etc.) e aplique as convenções na seção "Implementação".
- Se o milestone envolve migration, confira em `backend/src/main/resources/db/migration/` qual é a próxima numeração.
- Não invente entities, endpoints ou decisões que eu não confirmei. Em caso de dúvida, pergunte.

## Depois do arquivo pronto

Diga exatamente como eu devo invocar o Claude Code para executar o milestone. Normalmente: `implemente o M{N} seguindo docs/prompts/M{N}.md`.
