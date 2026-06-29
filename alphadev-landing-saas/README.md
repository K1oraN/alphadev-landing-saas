# AlphaDev Landing SaaS

Aplicacao SaaS para uma landing page publica principal e um painel administrativo protegido por JWT.

O visitante acessa somente a landing publica em `/`. O administrador acessa o painel para editar textos, secoes, imagens, cores, WhatsApp, SEO e leads.

## Stack

- Frontend: React + Vite + TypeScript + TailwindCSS
- Backend: Node.js + Express + TypeScript
- Banco: PostgreSQL + Prisma
- Autenticacao: JWT

Nao usa Next.js e nao usa Docker.

## Rotas do Frontend

Rotas publicas:

- `/` Landing publica principal
- `/site/:slug` rota interna mantida para compatibilidade futura

Rotas admin:

- `/admin/login`
- `/admin`
- `/admin/landing`
- `/admin/sections`
- `/admin/appearance`
- `/admin/images`
- `/admin/whatsapp`
- `/admin/seo`
- `/admin/leads`

Ao abrir `http://localhost:5173`, a aplicacao renderiza a landing publica principal. O painel fica disponivel manualmente em `http://localhost:5173/admin/login`.

## Endpoints Principais

Publicos:

- `GET /api/public/landing` retorna a landing principal publicada
- `POST /api/public/landing/leads` salva um lead na landing principal publicada
- `GET /api/public/landings/:slug` mantido para compatibilidade
- `POST /api/public/landings/:slug/leads` mantido para compatibilidade

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

## Landing Principal

O backend busca a landing principal por `isMain = true` e `status = PUBLISHED`. Se nenhuma landing principal publicada existir, ele usa a primeira landing publicada como fallback interno.

O seed cria ou atualiza uma landing padrao clara e neutra:

- Nome interno: `Landing Principal`
- Nome da empresa: `Sua Empresa`
- Slug: `principal`
- Status: `PUBLISHED`
- `isMain: true`

Tema padrao:

- Fundo: `#ffffff`
- Fundo secundario: `#f8fafc`
- Texto principal: `#0f172a`
- Texto secundario: `#475569`
- Cor primaria/botao: `#2563eb`
- Texto do botao: `#ffffff`

## Seed

No backend:

```bash
npm run seed
```

Credenciais iniciais:

```txt
Email: admin@suaempresa.com
Senha: 123456
```

O seed e idempotente: atualiza usuario, landing, tema, secoes, imagens, WhatsApp, SEO e exemplos de leads sem duplicar a landing principal.

## Desenvolvimento

Backend:

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
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

- Frontend: `http://localhost:5173`
- Admin: `http://localhost:5173/admin/login`
- Backend: `http://localhost:3333`

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
