# Legado — times e `team_members`

Este documento descreve o que permanece no **schema** e no **código** por compatibilidade com dados antigos, e o que pode ser removido no futuro.

## O que o produto usa hoje

Fluxo principal:

```txt
User → Expense → ExpenseParticipant → Charge → PaymentProof
```

Linguagem de API: **`participant` / `participants`**, **`amount_per_participant`** (JSON). Coluna de banco `expenses.amount_per_member` permanece até migração de rename opcional.

## O que ainda existe no banco (sem drop planejado aqui)

| Artefato | Motivo |
|----------|--------|
| Tabela `teams` | Histórico; possível feature futura |
| Tabela `team_members` | Histórico; vínculo legado em `charges.team_member_id` |
| Coluna `expenses.team_id` | Nullable; fluxo atual não associa equipe |
| Coluna `charges.team_member_id` | Nullable; cobranças antigas sem `expense_participant_id` |

## O que ainda existe no código

| Onde | Motivo |
|------|--------|
| `App\Models\Team`, `App\Models\TeamMember` | Eloquent precisa das entidades para FK e factories de teste de legado |
| `Charge::teamMember()` | Ler linhas antigas |
| `ChargeParticipantResolver::CHARGE_SNAPSHOT_RELATIONS` | Inclui `teamMember` para resolver nome/telefone quando não há `ExpenseParticipant` |
| Factories `TeamFactory`, `TeamMemberFactory` | Testes que cobrem dual vínculo legado |

**Removido do runtime:** rotas `/api/v1/teams`, controllers e resources REST de equipe; relações `User::teams()` / `ownedTeams()` / `teamMemberships()` (não usadas).

## Pré-requisitos para remover de vez

1. Backfill: todas as `charges` com `expense_participant_id` preenchido.
2. Nenhum cliente dependendo de dados só em `team_member_id`.
3. Remover fallback em `ChargeParticipantResolver` (trecho que lê `teamMember`).
4. Migração separada: dropar FK/coluna `charges.team_member_id`, depois tabelas `team_members` / `teams` se aplicável.
5. Suite de testes verde após cada etapa.

## Riscos

- Remover fallback antes do backfill quebra identificação pública e JSON de cobranças para registros antigos.
