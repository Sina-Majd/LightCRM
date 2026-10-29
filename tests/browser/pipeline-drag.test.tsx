import React from "react";
import { render } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import type { User } from "@supabase/supabase-js";
import DashboardLayout from "@/app/dashboard/layout";
import PipelinePage from "@/app/dashboard/pipeline/page";
import { createClient } from "@/lib/supabase/client";
import * as service from "@/lib/supabase/crm-service";
import { workspaceFixture } from "../fixtures/workspace";

const navigation = vi.hoisted(() => ({ pathname: "/dashboard/pipeline", push: vi.fn(), replace: vi.fn() }));
vi.mock("next/navigation", () => ({ usePathname: () => navigation.pathname, useRouter: () => navigation }));
vi.mock("@/lib/supabase/client", () => ({ createClient: vi.fn() }));
vi.mock("@/lib/supabase/crm-service");

const fixture = workspaceFixture();

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  vi.mocked(createClient).mockReturnValue({
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-one" } as User }, error: null }) },
  } as unknown as ReturnType<typeof createClient>);
  vi.mocked(service.fetchUserProfile).mockResolvedValue(fixture.userProfile);
  vi.mocked(service.fetchPipelineStages).mockResolvedValue(fixture.stages);
  vi.mocked(service.fetchDeals).mockResolvedValue(fixture.deals);
  vi.mocked(service.fetchCustomers).mockResolvedValue(fixture.customers);
  vi.mocked(service.fetchInvoices).mockResolvedValue(fixture.invoices);
  vi.mocked(service.fetchCheques).mockResolvedValue(fixture.cheques);
  vi.mocked(service.fetchTasks).mockResolvedValue(fixture.tasks);
  vi.mocked(service.fetchActivities).mockResolvedValue(fixture.activities);
  vi.mocked(service.fetchNotifications).mockResolvedValue([]);
});

for (const input of ["mouse", "keyboard"] as const) {
  it(`keeps a ${input} drop in its new column throughout a delayed save`, async () => {
    await page.viewport(1440, 1000);
    const pending = Promise.withResolvers<void>();
    vi.mocked(service.updateDealStage).mockReturnValueOnce(pending.promise);
    render(<DashboardLayout><PipelinePage /></DashboardLayout>);
    const deal = fixture.deals[0];
    const source = () => document.querySelector(`#pipeline-col-${deal.stageId} [data-rfd-draggable-id="${deal.id}"]`);
    const destination = () => document.querySelector(`#pipeline-col-stage-negotiation [data-rfd-draggable-id="${deal.id}"]`);
    const handle = page.getByRole("button", { name: `جابجایی معامله ${deal.title}` });
    await expect.element(handle).toBeVisible();

    if (input === "mouse") {
      const target = document.querySelector('#pipeline-col-stage-negotiation [data-rfd-droppable-id]')!;
      const bounds = target.getBoundingClientRect();
      // The handle is at the card's foot: keep its centre inside the stack.
      await userEvent.dragAndDrop(handle, target, { steps: 12, targetPosition: { x: bounds.width / 2, y: bounds.height - 8 } });
    } else {
      handle.element().focus();
      await userEvent.keyboard("[Space]");
      await expect.poll(() => document.querySelector('[data-rfd-draggable-id="deal-one"]')?.getAttribute("style")).toContain("position: fixed");
      await userEvent.keyboard("{ArrowLeft}");
      await expect.poll(() => document.querySelector('#pipeline-col-stage-negotiation [data-rfd-placeholder-context-id]')).toBeTruthy();
      await userEvent.keyboard("[Space]");
    }

    try {
      await expect.poll(() => service.updateDealStage).toHaveBeenCalledWith(deal.id, "stage-negotiation", 85);
      // Inspect every painted frame while persistence is unresolved. A snap back
      // to the source column, even for one frame, is a regression.
      const columns: string[] = [];
      for (let frame = 0; frame < 8; frame++) {
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        columns.push(destination() ? "destination" : source() ? "source" : "missing");
      }
      expect(columns).toEqual(Array(8).fill("destination"));
    } finally {
      pending.resolve();
    }
    await expect.poll(destination).toBeTruthy();
    expect(source()).toBeNull();
    await expect.element(page.getByRole("button", { name: `جابجایی معامله ${deal.title}` })).toBeVisible();
    expect(document.querySelectorAll(`[data-rfd-draggable-id="${deal.id}"]`)).toHaveLength(1);
  });
}
