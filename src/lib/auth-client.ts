import { createAuthClient } from "better-auth/client";
import { adminClient, emailOTPClient, inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  plugins: [adminClient(), emailOTPClient(), inferAdditionalFields<typeof auth>()],
});
