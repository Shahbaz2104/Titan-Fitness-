import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimitByIp } from "@/lib/rate-limit";
import { getSessionUser } from "@/lib/api";

const commentSchema = z.object({
  name: z.string().min(2).max(60),
  content: z.string().min(2).max(2000),
});

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const dbPost = await prisma.blogPost.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (dbPost) {
      const comments = await prisma.blogComment.findMany({
        where: { postId: dbPost.id, status: "APPROVED" },
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 50,
      });
      return NextResponse.json({
        comments: comments.map((c) => {
          const name = c.user?.name ?? c.guestName ?? "Titan Reader";
          return {
            id: c.id,
            name,
            initials: name.slice(0, 2).toUpperCase(),
            content: c.content,
            createdAt: c.createdAt,
          };
        }),
      });
    }
  } catch {
    // DB unavailable — return seeded comments
  }

  return NextResponse.json({ comments: [] });
}

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const limit = await rateLimitByIp(10, 60_000);
  if (!limit.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { slug } = await params;
  const body = await req.json().catch(() => null);
  const parsed = commentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const dbPost = await prisma.blogPost.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!dbPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const user = await getSessionUser();
    const comment = await prisma.blogComment.create({
      data: {
        postId: dbPost.id,
        userId: user?.id ?? null,
        guestName: user ? null : parsed.data.name,
        content: parsed.data.content,
        status: "APPROVED",
      },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Comments are available once the database is connected" },
      { status: 503 }
    );
  }
}
