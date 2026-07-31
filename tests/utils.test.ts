import { describe, it, expect } from "vitest";
import {
  calculateBMI,
  bmiCategory,
  slugify,
  initials,
  truncate,
  formatCurrency,
  maskEmail,
  timeAgo,
} from "@/lib/utils";

describe("calculateBMI", () => {
  it("computes BMI correctly", () => {
    expect(calculateBMI(70, 175)).toBe(22.9);
  });

  it("returns null for invalid input", () => {
    expect(calculateBMI(0, 175)).toBeNull();
    expect(calculateBMI(70, 0)).toBeNull();
    expect(calculateBMI(-5, 175)).toBeNull();
  });
});

describe("bmiCategory", () => {
  it("classifies correctly", () => {
    expect(bmiCategory(17.5).label).toBe("Underweight");
    expect(bmiCategory(22).label).toBe("Healthy");
    expect(bmiCategory(27).label).toBe("Overweight");
    expect(bmiCategory(33).label).toBe("Obese");
  });
});

describe("slugify", () => {
  it("converts strings to slugs", () => {
    expect(slugify("Hello World!")).toBe("hello-world");
    expect(slugify("  Multiple   Spaces  ")).toBe("multiple-spaces");
    expect(slugify("Café")).toBe("caf");
  });
});

describe("initials", () => {
  it("extracts initials", () => {
    expect(initials("Marcus Cole")).toBe("MC");
    expect(initials("A")).toBe("A");
    expect(initials("")).toBe("");
  });
});

describe("truncate", () => {
  it("truncates long strings", () => {
    expect(truncate("abcdefghij", 5)).toBe("abcde…");
    expect(truncate("abc", 5)).toBe("abc");
  });
});

describe("formatCurrency", () => {
  it("formats currency", () => {
    expect(formatCurrency(59)).toBe("$59");
    expect(formatCurrency(1999.5)).toBe("$1,999.5");
  });
});

describe("maskEmail", () => {
  it("masks email addresses", () => {
    expect(maskEmail("john@example.com")).toBe("jo****@example.com");
  });
});

describe("timeAgo", () => {
  it("formats relative time", () => {
    const now = Date.now();
    expect(timeAgo(new Date(now - 60_000))).toBe("1 minute ago");
    expect(timeAgo(new Date(now - 3_600_000))).toBe("1 hour ago");
    expect(timeAgo(new Date(now - 86_400_000))).toBe("1 day ago");
  });
});
