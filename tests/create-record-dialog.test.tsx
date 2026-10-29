// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CreateRecordDialog } from "@/components/dashboard/create-record-dialog";
import { DEFAULT_PIPELINE_STAGES } from "@/lib/crm/pipeline";

describe("record creation", () => {
  it("uses accessible labels, converts Toman to Rial, and preserves the selected stage", async () => {
    const onCreateDeal = vi.fn().mockResolvedValue(true);
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<CreateRecordDialog isOpen onClose={onClose} stages={DEFAULT_PIPELINE_STAGES} defaultStageId="stage-proposal" onCreateDeal={onCreateDeal} onCreateCustomer={vi.fn()} />);
    await user.type(screen.getByLabelText(/عنوان معامله/), "Support renewal");
    await user.type(screen.getByLabelText(/شرکت طرف حساب/), "Example");
    await user.type(screen.getByLabelText(/ارزش تخمینی/), "1000");
    await user.click(screen.getByRole("button", { name: "ثبت معامله در پایپ‌لاین" }));
    expect(onCreateDeal).toHaveBeenCalledWith(expect.objectContaining({ value: 10000, stageId: "stage-proposal", probability: 70, email: "", phone: "" }));
    await waitFor(() => expect(onClose).toHaveBeenCalledOnce());
  });

  it("keeps the deal draft and stays open when saving fails", async () => {
    const onCreateDeal = vi.fn().mockResolvedValue(false);
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<CreateRecordDialog isOpen onClose={onClose} stages={DEFAULT_PIPELINE_STAGES} onCreateDeal={onCreateDeal} onCreateCustomer={vi.fn()} />);
    await user.type(screen.getByLabelText(/عنوان معامله/), "Support renewal");
    await user.type(screen.getByLabelText(/شرکت طرف حساب/), "Example");
    await user.click(screen.getByRole("button", { name: "ثبت معامله در پایپ‌لاین" }));
    expect(screen.getByLabelText(/عنوان معامله/)).toHaveValue("Support renewal");
    expect(onClose).not.toHaveBeenCalled();
  });

  it("supports individual lead contacts without a fabricated company or contact details", async () => {
    const onCreateCustomer = vi.fn().mockResolvedValue(true);
    const user = userEvent.setup();
    render(<CreateRecordDialog isOpen defaultType="customer" onClose={vi.fn()} stages={DEFAULT_PIPELINE_STAGES} onCreateDeal={vi.fn()} onCreateCustomer={onCreateCustomer} />);
    await user.click(screen.getByRole("combobox", { name: "نوع مخاطب" }));
    await user.click(screen.getByRole("option", { name: "شخص حقیقی" }));
    await user.click(screen.getByRole("combobox", { name: "نوع پرونده" }));
    await user.click(screen.getByRole("option", { name: "سرنخ" }));
    await user.type(screen.getByLabelText(/مخاطب اصلی/), "Example person");
    await user.click(screen.getByRole("button", { name: "ثبت پرونده مشتری" }));
    expect(onCreateCustomer).toHaveBeenCalledWith(expect.objectContaining({ name: "Example person", company: "", customerType: "individual", segment: "lead", email: "", phone: "", ltv: 0 }));
  });
});
