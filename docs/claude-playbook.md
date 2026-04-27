# Claude Playbook — Códice

Este documento é seu, não do Claude. Não entra em contexto de sessão. É referência operacional sobre como usar a infraestrutura em `CLAUDE.md`, `.claude/rules/`, `.claude/commands/` e `.claude/agents/`.

Última atualização: abril 2026.

---

## Divisão de trabalho — onde fazer o quê

Antes de abrir qualquer sessão, decida onde o trabalho acontece.

### Claude Code CLI (no terminal, dentro do repo)

Trabalho que toca código, schema, configuração do projeto. Tudo que resulta em commit no `codice/`.

- Implementar milestone (M25 em diante).
- Criar ou revisar migration.
- Adicionar feature nova ou corrigir bug.
- Refatorar.
- Escrever teste (quando entrar).
- Editar arquivos de configuração (`application.yml`, `Dockerfile`, `vercel.json`).
- Debug de ambiente local.
- Auditar secrets, rodar `/revisar`, criar ADR.

### Projeto do Claude na web (esta interface)

Trabalho de planejamento, redação longa, design, discussão estratégica. Tudo que não termina em commit direto.

- Planejar fase nova (Fase 2: RAG, biblioteca pessoal).
- Escrever ou revisar Documento Mestre e briefs.
- Explorar alternativas arquiteturais antes de decidir (vira ADR depois).
- Gerar conteúdo denso (PDFs de brief, posts, material institucional).
- Roteiro de novos milestones em lote (como os M13-M24).
- Discussão de marca, tom de voz em profundidade.
- Auditar a própria infraestrutura (rules, commands, agentes).

### Regra de decisão

Se o output final é **código, schema ou configuração do repo**, Claude Code. Se o output final é **texto, plano ou decisão que depois vira código**, web.

Caso fronteiriço: prompt de milestone (`docs/prompts/Mn.md`). Escrever o prompt no web quando quiser pensar com calma, depois colar e executar no Claude Code. Ou usar `/milestone Mn título` direto no CLI se o escopo já está claro — o slash command faz o esqueleto.

---

## Abertura de sessão

### Setup básico (toda sessão)

```bash
cd ~/projetos/codice
claude
```

Sempre na raiz do monorepo. Nunca em `backend/` ou `frontend/` isolado — o CLAUDE.md e as rules dependem de você estar na raiz para funcionarem.

Primeira mensagem da sessão inclui intenção clara. Pelo menos um destes tipos:

- **Milestone novo:** `/milestone M25 adicionar favoritos`
- **Continuar milestone:** `implemente o M25 seguindo docs/prompts/M25.md`
- **Trabalho pontual:** `"quero adicionar índice em listings.seller_id porque a query X está lenta"`
- **Debug:** `"o endpoint /books/search está retornando 500 quando passo area=filosofia, investiga"`
- **Revisão:** `/revisar` ou `/revisar backend`

Sessão sem intenção clara rende pouco. Se você não sabe o que quer, abre o web primeiro, decide lá, volta pro CLI.

### Tipos de tarefa e como abrir

| Tipo | Abertura recomendada |
|---|---|
| Milestone grande | `/milestone Mn título` → confirma esqueleto → executa com prompt do `docs/prompts/Mn.md` |
| Mudança de schema | Cria migration direto, invoca `migration-reviewer` antes de aplicar |
| Bug pontual | Descreve sintoma + contexto + o que já tentou. Peça diagnóstico antes da correção |
| Refactor | Diga o escopo, a razão e o critério de pronto. Peça plano antes de tocar arquivos |
| Revisão de copy | Escreva (ou peça) o copy, depois invoque `editor-codice` |
| Trabalho exploratório | Use web, não CLI |

---

## Durante a sessão

### Plano antes de código

O CLAUDE.md força isso, mas às vezes o Claude pula. Se ele começar a editar antes de mostrar plano, interrompa com:

```
espera — me mostra o plano antes de editar arquivos
```

Isso é barato. Deixar seguir sem plano às vezes termina em reversão, que é cara.

### Escopo

Se o Claude começar a mexer em coisa fora do pedido:

```
fora de escopo — volta pro que eu pedi. o que você viu anota como bug latente
```

