import { jsonError, jsonOk, parseBody, requireAdmin } from "@/lib/api";
import { programSchema } from "@/lib/validators";
import { adminDeleteProgram, adminUpdateProgram } from "@/services/admin";

const programUpdateSchema = programSchema.partial();

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ programId: string }> }
) {
  try {
    await requireAdmin();
    const { programId } = await params;
    const body = await req.json().catch(() => null);
    const data = parseBody(programUpdateSchema, body);
    return jsonOk(await adminUpdateProgram(programId, data));
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ programId: string }> }
) {
  try {
    await requireAdmin();
    const { programId } = await params;
    return jsonOk(await adminDeleteProgram(programId));
  } catch (error) {
    return jsonError(error);
  }
}
