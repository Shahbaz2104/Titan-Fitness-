import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { deleteMealPlan, getMealPlan } from "@/services/nutrition";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ planId: string }> }
) {
  try {
    const user = await requireUser();
    const { planId } = await params;
    return jsonOk(await getMealPlan(user.id, planId));
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ planId: string }> }
) {
  try {
    const user = await requireUser();
    const { planId } = await params;
    return jsonOk(await deleteMealPlan(user.id, planId));
  } catch (error) {
    return jsonError(error);
  }
}
