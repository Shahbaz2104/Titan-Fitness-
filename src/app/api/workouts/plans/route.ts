import { jsonError, jsonOk, parseBody, requireUser } from "@/lib/api";
import { workoutPlanSchema } from "@/lib/validators";
import { createPlan, getActivePlans } from "@/services/workouts";

export async function GET() {
  try {
    const user = await requireUser();
    return jsonOk(await getActivePlans(user.id));
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json().catch(() => null);
    const data = parseBody(workoutPlanSchema, body);
    return jsonOk(await createPlan(user.id, data), { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
