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
JWT_SECRET="alphadev_landing_saas_secret_dev"
JWT_EXPIRES_IN="7d"
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
http://localhost:3333/api/public/landings/barbearia-demo
POST http://localhost:3333/api/auth/login
GET http://localhost:3333/api/auth/me
```

## Configurar o frontend

```bash
cd alphadev-landing-saas/frontend
npm install
npm run dev
```

Rotas:

- `http://localhost:5173/`
- `http://localhost:5173/site/barbearia-demo`
- `http://localhost:5173/site/demo`
- `http://localhost:5173/admin/login`
- `http://localhost:5173/admin`

A rota publica principal e `/site/:slug`. Exemplo:

```text
http://localhost:5173/site/barbearia-demo
```

Ela busca os dados em:

```text
GET http://localhost:3333/api/public/landings/barbearia-demo
```

A rota `/site/demo` continua funcionando por compatibilidade e redireciona para `/site/barbearia-demo`.

Em ambiente de desenvolvimento, se a API estiver offline, a landing publica exibe um fallback mockado discreto. Se o backend responder 404, a tela mostra uma mensagem amigavel de landing indisponivel.

## Login administrativo

Depois de rodar o seed, use as credenciais demo:

```text
Email: admin@demo.com
Senha: 123456
```

Fluxo:

```text
http://localhost:5173/admin/login
```

Ao autenticar, o usuario e redirecionado para:

```text
http://localhost:5173/admin
```

O painel `/admin` e protegido por token JWT salvo no `localStorage` com a chave `alphadev_landing_token`. As rotas publicas `/`, `/site/demo` e `/site/:slug` continuam livres.

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
- Rota publica `GET /api/public/landings/:slug`
- Rota `POST /api/auth/login`
- Rota protegida `GET /api/auth/me`
- Landing publica dinamica em `/site/:slug`
- Login admin em `/admin/login`
- Painel admin protegido em `/admin`
- Renderizacao dinamica de secoes `HERO`, `ABOUT`, `BENEFITS`, `TESTIMONIALS`, `GALLERY`, `CTA`, `FOOTER` e `CUSTOM`
- SEO basico no React com `react-helmet-async`
- Botao flutuante de WhatsApp
- Formulario visual de contato sem salvar leads ainda
- Logout do painel administrativo

Ainda nao implementado nesta etapa:

- Edicao real de landing
- CRUD
- Upload de imagens
- Dashboard completo
- Deploy
