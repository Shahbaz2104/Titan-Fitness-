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
      <div className="border-border bg-surface/60 shadow-card rounded-3xl border p-10 text-center backdrop-blur-xl">
        <span className="bg-success/15 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl">
          <MailCheck className="text-success h-8 w-8" />
        </span>
        <h1 className="font-display text-foreground mt-6 text-2xl font-bold tracking-tight uppercase">
          Check your inbox
        </h1>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          If an account exists for that email, we&apos;ve sent a password reset link. It expires in
          1 hour.
        </p>
        <Button asChild variant="outline" className="mt-8">
          <Link href="/login">Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="border-border bg-surface/60 shadow-card rounded-3xl border p-8 backdrop-blur-xl">
      <div className="text-center">
        <span className="bg-primary/15 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl">
          <KeyRound className="text-primary h-8 w-8" />
        </span>
        <h1 className="font-display text-foreground mt-6 text-2xl font-bold tracking-tight uppercase">
          Reset your <span className="text-gradient">password</span>
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
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
          {errors.email && <p className="text-primary text-xs">{errors.email.message}</p>}
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading !== null}>
          {loading === "link" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MailCheck className="h-4 w-4" />
          )}
          Send Reset Link
        </Button>

        <div className="flex items-center gap-3">
          <span className="bg-border h-px flex-1" />
          <span className="text-muted-foreground text-xs tracking-widest uppercase">or</span>
          <span className="bg-border h-px flex-1" />
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          onClick={sendOtp}
          disabled={loading !== null}
        >
          {loading === "otp" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Send Reset Code (OTP)
        </Button>
      </form>

      <p className="text-muted-foreground mt-6 text-center text-sm">
        Remembered it?{" "}
        <Link
          href="/login"
          className="text-primary hover:text-accent font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
