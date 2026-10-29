import { describe, expect, it } from "vitest";
import { taskDueCategory } from "@/lib/crm/tasks";

describe("task due dates", () => {
  it.each([
    ["2026-10-27", "overdue"], ["2026-10-28", "today"],
    ["2026-10-29", "upcoming"], ["invalid", "upcoming"],
  ])("categorizes %s as %s using local calendar days", (date, expected) => {
    expect(taskDueCategory(date, new Date(2026, 9, 28, 22))).toBe(expected);
  });
});
