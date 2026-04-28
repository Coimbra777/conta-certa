import { type ReactNode } from "react";

interface Props {
    open: boolean;
    title: string;
    children: ReactNode;
    onClose: () => void;
}

export function ModalShell({ open, title, children, onClose }: Props) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm animate-slide-up">
            <div className="w-full max-w-md bg-card border-4 border-foreground rounded-2xl brutal-shadow-lg overflow-hidden">
                <div className="flex items-center justify-between border-b-4 border-foreground bg-arcade-pink text-primary-foreground px-5 py-3">
                    <h3 className="font-display text-xl uppercase">{title}</h3>
                    <button
                        onClick={onClose}
                        className="font-black text-lg leading-none"
                        aria-label="Fechar"
                    >
                        ✕
                    </button>
                </div>
                <div className="p-5 sm:p-6">{children}</div>
            </div>
        </div>
    );
}
