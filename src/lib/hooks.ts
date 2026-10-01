import * as React from "react";

/**
 * SSR-safe media query hook using React 18+ useSyncExternalStore.
 */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const subscribe = React.useCallback(
    (callback: () => void) => {
      if (typeof window === "undefined") return () => {};
      const matchMedia = window.matchMedia(query);
      matchMedia.addEventListener("change", callback);
      return () => {
        matchMedia.removeEventListener("change", callback);
      };
    },
    [query]
  );

  const getSnapshot = () => {
    if (typeof window === "undefined") return defaultValue;
    return window.matchMedia(query).matches;
  };

  const getServerSnapshot = () => defaultValue;

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Returns true if viewport is desktop width (>= 768px).
 */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 768px)", true);
}

const emptySubscribe = () => () => {};

/**
 * SSR-safe hook that returns true only after hydrating on the client.
 */
export function useIsClient(): boolean {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
