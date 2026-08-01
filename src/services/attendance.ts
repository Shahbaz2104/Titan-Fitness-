import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/api";
import { calculateStreak, updateChallengeProgress } from "@/services/gamification";
import { createNotification } from "@/services/notifications";

export async function checkIn(
  userId: string,
  params: {
    branchId: string;
    method?: string;
  }
) {
  const branch = await prisma.branch.findFirst({
    where: { id: params.branchId, isActive: true },
  });
  if (!branch) throw new ApiError("Branch not found", 404, "NOT_FOUND");

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const existing = await prisma.attendance.findFirst({
    where: { userId, checkInTime: { gte: todayStart } },
  });
  if (existing) {
    if (!existing.checkOutTime) {
      return prisma.attendance.update({
        where: { id: existing.id },
        data: { checkOutTime: new Date() },
      });
    }
    throw new ApiError("Already checked in today", 409, "ALREADY_CHECKED_IN");
  }

  const record = await prisma.attendance.create({
    data: {
      userId,
      branchId: params.branchId,
      method: (params.method as never) ?? "QR",
      status: new Date().getHours() < 9 ? "PRESENT" : "LATE",
    },
  });

  await updateChallengeProgress(userId, "ATTENDANCE");
  await createNotification({
    userId,
    title: "Check-in successful",
    body: `Welcome to ${branch.name}! Have a great workout.`,
    type: "SYSTEM",
    data: { attendanceId: record.id },
  });

  return record;
}

export async function getAttendanceHistory(userId: string, limit = 60) {
  return prisma.attendance.findMany({
    where: { userId },
    include: { branch: { select: { id: true, name: true, city: true } } },
    orderBy: { checkInTime: "desc" },
    take: limit,
  });
}

export async function getAttendanceStats(userId: string) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [total, thisMonth, currentStreak, weekRecords] = await Promise.all([
    prisma.attendance.count({ where: { userId } }),
    prisma.attendance.count({ where: { userId, checkInTime: { gte: monthStart } } }),
    calculateStreak(userId),
    prisma.attendance.findMany({
      where: {
        userId,
        checkInTime: { gte: new Date(Date.now() - 7 * 86_400_000) },
      },
      orderBy: { checkInTime: "asc" },
    }),
  ]);

  return { total, thisMonth, currentStreak, weekRecords };
}

export async function isCheckedInToday(userId: string) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const record = await prisma.attendance.findFirst({
    where: { userId, checkInTime: { gte: todayStart } },
  });
  return {
    checkedIn: !!record,
    checkedOut: !!record?.checkOutTime,
    record,
  };
}
