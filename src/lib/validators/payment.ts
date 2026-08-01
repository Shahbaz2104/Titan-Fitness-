import { z } from "zod";

export const checkoutSchema = z.object({
  planId: z.string().min(1, "Plan is required"),
  branchId: z.string().optional().nullable(),
  couponCode: z.string().max(30).optional().nullable(),
});

export const membershipUpdateSchema = z.object({
  action: z.enum(["CANCEL", "RENEW", "FREEZE", "UNFREEZE"]),
});

export const couponSchema = z.object({
  code: z.string().min(3).max(30).transform((v) => v.toUpperCase()),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().positive("Value must be positive"),
  maxUses: z.number().int().min(0).optional().nullable(),
  minAmount: z.number().min(0).optional().nullable(),
  validFrom: z.coerce.date().optional().nullable(),
  validUntil: z.coerce.date().optional().nullable(),
  isActive: z.boolean().default(true),
  appliesTo: z.enum(["ALL", "MEMBERSHIP", "CLASS", "PROGRAM", "NEW_MEMBERS"]).default("ALL"),
});

export const referralApplySchema = z.object({
  code: z.string().min(3).max(30),
});

export const referralCreateSchema = z.object({
  referredEmail: z.string().email("Valid email required"),
});
