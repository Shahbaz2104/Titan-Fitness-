import { LoginPageForm } from "./login-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Sign In",
  noIndex: true,
});

export default function LoginPage() {
  return <LoginPageForm />;
}
