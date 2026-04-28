import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "default" | "green" | "yellow" | "cyan" | "pink";
  icon?: ReactNode;
}

const TONES: Record<NonNullable<Props["tone"]>, string> = {
  default: "bg-card",
  green: "bg-arcade-green",
  yellow: "bg-arcade-yellow",
  cyan: "bg-arcade-cyan",
  pink: "bg-arcade-pink text-primary-foreground",
};

export function DashboardCard({ label, value, hint, tone = "default", icon }: Props) {
  return (
    <div
      className={cn(
        "border-4 border-foreground rounded-2xl p-5 sm:p-6 brutal-shadow-sm flex flex-col gap-2 text-foreground",
        TONES[tone]
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest opacity-70">{label}</span>
        {icon && (
          <div className="size-8 rounded-lg border-2 border-foreground bg-card text-foreground flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
      <div className="font-display text-3xl sm:text-4xl tabular-nums leading-none">{value}</div>
      {hint && <div className="text-xs opacity-70 font-medium">{hint}</div>}
    </div>
  );
}

interface SummaryProps {
  total: number;
  paid: number;
  pending: number;
  proofs: number;
}

import { formatBRL } from "@/lib/format";
import { CircleDollarSign, Clock, FileCheck2, Wallet } from "lucide-react";

export function PaymentSummaryCard({ total, paid, pending, proofs }: SummaryProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <DashboardCard tone="cyan" icon={<Wallet className="size-4" />} label="Valor total" value={formatBRL(total)} />
      <DashboardCard tone="green" icon={<CircleDollarSign className="size-4" />} label="Confirmado" value={formatBRL(paid)} />
      <DashboardCard tone="yellow" icon={<Clock className="size-4" />} label="Pendente" value={formatBRL(pending)} />
      <DashboardCard tone="pink" icon={<FileCheck2 className="size-4" />} label="Comprovantes" value={proofs} />
    </div>
  );
}
