import { RegisterPageForm } from "./register-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Create Account",
  noIndex: true,
});

export default function RegisterPage() {
  return <RegisterPageForm />;
}
