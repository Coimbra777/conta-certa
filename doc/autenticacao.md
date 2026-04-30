# Autenticação

Esta aplicação usa **Laravel Sanctum** com token **Bearer** no header `Authorization` para rotas em `/api/v1/*` protegidas por `auth:sanctum`.

## Endpoints

Ver **[API.md](./API.md)** — seção **Auth**:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/logout`

Respostas de registro/login **não** usam o envelope `ApiResponse`; o frontend trata o JSON direto.

## Boas práticas

- Guardar o token apenas no cliente (hoje `localStorage` no React) implica risco se houver XSS — ver **[SECURITY.md](./SECURITY.md)**.
- Em fluxos **públicos** (participante no link `/p/...`), não reutilizar o Bearer do organizador em chamadas que devem ser anônimas.
- **Fluxo principal:** criar e gerenciar cobranças exige **conta** (`register` / `login`). A criação anônima via API está documentada como standby em **API.md**.

## Referências

- **[BACKEND.md](./BACKEND.md)** — estrutura Laravel e requests.
- **[FRONTEND.md](./FRONTEND.md)** — client HTTP e rotas da SPA.
