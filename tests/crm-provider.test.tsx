// @vitest-environment jsdom
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { AuthError, type User } from "@supabase/supabase-js";
import { CrmProvider, useCrm } from "@/components/dashboard/crm-context";
import { createClient } from "@/lib/supabase/client";
import * as service from "@/lib/supabase/crm-service";
import { workspaceFixture } from "./fixtures/workspace";

const navigation = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => navigation }));
vi.mock("@/lib/supabase/client", () => ({ createClient: vi.fn() }));
vi.mock("@/lib/supabase/crm-service");
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const fixture = workspaceFixture();
function mount() {
  return renderHook(useCrm, { wrapper: CrmProvider });
}

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  vi.spyOn(console, "error").mockImplementation(() => {});
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

it("releases completed resources while another request is still pending", async () => {
  const pending = Promise.withResolvers<typeof fixture.invoices>();
  vi.mocked(service.fetchInvoices).mockReturnValue(pending.promise);
  const { result } = mount();
  await waitFor(() => expect(result.current.load.deals).toBe(true));
  expect(result.current.deals).toEqual(fixture.deals);
  expect(result.current.load.invoices).toBe(false);
  expect(result.current.invoices).toEqual([]);
  await act(async () => pending.resolve(fixture.invoices));
  expect(result.current.load.invoices).toBe(true);
});

it("keeps a failed resource empty, reports the failure and can reload it", async () => {
  vi.mocked(service.fetchDeals).mockRejectedValueOnce(new Error("Network unavailable"));
  const { result } = mount();
  await waitFor(() => expect(result.current.loadError).toBeTruthy());
  expect(result.current.deals).toEqual([]);
  expect(result.current.customers).toEqual(fixture.customers);
  act(() => result.current.reloadWorkspace());
  await waitFor(() => expect(result.current.deals).toEqual(fixture.deals));
  expect(result.current.loadError).toBeNull();
});

it("redirects an unauthenticated user without requesting workspace resources", async () => {
  vi.mocked(createClient().auth.getUser).mockResolvedValue({ data: { user: null }, error: new AuthError("Authentication required") });
  mount();
  await waitFor(() => expect(navigation.replace).toHaveBeenCalledWith("/login"));
  expect(service.fetchUserProfile).not.toHaveBeenCalled();
  expect(service.fetchDeals).not.toHaveBeenCalled();
});

it("fails closed when an authenticated account has no workspace", async () => {
  vi.mocked(service.fetchUserProfile).mockResolvedValue(null);
  const { result } = mount();
  await waitFor(() => expect(result.current.loadError).toBeTruthy());
  expect(service.fetchDeals).not.toHaveBeenCalled();
  expect(result.current.deals).toEqual([]);
});

it("retains a selected deal after a failed delete and removes it after a successful retry", async () => {
  const { result } = mount();
  await waitFor(() => expect(result.current.load.deals).toBe(true));
  act(() => result.current.openDeal(fixture.deals[0]));
  vi.mocked(service.deleteDeal).mockRejectedValueOnce(new Error("Permission denied"));
  await act(async () => expect(await result.current.deleteDeal("deal-one")).toBe(false));
  expect(result.current.selectedDeal?.id).toBe("deal-one");
  expect(result.current.deals).toHaveLength(1);
  vi.mocked(service.deleteDeal).mockResolvedValueOnce(undefined);
  await act(async () => expect(await result.current.deleteDeal("deal-one")).toBe(true));
  expect(result.current.selectedDeal).toBeNull();
  expect(result.current.deals).toEqual([]);
});

it("keeps the open deal synchronized with persisted stage changes", async () => {
  const pending = Promise.withResolvers<void>();
  vi.mocked(service.updateDealStage).mockReturnValueOnce(pending.promise);
  const { result } = mount();
  await waitFor(() => expect(result.current.load.deals).toBe(true));
  act(() => result.current.openDeal(fixture.deals[0]));
  let save: Promise<boolean>;
  act(() => { save = result.current.changeStageFromSheet("deal-one", "stage-won"); });
  expect(result.current.selectedDeal?.stageId).toBe("stage-proposal");
  await act(async () => { pending.resolve(); await save; });
  expect(result.current.selectedDeal).toMatchObject({ stageId: "stage-won", probability: 100 });
  expect(service.updateDealStage).toHaveBeenCalledWith("deal-one", "stage-won", 100);
});

it("moves a dropped deal before persistence finishes and retains the saved position", async () => {
  const pending = Promise.withResolvers<void>();
  vi.mocked(service.updateDealStage).mockReturnValueOnce(pending.promise);
  const { result } = mount();
  await waitFor(() => expect(result.current.load.deals).toBe(true));
  const updated = result.current.deals.map((deal) => ({ ...deal, stageId: "stage-won", probability: 100, daysInStage: 0 }));
  let save: Promise<boolean>;
  act(() => { save = result.current.changeDeals(updated); });
  expect(result.current.deals[0]).toMatchObject({ stageId: "stage-won", probability: 100, daysInStage: 0 });
  await act(async () => { pending.resolve(); expect(await save).toBe(true); });
  expect(result.current.deals[0].stageId).toBe("stage-won");
  expect(result.current.activities.filter((activity) => activity.kind === "stage_change")).toHaveLength(1);
});

