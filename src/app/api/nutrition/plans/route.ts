import { jsonError, jsonOk, parseBody, requireUser } from "@/lib/api";
import { mealPlanSchema } from "@/lib/validators";
import { createMealPlan, getActiveMealPlans } from "@/services/nutrition";

export async function GET() {
  try {
    const user = await requireUser();
    return jsonOk(await getActiveMealPlans(user.id));
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json().catch(() => null);
    const data = parseBody(mealPlanSchema, body);
    return jsonOk(await createMealPlan(user.id, data), { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
