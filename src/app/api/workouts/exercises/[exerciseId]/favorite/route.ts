import { jsonError, jsonOk, requireUser } from "@/lib/api";
import { getFavorites, toggleFavorite } from "@/services/workouts";

export async function GET() {
  try {
    const user = await requireUser();
    return jsonOk(await getFavorites(user.id));
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ exerciseId: string }> }
) {
  try {
    const user = await requireUser();
    const { exerciseId } = await params;
    return jsonOk(await toggleFavorite(user.id, exerciseId));
  } catch (error) {
    return jsonError(error);
  }
}
