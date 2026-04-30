import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { CopyButton } from "@/components/CopyButton";
import { api } from "@/lib/api/client";
import type { Expense } from "@/lib/types";
import {
    buildOrganizerExpenseShareMessage,
    buildPublicLink,
    buildWhatsAppShareUrl,
} from "@/lib/format";
import { CheckCircle2, MessageCircle, ArrowRight } from "lucide-react";

export default function ExpenseSuccess() {
    const { id = "" } = useParams();
    const [exp, setExp] = useState<Expense | null>(null);

    useEffect(() => { api.getExpense(id).then(setExp); }, [id]);

    if (!exp) return <AppShell><div className="p-8">Carregando…</div></AppShell>;
    const link = buildPublicLink(exp.publicHash);
    const whatsappHref = buildWhatsAppShareUrl(
        buildOrganizerExpenseShareMessage(exp.title, link),
    );

    return (
        <AppShell>
            <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
                <div className="border-4 border-foreground bg-arcade-green rounded-3xl brutal-shadow-lg p-8 text-center flex flex-col items-center gap-4">
                    <div className="size-16 rounded-2xl border-4 border-foreground bg-card flex items-center justify-center brutal-shadow-sm">
                        <CheckCircle2 className="size-8" />
                    </div>
                    <h1 className="font-display text-4xl uppercase">Cobrança criada!</h1>
                    <p className="font-medium text-foreground/80">
                        Compartilhe o link abaixo com os participantes. Cada um vai ver seu valor e pagar via Pix.
                    </p>
                </div>

                <div className="mt-6 border-4 border-foreground bg-card rounded-2xl brutal-shadow p-5 flex flex-col gap-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Link público</span>
                        <div className="mt-1 break-all font-medium">{link}</div>
                    </div>
                    <CopyButton value={link} label="Copiar link" className="w-full py-4 text-base" />
                    <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-arcade-cyan text-foreground border-4 border-foreground px-4 py-3 rounded-xl font-black uppercase brutal-press brutal-press-sm"
                    >
                        <MessageCircle className="size-5" /> Compartilhar no WhatsApp
                    </a>
                    <Link
                        to={`/cobrancas/${exp.id}`}
                        className="inline-flex items-center justify-center gap-2 bg-foreground text-background border-4 border-foreground px-4 py-3 rounded-xl font-black uppercase brutal-press brutal-press-sm"
                    >
                        Ir para o painel <ArrowRight className="size-5" />
                    </Link>
                </div>
            </div>
        </AppShell>
    );
}
