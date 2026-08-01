import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/api";
import { updateChallengeProgress } from "@/services/gamification";

export async function listClasses(params: {
  branchId?: string;
  type?: string;
  date?: string;
  page?: number;
  limit?: number;
}) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const date = params.date ? new Date(params.date) : null;
  const dayStart = date
    ? new Date(date.getFullYear(), date.getMonth(), date.getDate())
    : null;
  const dayEnd = dayStart
    ? new Date(dayStart.getTime() + 86_400_000)
    : null;

  const where = {
    isActive: true,
    deletedAt: null,
    ...(params.branchId ? { branchId: params.branchId } : {}),
    ...(params.type && params.type !== "ALL" ? { type: params.type as never } : {}),
    ...(dayStart && dayEnd
      ? { startTime: { gte: dayStart, lt: dayEnd } }
      : { startTime: { gte: new Date() } }),
  };

  const [classes, total] = await Promise.all([
    prisma.classSchedule.findMany({
      where,
      include: {
        branch: { select: { id: true, name: true, city: true } },
        trainer: {
          include: { user: { select: { id: true, name: true, image: true } } },
        },
        program: { select: { id: true, name: true, slug: true } },
        _count: { select: { bookings: { where: { status: "BOOKED" } } } },
      },
      orderBy: { startTime: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.classSchedule.count({ where }),
  ]);

  return {
    classes: classes.map((cls) => ({
      ...cls,
      spotsLeft: Math.max(0, cls.capacity - cls._count.bookings),
    })),
    total,
    page,
    pages: Math.ceil(total / limit),
  };
}

export async function getClassById(classId: string, userId?: string) {
  const cls = await prisma.classSchedule.findFirst({
    where: { id: classId, isActive: true, deletedAt: null },
    include: {
      branch: { select: { id: true, name: true, city: true, address: true } },
      trainer: {
        include: { user: { select: { id: true, name: true, image: true } } },
      },
      program: true,
      bookings: {
        where: { status: "BOOKED" },
        include: { user: { select: { id: true, name: true, image: true } } },
      },
    },
  });
  if (!cls) throw new ApiError("Class not found", 404, "NOT_FOUND");

  const spotsLeft = Math.max(0, cls.capacity - cls.bookings.length);
  const myBooking = userId
    ? await prisma.booking.findFirst({
        where: { userId, classId, status: "BOOKED" },
      })
    : null;

  return { ...cls, spotsLeft, myBooking };
}

export async function bookClass(userId: string, classId: string) {
  const cls = await prisma.classSchedule.findFirst({
    where: { id: classId, isActive: true },
  });
  if (!cls) throw new ApiError("Class not found", 404, "NOT_FOUND");

  const bookedCount = await prisma.booking.count({
    where: { classId, status: "BOOKED" },
  });
  if (bookedCount >= cls.capacity) {
    throw new ApiError("Class is full", 409, "CLASS_FULL");
  }

  const existing = await prisma.booking.findFirst({
    where: { userId, classId, status: "BOOKED" },
  });
  if (existing) throw new ApiError("Already booked", 409, "ALREADY_BOOKED");

  return prisma.booking.create({
    data: {
      userId,
      classId,
      branchId: cls.branchId,
      programId: cls.programId,
      status: "BOOKED",
    },
  });
}

export async function cancelBooking(userId: string, bookingId: string) {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, userId },
  });
  if (!booking) throw new ApiError("Booking not found", 404, "NOT_FOUND");

  return prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED", cancelledAt: new Date() },
  });
}

export async function rescheduleBooking(
  userId: string,
  bookingId: string,
  newClassId: string
) {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, userId },
  });
  if (!booking) throw new ApiError("Booking not found", 404, "NOT_FOUND");

  const newClass = await prisma.classSchedule.findFirst({
    where: { id: newClassId, isActive: true },
  });
  if (!newClass) throw new ApiError("New class not found", 404, "NOT_FOUND");

  const bookedCount = await prisma.booking.count({
    where: { classId: newClassId, status: "BOOKED" },
  });
  if (bookedCount >= newClass.capacity) {
    throw new ApiError("New class is full", 409, "CLASS_FULL");
  }

  return prisma.$transaction([
    prisma.booking.update({
      where: { id: bookingId },
      data: { status: "RESCHEDULED", cancelledAt: new Date() },
    }),
    prisma.booking.create({
      data: {
        userId,
        classId: newClassId,
        branchId: newClass.branchId,
        programId: newClass.programId,
        status: "BOOKED",
        rescheduledFromId: bookingId,
      },
    }),
  ]);
}

export async function joinWaitlist(userId: string, classId: string) {
  const cls = await prisma.classSchedule.findFirst({
    where: { id: classId, isActive: true },
  });
  if (!cls) throw new ApiError("Class not found", 404, "NOT_FOUND");

  const position = await prisma.waitlist.count({ where: { classId } });
  return prisma.waitlist.upsert({
    where: { classId_userId: { classId, userId } },
    update: {},
    create: { classId, userId, position: position + 1 },
  });
}

export async function getMyBookings(userId: string) {
  const [upcoming, past] = await Promise.all([
    prisma.booking.findMany({
      where: { userId, status: "BOOKED", class: { startTime: { gte: new Date() } } },
      include: {
        class: {
          include: {
            branch: { select: { id: true, name: true, city: true } },
            trainer: {
              include: { user: { select: { name: true, image: true } } },
            },
          },
        },
      },
      orderBy: { class: { startTime: "asc" } },
    }),
    prisma.booking.findMany({
      where: { userId, OR: [{ status: { in: ["COMPLETED", "NO_SHOW", "CANCELLED"] } }] },
      include: { class: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);
  return { upcoming, past };
}

export async function checkInBooking(userId: string, classId: string) {
  const booking = await prisma.booking.findFirst({
    where: { userId, classId, status: "BOOKED" },
  });
  if (!booking) throw new ApiError("No active booking for this class", 404, "NOT_FOUND");

  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data: { checkedIn: true, status: "COMPLETED", completedAt: new Date() },
  });
  await updateChallengeProgress(userId, "ATTENDANCE");
  return updated;
}
