# API Notes

## Envelope padrão

Respostas JSON seguem o formato:

```json
{
  "success": true,
  "message": "...",
  "data": {},
  "meta": {}
}
```

Erros seguem o formato:

```json
{
  "success": false,
  "message": "...",
  "code": "ERROR_CODE",
  "errors": {}
}
```

## Gestão pública

Endpoints públicos de gestão exigem o header:

```http
X-Manage-Token: <token>
```

O token não é aceito por query string nem por body.

## Comprovantes

- Upload público: `POST /api/v1/public/expenses/{hash}/submit-proof`
- Download privado do organizador: `GET /api/v1/charges/{charge}/proof`
- Download público com gestão: `GET /api/v1/public/charges/{charge}/proof`
- Preview: `GET /api/v1/.../charges/{charge}/proofs/latest/view`

Após o fechamento da despesa, preview e download retornam `PROOF_REMOVED_AFTER_EXPENSE_CLOSED`.
