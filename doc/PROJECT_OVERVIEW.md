# Visão geral do produto

## O que é

**ContaCerta Pix** é uma aplicação para **cobranças compartilhadas via Pix**: o organizador define o valor total, cadastra **participantes**, informa a chave Pix e compartilha um **link público**. Quem deve pagar identifica-se, envia **comprovante**, e o organizador **aprova ou rejeita**.

## Problema que resolve

Substituir planilhas e cobranças informais sem visibilidade de quem já pagou ou pendências por participante.

## Fluxo principal (ativo) — organizador autenticado

1. **Cadastro / login** como organizador.
2. **Criação da despesa** autenticada (`POST /api/v1/expenses`) e **adição de participantes** com valores (`POST .../participants`).
3. **Compartilhamento do link público** (`/p/{public_hash}`) com os participantes — sem expor lista nem dados uns dos outros no GET anônimo.
4. Pagamento Pix **fora do sistema**.
5. Participante **informa nome + telefone**, valida correspondência com a cobrança e **envia comprovante** quando o status permitir.
6. Organizador **valida ou rejeita** no painel autenticado (`PATCH .../charges/{id}/validate|reject`). **Rejeição exige motivo** (`reason`).
7. Quando **todas** as cobranças estiverem **validadas**, a despesa pode ser **encerrada** (`closed`) conforme regras do backend.

## Fluxo público do participante (ativo)

- Acesso **sem login** pelo **`public_hash`** (SPA `/p/...`, API `GET /api/v1/public/expenses/{hash}`).
- **Privacidade:** o GET **sem** gestão devolve apenas **totais agregados** — não lista outros participantes nem valores individuais além do necessário para quem se identifica depois.
- Identificação por **nome + telefone** (`validate-participant`); envio de comprovante conforme status da cobrança individual.

## Gestão autenticada vs token (`manage_token`)

- No **painel** (`created_by`), o organizador vê e gerencia **somente** despesas em que é o criador.
- Despesas com **`created_by = null`** (legado / fluxo anônimo) **não aparecem** no painel autenticado — quem precisa alterar algo dependia do link com **`manage_token`** (fragmento `#manage=` ou header/query).

### Gestão via `manage_token` — experimental / standby como fluxo de produto

A API continua aceitando **`manage_token`** em rotas públicas de gestão (patch despesa, participantes, fechar, validar/rejeitar cobrança via público) para cobranças que já existem e para testes. **Não é o fluxo principal documentado para novos usuários:** o produto prioriza **conta + painel**. Perda do token **não** tem recuperação neste MVP.

## Criação de cobrança sem cadastro — standby

- Foi **prototipada** (`PublicExpenseCreatorService`, `POST /api/public/expenses`, UI legada `PublicNewExpense.tsx`).
- **Não é fluxo ativo:** o endpoint HTTP retorna **410** `PUBLIC_CREATE_EXPENSE_STANDBY`; na SPA, `/cobranca-publica/nova` exibe aviso e direciona para **cadastro/login**.
- **Risco histórico:** organizador sem conta dependia do **`manage_token`**; sem ele, não há painel nem recuperação automática.
- **Evolução possível:** reativar removendo o middleware da rota e ligando a UI novamente; no futuro, recuperação por **conta**, **telefone**, **WhatsApp/SMS** ou **reivindicação** de cobrança.

### API autenticada — participantes

- **`POST /expenses/{id}/participants`** só **insere** linhas novas (telefones inéditos na despesa). Não serve para reenviar a lista inteira de quem já está cadastrado.
- Valores já distribuídos + valores deste POST devem fechar o `total_amount`. Ajustes em quem já existe: **`PATCH .../participants/{id}`**.

### Regras de produto (MVP)

- **`due_date`:** informativo; não bloqueia fluxos após o dia do vencimento.
- **`amount_per_participant` na despesa:** quando cada participante tem valor diferente no backend, esse campo guarda a **média** (total ÷ N); valores reais estão em cada **Charge**.

## Entidades principais

| Entidade | Papel |
|----------|--------|
| **User** | Organizador autenticado |
| **Expense** | Cobrança (Pix, total, prazo, link público, token de gestão) |
| **ExpenseParticipant** | Snapshot do participante naquela cobrança |
| **Charge** | Valor devido e ciclo de status por participante |
| **PaymentProof** | Arquivo do comprovante ligado à cobrança |

Relação: `User → Expense → ExpenseParticipant → Charge → PaymentProof`.

## Estados da cobrança individual (`Charge`)

- `pending` — aguardando comprovante  
- `proof_sent` — comprovante enviado  
- `validated` — aprovado pelo organizador  
- `rejected` — recusado  

A **Expense** também tem status agregado (`open` / `closed`) conforme regras do backend.
