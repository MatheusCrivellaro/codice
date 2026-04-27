# V03 — Refinamento

Terceira e última fase da trilha de melhoria visual. Pré-requisitos: V01 e V02 executadas e validadas.

Objetivo: amarrar pontas, fazer o dark mode honesto, dar presença ao Livro dos Livros via placeholder coerente, e adicionar microanimação disciplinada. É a fase de maior risco de drift visual — execute com a régua mais alta.

## Princípios que valem pra esta fase

Os princípios das fases anteriores continuam valendo. Releia o cabeçalho de `docs/prompts/visual/V01-fundacao-visual.md` se precisar.

Reforço específico desta fase: **premium é restrição**. O Brief do Logo cap. 2 cita isso como princípio não-negociável. Aqui é onde a tentação de adicionar mais é maior — animação extra, segundo dourado em mais lugares, ilustração que tenta ser o mascote final. Resista. A entrega boa desta fase é a que parece feita por menos esforço, não por mais.

Liberdade criativa autorizada: você decide *como* implementar, qual componente refatorar, onde inserir. Você **não** decide adicionar elementos visuais novos fora do escopo. Se identificar uma quinta intervenção óbvia, descreva no relatório final.

Restrições técnicas inalteradas, com uma exceção condicional: Framer Motion pode entrar **se e somente se** você justificar por escrito antes de instalar e eu confirmar. Padrão é não usar.

## As cinco intervenções

### 3.1 Dark mode reimaginado, não invertido

Hoje o dark mode provavelmente é "trocou variável bordô→dourado e pronto" — vide M24 no technical reference. Não basta. Dark mode bem-feito no Códice é o livro à noite, sob luz de abajur, não o light invertido mecanicamente.

Diretrizes:

- **Textura de papel no dark fica mais seca e fina.** Já implementada na V01, revise se ficou bom — se a granulação do dark estiver chamativa demais, reduza alpha pra 0.02
- **Filetes ornamentais no dark ficam mais finos** (~0.75pt em vez de 1pt) e menos opacos (~50% em vez de 60-70%). Aplica nos `<Ornament />` da V01 e no filete duplo do header da V02
- **Dourado é destaque pontual, não substituto universal de bordô.** No dark, dourado aparece em: preço, capitular, fleuron central do ornament, hover state, badge de não-lidas, brasão de área. **Não aparece em**: texto corrido, headers de seção, separadores secundários, links de navegação default. Pra esses, use `var(--color-texto)` (off-white) ou `var(--color-cinza-borda)`
- **Borders de cards no dark** ficam um tom acima do fundo (cinza-borda escurecido), não bordô diluído nem dourado fantasmagórico
- **Lombada do BookCard** (V02) no dark fica em dourado a opacidade ainda menor (~15-20%) — em fundo escuro, qualquer cor saturada se destaca mais que em fundo claro

Critério de aceitação: passar 5 minutos no dark mode tem que ser confortável, não cansativo. Se dourado pisca no canto do olho enquanto você lê uma sinopse, é dourado demais. Se o dark mode lê como "o site, mas escuro", falhou. Se lê como "uma versão noturna do mesmo objeto", passou.

### 3.2 Selo placeholder do Livro dos Livros

Brief do mascote (`docs/Codice_Brief_Livro_dos_Livros.pdf`) ainda não foi executado em ilustração — depende de ilustrador externo ou rodada com IA generativa que não aconteceu. Os estados vazios do site têm copy editorial bom (M24, Doc Mestre cap. 7) mas zero presença visual.

**Não tente imitar o brief do mascote.** O brief pede traço a bico-de-pena, expressivo, irregular, com referências a Edward Gorey e vinhetas Penguin. Tentar reproduzir isso em SVG geométrico vai cair no "AI genérico" que o próprio brief lista como anti-referência (cap. 3).

**Em vez disso, crie um selo abstrato assumidamente placeholder**, no vocabulário gráfico de marca de impressor (Brief Logo): silhueta geométrica mínima de livro em pé, ~120px, traço bordô/dourado 1.5pt, sem rosto, sem detalhes de capa, sem braços. É um *signo* de livro, não uma *ilustração* de livro.

Componente `<LivroDosLivrosSeal size={120} />` ou similar. Aplicar nos estados vazios:

- Busca sem resultado: copy do Doc Mestre cap. 7 ("Nenhum livro com esse título no acervo agora. Quer que o Livro dos Livros sugira algo parecido?")
- Página 404 ("Algo se perdeu entre as páginas")
- Loading prolongado ("Folheando o acervo...")
- Lista de conversas vazia
- Lista de meus anúncios vazia (na MyListings)
- Estante de favoritos vazia (quando vier — não precisa criar a página, só garantir que o componente esteja pronto pra uso)

A honestidade desse placeholder é parte do design. Quando a ilustração final do mascote chegar — em fase futura, com ilustrador ou rodada de IA generativa controlada — esse componente será substituído sem retrabalho. O usuário hoje não vê "mascote em construção"; vê um selo discreto coerente com a marca.

### 3.3 Eixo óptico do Fraunces

Fraunces tem `opsz` variável e provavelmente está sendo usado com valor default em tudo. O mesmo font family deve passar a parecer **duas famílias visualmente**, economizando peso de fonte e ganhando hierarquia real.