Convenção explícita do CLAUDE.md. Usa sem peso.

### Correção

Claude errou. Você nota. Não reescreva o prompt inteiro. Direcione:

```
o fuzzy match está sem cast. similarity() precisa de text, coluna é varchar
```

Curto, técnico, aponta o erro. Deixa ele corrigir.

### Compact / limpeza de contexto

Se a sessão está longa (>1h, muitos arquivos tocados), o contexto vai estar poluído. Dois sintomas:

- Claude começa a repetir coisa que já foi discutida.
- Respostas ficam mais rasas, menos específicas.

Ação: fecha a sessão, abre outra, recomeça com intenção limpa. Se está no meio de milestone, salva o estado:

```
antes de fechar, me diz onde paramos: o que foi feito, o que falta, em que arquivos estão as mudanças em progresso
```

Cola essa resposta na abertura da próxima sessão.

Claude Code tem auto-compact, mas ele trunca de forma agressiva. Melhor fechar e reabrir manual quando o sinal de ruído cair.

### Permissões

Primeira vez que Claude pede permissão para rodar comando novo, decida conscientemente. Libere em massa o que é comum (`mvn`, `npm`, `git status`, edição em `backend/` e `frontend/`). Negue tudo que sai do repo ou envolve credencial.

Se você está liberando 40 comandos por sessão, sua whitelist está fraca. Pare, ajuste as permissões persistentes, continue.

---

## Fechamento de sessão

Se trabalhou em milestone:

```
/milestone-fechar M25
```

Se foi trabalho pontual com commit:

1. Roda `/revisar` antes de commitar. Se retornar `bloqueia`, resolve antes.
2. Roda `/secret` se tocou em `application.yml` ou adicionou chave nova.
3. Commita com Conventional Commits em português.

Se foi debug ou exploração sem commit:

- Se descobriu algo útil, salva como ADR (`/adr título`) ou nota no technical-reference.
- Se não descobriu, nada a fazer.

Nunca feche sessão com staged changes. Ou commita, ou reverte, ou faz stash nomeado explícito.

---

## Retrospectiva por milestone

Acontece dentro do `/milestone-fechar`. Além do checklist automático, pare 5 minutos e avalie:

**O que deu certo.** Um ou dois pontos. Padrão que funcionou, command que caiu bem, agente que pegou erro.

**O que deu errado.** Um ou dois pontos. Claude caiu em pegadinha? Você teve que corrigir a mesma coisa duas vezes? Uma instrução do CLAUDE.md ou de uma rule foi ignorada?

**O que virou regra candidata.** Se você repetiu alguma instrução três vezes na sessão (ex: "não use Lombok", "usa o token bordô não hex"), ela deveria estar em rule. Abre o arquivo certo (`.claude/rules/backend.md`, `frontend-styling.md`, etc) e adiciona a entrada. Custa 2 minutos agora, economiza 20 depois.

**O que virou comando candidato.** Se você fez um mesmo ritual manual duas vezes nos últimos dois milestones, considere slash command. Avalia no próximo milestone — se acontecer de novo, cria.

Anota isso num arquivo pessoal (fora do repo). Não precisa ser estruturado. Lista de bullets num `.md` em qualquer lugar serve.

---

## Manutenção da infraestrutura

### Gatilhos para revisão

Não há cadência fixa. Estes sinais disparam ação imediata:

| Sinal | Ação |
|---|---|
| Atualizei CLAUDE.md 3+ vezes em uma semana | CLAUDE.md está inflando. Mova regras específicas para `.claude/rules/` ou corte |
| Desliguei uma rule porque atrapalhou | A rule está errada. Corrige ou remove, não convive com rule desligada |
| Mesma pegadinha caiu 2x em milestones seguidos | Adiciona em `pegadinhas conhecidas` do prompt do próximo milestone e em rule relevante |
| Não invoquei um subagente em 3 semanas | Candidato a remoção. Agente não usado é confuso para o Claude principal |
| Slash command criado e nunca invocado | Remove. Comando morto polui autocomplete |
| Respondi a mesma pergunta do Claude 2x em sessões diferentes | Resposta vira decisão em ADR ou entrada em rule |
| technical-reference desatualizado em relação ao código | Corrige agora. Doc desatualizado é pior que doc ausente |

