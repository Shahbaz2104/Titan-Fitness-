import { VerifyEmailPageForm } from "./verify-email-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Verify Email",
  noIndex: true,
});

export default function VerifyEmailPage() {
  return <VerifyEmailPageForm />;
}
