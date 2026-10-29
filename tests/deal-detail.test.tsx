// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { DealDetailSheet } from "@/components/dashboard/deal-detail-sheet";
import { workspaceFixture } from "./fixtures/workspace";

it("keeps a negotiation note after a failed save and clears the draft after retry succeeds", async () => {
  const fixture = workspaceFixture();
  const onAddNote = vi.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true);
  const user = userEvent.setup();
  render(<DealDetailSheet isOpen deal={fixture.deals[0]} stages={fixture.stages} onClose={vi.fn()} onAddNote={onAddNote} />);
  await user.type(screen.getByRole("textbox", { name: "یادداشت مذاکره" }), "Customer approved the proposal");
  await user.click(screen.getByRole("button", { name: "ثبت یادداشت" }));
  expect(screen.getByRole("textbox", { name: "یادداشت مذاکره" })).toHaveValue("Customer approved the proposal");
  expect(onAddNote).toHaveBeenCalledWith("deal-one", "Customer approved the proposal");
  await user.click(screen.getByRole("button", { name: "ثبت یادداشت" }));
  await waitFor(() => expect(screen.getByRole("textbox", { name: "یادداشت مذاکره" })).toHaveValue(""));
  expect(onAddNote).toHaveBeenCalledTimes(2);
});
