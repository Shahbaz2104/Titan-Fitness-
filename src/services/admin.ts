import { prisma } from "@/lib/prisma";
import { Prisma, UserRole } from "@prisma/client";
import { ApiError } from "@/lib/api";

function slugify(text: string) {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function adminGetMembers(params: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;

  const where: Prisma.UserWhereInput = {
    role: { in: ["MEMBER", "TRAINER"] as UserRole[] },
    ...(params.status && params.status !== "ALL"
      ? { memberships: { some: { status: params.status as never } } }
      : {}),
    ...(params.search
      ? {
          OR: [
            { name: { contains: params.search, mode: "insensitive" as const } },
            { email: { contains: params.search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [members, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        isActive: true,
        createdAt: true,
        memberships: {
          where: { status: "ACTIVE" },
          select: { id: true, endDate: true, plan: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return { members, total, page, pages: Math.ceil(total / limit) };
}

export async function adminGetMemberDetail(memberId: string) {
  const member = await prisma.user.findFirst({
    where: { id: memberId, role: { in: ["MEMBER", "TRAINER"] as UserRole[] } },
    include: {
      memberships: { include: { plan: true }, orderBy: { createdAt: "desc" } },
      payments: { orderBy: { createdAt: "desc" }, take: 10 },
      attendance: { orderBy: { checkInTime: "desc" }, take: 10 },
    },
  });
  if (!member) throw new ApiError("Member not found", 404, "NOT_FOUND");
  return member;
}

export async function adminUpdateMemberStatus(memberId: string, isActive: boolean) {
  return prisma.user.update({
    where: { id: memberId },
    data: { isActive },
  });
}

export async function adminGetDashboardStats() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalMembers,
    activeMembers,
    newMembersThisMonth,
    totalTrainers,
    totalRevenue,
    monthRevenue,
    todayAttendance,
    activePlans,
    pendingTickets,
    expiringMemberships,
  ] = await Promise.all([
    prisma.user.count({ where: { role: { in: ["MEMBER", "TRAINER"] } } }),
    prisma.membership.count({ where: { status: "ACTIVE" } }),
    prisma.user.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.user.count({ where: { role: "TRAINER" } }),
    prisma.payment.aggregate({ where: { status: "SUCCEEDED" }, _sum: { amount: true } }),
    prisma.payment.aggregate({
      where: { status: "SUCCEEDED", createdAt: { gte: monthStart } },
      _sum: { amount: true },
    }),
    prisma.attendance.count({ where: { checkInTime: { gte: monthStart } } }),
    prisma.membershipPlan.count({ where: { isActive: true, deletedAt: null } }),
    prisma.supportTicket.count({ where: { status: "OPEN" } }),
    prisma.membership.count({
      where: {
        status: "ACTIVE",
        endDate: { lte: new Date(now.getTime() + 7 * 86_400_000) },
      },
    }),
  ]);

  return {
    totalMembers,
    activeMembers,
    newMembersThisMonth,
    totalTrainers,
    totalRevenue: totalRevenue._sum.amount ?? 0,
    monthRevenue: monthRevenue._sum.amount ?? 0,
    todayAttendance,
    activePlans,
    pendingTickets,
    expiringMemberships,
  };
}

export async function adminGetRevenueReport(days = 30) {
  const start = new Date(Date.now() - days * 86_400_000);
  start.setHours(0, 0, 0, 0);

  const payments = await prisma.payment.findMany({
    where: { status: "SUCCEEDED", createdAt: { gte: start } },
    select: { amount: true, createdAt: true, type: true },
    orderBy: { createdAt: "asc" },
  });

  const byDay = new Map<string, number>();
  for (const payment of payments) {
    const key = payment.createdAt.toISOString().slice(0, 10);
    byDay.set(key, (byDay.get(key) ?? 0) + Number(payment.amount));
  }

  const series = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(start.getTime() + i * 86_400_000);
    const key = d.toISOString().slice(0, 10);
    series.push({ date: key, revenue: byDay.get(key) ?? 0 });
  }

  const byType = payments.reduce<Record<string, number>>((acc, p) => {
    acc[p.type] = (acc[p.type] ?? 0) + Number(p.amount);
    return acc;
  }, {});

  return { series, byType, total: payments.reduce((a, p) => a + Number(p.amount), 0) };
}

export async function adminGetAttendanceReport(days = 30) {
  const start = new Date(Date.now() - days * 86_400_000);
  start.setHours(0, 0, 0, 0);

  const records = await prisma.attendance.findMany({
    where: { checkInTime: { gte: start } },
    select: { checkInTime: true, branchId: true, status: true },
  });

  const byDay = new Map<string, number>();
  for (const r of records) {
    const key = r.checkInTime.toISOString().slice(0, 10);
    byDay.set(key, (byDay.get(key) ?? 0) + 1);
  }

  const series = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(start.getTime() + i * 86_400_000);
    const key = d.toISOString().slice(0, 10);
    series.push({ date: key, count: byDay.get(key) ?? 0 });
  }

  return {
    series,
    total: records.length,
    present: records.filter((r) => r.status === "PRESENT").length,
    late: records.filter((r) => r.status === "LATE").length,
  };
}

export async function adminGetPrograms() {
  return prisma.program.findMany({
    where: { deletedAt: null },
    include: { _count: { select: { classes: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function adminCreateProgram(data: {
  name: string;
  category: string;
  description: string;
  difficulty: string;
  durationWeeks: number;
  sessionsPerWeek: number;
  imageUrl?: string | null;
}) {
  return prisma.program.create({
    data: {
      name: data.name,
      slug: slugify(data.name),
      category: data.category as never,
      description: data.description,
      difficulty: data.difficulty as never,
      durationWeeks: data.durationWeeks,
      sessionsPerWeek: data.sessionsPerWeek,
      imageUrl: data.imageUrl,
    },
  });
}

export async function adminUpdateProgram(
  programId: string,
  data: Partial<{
    name: string;
    category: string;
    description: string;
    difficulty: string;
    durationWeeks: number;
    sessionsPerWeek: number;
    imageUrl: string | null;
    isActive: boolean;
  }>
) {
  const program = await prisma.program.findFirst({
    where: { id: programId, deletedAt: null },
  });
  if (!program) throw new ApiError("Program not found", 404, "NOT_FOUND");

  const { ...rest } = data;
  return prisma.program.update({
    where: { id: programId },
    data: {
      ...(rest.name ? { name: rest.name, slug: slugify(rest.name) } : {}),
      ...(rest.category ? { category: rest.category as never } : {}),
      ...(rest.description ? { description: rest.description } : {}),
      ...(rest.difficulty ? { difficulty: rest.difficulty as never } : {}),
      ...(rest.durationWeeks !== undefined ? { durationWeeks: rest.durationWeeks } : {}),
      ...(rest.sessionsPerWeek !== undefined ? { sessionsPerWeek: rest.sessionsPerWeek } : {}),
      ...(rest.imageUrl !== undefined ? { imageUrl: rest.imageUrl } : {}),
      ...(rest.isActive !== undefined ? { isActive: rest.isActive } : {}),
    },
  });
}

export async function adminDeleteProgram(programId: string) {
  const program = await prisma.program.findFirst({
    where: { id: programId, deletedAt: null },
  });
  if (!program) throw new ApiError("Program not found", 404, "NOT_FOUND");
  return prisma.program.update({
    where: { id: programId },
    data: { deletedAt: new Date(), isActive: false },
  });
}

export async function adminGetClasses() {
  return prisma.classSchedule.findMany({
    where: { deletedAt: null },
    include: {
      branch: { select: { name: true, city: true } },
      trainer: { include: { user: { select: { name: true, image: true } } } },
      program: { select: { name: true } },
      _count: { select: { bookings: { where: { status: "BOOKED" } } } },
    },
    orderBy: { startTime: "desc" },
  });
}

export async function adminGetSettings() {
  const settings = await prisma.setting.findMany();
  return Object.fromEntries(settings.map((s) => [s.key, s.value]));
}

export async function adminUpdateSettings(entries: { key: string; value: string }[]) {
  await prisma.$transaction(
    entries.map((entry) =>
      prisma.setting.upsert({
        where: { key: entry.key },
        update: { value: entry.value },
        create: { key: entry.key, value: entry.value },
      })
    )
  );
  return { updated: entries.length };
}

export async function adminGetTickets() {
  return prisma.supportTicket.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      messages: { orderBy: { createdAt: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function adminReplyTicket(ticketId: string, adminId: string, content: string) {
  const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } });
  if (!ticket) throw new ApiError("Ticket not found", 404, "NOT_FOUND");

  await prisma.ticketMessage.create({
    data: { ticketId, senderId: adminId, senderRole: "ADMIN", content },
  });
  return prisma.supportTicket.update({
    where: { id: ticketId },
    data: { status: "IN_PROGRESS" },
  });
}

export async function adminUpdateTicketStatus(ticketId: string, status: string) {
  const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } });
  if (!ticket) throw new ApiError("Ticket not found", 404, "NOT_FOUND");
  return prisma.supportTicket.update({
    where: { id: ticketId },
    data: { status: status as never },
  });
}

export async function adminGetCoupons() {
  return prisma.coupon.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });
}

export async function adminCreateCoupon(data: {
  code: string;
  type: string;
  value: number;
  maxUses?: number | null;
  minAmount?: number | null;
  validFrom?: Date | null;
  validUntil?: Date | null;
}) {
  return prisma.coupon.create({
    data: {
      code: data.code.toUpperCase(),
      type: data.type as never,
      value: data.value,
      maxUses: data.maxUses,
      minAmount: data.minAmount,
      validFrom: data.validFrom,
      validUntil: data.validUntil,
    },
  });
}

export async function adminDeleteCoupon(couponId: string) {
  return prisma.coupon.update({
    where: { id: couponId },
    data: { deletedAt: new Date(), isActive: false },
  });
}

export async function adminGetBranches() {
  return prisma.branch.findMany({
    where: { deletedAt: null },
    include: { _count: { select: { users: true, classes: true } } },
    orderBy: { createdAt: "asc" },
  });
}

export async function adminGetBlogPosts() {
  return prisma.blogPost.findMany({
    where: { deletedAt: null },
    include: {
      author: { select: { name: true } },
      category: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function adminCreateBlogPost(data: {
  authorId: string;
  title: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  categoryId?: string | null;
  tags?: string[];
  status: string;
  readTimeMin?: number;
}) {
  return prisma.blogPost.create({
    data: {
      authorId: data.authorId,
      title: data.title,
      slug: slugify(data.title),
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.coverImage,
      ...(data.categoryId ? { categoryId: data.categoryId } : {}),
      tags: data.tags ?? [],
      status: data.status as never,
      readTimeMin: data.readTimeMin ?? 5,
      ...(data.status === "PUBLISHED" ? { publishedAt: new Date() } : {}),
    },
  });
}

export async function adminDeleteBlogPost(postId: string) {
  return prisma.blogPost.update({
    where: { id: postId },
    data: { deletedAt: new Date(), status: "DRAFT" },
  });
}

export async function adminGetChallenges() {
  return prisma.challenge.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { participants: true } } },
  });
}

export async function adminCreateChallenge(data: {
  title: string;
  description?: string | null;
  goalType: string;
  goalValue: number;
  startDate: Date;
  endDate: Date;
  rewardDescription?: string | null;
}) {
  return prisma.challenge.create({
    data: {
      title: data.title,
      slug: slugify(data.title),
      description: data.description,
      goalType: data.goalType as never,
      goalValue: data.goalValue,
      startDate: data.startDate,
      endDate: data.endDate,
      rewardDescription: data.rewardDescription,
    },
  });
}
