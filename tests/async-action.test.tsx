// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { toast } from "sonner";
import { useAsyncAction } from "@/lib/use-async-action";

vi.mock("sonner", () => ({ toast: { error: vi.fn() } }));

describe("async form actions", () => {
  it("prevents duplicate submissions while a save is pending", async () => {
    const { result } = renderHook(useAsyncAction);
    const deferred = Promise.withResolvers<boolean>();
    const save = vi.fn(() => deferred.promise);
    let first!: Promise<boolean>;
    act(() => { first = result.current.run(save); });
    expect(result.current.isPending).toBe(true);
    await expect(result.current.run(save)).resolves.toBe(false);
    expect(save).toHaveBeenCalledTimes(1);
    await act(async () => { deferred.resolve(true); await first; });
    expect(result.current.isPending).toBe(false);
    await expect(first).resolves.toBe(true);
  });

  it("allows retry after a failed save without throwing into an event handler", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { result } = renderHook(useAsyncAction);
    await act(async () => {
      expect(await result.current.run(() => Promise.reject(new Error("offline")))).toBe(false);
    });
    expect(result.current.isPending).toBe(false);
    expect(toast.error).toHaveBeenCalledWith(expect.any(String));
    await act(async () => { expect(await result.current.run(async () => true)).toBe(true); });
  });

  it("preserves an explicit failure from the provider", async () => {
    const { result } = renderHook(useAsyncAction);
    await act(async () => { expect(await result.current.run(async () => false)).toBe(false); });
    expect(result.current.isPending).toBe(false);
  });
});
