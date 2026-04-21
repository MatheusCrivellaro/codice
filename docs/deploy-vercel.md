# Deploy na Vercel — Frontend

Guia para deploy manual do frontend Vite + React na Vercel, com domínio custom e HTTPS.

## Pré-requisitos

- Conta no GitHub com acesso ao repositório `codice`.
- Conta na Vercel (https://vercel.com) — o plano Hobby (gratuito) é suficiente pro MVP.
- Backend já rodando no Railway com HTTPS (ver `docs/deploy-railway.md`).

## Setup inicial (uma vez)

### 1. Importar o projeto

1. Vercel Dashboard → **Add New** → **Project**.
2. Importar o repositório `codice` do GitHub (autorizar a integração se necessário).
3. Configurar:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detectado)
   - **Output Directory**: `dist` (auto-detectado)
   - **Install Command**: `npm install` (auto-detectado)

### 2. Variáveis de ambiente

Em **Environment Variables**, adicionar antes de fazer o primeiro deploy:

| Variável | Valor |
|---|---|
| `VITE_API_URL` | URL do backend. Ex: `https://codice-api.up.railway.app` (URL temporária do Railway) ou `https://api.codice.com.br` (quando o domínio estiver configurado). |

Importante: `VITE_API_URL` é aplicada em **build time** (Vite substitui no bundle). Se mudar o valor depois, é preciso re-deployar.

### 3. Primeiro deploy

Clicar em **Deploy**. Build típico: 1–2 minutos.

Após o deploy, a Vercel fornece uma URL `*.vercel.app`. Abrir e conferir:
- Home carrega com livros do acervo.
- Busca funciona.
- Página do livro abre.
- F5 em qualquer rota não dá 404 (SPA rewrite funcionando via `vercel.json`).

## Deploy contínuo

Todo push na branch `main` que altere arquivos dentro de `frontend/` redeploya automaticamente.

A Vercel também cria **Preview Deploys** por branch — cada PR/branch ganha uma URL própria. Não precisa configurar, vem por padrão.

## Domínio custom (frontend)

1. Vercel → projeto → **Settings** → **Domains** → **Add**.
2. Inserir `codice.com.br` (ou o domínio escolhido).
3. A Vercel mostra os registros DNS necessários. Normalmente:
   - Tipo **A**: `codice.com.br` → `76.76.21.21`
   - Tipo **CNAME**: `www.codice.com.br` → `cname.vercel-dns.com`
4. No painel do registrador do domínio (Registro.br, Cloudflare, etc.), criar os registros conforme indicado.
5. Aguardar propagação DNS (normalmente minutos, pode demorar até 48h em casos raros).
6. A Vercel provisiona o certificado SSL automaticamente (Let's Encrypt).

## Domínio da API (Railway)

Para que a API responda em `api.codice.com.br`:

1. Railway → serviço do backend → **Settings** → **Networking** → **Custom Domain** → adicionar `api.codice.com.br`.
2. Railway mostra um registro **CNAME** a configurar.
3. No registrador: criar CNAME `api.codice.com.br` apontando pro valor indicado pelo Railway.
4. Aguardar propagação. Railway provisiona SSL automaticamente.
5. Atualizar **`VITE_API_URL`** na Vercel para `https://api.codice.com.br` e re-deployar o frontend.
6. Atualizar **`CORS_ALLOWED_ORIGINS`** no Railway para incluir o domínio final do frontend. Ex: `https://codice.com.br,https://www.codice.com.br`. Re-deployar o backend.

## Checklist de CORS

Após cada mudança de domínio (frontend ou API), verificar:

- `CORS_ALLOWED_ORIGINS` no Railway inclui **todos** os origins que fazem requests: domínio custom, domínio `*.vercel.app` (se ainda em uso), `http://localhost:5173` em dev se necessário.
- Política CORS do bucket R2 (Cloudflare Dashboard → R2 → bucket → Settings → CORS) inclui os mesmos origins em `AllowedOrigins`.

Esquecer esses dois é o erro mais comum — o site carrega mas a API retorna 403 em preflight ou o upload de foto falha.

## Troubleshooting

- **Página em branco**: build falhou. Logs na Vercel → Deployments → clicar no deploy → Build Logs.
- **404 ao recarregar rota** (ex: F5 em `/buscar`): falta o `vercel.json` com rewrite de SPA. Confirmar que está versionado.
- **API não conecta / CORS 403**: `VITE_API_URL` errada ou `CORS_ALLOWED_ORIGINS` no Railway não inclui o domínio do frontend.
- **Mixed content** (console do browser): API em HTTP e frontend em HTTPS. Railway serve HTTPS por padrão em `*.up.railway.app` e em custom domains — confirmar que a `VITE_API_URL` começa com `https://`.
- **Assets com 404**: Root Directory errado. Deve ser `frontend`, não a raiz do monorepo.
- **Domínio custom não resolve**: propagação DNS não terminou. Usar https://dnschecker.org pra conferir.
- **Env var nova não aparece**: Vite substitui em build time — precisa re-deployar depois de alterar.

## O que este guia NÃO cobre (milestones futuros)

- Analytics (Vercel Analytics, Plausible, PostHog).
- Monitoring e uptime.
- SEO (sitemap, robots.txt, meta tags por página).
- PWA / service worker.
- SPF/DKIM/DMARC (necessários quando tiver email transacional).
