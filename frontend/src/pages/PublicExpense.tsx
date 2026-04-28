import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { api } from "@/lib/api/client";
import type { Expense, Participant } from "@/lib/types";
import { PixKeyBox } from "@/components/PixKeyBox";
import { ProofUpload } from "@/components/ProofUpload";
import { StatusBadge } from "@/components/StatusBadge";
import { formatBRL, initials } from "@/lib/format";
import { CheckCircle2, Clock, Smartphone, AlertTriangle } from "lucide-react";

export default function PublicExpense() {
    const { hash = "" } = useParams();
    const [searchParams] = useSearchParams();
    const manageToken = searchParams.get("manage");
    const [exp, setExp] = useState<Expense | null | undefined>(undefined);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [participant, setParticipant] = useState<Participant | null>(null);
    const [identifying, setIdentifying] = useState(false);
    const [identifyError, setIdentifyError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        api.getPublicExpense(hash, manageToken).then(setExp);
    }, [hash, manageToken]);

    const identify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIdentifyError(null);
        setIdentifying(true);
        try {
            const result = await api.identifyParticipant(hash, name.trim(), phone.trim(), manageToken);
            if (!result) {
                setIdentifyError("Não encontramos seu nome ou telefone na lista. Confira com quem te enviou o link.");
                return;
            }
            setParticipant(result.participant);
            setExp(result.expense);
        } finally {
            setIdentifying(false);
        }
    };

    const sendProof = async (file: File) => {
        if (!participant) return;
        setSubmitting(true);
        try {
            const updated = await api.submitProof(hash, participant, file);
            if (updated) setParticipant(updated);
        } finally {
            setSubmitting(false);
        }
    };

    if (exp === undefined) {
        return <PublicShell><div className="p-8 text-center">Carregando…</div></PublicShell>;
    }
    if (!exp) {
        return (
            <PublicShell>
                <div className="p-8 text-center">
                    <h1 className="font-display text-3xl uppercase mb-2">Link inválido</h1>
                    <p className="text-muted-foreground">Confira com o organizador se o link está correto.</p>
                </div>
            </PublicShell>
        );
    }

    return (
        <PublicShell>
            <header className="px-5 sm:px-6 pt-8 pb-6 border-b-4 border-foreground bg-arcade-yellow">
                <div className="max-w-md mx-auto">
                    <span className="text-xs font-bold uppercase tracking-widest">Cobrança compartilhada</span>
                    <h1 className="font-display text-3xl sm:text-4xl uppercase leading-tight mt-1">{exp.title}</h1>
                    <p className="text-sm font-bold mt-2">Organizado por {exp.organizerName}</p>
                    {exp.description && <p className="text-sm mt-1 opacity-80">{exp.description}</p>}
                </div>
            </header>

            <main className="px-5 sm:px-6 py-6 max-w-md mx-auto flex flex-col gap-5">
                {!participant ? (
                    <form onSubmit={identify} className="border-4 border-foreground bg-card rounded-2xl brutal-shadow p-5 flex flex-col gap-4">
                        <h2 className="font-display text-xl uppercase">Quem é você?</h2>
                        <p className="text-sm text-muted-foreground -mt-2">
                            Identifique-se para ver seu valor e fazer o pagamento.
                        </p>
                        <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-bold uppercase tracking-widest">Seu nome</span>
                            <input className="public-input" value={name} onChange={(e) => setName(e.target.value)} required />
                        </label>
                        <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-bold uppercase tracking-widest">Telefone</span>
                            <input className="public-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 9..." />
                        </label>
                        {identifyError && (
                            <div className="border-4 border-foreground bg-status-rejected text-status-rejected-fg px-3 py-2 rounded-lg text-sm font-bold">
                                {identifyError}
                            </div>
                        )}
                        <button
                            disabled={identifying}
                            className="bg-accent text-accent-foreground border-4 border-foreground py-4 rounded-xl font-black uppercase tracking-wider brutal-press brutal-press-md disabled:opacity-50"
                        >
                            {identifying ? "..." : "Ver meu pagamento"}
                        </button>
                    </form>
                ) : (
                    <>
                        <div className="border-4 border-foreground bg-card rounded-2xl brutal-shadow p-5 flex flex-col gap-3">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="size-12 rounded-full border-4 border-foreground bg-arcade-cyan flex items-center justify-center font-black">{initials(participant.name)}</div>
                                    <div className="min-w-0">
                                        <div className="font-bold truncate">{participant.name}</div>
                                        <div className="text-xs text-muted-foreground">Seu valor</div>
                                    </div>
                                </div>
                                <StatusBadge status={participant.status} />
                            </div>
                            <div className="font-display text-5xl tabular-nums leading-none">{formatBRL(participant.amount)}</div>
                        </div>

                        {participant.status === "validated" && (
                            <Banner tone="green" icon={<CheckCircle2 className="size-5" />} title="Pagamento confirmado">
                                Obrigado! O organizador confirmou seu pagamento.
                            </Banner>
                        )}

                        {participant.status === "proof_sent" && (
                            <Banner tone="cyan" icon={<Clock className="size-5" />} title="Comprovante recebido">
                                Recebemos seu comprovante. Aguarde a confirmação do organizador.
                            </Banner>
                        )}

                        {participant.status === "rejected" && (
                            <Banner tone="red" icon={<AlertTriangle className="size-5" />} title="Comprovante rejeitado">
                                {participant.rejectionReason ?? "Confira o motivo e envie um novo comprovante."}
                            </Banner>
                        )}

                        {(participant.status === "pending" || participant.status === "rejected") && (
                            <>
                                <PixKeyBox pixKey={exp.pixKey} pixKeyType={exp.pixKeyType} receiverName={exp.pixReceiverName} />

                                <ol className="border-4 border-foreground bg-card rounded-2xl p-5 flex flex-col gap-3 brutal-shadow-sm text-sm">
                                    <Step n={1} text="Copie a chave Pix acima" />
                                    <Step n={2} text="Abra o app do seu banco" />
                                    <Step n={3} text="Faça o pagamento do valor exato" />
                                    <Step n={4} text="Volte aqui e envie seu comprovante" />
                                </ol>

                                <div className="border-4 border-foreground bg-card rounded-2xl p-5 brutal-shadow flex flex-col gap-3">
                                    <div className="flex items-center gap-2">
                                        <Smartphone className="size-5" />
                                        <h3 className="font-display text-lg uppercase">Enviar comprovante</h3>
                                    </div>
                                    <ProofUpload onSubmit={sendProof} submitting={submitting} />
                                </div>
                            </>
                        )}
                    </>
                )}
            </main>

            <style>{`
                .public-input {
                    width: 100%;
                    border: 4px solid hsl(var(--foreground));
                    background: hsl(var(--background));
                    border-radius: 0.75rem;
                    padding: 0.85rem 1rem;
                    font-size: 1rem;
                    font-weight: 500;
                    outline: none;
                }
                .public-input:focus { box-shadow: 4px 4px 0 0 hsl(var(--accent)); }
            `}</style>
        </PublicShell>
    );
}

function PublicShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-dvh bg-background flex flex-col">
            <div className="border-b-4 border-foreground bg-foreground text-background">
                <div className="max-w-md mx-auto px-5 py-3 flex items-center gap-2">
                    <span className="size-5 rounded-full bg-accent border-2 border-background" />
                    <span className="font-display uppercase">ContaCerta Pix</span>
                </div>
            </div>
            <div className="flex-1 flex flex-col">{children}</div>
            <footer className="text-center text-xs text-muted-foreground py-4">
                Pagamento seguro via Pix · sem login necessário
            </footer>
        </div>
    );
}

function Banner({ tone, icon, title, children }: { tone: "green" | "cyan" | "red"; icon: React.ReactNode; title: string; children: React.ReactNode }) {
    const bg = tone === "green" ? "bg-arcade-green" : tone === "cyan" ? "bg-arcade-cyan" : "bg-status-rejected";
    const fg = tone === "red" ? "text-status-rejected-fg" : "text-foreground";
    return (
        <div className={`border-4 border-foreground rounded-2xl p-5 brutal-shadow-sm ${bg} ${fg}`}>
            <div className="flex items-center gap-2 font-display text-lg uppercase mb-1">{icon}{title}</div>
            <p className="text-sm font-medium opacity-90">{children}</p>
        </div>
    );
}

function Step({ n, text }: { n: number; text: string }) {
    return (
        <li className="flex items-center gap-3">
            <span className="size-7 rounded-full border-2 border-foreground bg-arcade-pink text-primary-foreground font-black grid place-items-center text-xs">{n}</span>
            <span className="font-medium">{text}</span>
        </li>
    );
}
