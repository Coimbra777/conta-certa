# Conta Fácil

API **Laravel 12** (`/api/v1`) + SPA **React/Vite** em `frontend/`.

## Requisitos

PHP 8.2+, Composer, MySQL 8 (ou MariaDB compatível), Node.js 20+.

## Rodar localmente

### Backend

```bash
cp .env.example .env
# Ajuste DB_* no .env
php artisan key:generate
php artisan migrate
php artisan serve
```

API: `http://localhost:8000/api/v1` · útil: `APP_URL`, `CORS_ALLOWED_ORIGINS` (ex.: `http://localhost:5173` em dev).

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_BASE_URL=http://localhost:8000
npm run dev
```

App: `http://localhost:5173`.

### Backend + Vite juntos

```bash
composer run dev
```

### Testes

```bash
php artisan test
```

---