### Auditoria profunda

Quando bater vontade (não agenda, por instinto), faça uma auditoria:

- `.claude/rules/*.md` — alguma rule nunca dispara? Alguma dispara para tudo? Ajuste paths.
- `.claude/commands/*.md` — todos foram usados nos últimos dois meses?
- `.claude/agents/*.md` — todos foram invocados? Algum foi invocado mas errou sistematicamente?
- `CLAUDE.md` — alguma seção virou letra morta? Alguma é lida mas não respeitada?
- `docs/adr/` — alguma decisão aceita foi silenciosamente revertida? Atualize status.

---

## Critérios mensuráveis de funcionamento

Se depois de 6 milestones desde a adoção desta infraestrutura:

- **Você não atualizou o CLAUDE.md nenhuma vez** → está ossificado demais. Provavelmente perdeu conexão com o que mudou no projeto. Revisa.
- **Você atualizou o CLAUDE.md 10+ vezes** → está inchando. Move regras específicas para rules, corta hard rules que viraram óbvias.
- **Você invocou `migration-reviewer` em todo milestone que teve migration** → está funcionando.
- **Você invocou `editor-codice` zero vezes** → ou você não escreveu copy novo (tudo bem), ou está invocando o Claude principal para isso (desperdício). Checa.
- **`/milestone` caiu em desuso** → dois cenários: (a) você achou um formato manual melhor — ótimo, ajusta o command; (b) você está improvisando milestones sem estrutura — perigoso, volta ao ritual.
- **`/revisar` pega violação real em cada uso** → está calibrado. Se pega sempre a mesma violação boba, ajusta a rule para que Claude principal evite desde o início.
- **ADRs não existem** → ou você parou de tomar decisões arquiteturais (improvável), ou está tomando sem registrar. Registra daqui pra frente, pelo menos as não-óbvias.

---

## Mapa de arquivos

| Arquivo | Função | Editado por |
|---|---|---|
| `CLAUDE.md` | Instruções permanentes do Claude na raiz | Você, no web ou direto |
| `codice-technical-reference.md` | Estado atual do código | Você ou Claude via `/milestone-fechar` |
| `codice-brand-reference.md` | Síntese operacional de brand | Você, raramente |
| `docs/Codice_*.pdf` | Documentos canônicos | Você, via web |
| `docs/prompts/Mn.md` | Prompt de milestone | Gerado por `/milestone` |
| `docs/adr/NNNN-*.md` | Decisões arquiteturais | Gerado por `/adr` |
| `.claude/rules/*.md` | Regras carregadas por path | Você, conforme gatilho |
| `.claude/commands/*.md` | Slash commands | Você, conforme gatilho |
| `.claude/agents/*.md` | Subagentes | Você, raramente |

---

## Quick reference

### Comandos do CLI criados

- `/milestone Mn título` — abre novo milestone
- `/milestone-fechar Mn` — fecha milestone, propõe diff do technical-reference
- `/revisar [tudo|backend|frontend|caminho]` — revisa staged contra rules
- `/adr título` — cria ADR em `docs/adr/`
- `/debug-schema` — inspeciona schema do Postgres local
- `/secret` — audita secrets

### Subagentes

- `migration-reviewer` — dispara em migration nova/modificada
- `editor-codice` — invocar quando revisar copy de usuário

### Invocação explícita de agente

```
use o migration-reviewer para revisar V11
```

```
passa este copy pelo editor-codice: "..."
```

### Frase que sempre funciona

Quando uma sessão está rendendo mal:

```
para. me mostra o plano antes de seguir. o que você entendeu do pedido, o que vai editar, o que não vai tocar, e qual é o critério de pronto
```

---

## O que este playbook não cobre

- Deploy e operação em produção (Railway, Vercel, R2). Consulte `docs/deploy/railway.md` e `docs/deploy/vercel.md`.
- Decisões de produto. Documento Mestre manda.
- Decisões de marca. Briefs mandam.
- Fluxo de desenvolvimento fora do Claude (abrir editor, rodar Docker Compose, etc). Isso é IDE, não Claude.
