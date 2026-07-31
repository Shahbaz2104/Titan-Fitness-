import { ForgotPasswordPageForm } from "./forgot-password-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Forgot Password",
  noIndex: true,
});

export default function ForgotPasswordPage() {
  return <ForgotPasswordPageForm />;
}
