import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

const PRICING: { match: RegExp; input: number; output: number }[] = [
  { match: /gpt-4o-mini|gpt-4\.1?-mini/i, input: 0.15, output: 0.6 },
  { match: /gpt-4o/i, input: 2.5, output: 10 },
  { match: /gpt-4\.1/i, input: 2, output: 8 },
  { match: /gpt-4/i, input: 30, output: 60 },
  { match: /o3|o4/i, input: 2, output: 8 },
];

export const AI_MODEL_ID = process.env.AI_MODEL ?? "gpt-4o-mini";

export function hasAiKey(): boolean {
  const key = process.env.OPENAI_API_KEY?.trim();
  return Boolean(key && key.length >= 10 && !key.includes("your-"));
}

export function getAiModel(): LanguageModel | null {
  if (!hasAiKey()) return null;
  try {
    const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
    return openai(AI_MODEL_ID);
  } catch {
    return null;
  }
}

export function estimateCostUsd(model: string, tokensIn: number, tokensOut: number): number {
  const pricing = PRICING.find((p) => p.match.test(model));
  if (!pricing) return 0;
  return ((tokensIn / 1_000_000) * pricing.input) + ((tokensOut / 1_000_000) * pricing.output);
}

export function aiEnabled(): boolean {
  return hasAiKey();
}
