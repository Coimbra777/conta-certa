# Deploy e build de produção

Checklist detalhado de segurança e revisões: [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md).

## Build da SPA para o Laravel

Em produção o React é empacotado em `public/spa/` e servido pela mesma origem do Laravel (`spa.blade.php` + manifest do Vite).

```bash
cd frontend
npm ci
npm run build
```

Defina `VITE_API_BASE_URL` no `.env` do frontend **antes do build** para apontar para a URL pública da API.

Se o build ainda não existir, a aplicação pode exibir instruções para gerá-lo.

## Deploy (visão geral)

1. `composer install --no-dev --optimize-autoloader`
2. Configurar `.env` (`APP_KEY`, banco, `APP_URL`, `CORS_ALLOWED_ORIGINS` com o domínio do frontend se for origem cruzada)
3. `php artisan migrate --force`
4. No diretório `frontend`: `npm ci && npm run build`
5. Servidor web com document root em `public/`; garantir que estáticos em `public/spa/` sejam servidos diretamente

Rotas web: redirecionamentos (`/public/expenses/...`, `/p/...`) + fallback SPA; `/api/*` não entram no fallback SPA.

## MySQL com Docker Compose

O serviço `db` costuma expor MySQL na porta **3300** no host (`3300:3306`). Dentro da rede Docker: `DB_HOST=db`, `DB_PORT=3306`. No host (artisan fora do container): `DB_HOST=127.0.0.1`, `DB_PORT=3300`. Alinhe `DB_DATABASE`, `DB_USERNAME` e `DB_PASSWORD` com `docker-compose.yml`.

Se mudar `DB_DATABASE` depois que o volume `.docker/mysql/dbdata` já existir, pode ser preciso criar o schema/conceder privilégios ou recriar o volume.

**Testes automatizados:** `phpunit.xml` pode usar SQLite em memória — não é obrigatório MySQL para `php artisan test`.
