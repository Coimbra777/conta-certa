import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { CopyButton } from "@/components/CopyButton";
import { ParticipantList } from "@/components/ParticipantList";
import { PaymentSummaryCard } from "@/components/DashboardCard";
import { RejectProofModal } from "@/components/RejectProofModal";
import { ModalShell } from "@/components/ModalShell";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api/client";
import type { Expense, Participant } from "@/lib/types";
import { buildPublicLink, formatBRL, formatDate } from "@/lib/format";
import { ArrowLeft } from "lucide-react";

export default function ExpenseDetail() {
  const { id = "" } = useParams();
  const [exp, setExp] = useState<Expense | null | undefined>(undefined);
  const [rejectFor, setRejectFor] = useState<Participant | null>(null);
  const [proofFor, setProofFor] = useState<Participant | null>(null);

  const refresh = () => api.getExpense(id).then(setExp);
  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, [id]);

  if (exp === undefined) return <AppShell><div className="p-8">Carregando…</div></AppShell>;
  if (!exp) return (
    <AppShell>
      <div className="p-8 max-w-xl mx-auto text-center">
        <h1 className="font-display text-3xl uppercase mb-2">Cobrança não encontrada</h1>
        <Link to="/dashboard" className="underline font-bold">Voltar para o painel</Link>
      </div>
    </AppShell>
  );

  const paid = exp.participants.filter((p) => p.status === "validated").reduce((s, p) => s + p.amount, 0);
  const proofs = exp.participants.filter((p) => p.status === "proof_sent").length;
  const pending = exp.totalAmount - paid;
  const allPaid = exp.participants.length > 0 && exp.participants.every((p) => p.status === "validated");

  const onApprove = async (p: Participant) => {
    await api.validateCharge(exp.id, p.id);
    refresh();
  };
  const onReject = async (reason: string) => {
    if (!rejectFor) return;
    await api.rejectCharge(exp.id, rejectFor.id, reason);
    refresh();
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        <div>
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-bold mb-3">
            <ArrowLeft className="size-4" /> Voltar
          </Link>
          <div className="border-4 border-foreground bg-card rounded-2xl brutal-shadow p-5 sm:p-6 flex flex-col gap-4">
            <div className="flex flex-wrap items-start gap-3 justify-between">
              <div className="min-w-0">
                <h1 className="font-display text-3xl sm:text-4xl uppercase">{exp.title}</h1>
                {exp.description && <p className="text-muted-foreground mt-1">{exp.description}</p>}
                <p className="text-sm text-muted-foreground mt-1">Vence em {formatDate(exp.dueDate)}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={allPaid ? "validated" : "pending"} />
                <span className="font-display text-2xl tabular-nums">{formatBRL(exp.totalAmount)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap p-3 bg-background border-4 border-foreground rounded-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Link público</span>
              <code className="text-sm break-all flex-1 min-w-0">{buildPublicLink(exp.publicHash)}</code>
              <CopyButton variant="ghost" value={buildPublicLink(exp.publicHash)} label="Copiar" />
            </div>
          </div>
        </div>

        <PaymentSummaryCard total={exp.totalAmount} paid={paid} pending={pending} proofs={proofs} />

        <section>
          <h2 className="font-display text-2xl uppercase mb-4">Participantes ({exp.participants.length})</h2>
          <ParticipantList
            participants={exp.participants}
            onApprove={onApprove}
            onReject={(p) => setRejectFor(p)}
            onViewProof={(p) => setProofFor(p)}
          />
        </section>
      </div>

      <RejectProofModal
        open={!!rejectFor}
        participantName={rejectFor?.name}
        onClose={() => setRejectFor(null)}
        onConfirm={onReject}
      />

      <ModalShell open={!!proofFor} title="Comprovante" onClose={() => setProofFor(null)}>
        <div className="flex flex-col items-center gap-4">
          {proofFor?.proofUrl ? (
            <img src={proofFor.proofUrl} alt="Comprovante" className="max-w-full border-4 border-foreground rounded-xl" />
          ) : (
            <p className="text-muted-foreground">Sem comprovante.</p>
          )}
        </div>
      </ModalShell>
    </AppShell>
  );
}
