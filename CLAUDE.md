# Códice — instruções para Claude Code

Marketplace de livros usados, solo founder, boring tech, MVP enxuto. Antes de qualquer ação nesta sessão, confirme que leu este arquivo respondendo com o plano da tarefa.

## Documentos de referência

Índice completo em `docs/README.md`. Os essenciais para sessão:

- `docs/codice-technical-reference.md` — estado atual do código (stack, schema, endpoints, estrutura de pastas). Atualize ao final de mudança estrutural ou via `/milestone-fechar`.
- `docs/codice-brand-reference.md` — síntese operacional de identidade visual, tom de voz e mascote. Fonte de verdade para paleta, tipografia e vocabulário.
- `docs/Codice_Documento_Mestre.pdf`, `docs/Codice_Brief_Livro_dos_Livros.pdf`, `docs/Codice_Brief_Logo.pdf` — documentos canônicos. Consulte se o `.md` de brand não cobrir.

Antes de discutir schema, endpoint ou estrutura, leia o `technical-reference`. Antes de discutir cor, fonte, copy ou ilustração, leia o `brand-reference`. Não invente o que está nesses arquivos.

Workflow operacional (abertura de sessão, slash commands, retrospectiva, manutenção da infra `.claude/`): `docs/claude-playbook.md` — leitura no projeto web, **não entra em contexto de sessão**.

## Protocolo de sessão

1. No início de toda tarefa, devolva o **plano** antes de editar arquivos: o que vai mudar, em quais arquivos, e o que fica fora do escopo. Espere confirmação ou siga se eu disser "executa".
2. Se faltar informação crítica, pergunte antes de chutar. Não invente nome de biblioteca, versão, API, função do projeto ou convenção que você não viu.
3. Ao terminar, liste o que foi alterado e o checklist de verificação (o que eu devo testar). Sugira a mensagem de commit em Conventional Commits.
4. Bug latente fora do escopo: apontar, não consertar sem permissão.

## Regras duras

- Nunca rode `flyway:clean`, `DROP DATABASE`, `rm -rf` fora do diretório do projeto, ou comando que apague dado sem eu pedir explicitamente.
- Nunca altere migration já commitada. Novo estado = nova `V{n}__descricao.sql`.
- `spring.jpa.hibernate.ddl-auto` é `validate`. Hibernate valida, nunca altera schema. Se precisar mudar, é via Flyway.
- Preço em `INTEGER` (centavos), nunca `DECIMAL` nem float.
- Nunca armazene secret em código. Variável de ambiente, sempre.
- Sem emojis em código, commit, UI, copy de produto ou documentação.
- Sem comentário óbvio no código. Comentário explica *porquê*, não *o quê*.

## Convenções de código

Detalhe completo no `technical-reference` §10. Resumo operacional:

**Backend.** Records para DTOs. Constructor injection, nunca `@Autowired` em campo. `@Valid` + Bean Validation. `@Transactional` no service, nunca no controller. Sem Lombok. Migrations `V{n}__descricao_em_snake_case.sql`.

**Frontend.** `function Component()`, nunca arrow function para componentes. Imports absolutos com `@/`. `any` só com justificativa em comentário. Estado de servidor via TanStack Query, não `useState`. Formulários via React Hook Form + Zod. Estilos via Tailwind + tokens da marca, nunca CSS inline fora de casos excepcionais.

**Git.** Conventional Commits em português: `feat(backend): adiciona endpoint X`, `fix(frontend): corrige Y`, `chore: Z`. Trabalho direto em `main`.

## Decisões arquiteturais fechadas

Não reabra sem eu pedir. Detalhe em `technical-reference` §13.

- Book e Listing são entidades separadas. Book é a obra canônica, Listing é uma oferta. Múltiplos listings apontam para o mesmo book.
- ISBN é nullable. Livros raros não têm. Fuzzy match por pg_trgm resolve duplicatas.
- Seller é tabela separada de User, 1:1 opcional. Nem todo user é seller.
- Listing nasce `PENDING_REVIEW`. Moderação manual é diferencial, não atrito acidental.
- Mensageria por polling (15s threads, 5s chat ativo). WebSocket fica para depois.
- Upload via presigned URL direto no R2. Backend não toca no arquivo.
- JWT em localStorage é dívida consciente do MVP. Não migre para cookie httpOnly sem eu pedir.

## Princípios de trabalho

1. **Boring tech vence.** Não introduza biblioteca nova sem necessidade clara. Se o projeto já resolve, use o que existe.
2. **Caminho simples primeiro.** Proponha a solução mais direta. Só apresente a versão sofisticada se eu pedir, ou se a simples tiver defeito grave que eu precise saber.
3. **MVP enxuto, fundação escalável.** Não construa hoje o que não foi validado. Mas não feche porta que custe caro abrir depois.
4. **Fricção construtiva.** Se meu pedido contradiz algo dos documentos, está errado, ou é over-engineering, aponte antes de executar. Não concorde automaticamente.
5. **Opinião, não lista neutra.** Quando eu pedir recomendação, tome posição, justifique, mencione o que pode dar errado.

## Fora de escopo permanente no MVP

Lista completa em `technical-reference` §12. Exemplos: pagamento real, OAuth, refresh token, reset de senha, OCR, recomendação por ML, edição de listing/perfil, RAG do Livro dos Livros, biblioteca pessoal, favoritos. Se meu pedido tocar esses itens, confirme antes — provavelmente é Fase 2+.