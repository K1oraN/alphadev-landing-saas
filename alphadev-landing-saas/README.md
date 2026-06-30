# AlphaDev Landing SaaS

Aplicacao SaaS com uma landing page publica principal em `/` e um painel administrativo protegido por JWT para personalizar textos, imagens, cores, secoes, WhatsApp, SEO e leads.

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

Admin:

- `/admin/login`
- `/admin`
- `/admin/landing`
- `/admin/sections`
- `/admin/appearance`
- `/admin/images`
- `/admin/whatsapp`
- `/admin/seo`
- `/admin/leads`

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

O endpoint `GET /api/public/landing` busca a landing principal publicada (`isMain = true` e `status = PUBLISHED`). Se nao existir registro no banco, o frontend exibe um fallback completo e profissional da empresa ficticia `Nova Essencia`.

O seed cria/atualiza:

- Nome interno: `Landing Principal`
- Empresa: `Nova Essencia`
- Slug: `principal`
- Status: `PUBLISHED`
- `isMain: true`
- Usuario admin: `admin@admin.com`

## Checklist de Teste

- Abrir `/` e conferir a landing clara, moderna e responsiva.
- Abrir `/admin/login` e confirmar que os campos nao vem preenchidos pelo codigo.
- Fazer login com as credenciais locais do README.
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
