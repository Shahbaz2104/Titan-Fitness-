import { prisma } from "@/lib/prisma";
import { createNotification } from "@/services/notifications";

export async function awardPoints(
  userId: string,
  points: number,
  reason: string
) {
  const updated = await prisma.userPoint.upsert({
    where: { userId },
    update: { points: { increment: points } },
    create: { userId, points },
  });
  await createNotification({
    userId,
    title: `+${points} points`,
    body: reason,
    type: "ACHIEVEMENT",
    data: { points, reason },
  });
  return updated;
}

export async function getOrCreatePoints(userId: string) {
  return prisma.userPoint.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
}

export async function checkAndAwardBadges(userId: string) {
  const badges = await prisma.badge.findMany({ where: { isActive: true } });
  const earned = await prisma.userBadge.findMany({
    where: { userId },
    select: { badgeId: true },
  });
  const earnedIds = new Set(earned.map((b) => b.badgeId));

  const [workoutCount, attendanceCount, prCount, waterDays, referralCount] =
    await Promise.all([
      prisma.workoutSession.count({ where: { userId, isCompleted: true } }),
      prisma.attendance.count({ where: { userId } }),
      prisma.workoutLog.count({ where: { session: { userId }, personalRecord: true } }),
      prisma.waterLog.count({ where: { userId } }),
      prisma.referral.count({ where: { referredById: userId, status: "REWARDED" } }),
    ]);

  const streak = await calculateStreak(userId);

  const criteria: Record<string, () => boolean> = {
    "First Step": () => workoutCount >= 1,
    "7-Day Streak": () => streak >= 7,
    "30-Day Streak": () => streak >= 30,
    "PR Hunter": () => prCount >= 1,
    "Hydration Hero": () => waterDays >= 7,
    "Early Bird": () => attendanceCount >= 1,
    "Century Club": () => workoutCount >= 100,
    "Community Champ": () => referralCount >= 1,
  };

  const newlyEarned: string[] = [];
  for (const badge of badges) {
    if (earnedIds.has(badge.id)) continue;
    const matched = criteria[badge.name];
    if (matched && matched()) {
      await prisma.userBadge.create({
        data: { userId, badgeId: badge.id },
      });
      await awardPoints(userId, badge.xpValue, `Badge earned: ${badge.name}`);
      newlyEarned.push(badge.name);
    }
  }
  return newlyEarned;
}

export async function calculateStreak(userId: string): Promise<number> {
  const sessions = await prisma.workoutSession.findMany({
    where: { userId, isCompleted: true },
    select: { date: true },
    orderBy: { date: "desc" },
  });
  if (sessions.length === 0) return 0;

  const days = new Set(
    sessions.map((s) => s.date.toISOString().slice(0, 10))
  );

  let streak = 0;
  const cursor = new Date();
  const today = cursor.toISOString().slice(0, 10);

  if (!days.has(today)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export async function getLeaderboard(limit = 20) {
  return prisma.userPoint.findMany({
    orderBy: { points: "desc" },
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
}

export async function getMyRank(userId: string) {
  const points = await getOrCreatePoints(userId);
  const rank =
    (await prisma.userPoint.count({
      where: { points: { gt: points.points } },
    })) + 1;
  return { rank, points: points.points };
}

export async function getMyBadges(userId: string) {
  return prisma.userBadge.findMany({
    where: { userId },
    include: { badge: true },
    orderBy: { earnedAt: "desc" },
  });
}

export async function getActiveChallenges() {
  const now = new Date();
  return prisma.challenge.findMany({
    where: { isActive: true, endDate: { gte: now } },
    orderBy: { startDate: "asc" },
  });
}

export async function joinChallenge(userId: string, challengeId: string) {
  const challenge = await prisma.challenge.findFirst({
    where: { id: challengeId, isActive: true },
  });
  if (!challenge) throw new Error("Challenge not found");

  return prisma.userChallenge.upsert({
    where: { userId_challengeId: { userId, challengeId } },
    update: {},
    create: { userId, challengeId },
  });
}

export async function getMyChallenges(userId: string) {
  return prisma.userChallenge.findMany({
    where: { userId },
    include: { challenge: true },
    orderBy: { joinedAt: "desc" },
  });
}

export async function updateChallengeProgress(
  userId: string,
  goalType: string,
  amount = 1
) {
  const challenges = await prisma.userChallenge.findMany({
    where: { userId, completedAt: null, challenge: { isActive: true, goalType: goalType as never } },
    include: { challenge: true },
  });

  for (const entry of challenges) {
    const next = Math.min(entry.progress + amount, entry.challenge.goalValue);
    const completed = next >= entry.challenge.goalValue;
    await prisma.userChallenge.update({
      where: { id: entry.id },
      data: {
        progress: next,
        completedAt: completed ? new Date() : null,
      },
    });
    if (completed) {
      await awardPoints(userId, 50, `Challenge completed: ${entry.challenge.title}`);
    }
  }
}
