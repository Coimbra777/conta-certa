# Segurança

## Autenticação

- **Sanctum** com token **Bearer** (`Authorization: Bearer …`) nas rotas `/api/v1/*` protegidas.

## Gestão pública

- **`manage_token`** opaco; envio via query `manage` ou header **`X-Manage-Token`**; comparação com **`hash_equals`** no servidor.
- O link **para participantes** não deve incluir esse token. Em fluxos onde a API devolve links de criação/gestão, prefira **`participant_url`** e **`manage_url`** (fragmento `#manage=`) à exposição manual do token (campo `manage_token` pode existir por compatibilidade).
- **Fluxo principal atual:** organizador **autenticado** no painel. Gestão só com **`manage_token`** é **experimental / standby** como narrativa de produto (cobranças `created_by = null` não aparecem no painel).
- **GET público** sem gestão retorna apenas **totais agregados** (quantidade de participantes, pagos, em aberto) — não lista nome/telefone/status por pessoa.
- **`manage_token`** não autoriza mutação se a despesa já estiver **`closed`** — resposta **`EXPENSE_CLOSED`** (**422**); comprovantes antigos ainda podem ser lidos pelos endpoints dedicados quando permitido pela mesma autorização de gestão/dono.

### Criação sem cadastro (standby)

- **`POST /api/public/expenses`** responde **410** até remoção do middleware de standby; não confundir com rotas de participante (`GET` por hash, `validate-participant`, `submit-proof`), que permanecem ativas.

## Validação, rejeição e prazo

- **Rejeição de cobrança** (`PATCH .../reject`): **`reason` obrigatório** (painel autenticado e gestão pública com `manage_token`).
- **`due_date`:** no MVP é **informativo** — não bloqueia envio de comprovante nem validação após o vencimento (ver também API.md).

## Rate limiting

- Limite global na API + limitadores nomeados (login, registro, rota `POST /api/public/expenses` — hoje **410 standby**, throttle ainda aplicado —, validação de participante, envio de comprovante, ações com manage).

## Uploads

- Validação por tipo e por **conteúdo** (magic bytes); tamanho limitado; armazenamento em disco não público; download com nome de arquivo seguro.

## CORS

- Origens permitidas via **`CORS_ALLOWED_ORIGINS`** (`.env`); em produção, sem `*`.

## Headers HTTP

- Middleware **`SecurityHeaders`** na API (ex.: `nosniff`, `X-Frame-Options`; HSTS quando HTTPS).

## localStorage

- Token Sanctum guardado no cliente (ex.: React). **Risco:** XSS no mesmo origin pode ler o token. Mitigar com higiene de UI (evitar HTML não confiável, revisar `dangerouslySetInnerHTML`).

## Melhorias futuras sugeridas

- **CSP** no HTML servido pelo Laravel para a SPA  
- **Sentry** (ou similar) para erros em produção  
- Cookies **HttpOnly** exigiriam fluxo diferente do Bearer atual  

## Referências

- [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)  
- [ARCHITECTURE.md](./ARCHITECTURE.md)  
