# AlphaDev Landing SaaS

SaaS para criacao e gestao de landing pages editaveis. O dono da landing acessa um painel protegido para editar textos, secoes, cores, imagens, WhatsApp, SEO e visualizar leads recebidos.

O projeto usa React + Vite no frontend e Node.js + Express + TypeScript no backend. Nao usa Next.js, Docker, Cloudinary ou S3 nesta etapa.

## Stack

- Frontend: React, Vite, TypeScript, TailwindCSS, React Router DOM, Axios, react-helmet-async
- Backend: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, Zod, JWT, Helmet, CORS, Multer
- Upload: local em desenvolvimento

## Estrutura

```text
alphadev-landing-saas/
  backend/
    prisma/
    src/
    uploads/
  frontend/
    src/
```

## Portas

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3333`

## Variaveis de ambiente

Backend `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/alphadev_landing_saas?schema=public"
PORT=3333
NODE_ENV=development
JWT_SECRET="alphadev_landing_saas_secret_dev"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:5173"
FRONTEND_URL_ALT="http://localhost:5174"
```

Frontend `frontend/.env`:

```env
VITE_API_URL="http://localhost:3333"
```

## Instalacao

Pela raiz:

```bash
npm install
npm run install:all
```

Ou separadamente:

```bash
cd alphadev-landing-saas/backend
npm install

cd ../frontend
npm install
```

## Banco, Prisma e seed

Crie o banco local:

```bash
createdb -U postgres alphadev_landing_saas
```

Depois rode:

```bash
cd alphadev-landing-saas/backend
npm approve-scripts
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

Prisma Studio:

```bash
npm run prisma:studio
```

## Rodar o projeto

Backend:

```bash
cd alphadev-landing-saas/backend
npm run dev
```

Frontend:

```bash
cd alphadev-landing-saas/frontend
npm run dev
```

Build:

```bash
cd alphadev-landing-saas/backend
npm run build
npm run start

cd ../frontend
npm run build
npm run preview
```

## Credenciais demo

```text
Email: admin@demo.com
Senha: 123456
```

## Rotas frontend

- `/`
- `/site/barbearia-demo`
- `/site/demo`
- `/admin/login`
- `/admin`
- `/admin/landing`
- `/admin/sections`
- `/admin/appearance`
- `/admin/images`
- `/admin/whatsapp`
- `/admin/seo`
- `/admin/leads`

## Endpoints principais

Publicos:

```text
GET  /health
GET  /health/db
GET  /api/public/sitemap
GET  /api/public/landings/:slug
POST /api/public/landings/:slug/leads
```

Auth:

```text
POST /api/auth/login
GET  /api/auth/me
```

Admin landing:

```text
GET    /api/admin/landing/me
PUT    /api/admin/landing/main
PUT    /api/admin/landing/theme
PUT    /api/admin/landing/whatsapp
PUT    /api/admin/landing/seo
GET    /api/admin/landing/sections
POST   /api/admin/landing/sections
PUT    /api/admin/landing/sections/:id
DELETE /api/admin/landing/sections/:id
PATCH  /api/admin/landing/sections/:id/toggle
```

Admin imagens:

```text
GET    /api/admin/images
POST   /api/admin/images
PATCH  /api/admin/images/:id
DELETE /api/admin/images/:id
```

Admin leads:

```text
GET    /api/admin/leads
GET    /api/admin/leads/:id
DELETE /api/admin/leads/:id
```

## Upload local

Arquivos enviados ficam em:

```text
backend/uploads/landings
```

URL publica:

```text
http://localhost:3333/uploads/landings/NOME_DO_ARQUIVO
```

Regras:

- JPG, PNG e WEBP
- Maximo de 5MB
- Campo multipart: `image`
- Tipos: `LOGO`, `HERO`, `GALLERY`, `TESTIMONIAL`, `OTHER`
- `LOGO` e `HERO` mantem apenas uma imagem por tipo
- Uploads reais sao ignorados pelo Git

Em producao, o storage local pode ser substituido por Cloudinary, S3 ou storage da hospedagem.

## Seguranca e limites

- Helmet ativo
- CORS restrito por `FRONTEND_URL` e `FRONTEND_URL_ALT`
- JSON body limit de `1mb`
- Rotas admin protegidas por JWT
- Token ausente/invalido retorna 401
- Usuario inativo/bloqueado retorna 403
- `passwordHash` nunca e retornado
- Rate limit de login: 5 tentativas a cada 15 minutos
- Rate limit de leads: 10 envios a cada 15 minutos
- Rate limit de upload: 20 uploads a cada 15 minutos
- Honeypot `website` no formulario de leads
- Upload limitado por mimetype e tamanho

## Checklist manual

Backend:

- `GET http://localhost:3333/health`
- `GET http://localhost:3333/health/db`
- Login em `POST /api/auth/login`
- `GET /api/public/landings/barbearia-demo`
- `POST /api/public/landings/barbearia-demo/leads`
- `GET /api/admin/leads`
- Upload em `POST /api/admin/images`
- Editar landing em `PUT /api/admin/landing/main`
- Editar tema em `PUT /api/admin/landing/theme`
- Editar secoes em `/api/admin/landing/sections`
- Editar WhatsApp em `PUT /api/admin/landing/whatsapp`
- Editar SEO em `PUT /api/admin/landing/seo`

Frontend:

- `http://localhost:5173/`
- `http://localhost:5173/site/barbearia-demo`
- Formulario de leads
- Botao WhatsApp
- `http://localhost:5173/admin/login`
- `http://localhost:5173/admin`
- `http://localhost:5173/admin/landing`
- `http://localhost:5173/admin/sections`
- `http://localhost:5173/admin/appearance`
- `http://localhost:5173/admin/images`
- `http://localhost:5173/admin/whatsapp`
- `http://localhost:5173/admin/seo`
- `http://localhost:5173/admin/leads`

## Checklist antes do deploy

- Trocar `JWT_SECRET`
- Configurar `FRONTEND_URL` de producao
- Configurar `VITE_API_URL` de producao
- Rodar migrations no banco de producao
- Definir estrategia de storage para uploads
- Revisar CORS
- Revisar variaveis `.env`
- Rodar `npm run build` no backend e frontend

## Nao implementado nesta etapa

- Deploy real
- Docker
- Pagamento
- Cadastro publico de clientes
- Multi-tenant avancado
- Recuperacao de senha
- Envio de e-mail
- Integracao real com WhatsApp API
- Cloudinary
- AWS S3
