import { prisma } from "@/lib/prisma";
import { createNotification } from "@/services/notifications";

const PUSH_IDLE_DAYS = 90;
const DAY_MS = 86_400_000;

export interface MaintenanceResult {
  expiredMemberships: number;
  prunedPushSubscriptions: number;
  ranAt: string;
}

export async function expireMemberships(now = new Date()) {
  const overdue = await prisma.membership.findMany({
    where: {
      status: "ACTIVE",
      endDate: { lte: now },
      deletedAt: null,
    },
    select: {
      id: true,
      userId: true,
      plan: { select: { name: true } },
    },
  });

  if (overdue.length === 0) return 0;

  await prisma.membership.updateMany({
    where: {
      id: { in: overdue.map((membership) => membership.id) },
      status: "ACTIVE",
      endDate: { lte: now },
    },
    data: { status: "EXPIRED" },
  });

  await Promise.allSettled(
    overdue.map((membership) =>
      createNotification({
        userId: membership.userId,
        title: "Membership expired",
        body: `Your ${membership.plan.name} membership has ended. Renew to keep training.`,
        type: "MEMBERSHIP",
        data: { membershipId: membership.id },
      })
    )
  );

  return overdue.length;
}

export async function prunePushSubscriptions(now = new Date()) {
  const cutoff = new Date(now.getTime() - PUSH_IDLE_DAYS * DAY_MS);

  const { count } = await prisma.pushSubscription.deleteMany({
    where: {
      OR: [
        { failureCount: { gte: 3 } },
        { lastSuccessAt: { lt: cutoff } },
        { lastSuccessAt: null, createdAt: { lt: cutoff } },
      ],
    },
  });

  return count;
}

export async function runMaintenance(now = new Date()): Promise<MaintenanceResult> {
  const [expiredMemberships, prunedPushSubscriptions] = await Promise.all([
    expireMemberships(now),
    prunePushSubscriptions(now),
  ]);

  return {
    expiredMemberships,
    prunedPushSubscriptions,
    ranAt: now.toISOString(),
  };
}
