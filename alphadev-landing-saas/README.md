# AlphaDev Landing SaaS

Sistema SaaS para criacao e gestao de landing pages editaveis. Cada cliente tera uma landing publica e, em etapas futuras, um painel administrativo para alterar textos, cores, imagens, logo, botoes, contatos e conteudo.

O projeto usa React + Vite no frontend e Node.js + Express + TypeScript no backend. Nao usa Next.js e nao usa Docker nesta etapa.

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
- Estrutura preparada para autenticacao futura com JWT

## Portas

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3333`

## Scripts da raiz

A raiz tem um `package.json` apenas para facilitar comandos. Frontend e backend continuam separados.

```bash
npm install
npm run install:all
npm run dev:backend
npm run dev:frontend
npm run build:backend
npm run build:frontend
```

## Criar banco PostgreSQL local

Crie um banco chamado `alphadev_landing_saas` no PostgreSQL local. Pelo `psql`, um exemplo:

```bash
createdb -U postgres alphadev_landing_saas
```

Ou, dentro do `psql`:

```sql
CREATE DATABASE alphadev_landing_saas;
```

## Configurar o backend

```bash
cd alphadev-landing-saas/backend
npm install
copy .env.example .env
```

Confira se o `.env` ficou assim, ajustando usuario, senha, host ou porta se o seu PostgreSQL for diferente:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/alphadev_landing_saas?schema=public"
PORT=3333
NODE_ENV=development
```

Depois rode:

```bash
npm approve-scripts
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Rotas para testar:

```text
http://localhost:3333/health
http://localhost:3333/api/demo/landing
```

## Configurar o frontend

```bash
cd alphadev-landing-saas/frontend
npm install
npm run dev
```

Rotas:

- `http://localhost:5173/`
- `http://localhost:5173/site/demo`
- `http://localhost:5173/admin`

A rota `/site/demo` tenta buscar dados reais em `http://localhost:3333/api/demo/landing`. Se a API falhar, a tela continua funcionando com dados mockados e mostra um aviso discreto.

## Scripts do backend

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run prisma:studio`
- `npm run seed`

Para abrir o Prisma Studio:

```bash
cd alphadev-landing-saas/backend
npm run prisma:studio
```

## Scripts do frontend

- `npm run dev`
- `npm run build`
- `npm run preview`

## Erros comuns

### DATABASE_URL Required

Esse erro acontece quando o backend nao encontrou a variavel `DATABASE_URL`.

Corrija criando o `.env` dentro da pasta `backend`:

```bash
cd alphadev-landing-saas/backend
copy .env.example .env
```

Depois confira a conexao com o PostgreSQL e rode:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### npm install rodado na pasta errada

Agora existe `package.json` na raiz, entao `npm install` nao deve mais quebrar. Mesmo assim, as dependencias reais ficam em `frontend` e `backend`.

Para instalar tudo pela raiz:

```bash
cd alphadev-landing-saas
npm run install:all
```

Ou instale separadamente:

```bash
cd alphadev-landing-saas/backend
npm install

cd ../frontend
npm install
```

### src refspec main does not match any

Esse erro costuma acontecer quando o commit foi feito na branch `master`, mas o push tentou enviar `main`.

Use:

```bash
git branch -M main
git push -u origin main
```

### remote origin already exists

Se o remoto `origin` ja existe, nao rode `git remote add origin` de novo.

Confira o remoto atual:

```bash
git remote -v
```

Se precisar trocar a URL:

```bash
git remote set-url origin URL_DO_REPOSITORIO
git push -u origin main
```

### Alertas de CRLF no Windows

Avisos sobre CRLF/LF geralmente nao impedem commit nem push. A raiz inclui `.gitattributes` com:

```text
* text=auto
```

Isso ajuda o Git a normalizar finais de linha entre Windows e outros ambientes.

## Escopo atual

Implementado:

- Base React + Vite + TypeScript + TailwindCSS
- Base Node.js + Express + TypeScript
- Prisma configurado com PostgreSQL
- Modelagem inicial do banco
- Seed demo da `Barbearia Demo AlphaDev`
- Rota `GET /health`
- Rota `GET /api/demo/landing`
- Landing demo consumindo API com fallback mockado

Ainda nao implementado nesta etapa:

- Autenticacao
- Painel admin real
- CRUD
- Upload de imagens
- Dashboard completo
- Deploy
