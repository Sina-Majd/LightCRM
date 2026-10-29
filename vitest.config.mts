import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    environment: "node",
    include: ["tests/**/*.test.{ts,tsx}"],
    exclude: ["tests/browser/**"],
    setupFiles: ["./tests/setup.ts"],
    restoreMocks: true,
    maxWorkers: 4,
    testTimeout: 10000,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/lib/**/*.ts", "src/components/dashboard/crm-context.tsx"],
      exclude: ["src/lib/i18n/**", "src/lib/crm/types.ts"],
    },
  },
});
