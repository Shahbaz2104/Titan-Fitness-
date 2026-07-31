import { ResetPasswordPageForm } from "./reset-password-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Reset Password",
  noIndex: true,
});

export default function ResetPasswordPage() {
  return <ResetPasswordPageForm />;
}
