import React from "react";
import { render } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import axe from "axe-core";
import { workspaceFixture } from "../fixtures/workspace";
import DashboardLayout from "@/app/dashboard/layout";
import TodayPage from "@/app/dashboard/today/page";
import PipelinePage from "@/app/dashboard/pipeline/page";
import CustomersPage from "@/app/dashboard/customers/page";
import InvoicesPage from "@/app/dashboard/invoices/page";
import TasksPage from "@/app/dashboard/tasks/page";
import AnalyticsPage from "@/app/dashboard/analytics/page";
import { useCrm } from "@/components/dashboard/crm-context";

const navigation = vi.hoisted(() => ({ pathname: "/dashboard/today", push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }));
vi.mock("next/navigation", () => ({ usePathname: () => navigation.pathname, useRouter: () => navigation }));
vi.mock("@/components/dashboard/crm-context", () => ({ useCrm: vi.fn(), CrmProvider: ({ children }: React.PropsWithChildren) => children }));

const routes = [
  ["today", TodayPage], ["pipeline", PipelinePage], ["customers", CustomersPage],
  ["invoices", InvoicesPage], ["tasks", TasksPage], ["analytics", AnalyticsPage],
] as const;

beforeEach(() => { vi.mocked(useCrm).mockReturnValue(workspaceFixture()); });

for (const width of [1440, 390]) {
  for (const [slug, View] of routes) {
    it(`${slug} renders at ${width}px without horizontal page overflow`, async () => {
      await page.viewport(width, 1000);
      navigation.pathname = `/dashboard/${slug}`;
      render(<DashboardLayout><View /></DashboardLayout>);
      await expect.element(page.getByRole("main")).toBeVisible();
      await expect.element(page.getByRole("heading", { level: 1 })).toBeVisible();
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth + 1);
      await page.screenshot({ path: `../../.next/dashboard-review/${slug}-${width}.png`, fullPage: true });
      const accessibility = await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] } });
      if (accessibility.violations.length) console.error("A11Y", slug, width, JSON.stringify(accessibility.violations.map((violation) => ({
        id: violation.id, nodes: violation.nodes.map((node) => ({ html: node.html, checks: node.any.map((check) => check.data) })),
      }))));
      expect(accessibility.violations.map((violation) => ({
        id: violation.id,
        nodes: violation.nodes.map((node) => ({ target: node.target, message: node.failureSummary })),
      }))).toEqual([]);
    });
  }
}

it("all dashboard views handle an empty workspace", async () => {
  for (const [slug, View] of routes) {
    vi.mocked(useCrm).mockReturnValue(workspaceFixture({ deals: [], customers: [], tasks: [], invoices: [], cheques: [], activities: [] }));
    navigation.pathname = `/dashboard/${slug}`;
    const result = render(<DashboardLayout><View /></DashboardLayout>);
    await expect.element(page.getByRole("main")).toBeVisible();
    const accessibility = await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] } });
    expect(accessibility.violations.map((violation) => ({ id: violation.id, nodes: violation.nodes.map((node) => node.html) }))).toEqual([]);
    result.unmount();
  }
});

it("keeps a busy activity feed within a narrow viewport", async () => {
  await page.viewport(390, 1000);
  const fixture = workspaceFixture();
  fixture.activities = Array.from({ length: 5 }, (_, index) => ({ ...fixture.activities[0], id: `activity-${index}` }));
  vi.mocked(useCrm).mockReturnValue(fixture);
  navigation.pathname = "/dashboard/today";
  render(<DashboardLayout><TodayPage /></DashboardLayout>);
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth + 1);
});

it("provides keyboard-accessible deal selection and a separate drag handle", async () => {
  await page.viewport(1440, 1000);
  const fixture = workspaceFixture();
  vi.mocked(useCrm).mockReturnValue(fixture);
  navigation.pathname = "/dashboard/pipeline";
  render(<DashboardLayout><PipelinePage /></DashboardLayout>);
  const title = page.getByRole("button", { name: fixture.deals[0].title, exact: true });
  title.element().focus();
  await userEvent.keyboard("{Enter}");
  expect(fixture.openDeal).toHaveBeenCalledWith(fixture.deals[0]);
  const handle = page.getByRole("button", { name: `جابجایی معامله ${fixture.deals[0].title}` });
  await expect.element(handle).toBeVisible();
  // Lifting/cancelling with the keyboard must not open the detail sheet.
  handle.element().focus();
  await userEvent.keyboard("[Space]{Escape}");
  expect(fixture.openDeal).toHaveBeenCalledTimes(1);
});