it("restores a failed drop's stage and position without discarding other saved edits", async () => {
  const secondDeal = { ...fixture.deals[0], id: "deal-two" };
  vi.mocked(service.fetchDeals).mockResolvedValue([fixture.deals[0], secondDeal]);
  const pending = Promise.withResolvers<void>();
  vi.mocked(service.updateDealStage).mockReturnValueOnce(pending.promise);
  const { result } = mount();
  await waitFor(() => expect(result.current.deals).toHaveLength(2));
  const moved = { ...fixture.deals[0], stageId: "stage-won", probability: 100, daysInStage: 0, lastActivity: "Just moved" };
  let save: Promise<boolean>;
  act(() => { save = result.current.changeDeals([secondDeal, moved]); });
  expect(result.current.deals.map((deal) => deal.id)).toEqual(["deal-two", "deal-one"]);
  expect(result.current.deals[1].stageId).toBe("stage-won");
  await act(async () => { await result.current.updateNextAction("deal-one", "Saved during drop", "2099-01-01"); });
  await act(async () => { pending.reject(new Error("Offline")); expect(await save).toBe(false); });
  expect(result.current.deals.map((deal) => deal.id)).toEqual(["deal-one", "deal-two"]);
  expect(result.current.deals[0]).toMatchObject({
    stageId: fixture.deals[0].stageId, probability: fixture.deals[0].probability,
    daysInStage: fixture.deals[0].daysInStage, lastActivity: fixture.deals[0].lastActivity,
    nextActionTitle: "Saved during drop", nextActionDue: "2099-01-01",
  });
  expect(result.current.activities.filter((activity) => activity.kind === "stage_change")).toHaveLength(0);
});

it("reorders within a column immediately without writing unchanged stages", async () => {
  const secondDeal = { ...fixture.deals[0], id: "deal-two" };
  vi.mocked(service.fetchDeals).mockResolvedValue([fixture.deals[0], secondDeal]);
  const { result } = mount();
  await waitFor(() => expect(result.current.deals).toHaveLength(2));
  let save: Promise<boolean>;
  act(() => { save = result.current.changeDeals([secondDeal, fixture.deals[0]]); });
  expect(result.current.deals.map((deal) => deal.id)).toEqual(["deal-two", "deal-one"]);
  expect(service.updateDealStage).not.toHaveBeenCalled();
  await act(async () => { expect(await save).toBe(true); });
});

it("commits successful moves and preserves failed deals when a batch partially fails", async () => {
  const secondDeal = { ...fixture.deals[0], id: "deal-two" };
  vi.mocked(service.fetchDeals).mockResolvedValue([fixture.deals[0], secondDeal]);
  vi.mocked(service.updateDealStage).mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error("Offline"));
  const { result } = mount();
  await waitFor(() => expect(result.current.deals).toHaveLength(2));
  const updates = result.current.deals.map((deal) => ({ ...deal, stageId: "stage-won", probability: 100 }));
  await act(async () => expect(await result.current.changeDeals(updates)).toBe(false));
  expect(result.current.deals.map((deal) => deal.stageId)).toEqual(["stage-won", "stage-proposal"]);
  expect(result.current.activities.filter((activity) => activity.kind === "stage_change")).toHaveLength(1);
});

it("keeps a task date after a failed reschedule and updates it after persistence", async () => {
  const { result } = mount();
  await waitFor(() => expect(result.current.load.tasks).toBe(true));
  vi.mocked(service.updateTaskDueDate).mockRejectedValueOnce(new Error("Offline"));
  await act(async () => expect(await result.current.rescheduleTask("task-one", "2099-01-01")).toBe(false));
  expect(result.current.tasks[0].dueDate).toBe(fixture.tasks[0].dueDate);
  vi.mocked(service.updateTaskDueDate).mockResolvedValueOnce(undefined);
  await act(async () => expect(await result.current.rescheduleTask("task-one", "2099-01-01")).toBe(true));
  expect(result.current.tasks[0]).toMatchObject({ dueDate: "2099-01-01", dueCategory: "upcoming" });
});

it("persists deal notes and preserves the original text when saving fails", async () => {
  vi.mocked(service.fetchDeals).mockResolvedValue([{ ...fixture.deals[0], notes: "Existing note" }]);
  const { result } = mount();
  await waitFor(() => expect(result.current.load.deals).toBe(true));
  vi.mocked(service.updateDealNotes).mockRejectedValueOnce(new Error("Offline"));
  await act(async () => expect(await result.current.addDealNote("deal-one", "New note")).toBe(false));
  expect(result.current.deals[0].notes).toBe("Existing note");
  vi.mocked(service.updateDealNotes).mockResolvedValueOnce(undefined);
  await act(async () => expect(await result.current.addDealNote("deal-one", "New note")).toBe(true));
  expect(service.updateDealNotes).toHaveBeenLastCalledWith("deal-one", "Existing note\n\nNew note");
  expect(result.current.deals[0].notes).toBe("Existing note\n\nNew note");
});
