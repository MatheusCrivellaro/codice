---
argument-hint: "M{N}"
description: Fecha milestone — checklist, diff do technical-reference, commit sugerido
---

Feche o milestone `$ARGUMENTS`.

## Ordem de execução

1. **Confirme que o milestone existe** em `docs/prompts/$ARGUMENTS.md`. Se não existir, pare e peça o número correto.

2. **Leia o critério de pronto** do arquivo do milestone. Liste os itens como checklist para eu confirmar um a um. Não prossiga enquanto eu não confirmar que todos passaram.

3. **Audite mudanças estruturais.** Verifique se houve:
   - Nova migration Flyway em `backend/src/main/resources/db/migration/`. Se sim, confira que seguiu as regras de `.claude/rules/migrations.md` (numeração, nomenclatura, nunca alterar commitada).
   - Novos endpoints na API. Liste método + rota + autenticação requerida.
   - Novas entities/tabelas. Liste.
   - Novos componentes/páginas de frontend. Liste.
   - Novas variáveis de ambiente. Se sim, confira que `backend/ENV.md` foi atualizado.

4. **Proponha diff do `codice-technical-reference.md`** se houver mudança estrutural. Mostre:
   - Seções afetadas (§3 estrutura, §4 modelo de dados, §5 endpoints, §11 histórico de milestones).
   - Trecho atual (2-4 linhas) e trecho proposto lado a lado.
   - Nunca edite sem minha aprovação explícita.

5. **Confira secrets.** Rode uma varredura rápida em arquivos modificados em busca de:
   - `application.yml` com valores não-placeholder em `jwt.secret`, `admin.seed-secret`, credenciais R2, API keys.
   - Tokens hardcoded em código Java ou TypeScript.
   - Se encontrar, pare e reporte antes de sugerir commit.

6. **Sugira mensagem de commit** em Conventional Commits (português), seguindo o padrão dos M01-M24:
   ```
   feat(backend): {descrição} (M{N})
   feat(frontend): {descrição} (M{N})
   feat: {descrição} (M{N})     # quando toca ambos
   ```

7. **Finalize.** Se tudo acima passou e o diff do technical-reference foi aplicado, confirme que `M{N}` está fechado. Sugira o próximo milestone baseado no roadmap (se existir) ou pergunte qual é.

## Regras

- Nunca rode `git commit` automaticamente. Sugira a mensagem, deixe eu commitar.
- Nunca edite `codice-technical-reference.md` sem minha aprovação explícita do diff proposto.
- Se o checklist falhar em algum item, pare e me ajude a entender por quê. Não feche milestone com pendência.
- Se encontrar bug latente fora do escopo deste milestone, aponte separadamente — não tente consertar aqui.