Reconfigurar:

- **Display** (H1 da Home, título do livro na BookPage, hero, capitular): `font-variation-settings: 'opsz' 144, 'wght' 400` — vira título de capa de livro
- **Subtítulos** (H2, H3, nome de seção): `'opsz' 72, 'wght' 500`
- **UI tipográfica** (preço, labels editoriais, running head): `'opsz' 14, 'wght' 500` (UI menor) ou `'opsz' 144, 'wght' 400` se for preço grande na BookPage

Adicione utilitários Tailwind ou classes CSS pra essas variantes. Sugestão: `.font-display`, `.font-headline`, `.font-ui-serif` (ou nomes melhores que você decidir).

Critério de aceitação: comparar o H1 da Home antes e depois — depois deve parecer "capa de livro", antes parecia "header de site". Se não houver diferença visível, o `opsz` não tá sendo aplicado de fato (suspeitar de cache de fonte ou de o Tailwind v4 não estar passando o valor).

### 3.4 Microanimação disciplinada

Implementar **só estas**, sem inventar mais. Se você achar que precisa de outra, descreva no relatório e espere.

- **Skeleton loading com shimmer papel→papel-profundo.** Não cinza→cinza. Duração 1.5s, ease-in-out. Aplica nos skeletons já existentes
- **Cursor da busca da Home** pisca elegante quando input vazio e focado, em Fraunces (1s, cubic-bezier suave). Não é o cursor nativo do input — é um decorativo overlay que pode até ser um caractere `|` em Fraunces piscando, atrás ou ao lado do cursor real. Decisão executiva sua se vale a pena ou se fica gimmick. Se ficar gimmick, corta e reporta
- **Transição entre páginas da paginação** (resultados de busca): fade-out 120ms + slide horizontal 8px + fade-in 160ms. Direção do slide segue direção da paginação (próxima página → entra da direita; anterior → entra da esquerda)
- **Hover do BookCard** já entrou na V02 — não duplique nem refine

Tudo com `transition` do Tailwind ou keyframes CSS. **Sem Framer Motion** salvo justificativa explícita pra paginação.

Crítico: nada de bounce, spring, overshoot. Tudo ease-out ou ease-in-out. Tudo abaixo de 250ms exceto o shimmer de skeleton. Premium é restrição.

### 3.5 Auditoria final e vocabulário

Antes de fechar a fase, faça uma passagem por todas as páginas em light *e* dark mode, mobile *e* desktop:

- Home, SearchPage, BookPage
- LoginPage, RegisterPage, PerfilPage
- SellPage e suas filhas (SellerDashboard, SellerProfileForm, CreateListingWizard, MyListings)
- ConversationsPage, ConversationDetailPage
- Painel admin (ModerationQueue, AllListings)
- NotFoundPage

**Trabalho de vocabulário.** A V02 deve ter coletado uma lista de ocorrências do vocabulário antigo ("catálogo", "carrinho", "comprar", etc.) fora do header. Aplique o vocabulário do Doc Mestre cap. 7 em todas as ocorrências dessa lista. Termos canônicos:

- "carrinho" → "estante"
- "catálogo" → "acervo"
- "vender" → "anunciar um livro" (verbo) / "anúncio" (substantivo, quando já estabelecido — mantenha "Listing" só em código)
- "comprar" → "levar este livro"
- "adicionar aos favoritos" → "reservar uma vaga na estante"
- "contatar vendedor" → "tenho interesse"
- "página inicial" → "vitrine"
- "cadastro" → "criar uma conta"

Aplique com bom senso — se algum desses sons forçado em contexto específico, mantenha o termo neutro e reporte. O objetivo é coerência editorial, não rigidez.

**Lista de inconsistências remanescentes.** Padding desalinhado, tipografia errada, cor fora do sistema, copy genérica que escapou. **Não conserte tudo nesta fase.** Apenas liste no relatório final, e me pergunte quais devo priorizar pra uma eventual V04 de polimento.

## Governança

Se identificar conflito entre alguma dessas instruções e um dos briefs, pare e aponte antes de executar.

Se identificar conflito entre essas intervenções e algo das fases anteriores, idem — não desfaça V01 ou V02 sem perguntar.

Decisões executivas com trade-off não-trivial vão no relatório, não na implementação silenciosa.

## Relatório esperado ao fim da fase

- Lista dos arquivos tocados
- Decisões executivas que tomou e por quê
- Avaliação honesta do dark mode pós-3.1: ele virou "livro à noite" ou ainda parece "site invertido"? Se ainda parece invertido, o que ainda falta?
- Como ficou o cursor decorativo da busca (3.4) — manteve ou cortou, e por quê
- Lista de inconsistências remanescentes pra eventual V04 de polimento, agrupadas por gravidade (alto/médio/baixo)
- Avaliação geral: depois de V01 + V02 + V03, o site ainda parece shadcn default em algum lugar? Onde?

Esta é a última fase planejada da trilha. Ao terminar, pare e reporte. Decidiremos juntos se faz sentido uma V04 de polimento ou se o esforço seguinte é em outra frente (logo final, ilustração do mascote, RAG do Livro dos Livros, etc.).
