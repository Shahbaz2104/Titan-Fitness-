import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/api";
import { REFERRAL_REWARD } from "@/lib/constants";
import { awardPoints, getOrCreatePoints } from "@/services/gamification";
import { createNotification } from "@/services/notifications";

export async function getMembershipPlans() {
  return prisma.membershipPlan.findMany({
    where: { isActive: true, deletedAt: null },
    orderBy: { price: "asc" },
  });
}

export async function getActiveMembership(userId: string) {
  const membership = await prisma.membership.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      deletedAt: null,
      OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
    },
    include: { plan: true },
    orderBy: { endDate: "desc" },
  });

  if (!membership) return null;

  const now = new Date();
  const daysLeft = membership.endDate
    ? Math.max(0, Math.ceil((membership.endDate.getTime() - now.getTime()) / 86_400_000))
    : null;

  return { ...membership, daysLeft };
}

export async function getPaymentHistory(userId: string, limit = 30) {
  return prisma.payment.findMany({
    where: { userId, deletedAt: null },
    include: {
      membership: { select: { plan: { select: { name: true } } } },
      coupon: { select: { code: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function validateCoupon(code: string, amount: number) {
  const coupon = await prisma.coupon.findFirst({
    where: { code: code.toUpperCase(), isActive: true, deletedAt: null },
  });
  if (!coupon) throw new ApiError("Invalid coupon code", 404, "INVALID_COUPON");

  const now = new Date();
  if (coupon.validFrom && coupon.validFrom > now) throw new ApiError("Coupon not active yet", 400, "COUPON_INVALID");
  if (coupon.validUntil && coupon.validUntil < now) throw new ApiError("Coupon expired", 400, "COUPON_EXPIRED");
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    throw new ApiError("Coupon usage limit reached", 400, "COUPON_MAX_USED");
  }
  if (coupon.minAmount && amount < Number(coupon.minAmount)) {
    throw new ApiError("Minimum amount not met", 400, "COUPON_MIN_AMOUNT");
  }

  const discount = coupon.type === "PERCENTAGE"
    ? (amount * Number(coupon.value)) / 100
    : Math.min(Number(coupon.value), amount);

  return { coupon, discount, finalAmount: Math.max(0, Math.round((amount - discount) * 100) / 100) };
}

export async function createMembershipOrder(userId: string, data: {
  planId: string;
  branchId?: string;
  couponCode?: string;
  autoRenew?: boolean;
}) {
  const plan = await prisma.membershipPlan.findFirst({
    where: { id: data.planId, isActive: true, deletedAt: null },
  });
  if (!plan) throw new ApiError("Plan not found", 404, "NOT_FOUND");

  let couponId: string | null = null;
  let discount = 0;
  if (data.couponCode) {
    const result = await validateCoupon(data.couponCode, Number(plan.price));
    couponId = result.coupon.id;
    discount = result.discount;
  }

  const amount = Number(plan.price) - discount;

  const payment = await prisma.payment.create({
    data: {
      userId,
      branchId: data.branchId,
      amount,
      type: "MEMBERSHIP",
      description: `Membership: ${plan.name}`,
      couponId,
      metadata: { planId: plan.id, autoRenew: data.autoRenew ?? false, originalAmount: Number(plan.price) },
    },
  });

  if (couponId) {
    await prisma.coupon.update({
      where: { id: couponId },
      data: { usedCount: { increment: 1 } },
    });
  }

  return { payment, plan, discount };
}

export async function activateMembership(
  userId: string,
  planId: string,
  opts: {
    branchId?: string;
    startDate?: Date;
    endDate?: Date;
    method?: string;
  } = {}
) {
  const plan = await prisma.membershipPlan.findUnique({ where: { id: planId } });
  if (!plan) throw new ApiError("Plan not found", 404, "NOT_FOUND");

  const startDate = opts.startDate ?? new Date();
  const endDate = opts.endDate ?? new Date(startDate.getTime() + plan.durationDays * 86_400_000);

  await prisma.membership.updateMany({
    where: { userId, status: "ACTIVE" },
    data: { status: "EXPIRED", endDate: new Date() },
  });

  const membership = await prisma.membership.upsert({
    where: { userId_planId: { userId, planId } },
    update: {
      status: "ACTIVE",
      startDate,
      endDate,
      branchId: opts.branchId,
      renewalsCount: { increment: 1 },
    },
    create: {
      userId,
      planId,
      branchId: opts.branchId,
      status: "ACTIVE",
      startDate,
      endDate,
    },
  });

  await prisma.payment.updateMany({
    where: { userId, status: "PENDING", metadata: { path: ["planId"], equals: planId } },
    data: {
      status: "SUCCEEDED",
      method: (opts.method as never) ?? "CARD",
    },
  });

  await createNotification({
    userId,
    title: "Welcome to Titan Fitness!",
    body: `Your ${plan.name} membership is now active. Let's get started!`,
    type: "MEMBERSHIP",
    data: { membershipId: membership.id },
  });

  return { membership, plan };
}

export async function getReferralInfo(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { referralCode: true },
  });

  const [referrals, points] = await Promise.all([
    prisma.referral.findMany({
      where: { referredById: userId },
      include: {
        referredUser: { select: { id: true, name: true, image: true, createdAt: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    getOrCreatePoints(userId),
  ]);

  return {
    referralCode: user?.referralCode ?? null,
    referrals,
    points: points.points,
    rewardPerReferral: REFERRAL_REWARD,
  };
}

export async function applyReferral(userId: string, code: string) {
  const referrer = await prisma.user.findFirst({
    where: { referralCode: code.toUpperCase(), id: { not: userId } },
  });
  if (!referrer) throw new ApiError("Invalid referral code", 404, "INVALID_REFERRAL");

  const existing = await prisma.referral.findFirst({
    where: { referredById: referrer.id, referredUserId: userId },
  });
  if (existing) throw new ApiError("Referral already applied", 409, "REFERRAL_EXISTS");

  const referral = await prisma.referral.create({
    data: {
      referredById: referrer.id,
      referredUserId: userId,
      code: code.toUpperCase(),
      status: "PENDING",
      rewardAmount: REFERRAL_REWARD,
    },
  });

  await awardPoints(referrer.id, REFERRAL_REWARD, "New member joined with your referral code");
  await prisma.referral.update({
    where: { id: referral.id },
    data: { status: "REWARDED", redeemedAt: new Date() },
  });

  await createNotification({
    userId: referrer.id,
    title: "Referral rewarded!",
    body: "You earned 20 points for referring a new member.",
    type: "ACHIEVEMENT",
  });

  return { success: true };
}
