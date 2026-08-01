"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { KeyRound, Loader2, MailCheck, Send } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const forgotSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export function ForgotPasswordPageForm() {
  const router = useRouter();
  const [loading, setLoading] = React.useState<"link" | "otp" | null>(null);
  const [sent, setSent] = React.useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotForm>({ resolver: zodResolver(forgotSchema) });

  const onSubmit = async (data: ForgotForm) => {
    setLoading("link");
    const { error } = await authClient.requestPasswordReset({
      email: data.email,
      redirectTo: "/reset-password",
    });
    setLoading(null);
    if (error) {
      toast.error("Couldn't send reset link", {
        description: error.message ?? "Please check the email address.",
      });
      return;
    }
    setSent(true);
  };

  const sendOtp = async () => {
    const email = getValues("email");
    if (!email) {
      toast.error("Enter your email first");
      return;
    }
    setLoading("otp");
    const { error } = await authClient.emailOtp.requestPasswordReset({ email });
    setLoading(null);
    if (error) {
      toast.error("Couldn't send reset code", {
        description: error.message ?? "Please check the email address.",
      });
      return;
    }
    router.push(`/reset-password?email=${encodeURIComponent(email)}`);
  };

  if (sent) {
    return (
      <div className="rounded-3xl border border-border bg-surface/60 p-10 text-center backdrop-blur-xl shadow-card">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success/15">
          <MailCheck className="h-8 w-8 text-success" />
        </span>
        <h1 className="mt-6 font-display text-2xl font-bold uppercase tracking-tight text-foreground">
          Check your inbox
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          If an account exists for that email, we&apos;ve sent a password reset
          link. It expires in 1 hour.
        </p>
        <Button asChild variant="outline" className="mt-8">
          <Link href="/login">Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-surface/60 p-8 backdrop-blur-xl shadow-card">
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15">
          <KeyRound className="h-8 w-8 text-primary" />
        </span>
        <h1 className="mt-6 font-display text-2xl font-bold uppercase tracking-tight text-foreground">
          Reset your <span className="text-gradient">password</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email, then choose how you want to reset it.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="text-xs text-primary">{errors.email.message}</p>}
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading !== null}>
          {loading === "link" ? <Loader2 className="h-4 w-4 animate-spin" /> : <MailCheck className="h-4 w-4" />}
          Send Reset Link
        </Button>

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-widest text-muted-foreground">or</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          onClick={sendOtp}
          disabled={loading !== null}
        >
          {loading === "otp" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Send Reset Code (OTP)
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link href="/login" className="font-medium text-primary transition-colors hover:text-accent">
          Sign in
        </Link>
      </p>
    </div>
  );
}
