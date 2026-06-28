# AlphaDev Landing SaaS

SaaS para criacao e gestao de landing pages editaveis. O dono da landing acessa um painel protegido para editar textos, secoes, cores, imagens, WhatsApp, SEO e visualizar leads recebidos.

O projeto usa React + Vite + TypeScript no frontend e Node.js + Express + TypeScript no backend. Nao usa Next.js, Docker, Cloudinary ou S3 nesta etapa.

## Stack

- Frontend: React, Vite, TypeScript, TailwindCSS, React Router DOM, Axios, react-helmet-async
- Backend: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, Zod, JWT, Helmet, CORS, Multer
- Banco: PostgreSQL
- Autenticacao: JWT
- Upload: local em `backend/uploads/landings`

## Estrutura

```text
alphadev-landing-saas/
  backend/
    prisma/
    src/
    uploads/
  frontend/
    src/
  README.md
  .gitignore
  .gitattributes
```

## Desenvolvimento local

Portas padrao:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3333`

Backend `backend/.env` local:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/alphadev_landing_saas?schema=public"
PORT=3333
NODE_ENV=development
JWT_SECRET="alphadev_landing_saas_secret_dev"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:5173"
FRONTEND_URL_ALT="http://localhost:5174"
BACKEND_PUBLIC_URL="http://localhost:3333"
```

Frontend `frontend/.env` local:

```env
VITE_API_URL="http://localhost:3333"
```

Instalar dependencias:

```bash
npm install
npm run install:all
```

Ou separadamente:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Banco local:

```bash
createdb -U postgres alphadev_landing_saas
cd backend
npx prisma generate
npx prisma migrate dev
npm run seed
```

Rodar em desenvolvimento:

```bash
cd backend
npm run dev

cd ../frontend
npm run dev
```

Build local:

```bash
cd backend
npm run build
npm run start

cd ../frontend
npm run build
npm run preview
```

Credenciais demo:

```text
Email: admin@demo.com
Senha: 123456
```

## Variaveis de ambiente

Backend producao `backend/.env`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/alphadev_landing_saas?schema=public"
PORT=3333
NODE_ENV=production
JWT_SECRET="troque_essa_chave_em_producao"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="https://seudominio.com.br"
FRONTEND_URL_ALT=""
BACKEND_PUBLIC_URL="https://api.seudominio.com.br"
```

Se usar frontend e backend no mesmo dominio com proxy do Nginx:

```env
BACKEND_PUBLIC_URL="https://seudominio.com.br"
```

Checklist backend:

- `DATABASE_URL`
- `PORT`
- `NODE_ENV`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `FRONTEND_URL`
- `FRONTEND_URL_ALT`
- `BACKEND_PUBLIC_URL`

Frontend producao `frontend/.env`:

```env
VITE_API_URL="https://api.seudominio.com.br"
```

Se usar frontend e backend no mesmo dominio com `/api` e `/uploads` pelo Nginx:

```env
VITE_API_URL="https://seudominio.com.br"
```

Checklist frontend:

- `VITE_API_URL`

## Scripts

Backend:

```bash
npm run dev
npm run build
npm run start
npm run prisma:generate
npm run prisma:migrate
npm run prisma:deploy
npm run prisma:studio
npm run seed
```

Frontend:

```bash
npm run dev
npm run build
npm run preview
```

O build do backend gera `backend/dist`. O build do frontend gera `frontend/dist`.

## Prisma em producao

Em desenvolvimento, use:

```bash
npx prisma migrate dev
```

Em producao, use:

```bash
npm run prisma:deploy
```

Nao use `migrate dev` em producao. O comando `migrate dev` e interativo, pode criar novas migrations e e voltado para o ciclo local de desenvolvimento. O comando `migrate deploy` apenas aplica migrations ja criadas e versionadas.

## Seed em producao

O comando abaixo e opcional:

```bash
npm run seed
```

Ele pode criar uma demo inicial com usuario `admin@demo.com` e landing `barbearia-demo`. O seed foi preparado para ser idempotente: se a landing demo ja existir, ele nao sobrescreve conteudo, imagens ou leads existentes.

Em producao real, use com cuidado. Depois de criar dados reais, evite rodar seeds sem revisar o que eles fazem.

## Uploads em producao

Uploads locais ficam em:

```text
backend/uploads/landings
```

Regras importantes:

- A pasta precisa existir no servidor.
- O usuario que roda o Node/PM2 precisa ter permissao de escrita.
- Arquivos reais de upload nao devem ir para o GitHub.
- O projeto versiona apenas `.gitkeep` para manter a estrutura de pastas.
- O Express ja serve arquivos estaticos em `/uploads`.
- O Nginx tambem pode proxyar `/uploads` para o Express ou servir a pasta diretamente.

Exemplo para criar e ajustar permissao:

```bash
mkdir -p /var/www/alphadev-landing-saas/backend/uploads/landings
sudo chown -R $USER:www-data /var/www/alphadev-landing-saas/backend/uploads
chmod -R 775 /var/www/alphadev-landing-saas/backend/uploads
```

## CORS e seguranca

Em producao, o backend aceita origens apenas de:

- `FRONTEND_URL`
- `FRONTEND_URL_ALT`, quando preenchida

`localhost` e `127.0.0.1` sao aceitos automaticamente apenas quando `NODE_ENV=development`.

Outros pontos ativos:

- Helmet ativo
- Rate limit de login
- Rate limit de leads
- Rate limit de upload
- Rotas admin protegidas por JWT
- Stack trace nao e retornado em producao
- Upload limitado por mimetype e tamanho
- Caminhos de upload resolvidos a partir do backend, sem caminho absoluto local

## Rotas principais

Frontend:

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

Backend publicos:

```text
GET  /health
GET  /health/db
GET  /api/public/sitemap
GET  /api/public/landings/:slug
POST /api/public/landings/:slug/leads
```

Backend auth:

```text
POST /api/auth/login
GET  /api/auth/me
```

Backend admin:

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
GET    /api/admin/images
POST   /api/admin/images
PATCH  /api/admin/images/:id
DELETE /api/admin/images/:id
GET    /api/admin/leads
GET    /api/admin/leads/:id
DELETE /api/admin/leads/:id
```

