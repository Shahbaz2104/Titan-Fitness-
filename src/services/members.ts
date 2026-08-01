import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/api";
import { calculateBMI } from "@/lib/utils";

export async function getMemberProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId, deletedAt: null },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
      gender: true,
      dateOfBirth: true,
      role: true,
      heightCm: true,
      weightKg: true,
      bodyFatPct: true,
      fitnessGoal: true,
      experience: true,
      referralCode: true,
      branchId: true,
      createdAt: true,
      branch: { select: { id: true, name: true, city: true } },
    },
  });
  if (!user) throw new ApiError("User not found", 404, "NOT_FOUND");
  return user;
}

export async function updateMemberProfile(userId: string, data: Record<string, unknown>) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
      gender: true,
      dateOfBirth: true,
      heightCm: true,
      weightKg: true,
      bodyFatPct: true,
      fitnessGoal: true,
      experience: true,
    },
  });
  return user;
}

export async function addBodyMetric(
  userId: string,
  data: {
    weightKg?: number;
    bodyFatPct?: number;
    muscleMassKg?: number;
    waterLiters?: number;
    waistCm?: number;
    chestCm?: number;
    armsCm?: number;
    notes?: string;
    date?: Date;
  }
) {
  const heightCm = data.weightKg ? await getHeightForBmi(userId) : undefined;
  const bmi = data.weightKg && heightCm ? calculateBMI(data.weightKg, heightCm) : undefined;

  return prisma.bodyMetric.upsert({
    where: { userId_date: { userId, date: data.date ?? new Date() } },
    update: {
      ...data,
      bmi: bmi ?? undefined,
    },
    create: {
      userId,
      ...data,
      bmi: bmi ?? undefined,
    },
  });
}

async function getHeightForBmi(userId: string): Promise<number | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { heightCm: true },
  });
  return user?.heightCm ?? null;
}

export async function getBodyMetrics(userId: string, limit = 30) {
  return prisma.bodyMetric.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: limit,
  });
}

export async function getWaterLogs(userId: string, limit = 30) {
  return prisma.waterLog.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: limit,
  });
}

export async function addWaterLog(userId: string, amountMl: number, date?: Date) {
  const day = date ?? new Date();
  const existing = await prisma.waterLog.findFirst({
    where: { userId, date: day },
  });
  if (existing) {
    return prisma.waterLog.update({
      where: { id: existing.id },
      data: { amountMl: existing.amountMl + amountMl },
    });
  }
  return prisma.waterLog.create({ data: { userId, amountMl, date: day } });
}

export async function getCalorieLogs(userId: string, limit = 30) {
  return prisma.calorieLog.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: limit,
  });
}

export async function deleteCalorieLog(userId: string, logId: string) {
  return prisma.calorieLog.delete({
    where: { id: logId, userId },
  });
}

export async function addCalorieLog(
  userId: string,
  data: {
    mealType: string;
    foodName: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    portion?: string;
    date?: Date;
  }
) {
  return prisma.calorieLog.create({
    data: {
      userId,
      mealType: data.mealType as never,
      foodName: data.foodName,
      calories: data.calories,
      protein: data.protein,
      carbs: data.carbs,
      fat: data.fat,
      portion: data.portion,
      date: data.date,
    },
  });
}

export async function getProgressPhotos(userId: string) {
  return prisma.progressPhoto.findMany({
    where: { userId },
    orderBy: { takenAt: "desc" },
  });
}

export async function addProgressPhoto(
  userId: string,
  data: { imageUrl: string; stage: string; note?: string }
) {
  return prisma.progressPhoto.create({
    data: { userId, imageUrl: data.imageUrl, stage: data.stage as never, note: data.note },
  });
}

export async function deleteProgressPhoto(userId: string, photoId: string) {
  const photo = await prisma.progressPhoto.findFirst({ where: { id: photoId, userId } });
  if (!photo) throw new ApiError("Photo not found", 404, "NOT_FOUND");
  await prisma.progressPhoto.delete({ where: { id: photoId } });
  return { ok: true };
}
