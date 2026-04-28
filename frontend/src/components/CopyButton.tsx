import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    value: string;
    label?: string;
    className?: string;
    variant?: "default" | "ghost";
}

export function CopyButton({
    value,
    label = "Copiar",
    className,
    variant = "default",
}: Props) {
    const [copied, setCopied] = useState(false);

    const onCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            /* ignore */
        }
    };

    if (variant === "ghost") {
        return (
            <button
                type="button"
                onClick={onCopy}
                className={cn(
                    "inline-flex items-center gap-2 font-bold text-sm border-2 border-foreground bg-card px-3 py-2 rounded-lg brutal-press brutal-press-sm",
                    className,
                )}
            >
                {copied ? (
                    <Check className="size-4" />
                ) : (
                    <Copy className="size-4" />
                )}
                {copied ? "Copiado!" : label}
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={onCopy}
            className={cn(
                "inline-flex items-center justify-center gap-2 font-black uppercase tracking-wider border-4 border-foreground bg-accent text-accent-foreground px-5 py-3 rounded-xl brutal-press brutal-press-md",
                className,
            )}
        >
            {copied ? (
                <Check className="size-5" />
            ) : (
                <Copy className="size-5" />
            )}
            {copied ? "Copiado!" : label}
        </button>
    );
}
