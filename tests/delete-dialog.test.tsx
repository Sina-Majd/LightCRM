// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ConfirmDeleteDialog } from "@/components/dashboard/confirm-delete-dialog";

describe("delete confirmation", () => {
  it("stays open when deletion fails", async () => {
    const onOpenChange = vi.fn();
    render(<ConfirmDeleteDialog open title="حذف مشتری" itemName="Example" onOpenChange={onOpenChange} onConfirm={async () => false} />);
    await userEvent.click(screen.getByRole("button", { name: "حذف" }));
    expect(screen.getByRole("alertdialog")).toBeVisible();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("prevents repeat deletion and closes only after successful persistence", async () => {
    const action = Promise.withResolvers<boolean>();
    const onConfirm = vi.fn(() => action.promise);
    const onOpenChange = vi.fn();
    render(<ConfirmDeleteDialog open title="حذف مشتری" onOpenChange={onOpenChange} onConfirm={onConfirm} />);
    await userEvent.click(screen.getByRole("button", { name: "حذف" }));
    expect(screen.getByRole("button", { name: "حذف" })).toBeDisabled();
    expect(onOpenChange).not.toHaveBeenCalled();
    action.resolve(true);
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
    expect(onConfirm).toHaveBeenCalledOnce();
  });
});
