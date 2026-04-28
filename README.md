# Conta Fácil — Laravel API + React SPA

Backend **Laravel 12** expõe API REST em `/api/v1`. O frontend **React + Vite** está em `frontend/` e, em produção, é servido pelo Laravel a partir de `public/spa`.

## Requisitos

- PHP 8.2+, Composer, extensões usuais do Laravel (incl. dom, xml para CI)
- Node.js 20+ (frontend)

## Backend

```bash
cp .env.example .env
php artisan key:generate
touch database/database.sqlite   # se usar SQLite
php artisan migrate
php artisan serve
```

API base: `http://localhost:8000/api/v1`

Variáveis úteis:

- `APP_URL=http://localhost:8000`
- `CORS_ALLOWED_ORIGINS=http://localhost:5173` (dev; várias origens separadas por vírgula)

## Frontend (desenvolvimento)

```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_BASE_URL=http://localhost:8000
npm run dev
```

App: `http://localhost:5173` (comunicação com a API no :8000 via CORS).

## Build do React para o Laravel servir

```bash
cd frontend
npm install
npm run build
```

Artefatos em `public/spa/`. Acesse a mesma origem do Laravel, por exemplo `http://localhost:8000/` — o Blade `spa.blade.php` carrega o manifest do Vite.

Se o build ainda não existir, a view mostra instruções para gerá-lo.

## Composer dev (backend + fila + logs + Vite)

```bash
composer run dev
```

Inclui `npm --prefix frontend run dev` na porta **5173**.

## Testes

```bash
php artisan config:clear
php artisan test
```

## Documentação

- `doc/api.md` — API
- `doc/frontend.md` — React/Vite e CORS
- `doc/arquitetura.md` — visão geral
- `doc/SECURITY.md` — revisão de segurança, rate limits, uploads, checklist de produção

## Deploy

1. `composer install --no-dev --optimize-autoloader`
2. Configurar `.env` (APP_KEY, DB, `APP_URL`, `CORS_ALLOWED_ORIGINS` com o domínio do frontend se for origem cruzada)
3. `php artisan migrate --force`
4. No diretório `frontend`: `npm ci && npm run build`
5. Servidor web apontando `public/` como document root; garantir que arquivos estáticos em `public/spa/` sejam servidos diretamente

Rotas web: redirecionamentos legados (`/public/expenses/...`, `/p/.../...`) + fallback SPA; rotas `/api/*` não são capturadas pelo fallback.
