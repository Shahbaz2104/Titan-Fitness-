import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { deletePlan, getPlan } from "@/services/workouts";

export async function GET(_req: Request, { params }: { params: Promise<{ planId: string }> }) {
  try {
    const user = await requireUser();
    const { planId } = await params;
    return jsonOk(await getPlan(user.id, planId));
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ planId: string }> }) {
  try {
    const user = await requireUser();
    const { planId } = await params;
    return jsonOk(await deletePlan(user.id, planId));
  } catch (error) {
    return jsonError(error);
  }
}
