# Códice — referência de marca

Síntese operacional dos três briefs. Use este arquivo como fonte de verdade para decisões de cor, tipografia, copy e ilustração durante implementação. Para narrativa, racional e referências culturais, consulte os PDFs em `docs/`.

## Posicionamento

Marketplace bibliófilo, não e-commerce genérico. Curadoria sobre catálogo, acervo acadêmico em destaque, cuidado de bibliotecário. Referências mentais: livro de ensaios da Companhia das Letras dos anos 2000 cruzado com a clareza estrutural do Claude.ai. Premium é restrição, não ostentação.

## Paleta

### Light mode

| Token | Hex | Uso |
|---|---|---|
| Papel | `#F7F3EC` | Fundo |
| Papel profundo | `#EFE8DA` | Cards, superfícies elevadas |
| Tinta | `#2A2420` | Texto principal |
| Bordô | `#7A2E2E` | Destaque, links, CTAs |
| Cinza-quente | `#A89F92` | Texto secundário |
| Cinza-borda | `#D4CFC7` | Divisores, bordas |

### Dark mode

| Token | Hex | Uso |
|---|---|---|
| Fundo | `#1A1714` | Fundo |
| Superfície | `#252220` | Cards |
| Texto | `#E8E0D2` | Texto principal |
| Dourado | `#B89968` | Destaque (substitui bordô) |
| Bordas | `#3D3732` | Divisores |

Regra: bordô no light, dourado no dark. Bordô em fundo escuro vira sangue. Sem gradientes, sem sombras berrantes, sem glassmorphism, sem neumorphism, sem hover com glow.

## Tipografia

| Família | Pesos | Uso |
|---|---|---|
| Fraunces | 400, 500 | Títulos, display, preços, marca |
| Source Serif 4 | 400 | Leitura longa, sinopses |
| Inter | 400, 500 | UI, labels, inputs, texto curto |

Hierarquia: H1 40-48px, H2 28-32px, corpo 16-17px, UI 14-15px. Line-height 1.6 no corpo. Pesos baixos. Evitar bold pesado. Largura de leitura travada em ~680px (70 caracteres por linha).

## Layout

Max-width de conteúdo 1280px. Grid de livros: 4 colunas desktop, 3 tablet, 2 mobile, gap 24px. Espaçamento generoso. Mobile-first.

## Tom de voz

Caloroso-sóbrio. Vocabulário de biblioteca, não de e-commerce. Frases curtas a médias, ritmo de leitura literária, não de manchete. Observações literárias discretas quando couberem, sem pedantismo. Sem exclamações duplas, sem onomatopeias enfáticas, sem emoji em copy oficial.

### Vocabulário do Códice

| Evite | Use |
|---|---|
| Carrinho | Estante |
| Catálogo | Acervo |
| Vender | Anunciar um livro |
| Comprar | Levar este livro |
| Adicionar aos favoritos | Reservar uma vaga na estante |
| Contatar vendedor | Tenho interesse |
| Página inicial | Vitrine |
| Cadastro | Criar uma conta |

### Microcopy de estados

- Busca sem resultado: "Nenhum livro com esse título no acervo agora. Quer que o Livro dos Livros sugira algo parecido?"
- Estante vazia: "Sua estante está esperando os primeiros volumes."
- Erro 500: "Algo se perdeu entre as páginas. Tente novamente em instantes."
- Loading longo: "Folheando o acervo…"
- Anúncio publicado: "Livro disponível na vitrine. Quem procurar, encontrará."

## Livro dos Livros (mascote)

Bibliotecário sábio em forma de livro antropomórfico. Sem rosto, sem olhos, sem boca. Expressão via postura, inclinação e gesto dos braços. Traço a bico-de-pena, monocromático, stroke 1.5-2.5pt com leve variação.

Referências de estilo: Edward Gorey, Saul Steinberg, vinhetas Penguin Classics 60-70.

Anti-referências absolutas: Disney, Pixar, Duolingo, kawaii, mascote corporativo, gradiente pastel, olhos brilhantes, flat vetorial geométrico. Nunca adicionar traço facial em hipótese alguma.

Cor: traço monocromático. Fundo claro usa `#2A2420` ou `#7A2E2E`. Fundo escuro usa `#E8E0D2` ou `#B89968`. Sem versão colorida.

Entrega em SVG com stroke referenciando `currentColor` para troca via CSS. Estado atual: **não executado**. Placeholder em uso. Brief completo em `docs/Codice_Brief_Livro_dos_Livros.pdf`.

## Logo

Marca de impressor renascentista com geometria contemporânea. Selo abstrato com container geométrico (círculo, losango ou hexágono) e símbolo central abstrato.

Princípios não negociáveis:

1. Funciona em 32px (favicon).
2. Funciona monocromático (preto puro).
3. Uma ideia visual só, não duas empilhadas.
4. Convive com Fraunces sem competir — símbolo é geométrico puro.

Sem gradientes, sem sombras, sem textura raster simulando carimbo gasto. Lockup: símbolo + "códice" em Fraunces 500, minúsculo, tracking +30.

Anti-referências: cervejaria artesanal vintage, ornamentos vitorianos, blackletter, filigrana, café hipster. A diferença entre marca de impressor e café hipster é executiva — geometria moderna num formato histórico, não tentativa de parecer envelhecido.

Estado atual: **não executado**. Favicon placeholder com letra "c". Brief completo em `docs/Codice_Brief_Logo.pdf`.

## Tratamento de fotos de anúncio

Vendedor sobe mínimo três fotos seguindo template:

1. Capa frontal sobre superfície neutra clara, luz natural lateral, sem flash.
2. Lombada e contracapa lado a lado.
3. Detalhe de estado — páginas internas, marcas, grifos, anotações.

Opcionais: página de rosto, foto de defeito específico. Capa oficial do Google Books é "imagem de catálogo", exibida ao lado das fotos reais — fotos reais ganham destaque porque são parte do charme do usado.