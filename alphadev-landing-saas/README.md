# AlphaDev Landing SaaS

Sistema SaaS para criação e gestão de landing pages editáveis. A proposta é permitir que cada cliente tenha uma landing pública e um painel administrativo para alterar textos, cores, imagens, logo, botões, contatos e conteúdo da página.

Esta etapa cria apenas a base do projeto, organização das pastas, configuração do stack e telas iniciais de demonstração. Autenticação, CRUD, upload, dashboard completo e deploy serão tratados em etapas futuras.

## Stack

### Frontend

- React com Vite
- TypeScript
- TailwindCSS
- React Router DOM
- Axios

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod
- CORS
- Helmet
- dotenv
- Estrutura preparada para autenticação futura com JWT

## Portas

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3333`

## Instalação do frontend

```bash
cd alphadev-landing-saas/frontend
npm install
```

## Instalação do backend

```bash
cd alphadev-landing-saas/backend
npm install
```

## Configuração do ambiente

No backend, copie o arquivo `.env.example` para `.env`:

```bash
cd alphadev-landing-saas/backend
copy .env.example .env
```

Depois ajuste a variável `DATABASE_URL` com os dados do seu PostgreSQL:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/alphadev_landing_saas?schema=public"
```

## Rodar o backend

```bash
cd alphadev-landing-saas/backend
npm run dev
```

Rota inicial:

```http
GET http://localhost:3333/health
```

Resposta esperada:

```json
{
  "status": "ok",
  "message": "AlphaDev Landing SaaS API online"
}
```

## Rodar o frontend

```bash
cd alphadev-landing-saas/frontend
npm run dev
```

Rotas iniciais:

- `/` - apresentação do AlphaDev Landing SaaS
- `/site/demo` - landing page pública de exemplo
- `/admin` - preview do futuro painel administrativo

## Scripts úteis

### Frontend

- `npm run dev`
- `npm run build`
- `npm run preview`

### Backend

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run prisma:generate`
- `npm run prisma:migrate`
