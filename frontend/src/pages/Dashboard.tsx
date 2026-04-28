import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { DashboardCard } from "@/components/DashboardCard";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { CopyButton } from "@/components/CopyButton";
import { api } from "@/lib/api/client";
import type { Expense } from "@/lib/types";
import { buildPublicLink, formatBRL, formatDate } from "@/lib/format";
import { CircleDollarSign, Clock, ListChecks, PiggyBank, Plus, Receipt } from "lucide-react";

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[] | null>(null);

  useEffect(() => {
    api.listExpenses().then(setExpenses);
  }, []);

  const stats = useMemo(() => {
    const list = expenses ?? [];
    const totalExpected = list.reduce((s, e) => s + e.totalAmount, 0);
    const totalConfirmed = list.reduce(
      (s, e) => s + e.participants.filter((p) => p.status === "validated").reduce((a, b) => a + b.amount, 0),
      0
    );
    const pending = list.reduce(
      (s, e) => s + e.participants.filter((p) => p.status !== "validated").length,
      0
    );
    const active = list.length;
    return { active, totalExpected, totalConfirmed, pending };
  }, [expenses]);

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl sm:text-5xl uppercase tracking-tight">Minhas cobranças</h1>
            <p className="text-muted-foreground mt-1">Acompanhe quem pagou e quem ainda falta.</p>
          </div>
          <Link
            to="/cobrancas/nova"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground border-4 border-foreground px-5 py-3 rounded-xl font-black uppercase brutal-press brutal-press-md"
          >
            <Plus className="size-5" /> Nova cobrança
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <DashboardCard tone="cyan" icon={<ListChecks className="size-4" />} label="Cobranças ativas" value={stats.active} />
          <DashboardCard tone="yellow" icon={<PiggyBank className="size-4" />} label="Total esperado" value={formatBRL(stats.totalExpected)} />
          <DashboardCard tone="green" icon={<CircleDollarSign className="size-4" />} label="Total confirmado" value={formatBRL(stats.totalConfirmed)} />
          <DashboardCard tone="pink" icon={<Clock className="size-4" />} label="Pagamentos pendentes" value={stats.pending} />
        </div>

        {expenses === null ? (
          <div className="text-muted-foreground">Carregando...</div>
        ) : expenses.length === 0 ? (
          <EmptyState
            icon={<Receipt className="size-6" />}
            title="Você ainda não criou nenhuma cobrança"
            description="Comece criando sua primeira cobrança compartilhada."
            action={
              <Link
                to="/cobrancas/nova"
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground border-4 border-foreground px-5 py-3 rounded-xl font-black uppercase brutal-press brutal-press-md"
              >
                <Plus className="size-5" /> Criar cobrança
              </Link>
            }
          />
        ) : (
          <ul className="grid sm:grid-cols-2 gap-5">
            {expenses.map((exp) => {
              const paid = exp.participants.filter((p) => p.status === "validated").length;
              const pct = exp.participants.length === 0 ? 0 : Math.round((paid / exp.participants.length) * 100);
              const overall = paid === exp.participants.length && exp.participants.length > 0 ? "validated" : "pending";
              return (
                <li
                  key={exp.id}
                  className="border-4 border-foreground bg-card rounded-2xl brutal-shadow-sm p-5 flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-display text-xl uppercase truncate">{exp.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {exp.participants.length} participantes · vence {formatDate(exp.dueDate)}
                      </p>
                    </div>
                    <StatusBadge status={overall as any} />
                  </div>

                  <div className="font-display text-3xl tabular-nums">{formatBRL(exp.totalAmount)}</div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>{paid}/{exp.participants.length} pagaram</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-3 w-full border-2 border-foreground bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-arcade-green" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <Link
                      to={`/cobrancas/${exp.id}`}
                      className="flex-1 text-center bg-foreground text-background border-4 border-foreground px-4 py-2 rounded-lg font-bold brutal-press brutal-press-sm"
                    >
                      Ver detalhes
                    </Link>
                    <CopyButton variant="ghost" value={buildPublicLink(exp.publicHash)} label="Copiar link" />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
