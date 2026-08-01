import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/api";
import { awardPoints, updateChallengeProgress, checkAndAwardBadges } from "@/services/gamification";
import { WORKOUT_POINTS } from "@/lib/constants";

export async function getExerciseLibrary(category?: string, search?: string) {
  return prisma.exercise.findMany({
    where: {
      deletedAt: null,
      ...(category && category !== "ALL" ? { category: category as never } : {}),
      ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
    },
    orderBy: { name: "asc" },
    take: 200,
  });
}

export async function getExerciseById(exerciseId: string) {
  return prisma.exercise.findFirst({
    where: { id: exerciseId, deletedAt: null },
  });
}

export async function toggleFavorite(userId: string, exerciseId: string) {
  const existing = await prisma.exerciseFavorite.findUnique({
    where: { userId_exerciseId: { userId, exerciseId } },
  });
  if (existing) {
    await prisma.exerciseFavorite.delete({ where: { id: existing.id } });
    return { favorited: false };
  }
  await prisma.exerciseFavorite.create({ data: { userId, exerciseId } });
  return { favorited: true };
}

export async function getFavorites(userId: string) {
  return prisma.exerciseFavorite.findMany({
    where: { userId },
    include: { exercise: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createCustomExercise(userId: string, data: {
  name: string;
  muscleGroup: string;
  equipment?: string | null;
  difficulty?: string;
  category?: string;
  instructions?: { setup?: string; execution?: string; tips?: string };
}) {
  const slug =
    data.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-") +
    "-" +
    Math.random().toString(36).slice(2, 7);
  return prisma.exercise.create({
    data: {
      name: data.name,
      slug,
      muscleGroup: data.muscleGroup,
      equipment: data.equipment ?? "Bodyweight",
      difficulty: (data.difficulty as never) ?? "BEGINNER",
      category: (data.category as never) ?? "FULL_BODY",
      instructions: data.instructions ?? {},
      isCustom: true,
      createdById: userId,
    },
  });
}

export async function getActivePlans(userId: string) {
  return prisma.workoutPlan.findMany({
    where: { userId, isActive: true, deletedAt: null },
    include: {
      days: {
        include: {
          exercises: {
            include: { exercise: true },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { dayNumber: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getPlan(userId: string, planId: string) {
  const plan = await prisma.workoutPlan.findFirst({
    where: { id: planId, userId, deletedAt: null },
    include: {
      days: {
        include: {
          exercises: {
            include: { exercise: true },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { dayNumber: "asc" },
      },
    },
  });
  if (!plan) throw new ApiError("Plan not found", 404, "NOT_FOUND");
  return plan;
}

export async function createPlan(userId: string, data: {
  name: string;
  goal?: string | null;
  description?: string | null;
  isAiGenerated?: boolean;
}) {
  return prisma.workoutPlan.create({
    data: { userId, ...data },
  });
}

export async function deletePlan(userId: string, planId: string) {
  const plan = await prisma.workoutPlan.findFirst({ where: { id: planId, userId } });
  if (!plan) throw new ApiError("Plan not found", 404, "NOT_FOUND");
  return prisma.workoutPlan.update({
    where: { id: planId },
    data: { isActive: false, deletedAt: new Date() },
  });
}

export async function startSession(userId: string, data: {
  title: string;
  planId?: string | null;
  workoutDayId?: string | null;
  notes?: string | null;
}) {
  return prisma.workoutSession.create({
    data: { userId, ...data },
  });
}

export async function completeSession(userId: string, sessionId: string, data: {
  durationMinutes?: number | null;
  caloriesBurned?: number | null;
  notes?: string | null;
  logs?: { exerciseId: string; setsCompleted: number; reps?: string | null; weightKg?: number | null; notes?: string | null; personalRecord?: boolean }[];
}) {
  const session = await prisma.workoutSession.findFirst({
    where: { id: sessionId, userId },
  });
  if (!session) throw new ApiError("Session not found", 404, "NOT_FOUND");

  const updated = await prisma.workoutSession.update({
    where: { id: sessionId },
    data: {
      durationMinutes: data.durationMinutes,
      caloriesBurned: data.caloriesBurned,
      notes: data.notes,
      isCompleted: true,
      completedAt: new Date(),
    },
  });

  if (data.logs && data.logs.length > 0) {
    await prisma.workoutLog.createMany({
      data: data.logs.map((log) => ({ ...log, sessionId })),
    });
  }

  const prCount = data.logs?.filter((l) => l.personalRecord).length ?? 0;

  await awardPoints(userId, WORKOUT_POINTS, "Workout completed");
  if (prCount > 0) await awardPoints(userId, prCount * 10, `${prCount} personal record${prCount > 1 ? "s" : ""}`);
  await updateChallengeProgress(userId, "WORKOUTS");
  await checkAndAwardBadges(userId);

  return updated;
}

export async function getSessionHistory(userId: string, limit = 60) {
  return prisma.workoutSession.findMany({
    where: { userId, deletedAt: null },
    include: {
      logs: { include: { exercise: true } },
      plan: { select: { id: true, name: true } },
    },
    orderBy: { date: "desc" },
    take: limit,
  });
}

export async function getPersonalRecords(userId: string) {
  const logs = await prisma.workoutLog.findMany({
    where: { session: { userId }, personalRecord: true },
    include: { exercise: { select: { id: true, name: true, muscleGroup: true } }, session: { select: { date: true } } },
    orderBy: { createdAt: "desc" },
  });

  const bestByExercise = new Map<string, (typeof logs)[number]>();
  for (const log of logs) {
    const existing = bestByExercise.get(log.exerciseId);
    if (!existing || (log.weightKg ?? 0) > (existing.weightKg ?? 0)) {
      bestByExercise.set(log.exerciseId, log);
    }
  }
  return Array.from(bestByExercise.values());
}

export async function getWorkoutStats(userId: string) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalWorkouts, monthWorkouts, totalMinutes, totalCalories, avgDuration] =
    await Promise.all([
      prisma.workoutSession.count({ where: { userId, isCompleted: true } }),
      prisma.workoutSession.count({
        where: { userId, isCompleted: true, date: { gte: monthStart } },
      }),
      prisma.workoutSession.aggregate({
        where: { userId, isCompleted: true },
        _sum: { durationMinutes: true },
      }),
      prisma.workoutSession.aggregate({
        where: { userId, isCompleted: true },
        _sum: { caloriesBurned: true },
      }),
      prisma.workoutSession.aggregate({
        where: { userId, isCompleted: true },
        _avg: { durationMinutes: true },
      }),
    ]);

  return {
    totalWorkouts,
    monthWorkouts,
    totalMinutes: totalMinutes._sum.durationMinutes ?? 0,
    totalCalories: totalCalories._sum.caloriesBurned ?? 0,
    avgDuration: Math.round(avgDuration._avg.durationMinutes ?? 0),
  };
}

export async function getTodayWorkout(userId: string) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const sessions = await prisma.workoutSession.findMany({
    where: { userId, date: { gte: start, lte: end } },
    include: {
      logs: { include: { exercise: true } },
      plan: { select: { name: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  const plan = await prisma.workoutPlan.findFirst({
    where: { userId, isActive: true, deletedAt: null },
    include: {
      days: {
        include: { exercises: { include: { exercise: true } } },
        orderBy: { dayNumber: "asc" },
      },
    },
  });

  return { sessions, plan, completed: sessions.some((s) => s.isCompleted) };
}
