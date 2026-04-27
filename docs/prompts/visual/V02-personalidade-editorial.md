# V02 — Personalidade Editorial

Segunda fase da trilha de melhoria visual. Pré-requisito: V01 executada e validada.

Objetivo desta fase: o site começa a parecer especificamente o Códice, e não outro marketplace curatorial qualquer. Quatro intervenções de média complexidade, todas dentro do vocabulário de livro impresso.

## Princípios que valem pra esta fase

Os mesmos princípios do V01 continuam valendo. Releia o cabeçalho de `docs/prompts/visual/V01-fundacao-visual.md` se precisar — vocabulário permitido, vocabulário proibido, restrições técnicas, convenções de código.

Reforço específico desta fase: marginália e tratamento editorial são onde o site mais vai ganhar personalidade própria. Resista à tentação de ornamentar demais. O Brief do Logo cap. 7 fala da diferença entre "marca de impressor renascentista" e "café hipster brooklynense" ser executiva — vale aqui também. Sutileza vence ostentação. Quando estiver na dúvida entre fazer um pouco mais ou um pouco menos, faz menos.

Liberdade criativa autorizada: você decide *como* implementar, qual componente refatorar pra acomodar, onde inserir, que ajustes finos fazem sentido. Você **não** decide adicionar elementos visuais novos fora do escopo desta fase. Se identificar uma quinta intervenção óbvia dentro do espírito da fase, descreva no relatório final mas não implemente sem confirmação.

Restrições técnicas inalteradas: Tailwind v4 + shadcn/ui + Fraunces / Source Serif 4 / Inter. Sem bibliotecas novas. Framer Motion não entra nesta fase. Mobile-first. Dark mode tem que funcionar em toda mudança. `npm run build` ao fim da fase.

## As quatro intervenções

### 2.1 Marginália na BookPage

A página de livro vira página de livro impresso. Implementar:

**Running head no topo da página.** O slug do livro em Fraunces italic, peso 400, ~13px, tracking aberto, cor `var(--color-cinza-quente)` (light) ou equivalente sóbrio no dark. Alinhado à esquerda do bloco de conteúdo, acima do título. Funciona como o cabeçalho que aparece no topo de cada página de livro impresso indicando capítulo ou obra.

**Foliação no rodapé do bloco de metadados.** Número do listing prefixado por "Nº" em Inter tabular 11-12px, alinhado à direita. Ex: `Nº 0147`. Decisão executiva sua: se o número sequencial do listing não estiver disponível no payload da BookPage (provavelmente não está — só temos UUID), decida se vale puxá-lo do backend (criar um campo `listing_number` ou similar) ou se você usa um hash curto/legível derivado do UUID como proxy. Reporte a escolha — eu prefiro a solução que evita mudança no backend nesta fase, mas escuto seu argumento se discordar.

**Aspas tipográficas corretas em sinopse.** Substituir `"` retas por `"` e `"` curvas onde aparecerem em texto editorial. Aplicar com cor bordô/dourado em peso ligeiramente maior que o texto ao redor — funcionam como pequeno destaque tipográfico. Cuidado: só onde fizer sentido editorial (sinopses, citações), não em campos de input ou UI.

**Itálico de Source Serif 4 em campos editoriais.** Campos como "tradução de [Nome]", "edição revisada", "publicado originalmente em [ano]" devem usar `<em>` com tratamento editorial (Source Serif italic), não bold. Bold é signaling de UI; itálico é convenção de livro.

### 2.2 Header editorial

`AppShell` hoje é header shadcn responsivo padrão. Reformular pra parecer cabeçalho de catálogo editorial.

**Wordmark.** "códice" em Fraunces peso 500, todo minúsculo, tracking +30 unidades (Brief Logo cap. 6 — usar `letter-spacing: 0.03em` aproxima). Posição esquerda. Sem ícone até o logo final chegar — texto sozinho funciona se a tipografia tiver presença.

**Navegação.** Trocar capitalização inicial pelos termos do Doc Mestre cap. 7: "acervo" no lugar de "Acervo", "vender", "conversas". Inter peso 500, tracking levemente aberto, ~14px. Audite todo o site no fim da fase pra garantir que o vocabulário está consistente — se houver outras ocorrências de "Catálogo", "Carrinho", "Comprar" ou similares fora do header, liste no relatório (não corrija ainda, isso é trabalho da V03).