## Deploy em VPS Ubuntu

Este guia prepara um deploy manual em uma VPS Ubuntu, como Hostinger VPS. Ajuste caminhos, usuario, dominio e senhas conforme seu servidor.

### 1. Instalar Node.js LTS

Opcao com NodeSource:

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install nodejs -y
node -v
npm -v
```

Opcao com NVM tambem funciona. O importante e usar Node.js LTS.

### 2. Instalar PostgreSQL

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib -y
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

Criar usuario e banco:

```bash
sudo -u postgres psql
```

Dentro do `psql`:

```sql
CREATE USER alphadev_user WITH PASSWORD 'troque_essa_senha';
CREATE DATABASE alphadev_landing_saas OWNER alphadev_user;
GRANT ALL PRIVILEGES ON DATABASE alphadev_landing_saas TO alphadev_user;
\q
```

### 3. Enviar projeto ao servidor

Exemplo de pasta:

```bash
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
cd /var/www
git clone URL_DO_SEU_REPOSITORIO alphadev-landing-saas
cd alphadev-landing-saas
```

### 4. Configurar backend

```bash
cd /var/www/alphadev-landing-saas/backend
cp .env.example .env
nano .env
```

Exemplo com API em subdominio:

```env
DATABASE_URL="postgresql://alphadev_user:troque_essa_senha@localhost:5432/alphadev_landing_saas?schema=public"
PORT=3333
NODE_ENV=production
JWT_SECRET="gere_uma_chave_grande_e_unica"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="https://seudominio.com.br"
FRONTEND_URL_ALT="https://www.seudominio.com.br"
BACKEND_PUBLIC_URL="https://api.seudominio.com.br"
```

Instalar, gerar Prisma Client, aplicar migrations e buildar:

```bash
npm install
npx prisma generate
npm run prisma:deploy
npm run build
```

### 5. Configurar frontend

```bash
cd /var/www/alphadev-landing-saas/frontend
cp .env.example .env
nano .env
```

Com API em subdominio:

```env
VITE_API_URL="https://api.seudominio.com.br"
```

Com backend no mesmo dominio via `/api`:

```env
VITE_API_URL="https://seudominio.com.br"
```

Build:

```bash
npm install
npm run build
```

O Nginx deve apontar para:

```text
/var/www/alphadev-landing-saas/frontend/dist
```

### 6. Rodar backend com PM2

```bash
sudo npm install -g pm2
cd /var/www/alphadev-landing-saas/backend
npm install
npx prisma generate
npm run build
npm run prisma:deploy
pm2 start dist/server.js --name alphadev-landing-api
pm2 save
pm2 startup
```

Tambem existe um arquivo opcional:

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Comandos uteis:

```bash
pm2 list
pm2 logs alphadev-landing-api
pm2 restart alphadev-landing-api
pm2 stop alphadev-landing-api
```

### 7. Configurar Nginx

Instalar:

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

#### Cenario A: frontend e backend no mesmo dominio

Frontend em `/`, backend em `/api` e uploads em `/uploads`.

Arquivo exemplo:

```bash
sudo nano /etc/nginx/sites-available/alphadev-landing-saas
```

Configuracao:

```nginx
server {
    server_name seudominio.com.br www.seudominio.com.br;

    root /var/www/alphadev-landing-saas/frontend/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:3333/api;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /health {
        proxy_pass http://localhost:3333/health;
    }

    location /uploads {
        proxy_pass http://localhost:3333/uploads;
    }
}
```

Ativar:

```bash
sudo ln -s /etc/nginx/sites-available/alphadev-landing-saas /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Neste cenario:

