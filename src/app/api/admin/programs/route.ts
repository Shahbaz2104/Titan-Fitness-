import { z } from "zod";
import { jsonError, jsonOk, parseBody, requireAdmin } from "@/lib/api";
import { programSchema } from "@/lib/validators";
import { adminCreateProgram, adminGetPrograms } from "@/services/admin";

const createProgramSchema = programSchema.extend({
  sessionsPerWeek: z.number().int().min(1).max(7).default(3),
});

export async function GET() {
  try {
    await requireAdmin();
    return jsonOk(await adminGetPrograms());
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json().catch(() => null);
    const data = parseBody(createProgramSchema, body);
    return jsonOk(
      await adminCreateProgram({
        name: data.name,
        category: data.category,
        description: data.description,
        difficulty: data.difficulty,
        durationWeeks: data.durationWeeks ?? 8,
        sessionsPerWeek: data.sessionsPerWeek ?? 3,
        imageUrl: data.imageUrl,
      }),
      { status: 201 }
    );
  } catch (error) {
    return jsonError(error);
  }
}