**Filete duplo separando header de conteúdo.** Em vez de `border-b` simples, duas linhas finas paralelas espaçadas 2-3px, cor `var(--color-borda)` opacidade 60%. Use o componente `<Ornament variant="double-rule" />` da V01 se fizer sentido, ou inline se preferir.

**Badge de não-lidas em /conversas.** Círculo cheio bordô (light) / dourado (dark), 16px, número Inter 10-11px peso 500, cor papel/branco. Não usar vermelho de notificação em nenhuma hipótese — quebra a paleta inteira.

**Mobile.** O tratamento mobile do menu (hamburger, sheet ou alternativa) é decisão sua, contanto que coerente com o resto. Se você usar `<Sheet>` do shadcn, customize tipografia e ornamentação pra não parecer o sheet default.

### 2.3 BookCard com tratamento de "lombada"

A metáfora do Doc Mestre cap. 7 é literal: "estante" no lugar de "carrinho", "levar este livro" no lugar de "comprar". O grid de livros deveria parecer estante.

Cada card no grid recebe:

- Linha vertical sutil de 1-2px na lateral esquerda, sugerindo lombada de livro. Cor: bordô a 20-30% opacity (light), dourado a 25% opacity (dark)
- No `:hover`: deslocamento 2-3px pra direita (`translateX`), transição 180ms ease-out, sombra fininha curta atrás (~4px blur, opacidade 8%) — sombra editorial, não soft shadow grande de SaaS
- **Não usar `transform: scale`.** A metáfora é tirar um livro da estante, não zoomar num produto

Decisão executiva: se o card já tem outras transições (mudança de cor de borda, aumento de elevação, etc.), integre — não acumule animações sobrepostas. O hover bom é uma única ação visual coerente.

Critério de aceitação: passar o mouse pelo grid várias vezes deve parecer puxar livros levemente da estante, não interagir com tiles de dashboard.

### 2.4 Brasões de área acadêmica

As 8 áreas do seed ganham cada uma um pequeno emblema geométrico em filete, ~16-18px, traço 1pt, no espírito de marca de impressor em miniatura. É a intervenção de maior singularidade desta fase — nenhum marketplace concorrente tem isso.

Sugestões de partida (sinta-se livre pra ajustar — você é quem vai testar visualmente):

- Literatura Brasileira: círculo perfeito com pequeno ponto central
- Filosofia: triângulo com vértice pra cima, oco
- Sociologia e Antropologia: hexágono regular
- Direito: losango vertical
- História: círculo com filete horizontal cortando
- Letras e Crítica Literária: dois círculos concêntricos
- Psicologia e Psicanálise: espiral mínima de 1.5 voltas
- Educação e Pedagogia: quadrado rotacionado 45° com ponto central

Aplicar ao lado do nome da área no `AcademicAreaBadge`, nos filtros da `SearchPage`, na chip de área da `BookPage`. Cor: bordô/dourado conforme contexto.

Se você achar que algum desses símbolos parece confuso, redundante com outro, ou ruim em 16px, ajuste e reporte. Mantenha o espírito: geometria limpa, uma única ideia por brasão, legível em 16px e ainda reconhecível em 12px.

Implementação sugerida: componente `<AreaEmblem area="filosofia" size={16} />` que renderiza o SVG correto baseado na prop. Mais limpo que 8 componentes separados.

## Governança

Se identificar conflito entre alguma dessas instruções e um dos briefs, pare e aponte antes de executar.

Se identificar conflito entre essas intervenções e algo que foi feito na V01, idem — não desfaça V01 sem perguntar.

Decisões executivas com trade-off não-trivial vão no relatório, não na implementação silenciosa.

## Relatório esperado ao fim da fase

- Lista dos arquivos tocados
- Decisão sobre o número de listing (foliação 2.1) e justificativa
- Lista de ocorrências do vocabulário antigo ("catálogo", "carrinho", "comprar", etc.) que você encontrou fora do header — pra V03
- Descrição em palavras de antes/depois das telas afetadas (BookPage com marginália, header em todas as páginas, grid em Home e SearchPage, badges de área)
- Ajustes que você fez nos brasões propostos e por quê
- Eventual quinta intervenção que consideraria óbvia dentro do espírito desta fase

Pare aqui ao terminar. Não siga pra V03 sem confirmação.
