"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Dumbbell, Loader2, LogIn, Mail, ShieldCheck, UserRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GoogleIcon } from "@/components/shared/google-icon";
import { DEMO_ACCOUNTS, DEMO_MODE, DEMO_PASSWORD } from "@/lib/demo";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPageForm({ googleEnabled = false }: { googleEnabled?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/dashboard";
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [demoLoading, setDemoLoading] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: redirect,
    });
    setLoading(false);
    if (error) {
      toast.error("Sign in failed", {
        description: error.message ?? "Check your credentials and try again.",
      });
      return;
    }
    toast.success("Welcome back!");
    router.push(redirect);
    router.refresh();
  };

  const onGoogle = async () => {
    setGoogleLoading(true);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: redirect,
    });
    setGoogleLoading(false);
  };

  const onDemo = async (account: (typeof DEMO_ACCOUNTS)[number]) => {
    setDemoLoading(account.email);
    const { error } = await authClient.signIn.email({
      email: account.email,
      password: DEMO_PASSWORD,
      callbackURL: account.redirect,
    });
    setDemoLoading(null);
    if (error) {
      toast.error("Demo sign-in failed", {
        description: error.message ?? "The demo account may not be seeded yet.",
      });
      return;
    }
    toast.success(`Signed in as demo ${account.label.toLowerCase()}`);
    router.push(account.redirect);
    router.refresh();
  };

  return (
    <div className="border-border bg-surface/60 shadow-card rounded-3xl border p-8 backdrop-blur-xl">
      <div className="text-center">
        <h1 className="font-display text-foreground text-3xl font-bold tracking-tight uppercase">
          Welcome <span className="text-primary">Back</span>
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">Log in to continue your training.</p>
      </div>

      {DEMO_MODE && (
        <div className="border-primary/20 bg-primary/5 mt-6 rounded-2xl border p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-primary h-4 w-4" />
            <p className="text-foreground text-xs font-semibold tracking-widest uppercase">
              Demo access
            </p>
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            One-click accounts. Public sign-up is disabled in this preview.
          </p>
          <div className="mt-3 grid gap-2">
            {DEMO_ACCOUNTS.map((account) => {
              const Icon =
                account.label === "Admin"
                  ? ShieldCheck
                  : account.label === "Trainer"
                    ? Dumbbell
                    : UserRound;
              return (
                <Button
                  key={account.email}
                  type="button"
                  variant="outline"
                  className="h-auto justify-start gap-3 py-2.5"
                  onClick={() => onDemo(account)}
                  disabled={demoLoading !== null}
                >
                  {demoLoading === account.email ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Icon className="text-primary h-4 w-4" />
                  )}
                  <span className="text-left">
                    <span className="block text-sm font-semibold">{account.label}</span>
                    <span className="text-muted-foreground block text-[11px] font-normal">
                      {account.description}
                    </span>
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {googleEnabled && (
        <>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="mt-6 w-full"
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
            <span className="text-muted-foreground text-xs tracking-widest uppercase">or</span>
            <Separator className="flex-1" />
          </div>
        </>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pl-11"
              autoComplete="email"
              {...register("email")}
              aria-invalid={!!errors.email}
            />
          </div>
          {errors.email && <p className="text-primary text-xs">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-primary hover:text-accent text-xs transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            {...register("password")}
            aria-invalid={!!errors.password}
          />
          {errors.password && <p className="text-primary text-xs">{errors.password.message}</p>}
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
          Sign In
        </Button>
      </form>

      {DEMO_MODE ? (
        <p className="text-muted-foreground mt-6 text-center text-xs">
          Preview mode — public sign-up is disabled. Use a demo account above.
        </p>
      ) : (
        <p className="text-muted-foreground mt-6 text-center text-sm">
          New to Titan?{" "}
          <Link
            href="/register"
            className="text-primary hover:text-accent font-medium transition-colors"
          >
            Create an account
          </Link>
        </p>
      )}
    </div>
  );
}
