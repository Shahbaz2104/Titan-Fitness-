import { jsonError, jsonOk, parseBody, requireUser } from "@/lib/api";
import { progressPhotoSchema } from "@/lib/validators";
import { addProgressPhoto, getProgressPhotos } from "@/services/members";

export async function GET() {
  try {
    const user = await requireUser();
    return jsonOk(await getProgressPhotos(user.id));
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json().catch(() => null);
    const data = parseBody(progressPhotoSchema, body);
    const photo = await addProgressPhoto(user.id, { ...data, stage: data.stage ?? "NOW" });
    return jsonOk(photo, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
