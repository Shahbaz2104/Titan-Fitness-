import { jsonError, jsonOk, parseBody, requireUser, withRateLimit } from "@/lib/api";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
});

const RESPONSES: { match: RegExp; reply: string }[] = [
  {
    match: /(workout|training) plan|beginner plan/i,
    reply:
      "Here's a simple beginner plan to start: 3 days/week — Day 1 full-body (squats, push-ups, rows), Day 2 rest or light cardio, Day 3 full-body again. Start with 2–3 sets of 10–12 reps, rest 90s between sets. Progress by adding reps first, then weight. Want me to generate a detailed plan with exercises from our library?",
  },
  {
    match: /(nutrition|eat|diet|food|meal)/i,
    reply:
      "Nutrition tip: aim for ~1.6–2.2g of protein per kg of bodyweight daily, spread across 3–4 meals. Pre-workout, favor carbs; post-workout, combine protein + carbs. Log your meals in the Nutrition tab and I'll help you dial in your macros. What's your current goal?",
  },
  {
    match: /(bench|squat|deadlift|strength|stronger)/i,
    reply:
      "To get stronger, stick to progressive overload: add a small amount of weight (or one rep) each session, keep proper form, and prioritize sleep and recovery. A simple protocol: 3–5 sets of 4–6 reps at 80–85% of your 1RM, with 2–3 minutes rest. Let me know which lift you're working on.",
  },
  {
    match: /(water|hydrat)/i,
    reply:
      "Hydration matters: aim for about 3L of water daily (more if you're training hard). A good habit is 500ml upon waking and 250ml every hour during the day. Track it in the dashboard's water tracker and try to hit your goal every day for a week — your energy will improve noticeably.",
  },
  {
    match: /(form|technique|injur|pain)/i,
    reply:
      "Good form beats heavy weight — always. For any lift: brace your core, keep a neutral spine, and control the eccentric (lowering) phase. If something hurts (sharp pain), stop and rest. For technique feedback, consider booking a session with one of our certified trainers — they're world-class.",
  },
  {
    match: /(recovery|sleep|rest)/i,
    reply:
      "Recovery is where gains happen. Aim for 7–9 hours of sleep, take 1–2 full rest days weekly, and keep stress in check. Active recovery (walking, light stretching) also helps. If you're sore, prioritize hydration, protein, and light movement over long stretches of inactivity.",
  },
];

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    await withRateLimit(user.id, 30, 60_000);
    const body = await req.json().catch(() => null);
    const data = parseBody(chatSchema, body);

    const match = RESPONSES.find((r) => r.match.test(data.message));
    const reply = match
      ? match.reply
      : "Great question! As your Titan AI coach, my advice: stay consistent, train hard but smart, log every session, and focus on small improvements each week. What are you training today — strength, cardio, or recovery?";

    await prisma.aIUsage.create({
      data: {
        userId: user.id,
        feature: "CHATBOT",
        model: "rule-based",
        status: "SUCCESS",
        tokensIn: 0,
        tokensOut: 0,
        cost: 0,
      },
    });

    return jsonOk({ reply });
  } catch (error) {
    return jsonError(error);
  }
}
