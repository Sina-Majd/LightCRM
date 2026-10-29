// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CreateInvoiceDialog } from "@/components/dashboard/create-invoice-dialog";

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

describe("invoice creation", () => {
  it("converts entered Toman values to Rial, calculates totals, and waits for the save", async () => {
    const save = Promise.withResolvers<boolean>();
    const onCreateInvoice = vi.fn(() => save.promise);
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<CreateInvoiceDialog isOpen onClose={onClose} customers={[]} onCreateInvoice={onCreateInvoice} />);
    await user.type(screen.getByLabelText("شرح"), "Consulting");
    await user.type(screen.getByLabelText("قیمت واحد"), "۱۰۰۰");
    fireEvent.change(screen.getByLabelText("تعداد"), { target: { value: "2" } });
    await user.click(screen.getByRole("button", { name: /تایید و صدور/ }));
    expect(onCreateInvoice).toHaveBeenCalledWith(
      expect.objectContaining({ subtotal: 20000, tax: 2000, total: 22000 }),
      [expect.objectContaining({ description: "Consulting", quantity: 2, unit_price: 10000, total: 22000 })]
    );
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /تایید و صدور/ })).toBeDisabled();
    save.resolve(true);
    await waitFor(() => expect(onClose).toHaveBeenCalledOnce());
  });

  it("retains user input when persistence fails and permits retry", async () => {
    const onCreateInvoice = vi.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<CreateInvoiceDialog isOpen onClose={onClose} customers={[]} onCreateInvoice={onCreateInvoice} />);
    await user.type(screen.getByLabelText("شرح"), "Consulting");
    await user.type(screen.getByLabelText("قیمت واحد"), "1000");
    await user.click(screen.getByRole("button", { name: /تایید و صدور/ }));
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByLabelText("شرح")).toHaveValue("Consulting");
    expect(screen.getByLabelText("قیمت واحد")).toHaveValue("1000");
    await user.click(screen.getByRole("button", { name: /تایید و صدور/ }));
    await waitFor(() => expect(onClose).toHaveBeenCalledOnce());
    expect(onCreateInvoice).toHaveBeenCalledTimes(2);
  });
});
