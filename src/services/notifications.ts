import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function createNotification(params: {
  userId: string;
  title: string;
  body: string;
  type?: string;
  data?: Record<string, unknown>;
}) {
  return prisma.notification.create({
    data: {
      userId: params.userId,
      title: params.title,
      body: params.body,
      type: params.type as never,
      data: (params.data ?? {}) as Prisma.InputJsonValue,
    },
  });
}

export async function getNotifications(userId: string, limit = 50) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getUnreadCount(userId: string) {
  return prisma.notification.count({
    where: { userId, readAt: null },
  });
}

export async function markNotificationRead(userId: string, id: string) {
  const result = await prisma.notification.updateMany({
    where: { id, userId },
    data: { readAt: new Date() },
  });
  return { updated: result.count > 0 };
}

export async function markAllRead(userId: string) {
  const result = await prisma.notification.updateMany({
    where: { userId, readAt: null },
    data: { readAt: new Date() },
  });
  return { updated: result.count };
}

export async function notifyMembershipExpiry() {
  const threshold = new Date();
  threshold.setDate(threshold.getDate() + 7);
  const expiring = await prisma.membership.findMany({
    where: {
      status: "ACTIVE",
      endDate: { lte: threshold },
    },
    include: { user: { select: { id: true } } },
  });

  for (const membership of expiring) {
    if (!membership.endDate) continue;
    const daysLeft = Math.ceil(
      (membership.endDate.getTime() - Date.now()) / 86_400_000
    );
    await createNotification({
      userId: membership.userId,
      title: "Membership expiring soon",
      body: `Your membership ends in ${daysLeft} day${daysLeft === 1 ? "" : "s"}. Renew to keep training.`,
      type: "MEMBERSHIP",
      data: { membershipId: membership.id, daysLeft },
    });
  }
  return expiring.length;
}
