"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { KeyRound, Loader2, MailCheck, MailX, Send } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function VerifyEmailPageForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? searchParams.get("tokenValue") ?? "";
  const [state, setState] = React.useState<"checking" | "verified" | "failed" | "idle">(
    token ? "checking" : "idle"
  );
  const [email, setEmail] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [verifying, setVerifying] = React.useState(false);
  const [codeSent, setCodeSent] = React.useState(false);

  React.useEffect(() => {
    if (!token) return;
    authClient
      .verifyEmail({ query: { token } })
      .then(({ error }) => setState(error ? "failed" : "verified"))
      .catch(() => setState("failed"));
  }, [token]);

  const sendCode = async () => {
    if (!email) {
      toast.error("Enter your email first");
      return;
    }
    setSending(true);
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    });
    setSending(false);
    if (error) {
      toast.error("Couldn't send the code", { description: error.message });
      return;
    }
    setCodeSent(true);
    toast.success("Verification code sent!", { description: "Check your inbox (valid 5 min)." });
  };

  const verifyOtp = async () => {
    if (!email) {
      toast.error("Enter your email first");
      return;
    }
    if (otp.length < 6) {
      toast.error("Enter the 6-digit code");
      return;
    }
    setVerifying(true);
    const { error } = await authClient.emailOtp.verifyEmail({ email, otp });
    setVerifying(false);
    if (error) {
      toast.error("Verification failed", {
        description: error.message ?? "Wrong or expired code.",
      });
      return;
    }
    setState("verified");
  };

  if (state === "checking") {
    return (
      <div className="border-border bg-surface/60 shadow-card rounded-3xl border p-10 text-center backdrop-blur-xl">
        <Loader2 className="text-primary mx-auto h-10 w-10 animate-spin" />
        <h1 className="font-display text-foreground mt-6 text-2xl font-bold tracking-tight uppercase">
          Verifying…
        </h1>
      </div>
    );
  }

  if (state === "verified") {
    return (
      <div className="border-border bg-surface/60 shadow-card rounded-3xl border p-10 text-center backdrop-blur-xl">
        <span className="bg-success/15 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl">
          <MailCheck className="text-success h-8 w-8" />
        </span>
        <h1 className="font-display text-foreground mt-6 text-2xl font-bold tracking-tight uppercase">
          Email verified!
        </h1>
        <p className="text-muted-foreground mt-3 text-sm">
          Your account is ready. Time to start training.
        </p>
        <Button asChild className="mt-8">
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="border-border bg-surface/60 shadow-card rounded-3xl border p-8 backdrop-blur-xl">
      <div className="text-center">
        {state === "failed" ? (
          <>
            <span className="bg-primary/15 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl">
              <MailX className="text-primary h-8 w-8" />
            </span>
            <h1 className="font-display text-foreground mt-6 text-2xl font-bold tracking-tight uppercase">
              Verification failed
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              The link may be invalid or expired. Verify with a code below instead.
            </p>
          </>
        ) : (
          <>
            <span className="bg-accent/15 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl">
              <KeyRound className="text-accent h-8 w-8" />
            </span>
            <h1 className="font-display text-foreground mt-6 text-2xl font-bold tracking-tight uppercase">
              Verify your email
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              We&apos;ll send a 6-digit code to your inbox. It expires in 5 minutes.
            </p>
          </>
        )}
      </div>

      <div className="mt-8 space-y-4">
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

        {!codeSent ? (
          <Button type="button" size="lg" className="w-full" onClick={sendCode} disabled={sending}>
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send Verification Code
          </Button>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="otp">6-digit code</Label>
              <Input
                id="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="••••••"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="text-center font-mono text-lg tracking-[0.5em]"
                required
              />
            </div>
            <Button
              type="button"
              size="lg"
              className="w-full"
              onClick={verifyOtp}
              disabled={verifying}
            >
              {verifying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MailCheck className="h-4 w-4" />
              )}
              Verify Code
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={sendCode}
              disabled={sending}
            >
              Resend code
            </Button>
          </>
        )}
      </div>

      <p className="text-muted-foreground mt-6 text-center text-sm">
        Already verified?{" "}
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
