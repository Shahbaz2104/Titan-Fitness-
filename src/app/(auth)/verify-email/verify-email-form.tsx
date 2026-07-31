"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2, MailCheck, MailX } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";



export function VerifyEmailPageForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? searchParams.get("tokenValue") ?? "";
  const [state, setState] = React.useState<"checking" | "verified" | "failed" | "sent">(
    token ? "checking" : "sent"
  );
  const [email, setEmail] = React.useState("");
  const [sending, setSending] = React.useState(false);

  React.useEffect(() => {
    if (!token) return;
    authClient
      .verifyEmail({ query: { token } })
      .then(({ error }) => setState(error ? "failed" : "verified"))
      .catch(() => setState("failed"));
  }, [token]);

  const resend = async () => {
    if (!email) {
      toast.error("Enter your email first");
      return;
    }
    setSending(true);
    const { error } = await authClient.sendVerificationEmail({
      email,
      callbackURL: "/dashboard",
    });
    setSending(false);
    if (error) {
      toast.error("Couldn't resend", { description: error.message });
      return;
    }
    toast.success("Verification email sent!");
  };

  if (state === "checking") {
    return (
      <div className="rounded-3xl border border-border bg-surface/60 p-10 text-center backdrop-blur-xl shadow-card">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
        <h1 className="mt-6 font-display text-2xl font-bold uppercase tracking-tight text-foreground">
          Verifying…
        </h1>
      </div>
    );
  }

  if (state === "verified") {
    return (
      <div className="rounded-3xl border border-border bg-surface/60 p-10 text-center backdrop-blur-xl shadow-card">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success/15">
          <MailCheck className="h-8 w-8 text-success" />
        </span>
        <h1 className="mt-6 font-display text-2xl font-bold uppercase tracking-tight text-foreground">
          Email verified!
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Your account is ready. Time to start training.
        </p>
        <Button asChild className="mt-8">
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-surface/60 p-8 backdrop-blur-xl shadow-card">
      <div className="text-center">
        {state === "failed" ? (
          <>
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15">
              <MailX className="h-8 w-8 text-primary" />
            </span>
            <h1 className="mt-6 font-display text-2xl font-bold uppercase tracking-tight text-foreground">
              Verification failed
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              The link may be invalid or expired. Request a new one below.
            </p>
          </>
        ) : (
          <>
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15">
              <MailCheck className="h-8 w-8 text-accent" />
            </span>
            <h1 className="mt-6 font-display text-2xl font-bold uppercase tracking-tight text-foreground">
              Check your inbox
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We sent a verification link to your email. Click it to activate your account.
            </p>
          </>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          resend();
        }}
        className="mt-8 space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={sending}>
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MailCheck className="h-4 w-4" />}
          Resend Verification Email
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already verified?{" "}
        <Link href="/login" className="font-medium text-primary transition-colors hover:text-accent">
          Sign in
        </Link>
      </p>
    </div>
  );
}
