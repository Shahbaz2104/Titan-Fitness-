import { jsonError, jsonOk, requireAdmin } from "@/lib/api";
import { adminGetSettings, adminUpdateSettings } from "@/services/admin";

export async function GET() {
  try {
    await requireAdmin();
    return jsonOk(await adminGetSettings());
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json().catch(() => null);
    const entries = Array.isArray(body)
      ? body
      : Object.entries(body ?? {}).map(([key, value]) => ({ key, value: String(value) }));
    const valid = entries.filter(
      (e): e is { key: string; value: string } =>
        typeof e?.key === "string" && e.key.length > 0 && typeof e.value === "string"
    );
    return jsonOk(await adminUpdateSettings(valid));
  } catch (error) {
    return jsonError(error);
  }
}
