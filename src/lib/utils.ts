import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string, opts?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-US", opts ?? { dateStyle: "medium" }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function timeAgo(date: Date | string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const intervals: [number, string][] = [
    [31536000, "year"],
    [2592000, "month"],
    [604800, "week"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ];
  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count} ${label}${count > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function truncate(text: string, length = 100): string {
  return text.length > length ? `${text.slice(0, length)}…` : text;
}

export function calculateBMI(weightKg: number, heightCm: number): number | null {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0 || heightCm > 300) {
    return null;
  }
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

export function bmiCategory(bmi: number): {
  label: string;
  color: string;
  health: string;
} {
  if (bmi < 18.5)
    return {
      label: "Underweight",
      color: "#FFC107",
      health: "You may need to increase your caloric intake.",
    };
  if (bmi < 25)
    return {
      label: "Healthy",
      color: "#00C853",
      health: "You're in a great range. Keep up the momentum!",
    };
  if (bmi < 30)
    return {
      label: "Overweight",
      color: "#FF6B35",
      health: "A balanced plan can help you reach a healthier range.",
    };
  return {
    label: "Obese",
    color: "#E63946",
    health: "We recommend a structured weight loss program.",
  };
}

export function isDateInPast(date: Date | string): boolean {
  return new Date(date).getTime() < Date.now();
}

export function dateRange(start: Date | string, end: Date | string): number {
  return Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24));
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  const masked = local.slice(0, 2) + "*".repeat(Math.max(4, local.length - 4));
  return `${masked}@${domain}`;
}
