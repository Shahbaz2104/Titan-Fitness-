import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getWebPush, pushEnabled } from "@/lib/push";

export async function createNotification(params: {
  userId: string;
  title: string;
  body: string;
  type?: string;
  data?: Record<string, unknown>;
}) {
  const notification = await prisma.notification.create({
    data: {
      userId: params.userId,
      title: params.title,
      body: params.body,
      type: params.type as never,
      data: (params.data ?? {}) as Prisma.InputJsonValue,
    },
  });

  if (pushEnabled()) {
    await sendPushToUser(params.userId, notification.title, notification.body, {
      type: params.type ?? "SYSTEM",
      notificationId: notification.id,
    }).catch(() => {
      // push delivery is best-effort; never break notification creation
    });
  }

  return notification;
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
    const daysLeft = Math.ceil((membership.endDate.getTime() - Date.now()) / 86_400_000);
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

// ============================================================
// WEB PUSH SUBSCRIPTIONS
// ============================================================

export async function subscribePush(params: {
  userId: string;
  endpoint: string;
  keysP256dh: string;
  keysAuth: string;
  userAgent?: string;
}) {
  await prisma.pushSubscription.upsert({
    where: { endpoint: params.endpoint },
    update: {
      keysP256dh: params.keysP256dh,
      keysAuth: params.keysAuth,
      userAgent: params.userAgent,
    },
    create: {
      userId: params.userId,
      endpoint: params.endpoint,
      keysP256dh: params.keysP256dh,
      keysAuth: params.keysAuth,
      userAgent: params.userAgent,
    },
  });
  return { subscribed: true };
}

export async function unsubscribePush(userId: string, endpoint: string) {
  const result = await prisma.pushSubscription.deleteMany({
    where: { userId, endpoint },
  });
  return { unsubscribed: result.count > 0 };
}

export async function getPushSubscriptions(userId: string) {
  return prisma.pushSubscription.findMany({ where: { userId } });
}

export async function sendPushToUser(
  userId: string,
  title: string,
  body: string,
  data: Record<string, unknown>
) {
  if (!pushEnabled()) return 0;
  const subscriptions = await getPushSubscriptions(userId);
  if (subscriptions.length === 0) return 0;

  const webpush = getWebPush();
  const payload = JSON.stringify({
    title,
    body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    data: {
      url: data.url ?? "/dashboard/notifications",
      type: data.type ?? "SYSTEM",
      notificationId: data.notificationId,
    },
  });

  let sent = 0;
  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.keysP256dh, auth: sub.keysAuth },
        },
        payload
      );
      sent++;
    } catch (error) {
      const code = (error as { statusCode?: number }).statusCode;
      // 404/410: subscription is gone — clean it up
      if (code === 404 || code === 410) {
        await prisma.pushSubscription
          .deleteMany({ where: { endpoint: sub.endpoint } })
          .catch(() => {});
      }
    }
  }
  return sent;
}
