import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";
import { updateSession } from "@/lib/supabase/middleware";

vi.mock("@supabase/ssr", () => ({ createServerClient: vi.fn() }));

function refreshSession(user: { id: string } | null) {
  vi.mocked(createServerClient).mockImplementation((_url, _key, options) => {
    const cookies = options.cookies as CookieMethodsServer;
    return { auth: { getUser: async () => {
      await cookies.setAll?.([
        { name: "access", value: "refreshed", options: { httpOnly: true, sameSite: "lax" } },
      ], { "Cache-Control": "private, no-store", "Pragma": "no-cache", "Expires": "0" });
      await cookies.setAll?.([
        { name: "refresh", value: "new-token", options: { httpOnly: true } },
      ], {});
      return { data: { user }, error: null };
    } } } as unknown as ReturnType<typeof createServerClient>;
  });
}

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://database.test");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-key");
});

describe("session proxy", () => {
  it.each(["/dashboard", "/dashboard/today", "/dashboard/pipeline", "/dashboard/customers", "/dashboard/invoices", "/dashboard/tasks", "/dashboard/analytics"])("protects %s while retaining refresh cookies and cache headers", async (path) => {
    refreshSession(null);
    const request = new NextRequest(`https://crm.example${path}`);
    const response = await updateSession(request);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://crm.example/login");
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(response.headers.get("pragma")).toBe("no-cache");
    expect(response.headers.get("expires")).toBe("0");
    expect(response.cookies.get("access")?.httpOnly).toBe(true);
    expect(response.cookies.get("refresh")?.value).toBe("new-token");
    expect(request.cookies.get("access")?.value).toBe("refreshed");
  });

  it.each(["/login", "/register", "/signup"])("redirects authenticated visitors from %s", async (path) => {
    refreshSession({ id: "user" });
    const response = await updateSession(new NextRequest(`https://crm.example${path}`));
    expect(response.headers.get("location")).toBe("https://crm.example/dashboard");
    expect(response.cookies.getAll()).toHaveLength(2);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });

  it("leaves similarly named public paths public", async () => {
    refreshSession(null);
    const response = await updateSession(new NextRequest("https://crm.example/dashboard-preview"));
    expect(response.headers.get("location")).toBeNull();
  });
});
