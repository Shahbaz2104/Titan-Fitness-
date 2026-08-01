import { jsonError, jsonOk } from "@/lib/api";
import { getGalleryImages } from "@/services/content";

export async function GET() {
  try {
    return jsonOk(await getGalleryImages());
  } catch (error) {
    return jsonError(error);
  }
}
