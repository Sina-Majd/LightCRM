"use client";

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

export type ActionResult = boolean | void;
export type AsyncAction<Args extends unknown[] = []> = (...args: Args) => ActionResult | Promise<ActionResult>;

/** Prevent repeat submissions and preserve form input when a save fails. */
export function useAsyncAction() {
  const pending = useRef(false);
  const [isPending, setIsPending] = useState(false);

  const run = useCallback(async (action: AsyncAction): Promise<boolean> => {
    if (pending.current) return false;
    pending.current = true;
    setIsPending(true);
    try {
      return (await action()) !== false;
    } catch (error) {
      console.error("CRM action failed:", error);
      toast.error("عملیات انجام نشد. لطفاً دوباره تلاش کنید.");
      return false;
    } finally {
      pending.current = false;
      setIsPending(false);
    }
  }, []);

  return { isPending, run };
}
