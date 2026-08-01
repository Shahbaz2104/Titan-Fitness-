"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, KeyRound, Loader2, Lock } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const resetSchema = z
  .object({
    email: z.string().email("Enter a valid email"),
    otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

type ResetForm = z.infer<typeof resetSchema>;

export function ResetPasswordPageForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? searchParams.get("tokenValue") ?? "";
  const emailParam = searchParams.get("email") ?? "";
  const isOtpMode = Boolean(emailParam && !token);

  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: emailParam, otp: "", password: "", confirm: "" },
  });

  const onSubmit = async (data: ResetForm) => {
    setLoading(true);
    const result = isOtpMode
      ? await authClient.emailOtp.resetPassword({
          email: data.email,
          otp: data.otp,
          password: data.password,
        })
      : await authClient.resetPassword({ newPassword: data.password, token });
    setLoading(false);

    if (result.error) {
      toast.error("Reset failed", {
        description: result.error.message ?? "The code or link may have expired.",
      });
      return;
    }
    toast.success("Password updated!", {
      description: "You can now sign in with your new password.",
    });
    router.push("/login");
  };

  return (
    <div className="border-border bg-surface/60 shadow-card rounded-3xl border p-8 backdrop-blur-xl">
      <div className="text-center">
        <span className="bg-primary/15 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl">
          {isOtpMode ? (
            <KeyRound className="text-primary h-8 w-8" />
          ) : (
            <Lock className="text-primary h-8 w-8" />
          )}
        </span>
        <h1 className="font-display text-foreground mt-6 text-2xl font-bold tracking-tight uppercase">
          Choose a new <span className="text-gradient">password</span>
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          {isOtpMode
            ? "Enter the 6-digit code from your email plus your new password."
            : "Make it strong — mix letters, numbers, and symbols."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        {isOtpMode && (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                readOnly
                className="opacity-70"
                {...register("email")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="otp">Reset code</Label>
              <Input
                id="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="••••••"
                maxLength={6}
                className="text-center font-mono text-lg tracking-[0.5em]"
                {...register("otp")}
                aria-invalid={!!errors.otp}
              />
              {errors.otp && <p className="text-primary text-xs">{errors.otp.message}</p>}
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              className="pr-11"
              {...register("password")}
              aria-invalid={!!errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-primary text-xs">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input
            id="confirm"
            type={showPassword ? "text" : "password"}
            placeholder="Repeat your password"
            autoComplete="new-password"
            {...register("confirm")}
            aria-invalid={!!errors.confirm}
          />
          {errors.confirm && <p className="text-primary text-xs">{errors.confirm.message}</p>}
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={loading || (!isOtpMode && !token)}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
          Update Password
        </Button>
      </form>

      <p className="text-muted-foreground mt-6 text-center text-sm">
        <Link
          href="/login"
          className="text-primary hover:text-accent font-medium transition-colors"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
