import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProofUpload } from "./ProofUpload";

describe("ProofUpload", () => {
    it("shows inline error instead of alert when file is larger than 5MB", async () => {
        const onSubmit = vi.fn();
        const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

        render(<ProofUpload onSubmit={onSubmit} />);

        const input = document.querySelector('input[type="file"]');
        expect(input).not.toBeNull();

        const bigFile = new File(["x"], "big.pdf", {
            type: "application/pdf",
        });
        Object.defineProperty(bigFile, "size", {
            configurable: true,
            value: 6 * 1024 * 1024,
        });

        fireEvent.change(input as HTMLInputElement, {
            target: { files: [bigFile] },
        });

        expect(
            await screen.findByText(/Arquivo grande demais \(máx\. 5MB\)\./i),
        ).toBeInTheDocument();
        expect(alertSpy).not.toHaveBeenCalled();
        expect(
            screen.getByRole("button", { name: /Enviar comprovante/i }),
        ).toBeDisabled();
    });
});
