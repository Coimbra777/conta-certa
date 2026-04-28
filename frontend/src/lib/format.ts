// Helpers de formatação BR.
export const formatBRL = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const formatPhone = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (digits.length <= 10) {
        return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
    }
    return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
};

export const formatDate = (iso?: string) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

export const formatDateTime = (iso?: string) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const initials = (name: string) =>
    name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase() ?? "")
        .join("");

export const buildPublicLink = (hash: string) =>
    `${window.location.origin}/p/${hash}`;
