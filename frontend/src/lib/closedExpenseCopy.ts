/** Textos de cobrança encerrada (`expense.status === "closed"`). */

export const CLOSED_EXPENSE_ORGANIZER = {
    title: "Cobrança finalizada",
    lines: [
        "Todos os participantes tiveram seus pagamentos validados.",
        "Esta cobrança está encerrada e disponível apenas para consulta.",
    ],
} as const;

export const CLOSED_EXPENSE_PUBLIC_PARTICIPANT = {
    title: "Cobrança finalizada",
    lines: [
        "Todos os pagamentos desta cobrança já foram confirmados.",
        "Não é mais necessário enviar comprovante.",
    ],
} as const;

export const CLOSED_EXPENSE_SHARE_DISABLED_HINT =
    "Cobrança finalizada — compartilhamento indisponível.";
