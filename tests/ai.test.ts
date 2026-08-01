import { describe, it, expect, vi, afterEach } from "vitest";
import { estimateCostUsd, hasAiKey } from "@/lib/ai";

describe("estimateCostUsd", () => {
  it("prices gpt-4o-mini at 0.15/0.6 per million tokens", () => {
    const cost = estimateCostUsd("gpt-4o-mini", 100_000, 20_000);
    expect(cost).toBeCloseTo(0.015 + 0.012, 5);
  });

  it("prices gpt-4o at 2.5/10", () => {
    const cost = estimateCostUsd("gpt-4o", 1_000_000, 500_000);
    expect(cost).toBeCloseTo(2.5 + 5, 5);
  });

  it("returns 0 for unknown models", () => {
    expect(estimateCostUsd("claude-3.5", 1000, 1000)).toBe(0);
  });

  it("returns 0 for zero tokens", () => {
    expect(estimateCostUsd("gpt-4o-mini", 0, 0)).toBe(0);
  });
});

describe("hasAiKey", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is false when no key is set", () => {
    vi.stubEnv("OPENAI_API_KEY", "");
    expect(hasAiKey()).toBe(false);
  });

  it("is false for placeholder keys", () => {
    vi.stubEnv("OPENAI_API_KEY", "your-api-key-here");
    expect(hasAiKey()).toBe(false);
  });

  it("is false for short keys", () => {
    vi.stubEnv("OPENAI_API_KEY", "abc");
    expect(hasAiKey()).toBe(false);
  });

  it("is true for a plausible key", () => {
    vi.stubEnv("OPENAI_API_KEY", "sk-proj-0123456789abcdef");
    expect(hasAiKey()).toBe(true);
  });
});