```env
FRONTEND_URL="https://seudominio.com.br"
BACKEND_PUBLIC_URL="https://seudominio.com.br"
VITE_API_URL="https://seudominio.com.br"
```

#### Cenario B: frontend no dominio principal e API em subdominio

Frontend:

```nginx
server {
    server_name seudominio.com.br www.seudominio.com.br;

    root /var/www/alphadev-landing-saas/frontend/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}
```

API:

```nginx
server {
    server_name api.seudominio.com.br;

    location / {
        proxy_pass http://localhost:3333;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Neste cenario:

```env
FRONTEND_URL="https://seudominio.com.br"
FRONTEND_URL_ALT="https://www.seudominio.com.br"
BACKEND_PUBLIC_URL="https://api.seudominio.com.br"
VITE_API_URL="https://api.seudominio.com.br"
```

### 8. HTTPS/SSL com Certbot

Depois que o Nginx estiver funcionando em HTTP:

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d seudominio.com.br -d www.seudominio.com.br
```

Se usar subdominio de API:

```bash
sudo certbot --nginx -d api.seudominio.com.br
```

Renovacao automatica costuma ser configurada pelo Certbot. Confira com:

```bash
sudo certbot renew --dry-run
```

## Checklist antes do deploy

- Backend builda sem erro.
- Frontend builda sem erro.
- `.env` nao esta versionado.
- `.env.example` atualizado.
- Migrations criadas e versionadas.
- Seed idempotente.
- CORS configurado para dominio de producao.
- URLs de producao definidas.
- Uploads reais ignorados no Git.
- `backend/uploads/landings` existe no servidor.
- README atualizado.

## Checklist depois do deploy

Testar:

- Dominio abre o frontend.
- `/site/barbearia-demo`.
- `/admin/login`.
- Login.
- Painel admin.
- Edicao da landing.
- Upload de imagem.
- Formulario de leads.
- Listagem de leads.
- Botao WhatsApp.
- `/health`.
- `/health/db`.

## Problemas comuns

Erro: `DATABASE_URL Required`

Solucao: criar `backend/.env` baseado em `backend/.env.example` e conferir `DATABASE_URL`.

Erro: `Prisma Client did not initialize`

Solucao: rodar `npx prisma generate` dentro de `backend`.

Erro: tabela nao existe em producao

Solucao: rodar `npm run prisma:deploy` dentro de `backend`.

Erro: frontend nao conecta na API

Solucao: conferir `VITE_API_URL`, `FRONTEND_URL`, CORS e configuracao do Nginx.

Erro: 404 ao atualizar pagina React

Solucao: configurar `try_files $uri /index.html` no Nginx.

Erro: upload nao salva

Solucao: conferir se `backend/uploads/landings` existe e se o usuario do PM2 tem permissao de escrita.

Erro: PM2 nao reinicia apos reboot

Solucao: rodar `pm2 save` e `pm2 startup`, copiando e executando o comando que o PM2 mostrar.

## Comandos Git

Fluxo sugerido:

```bash
git add .
git commit -m "chore: prepara projeto para deploy"
git push
```

## Fora do escopo desta etapa

- Deploy real automatico
- Docker
- GitHub Actions obrigatorio
- Pagamento
- Cadastro publico de clientes
- Recuperacao de senha
- Cloudinary
- AWS S3
- Mudanca completa de arquitetura
