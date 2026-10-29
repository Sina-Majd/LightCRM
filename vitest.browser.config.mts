import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: {
    "@": fileURLToPath(new URL("./src", import.meta.url)),
    "next/dynamic": fileURLToPath(new URL("./tests/browser/mocks/dynamic.ts", import.meta.url)),
    "next/link": fileURLToPath(new URL("./tests/browser/mocks/link.tsx", import.meta.url)),
    "next/image": fileURLToPath(new URL("./tests/browser/mocks/image.tsx", import.meta.url)),
  } },
  test: {
    include: ["tests/browser/**/*.test.tsx"],
    setupFiles: ["./tests/browser/setup.ts"],
    testTimeout: 20000,
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({
        launchOptions: process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {},
        contextOptions: { locale: "fa-IR", timezoneId: "Asia/Tehran", reducedMotion: "reduce" },
      }),
      instances: [{ browser: "chromium" }],
      screenshotDirectory: fileURLToPath(new URL("./.next/dashboard-review", import.meta.url)),
    },
  },
});
