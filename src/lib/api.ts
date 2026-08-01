import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Prisma } from "@prisma/client";
import { type ZodType } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimitByUser } from "@/lib/rate-limit";

export type ApiRole = "SUPER_ADMIN" | "ADMIN" | "TRAINER" | "RECEPTIONIST" | "MEMBER";

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(message: string, status = 400, code = "BAD_REQUEST") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function jsonOk<T>(data: T, init?: { status?: number }) {
  return NextResponse.json({ success: true, data }, { status: init?.status ?? 200 });
}

export function parseBody<T>(schema: ZodType<T>, body: unknown): T {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid input";
    throw new ApiError(message, 400, "VALIDATION_ERROR");
  }
  return parsed.data;
}

export function jsonError(error: unknown, fallback = "Something went wrong") {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { success: false, error: { code: error.code, message: error.message } },
      { status: error.status }
    );
  }
  console.error("[api]", error);
  return NextResponse.json(
    { success: false, error: { code: "INTERNAL", message: fallback } },
    { status: 500 }
  );
}

export async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) throw new ApiError("Unauthorized", 401, "UNAUTHORIZED");
  return user;
}

export async function requireRole(...roles: ApiRole[]) {
  const user = await requireUser();
  const role = user.role as ApiRole;
  if (!roles.includes(role)) {
    throw new ApiError("Forbidden", 403, "FORBIDDEN");
  }
  return user;
}

export async function requireAdmin() {
  return requireRole("SUPER_ADMIN", "ADMIN");
}

export async function withRateLimit(userId: string, limit = 60, windowMs = 60_000) {
  const { success } = await rateLimitByUser(userId, limit, windowMs);
  if (!success) throw new ApiError("Too many requests", 429, "RATE_LIMITED");
}

export async function auditLog(params: {
  actorId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  details?: Record<string, unknown>;
}) {
  try {
    const h = await headers();
    await prisma.auditLog.create({
      data: {
        actorId: params.actorId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        details: (params.details ?? {}) as Prisma.InputJsonValue,
        ipAddress: h.get("x-forwarded-for") ?? undefined,
        userAgent: h.get("user-agent") ?? undefined,
      },
    });
  } catch {
    // audit logging must never break the request
  }
}

export function getIp(): string {
  // placeholder kept for parity with rate-limit API
  return "unknown";
}
