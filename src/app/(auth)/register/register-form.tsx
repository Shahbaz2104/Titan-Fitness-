"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GoogleIcon } from "@/components/shared/google-icon";



const registerSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  referralCode: z.string().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPageForm() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    const { error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      ...(data.referralCode ? { referralCode: data.referralCode } : {}),
      callbackURL: "/dashboard",
    });
    setLoading(false);
    if (error) {
      toast.error("Sign up failed", {
        description: error.message ?? "An account with this email may already exist.",
      });
      return;
    }
    toast.success("Account created!", {
      description: "Check your email to verify your account.",
    });
    router.push("/verify-email");
  };

  const onGoogle = async () => {
    setGoogleLoading(true);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
    setGoogleLoading(false);
  };

  return (
    <div className="rounded-3xl border border-border bg-surface/60 p-8 backdrop-blur-xl shadow-card">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground">
          Join <span className="text-gradient">Titan</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Create your account — it takes less than a minute.
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="mt-8 w-full"
        onClick={onGoogle}
        disabled={googleLoading}
      >
        {googleLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon className="h-4 w-4" />
        )}
        Continue with Google
      </Button>

      <div className="my-6 flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="text-xs uppercase tracking-widest text-muted-foreground">or</span>
        <Separator className="flex-1" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            autoComplete="name"
            {...register("name")}
            aria-invalid={!!errors.name}
          />
          {errors.name && <p className="text-xs text-primary">{errors.name.message}</p>}
        </div>

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

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Minimum 8 characters"
            autoComplete="new-password"
            {...register("password")}
            aria-invalid={!!errors.password}
          />
          {errors.password && <p className="text-xs text-primary">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="referralCode">Referral code (optional)</Label>
          <Input
            id="referralCode"
            placeholder="TITAN-XXXXXX"
            {...register("referralCode")}
          />
          <p className="text-[11px] text-muted-foreground">
            Got a code from a friend? Enter it and you both earn $20.
          </p>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UserPlus className="h-4 w-4" />
          )}
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already a member?{" "}
        <Link href="/login" className="font-medium text-primary transition-colors hover:text-accent">
          Sign in
        </Link>
      </p>
      <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
        By creating an account you agree to our{" "}
        <Link href="/terms" className="hover:text-primary">Terms</Link> and{" "}
        <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>.
      </p>
    </div>
  );
}
