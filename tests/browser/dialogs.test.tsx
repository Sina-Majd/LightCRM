import React from "react";
import { render } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import axe from "axe-core";
import { workspaceFixture } from "../fixtures/workspace";
import { CreateRecordDialog } from "@/components/dashboard/create-record-dialog";
import { CreateInvoiceDialog } from "@/components/dashboard/create-invoice-dialog";
import { ChequeRegisterDialog } from "@/components/dashboard/cheque-register-dialog";
import { DealDetailSheet } from "@/components/dashboard/deal-detail-sheet";
import { InvoicePrintModal } from "@/components/dashboard/invoice-print-modal";

const fixture = workspaceFixture();
const dialogs = [
  ["deal", () => <CreateRecordDialog isOpen onClose={vi.fn()} stages={fixture.stages} onCreateDeal={vi.fn()} onCreateCustomer={vi.fn()} />],
  ["customer", () => <CreateRecordDialog isOpen defaultType="customer" onClose={vi.fn()} stages={fixture.stages} onCreateDeal={vi.fn()} onCreateCustomer={vi.fn()} />],
  ["invoice", () => <CreateInvoiceDialog isOpen onClose={vi.fn()} customers={fixture.customers} onCreateInvoice={vi.fn()} />],
  ["cheque", () => <ChequeRegisterDialog isOpen onClose={vi.fn()} customers={fixture.customers} onCreateCheque={vi.fn()} />],
  ["deal-details", () => <DealDetailSheet isOpen onClose={vi.fn()} stages={fixture.stages} deal={fixture.deals[0]} />],
  ["invoice-print", () => <InvoicePrintModal isOpen onClose={vi.fn()} invoice={fixture.invoices[0]} customer={fixture.customers[0]} companyName="شرکت آزمایشی" />],
] as const;

for (const width of [1440, 390]) {
  for (const [name, Dialog] of dialogs) {
    it(`${name} dialog is accessible at ${width}px`, async () => {
      await page.viewport(width, 1000);
      render(<Dialog />);
      await expect.element(page.getByRole("dialog")).toBeVisible();
      const dialog = document.querySelector('[role="dialog"]')!;
      await Promise.all(document.getAnimations().map((animation) => animation.finished));
      await expect.poll(() => dialog.getBoundingClientRect().left).toBeGreaterThanOrEqual(-1);
      await expect.poll(() => dialog.getBoundingClientRect().right).toBeLessThanOrEqual(width + 1);
      if (name === "invoice-print") {
        expect(page.getByText("خدمات پشتیبانی", { exact: true }).element().getBoundingClientRect().height).toBeLessThanOrEqual(60);
      }
      const result = await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] } });
      expect(result.violations.map((violation) => ({ id: violation.id, nodes: violation.nodes.map((node) => ({ html: node.html, message: node.failureSummary })) }))).toEqual([]);
      await page.screenshot({ path: `../../.next/dashboard-review/${name}-dialog-${width}.png` });
    });
  }
}

it("selects a calendar date inside a cheque dialog without dismissing the form", async () => {
  const onClose = vi.fn();
  render(<ChequeRegisterDialog isOpen onClose={onClose} customers={fixture.customers} onCreateCheque={vi.fn()} />);
  await page.getByRole("button", { name: "تاریخ سررسید چک", exact: true }).click();
  await expect.element(page.getByRole("dialog", { name: "انتخاب تاریخ شمسی" })).toBeVisible();
  await page.getByRole("button", { name: "امروز", exact: true }).click();
  expect(onClose).not.toHaveBeenCalled();
  await expect.element(page.getByRole("dialog", { name: "انتخاب تاریخ شمسی" })).not.toBeInTheDocument();
  await page.getByRole("button", { name: "پاک کردن تاریخ" }).click();
  await expect.element(page.getByRole("button", { name: "تاریخ سررسید چک", exact: true })).toHaveTextContent("انتخاب تاریخ");
  await userEvent.keyboard("{Escape}");
  expect(onClose).toHaveBeenCalled();
});
