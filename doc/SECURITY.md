# Security Notes

## Autenticação

- A API autenticada usa Sanctum com Bearer token.
- A expiração do token é configurável por `SANCTUM_TOKEN_EXPIRATION_MINUTES`.
- `POST /api/v1/auth/logout` revoga o token atual.
- Respostas 401 da API usam o código estável `UNAUTHENTICATED`.

## Manage Token

- O token de gestão pública é aceito somente pelo header `X-Manage-Token`.
- Query string e body não são aceitos para autenticação de gestão.
- Links de gestão usam fragmento `#manage=` para evitar envio do token ao servidor.

## Comprovantes

- Os comprovantes usam storage privado (`local`).
- O backend valida extensão declarada e conteúdo real por magic bytes.
- O limite atual de upload é 5 MB.
- O path segue o padrão `payment-proofs/expense-{expense_id}/{phone_normalized}-{timestamp}.{ext}`.
- Reenvio após rejeição remove o arquivo anterior.
- Ao fechar a despesa, todos os comprovantes são removidos e `file_path` vira `null`.

## Minimização de dados

- CPF não é coletado nem exposto pela API autenticada.
- Sem token de gestão, a API pública não expõe lista de participantes, nome do organizador ou telefone do organizador.
- Comprovantes deixam de ficar acessíveis depois do fechamento da despesa.

## Headers e limites

- A API envia `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` e CSP.
- HSTS é enviado somente em produção com HTTPS.
- Login, leitura pública, ações públicas e downloads possuem rate limiting dedicado.
