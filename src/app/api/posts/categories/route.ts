import { jsonError, jsonOk } from "@/lib/api";
import { getBlogCategories } from "@/services/content";

export async function GET() {
  try {
    return jsonOk(await getBlogCategories());
  } catch (error) {
    return jsonError(error);
  }
}
