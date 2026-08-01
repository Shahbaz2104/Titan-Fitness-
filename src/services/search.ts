import { prisma } from "@/lib/prisma";

export async function globalSearch(query: string, limit = 12) {
  if (!query.trim()) return { programs: [], posts: [], classes: [], exercises: [] };

  const [programs, posts, classes, exercises] = await Promise.all([
    prisma.program.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        name: { contains: query, mode: "insensitive" },
      },
      select: { id: true, name: true, slug: true, category: true, imageUrl: true },
      take: limit,
    }),
    prisma.blogPost.findMany({
      where: {
        status: "PUBLISHED",
        deletedAt: null,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { excerpt: { contains: query, mode: "insensitive" } },
        ],
      },
      select: { id: true, title: true, slug: true, coverImage: true },
      take: limit,
    }),
    prisma.classSchedule.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        name: { contains: query, mode: "insensitive" },
      },
      select: { id: true, name: true, type: true },
      take: limit,
    }),
    prisma.exercise.findMany({
      where: {
        deletedAt: null,
        name: { contains: query, mode: "insensitive" },
      },
      select: { id: true, name: true, muscleGroup: true, category: true },
      take: limit,
    }),
  ]);

  return { programs, posts, classes, exercises };
}

export async function searchExercises(query: string, limit = 20) {
  return prisma.exercise.findMany({
    where: {
      deletedAt: null,
      name: { contains: query, mode: "insensitive" },
    },
    take: limit,
  });
}
