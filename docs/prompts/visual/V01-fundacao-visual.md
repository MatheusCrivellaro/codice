# V01 — Fundação Visual

Primeira fase de uma trilha de melhoria visual em três etapas. Objetivo desta fase: o site para de parecer shadcn default. Quatro intervenções baratas, alto impacto, zero risco arquitetural.

## Princípios que valem pra esta fase e pras próximas

Ler antes de começar, se ainda não estão em contexto: `docs/Codice_Documento_Mestre.pdf` (especialmente cap. 6 e 7), `docs/Codice_Brief_Logo.pdf`, `docs/Codice_Brief_Livro_dos_Livros.pdf`. Fidelidade aos três briefs é inegociável.

O problema atual: tokens corretos aplicados timidamente em layout shadcn default produzem um site bonitinho mas genérico. A solução não é adicionar tokens novos — é usar os existentes com mais convicção e adicionar **textura, ornamento e marginália** que façam o site parecer **miolo de livro bem impresso**, não vitrine de marketplace.

Vocabulário visual permitido: tipo móvel, marca de impressor (Aldus Manutius, Plantin, Elzevir), Penguin Classics 60-70, capitular iluminada, filete ornamental, fleuron, vinheta editorial, bico-de-pena, paginação impressa, marginália.

Vocabulário **proibido**: máquina de escrever, cervejaria artesanal, estética hipster, vintage envelhecido com filigrana, ornamento vitoriano, blackletter, texturas raster simulando carimbo gasto, gradientes, glassmorphism, hover com glow, neumorphism. O brief do logo lista isso explicitamente como anti-referência — vale pro site inteiro.

Liberdade criativa autorizada: você decide *como* implementar, qual componente refatorar pra acomodar, onde inserir, que ajustes finos fazem sentido dado o estado real do código. Você **não** decide adicionar elementos visuais novos fora do escopo desta fase. Se identificar uma quinta intervenção óbvia dentro do espírito da fase, descreva no relatório final mas não implemente sem confirmação.

Restrições técnicas: Tailwind v4 + shadcn/ui (style new-york) + Fraunces / Source Serif 4 / Inter já configurados. Sem bibliotecas novas pesadas — Framer Motion não entra nesta fase. Mobile-first sempre. Dark mode (bordô vira dourado) tem que funcionar igualmente bem em toda mudança. Rode `npm run build` ao fim da fase pra garantir que não quebrou nada.

Convenções de código já estabelecidas: `function Component()` (não arrow), imports com `@/`, tipagem estrita, estilos via Tailwind utilities + tokens da marca. Mantém.

Conventional commits, escopo claro. Um commit por intervenção é o mínimo aceitável; pode subdividir mais se fizer sentido.

## As quatro intervenções

### 1.1 Textura de papel global

O Doc Mestre cap. 6 cita literalmente "off-white granulado obtido por textura SVG sutil". Isso não foi entregue no M22.

Implementar como `background-image` no `body` via SVG inline com `feTurbulence` `fractalNoise`. Duas variantes:

- Light: granulação levemente mais aberta, cor de tinta `#2A2420` com alpha ~0.03-0.05
- Dark: granulação mais fina, cor off-white `#E8E0D2` com alpha ~0.025

Critério de aceitação: rosto perto da tela mostra micrograin; afastado, parece plano contínuo de papel sem padrão de repetição visível. Se aparecer grade, aumenta o tile do SVG (200x200 → 400x400).

### 1.2 Componente `<Ornament />`

Substituto editorial do `<Separator />` do shadcn. Três variantes:

- `rule`: linha simples fina
- `double-rule`: par de linhas paralelas espaçadas 2-3px
- `fleuron`: linha–losango–linha, com pequeno losango ou asterisco editorial centralizado

Cor: `var(--color-bordo)` no light, `var(--color-dourado)` no dark, opacidade ~60-70%.

Aplicar em pelo menos: `BookPage` (entre metadados e ofertas), `Home` (entre hero e grid, e entre seções principais), `SearchPage` (entre filtros e resultados), footer do `AppShell` (acima do conteúdo do footer). Você decide o nível de uso — não polua, mas use.

Tamanho de referência do losango: 12-16px lado, traço 1pt.

### 1.3 Capitular em sinopses

Classe utilitária `.drop-cap` aplicada ao primeiro parágrafo de sinopses na `BookPage` e em qualquer descrição editorial longa (perfil de seller quando vier).

- Fraunces 400, eixo óptico alto (`font-variation-settings: 'opsz' 144`)
- `float: left`, ~3 linhas de altura
- Cor bordô (light) / dourado (dark)

Crítico: o bloco de texto da sinopse precisa estar travado em `max-width: 680px` (Doc Mestre cap. 6: "blocos de leitura travados em ~680px, ~70 caracteres por linha"). Se hoje está em largura maior, conserte aqui.

Em mobile (<640px), capitular cai pra ~2.8em.

Critério de aceitação: cobre exatamente 3 linhas, segunda letra do parágrafo não cola na capitular, leitor pensa "isso é orelha de livro".

### 1.4 Tratamento tipográfico de preços

Preço hoje provavelmente é Inter bold em cor neutra. Reescrever pra Fraunces peso 400, com `R$` em tamanho menor (60-70%) e tracking levemente aberto.

Aplicar onde quer que `formatPrice` apareça: `BookCard`, `BookPage` (lista de ofertas), `MyListings`, qualquer outro.

Bonus permitido (não obrigatório): na lista de ofertas da BookPage, a oferta mais barata recebe um pequeno asterisco fino antes (não um badge "Menor preço" colorido) — sutileza editorial, não signaling de e-commerce.

## Governança

Se identificar conflito entre alguma dessas instruções e um dos briefs, **pare e aponte antes de executar** — é regra do projeto. Se identificar conflito entre duas intervenções desta lista, idem. Se uma decisão executiva sua envolve trade-off não-trivial, reporte antes de seguir.

Não comite nada sem rodar `npm run build` antes.

## Relatório esperado ao fim da fase

- Lista dos arquivos tocados
- Decisões executivas que você tomou e por quê
- Descrição em palavras de antes/depois das telas afetadas (Home, BookPage, SearchPage no mínimo)
- Nota de qualquer débito ou inconsistência que percebeu mas decidiu não corrigir nesta fase
- Eventual quinta intervenção que você consideraria óbvia dentro do espírito desta fase, com justificativa, pra eu validar antes da Fase 2

Pare aqui ao terminar. Não siga pra Fase 2 sem confirmação.
