# AlphaDev Landing SaaS

Aplicacao SaaS white label com uma landing page publica principal em `/` e um painel administrativo protegido por JWT para personalizar textos, imagens, cores, secoes, WhatsApp, SEO, publicacao e leads.

A marca publica padrao e apenas um fallback (`SuaMarca`). O visitante nao deve ver dados internos do projeto, rotas de demonstracao, credenciais ou informacoes tecnicas.

## Stack

- Frontend: React + Vite + TypeScript + TailwindCSS
- Backend: Node.js + Express + TypeScript
- Banco: PostgreSQL + Prisma
- Autenticacao: JWT

Nao usa Next.js e nao usa Docker.

## Rodando Localmente

Backend:

```bash
cd backend
npm install
npx prisma generate
npm run seed
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

URLs locais:

- Landing publica: `http://localhost:5173`
- Login admin: `http://localhost:5173/admin/login`
- Painel admin: `http://localhost:5173/admin`
- Backend: `http://localhost:3333`

## Credenciais de Desenvolvimento

As credenciais abaixo sao apenas para desenvolvimento local e sao criadas/atualizadas pelo seed. Elas nao aparecem na tela de login.

```txt
Email: admin@admin.com
Senha: 123456
```

## Rotas

Publica:

- `/` landing publica principal
- `/site/:slug` rota interna mantida para compatibilidade futura
- `/site/demo` e `/site/barbearia-demo` redirecionam para `/`

Admin:

- `/admin/login`
- `/admin`
- `/admin/landing`
- `/admin/appearance`
- `/admin/content`
- `/admin/images`
- `/admin/sections`
- `/admin/testimonials`
- `/admin/faq`
- `/admin/seo`
- `/admin/integrations`
- `/admin/publication`
- `/admin/leads`
- `/admin/settings`

## Endpoints Principais

Publicos:

- `GET /api/public/landing`
- `POST /api/public/landing/leads`
- `GET /api/public/landings/:slug`
- `POST /api/public/landings/:slug/leads`

Autenticacao:

- `POST /api/auth/login`
- `GET /api/auth/me`

Admin:

- `GET /api/admin/landing/me`
- `PUT /api/admin/landing/main`
- `PUT /api/admin/landing/theme`
- `PUT /api/admin/landing/whatsapp`
- `PUT /api/admin/landing/seo`
- `GET /api/admin/landing/sections`
- `POST /api/admin/landing/sections`
- `PUT /api/admin/landing/sections/:id`
- `DELETE /api/admin/landing/sections/:id`
- `PATCH /api/admin/landing/sections/:id/toggle`
- `GET /api/admin/leads`
- `GET /api/admin/leads/:id`
- `DELETE /api/admin/leads/:id`

## Variaveis de Ambiente

Backend:

```txt
DATABASE_URL=
PORT=3333
NODE_ENV=development
JWT_SECRET=
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
FRONTEND_URL_ALT=
BACKEND_PUBLIC_URL=http://localhost:3333
```

Frontend:

```txt
VITE_API_URL="http://localhost:3333"
```

Cenarios de hospedagem:

```txt
# Local
VITE_API_URL="http://localhost:3333"

# Producao com mesmo dominio e proxy Nginx
VITE_API_URL=""
# ou
VITE_API_URL="/api"

# Producao com API em subdominio
VITE_API_URL="https://api.seudominio.com.br"
```

O frontend usa `VITE_API_URL` como base da API. Se a variavel estiver vazia, as chamadas usam caminho relativo.

## Landing Principal

O endpoint `GET /api/public/landing` busca a landing principal publicada (`isMain = true` e `status = PUBLISHED`). Se nao existir registro no banco, o frontend exibe um fallback completo e profissional com a marca neutra `SuaMarca`.

A landing publica em `/` usa dados do banco quando existem:

- textos principais, secoes e CTAs;
- tema e cores salvas;
- logo, imagem hero, foto do profissional e galeria;
- configuracao de WhatsApp;
- SEO;
- depoimentos e secoes configuradas.

Quando algum dado ainda nao foi cadastrado, o frontend usa conteudo padrao bonito e placeholders elegantes, sem imagem quebrada.

O seed cria/atualiza:

- Nome interno: `Landing Principal`
- Empresa: `SuaMarca`
- Slug: `principal`
- Status: `PUBLISHED`
- `isMain: true`
- Usuario admin: `admin@admin.com`

## Painel Administrativo

O painel em `/admin` funciona como editor visual da landing, com sidebar clara, topbar, cards de edicao, abas e pre-visualizacao em tempo real. As rotas especificas continuam disponiveis para edicoes mais detalhadas:

- `/admin/landing` para identidade e dados principais;
- `/admin/appearance` para tema;
- `/admin/images` para upload e gerenciamento de imagens;
- `/admin/sections` para secoes;
- `/admin/seo` para SEO;
- `/admin/integrations` para WhatsApp;
- `/admin/leads` para leads recebidos.

## Checklist de Teste

- Abrir `/` e conferir a landing clara, moderna e responsiva.
- Abrir `/admin/login` e confirmar que os campos nao vem preenchidos pelo codigo.
- Fazer login com as credenciais locais do README.
- Abrir `/admin` e conferir sidebar, topbar, cards de edicao e preview.
- Editar conteudo, cores, secoes, imagens, WhatsApp ou SEO no painel.
- Voltar para `/` e conferir as alteracoes.
- Enviar um lead pelo formulario publico.
- Conferir o lead em `/admin/leads`.
- Rodar `npm run build` no backend e no frontend.

## Build

Backend:

```bash
cd backend
npm run build
```

Frontend:

```bash
cd frontend
npm run build
```
