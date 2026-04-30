import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/**
 * Rota `/cobranca-publica/nova`: criação sem cadastro em standby (produto foca no fluxo autenticado).
 * Implementação completa permanece em {@link ./PublicNewExpense.tsx} para reativação futura.
 */
export default function PublicCreateExpenseStandby() {
    return (
        <div className="min-h-dvh bg-background text-foreground">
            <header className="border-b-4 border-foreground px-5 py-4 flex items-center justify-between gap-4">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 font-bold text-sm underline-offset-4 hover:underline"
                >
                    <ArrowLeft className="size-4" /> Início
                </Link>
                <Link
                    to="/login?redirect=/cobrancas/nova"
                    className="text-sm font-bold underline-offset-4 hover:underline"
                >
                    Entrar
                </Link>
            </header>

            <main className="max-w-xl mx-auto px-5 py-10 flex flex-col gap-6">
                <div className="border-4 border-foreground bg-card rounded-2xl brutal-shadow p-6 sm:p-8 flex flex-col gap-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Funcionalidade em standby
                    </p>
                    <h1 className="font-display text-3xl sm:text-4xl uppercase leading-tight">
                        Criar cobrança sem cadastro
                    </h1>
                    <p className="text-muted-foreground font-medium leading-relaxed">
                        Por enquanto, o fluxo principal é com conta: você cria e gerencia cobranças no
                        painel, compartilha o link público com os participantes e valida comprovantes
                        por lá. A criação anônima pode voltar no futuro.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Link
                            to="/cadastro"
                            className="inline-flex justify-center items-center bg-accent text-accent-foreground border-4 border-foreground px-5 py-4 rounded-xl font-black uppercase text-center brutal-press brutal-press-sm"
                        >
                            Criar conta grátis
                        </Link>
                        <Link
                            to="/login?redirect=/cobrancas/nova"
                            className="inline-flex justify-center items-center bg-card border-4 border-foreground px-5 py-4 rounded-xl font-bold text-center brutal-press brutal-press-sm"
                        >
                            Já tenho conta
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
