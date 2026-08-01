import { describe, it, expect, vi, afterEach } from "vitest";
import { pushEnabled, getVapidPublicKey } from "@/lib/push";

describe("push", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is disabled when VAPID keys are missing", () => {
    vi.stubEnv("NEXT_PUBLIC_VAPID_PUBLIC_KEY", "");
    vi.stubEnv("VAPID_PRIVATE_KEY", "");
    expect(pushEnabled()).toBe(false);
  });

  it("is enabled when both VAPID keys are set", () => {
    vi.stubEnv("NEXT_PUBLIC_VAPID_PUBLIC_KEY", "public-key");
    vi.stubEnv("VAPID_PRIVATE_KEY", "private-key");
    expect(pushEnabled()).toBe(true);
    expect(getVapidPublicKey()).toBe("public-key");
  });

  it("requires the private key too", () => {
    vi.stubEnv("NEXT_PUBLIC_VAPID_PUBLIC_KEY", "public-key");
    vi.stubEnv("VAPID_PRIVATE_KEY", "");
    expect(pushEnabled()).toBe(false);
  });
});
