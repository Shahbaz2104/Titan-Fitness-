import { timingSafeEqual } from "node:crypto";
import { ApiError, jsonError, jsonOk } from "@/lib/api";
import { runMaintenance } from "@/services/maintenance";

export const dynamic = "force-dynamic";

function assertCronSecret(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) throw new ApiError("CRON_SECRET is not configured", 503, "CRON_DISABLED");

  const header = req.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  const actualBuffer = Buffer.from(header);
  const expectedBuffer = Buffer.from(expected);

  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    throw new ApiError("Unauthorized", 401, "UNAUTHORIZED");
  }
}

async function handle(req: Request) {
  try {
    assertCronSecret(req);
    return jsonOk(await runMaintenance());
  } catch (error) {
    return jsonError(error);
  }
}

export async function GET(req: Request) {
  return handle(req);
}

export async function POST(req: Request) {
  return handle(req);
}
