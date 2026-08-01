const RESEND_API_URL = "https://api.resend.com/emails";

export const EMAIL_FROM = "Titan Fitness <onboarding@resend.dev>";

type EmailTemplate = "verify-email" | "reset-password" | "notification";
type OtpTemplate = "sign-in" | "change-email" | "email-verification" | "forget-password";

export async function sendAuthEmail(
  to: string,
  template: EmailTemplate,
  data: { url: string; name: string }
) {
  const subject =
    template === "verify-email"
      ? "Verify your Titan Fitness email"
      : "Reset your Titan Fitness password";

  if (!process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY missing — email not sent:", { to, template });
    return;
  }

  await sendViaResend({
    to,
    subject,
    html: renderEmail(template, { ...data, title: subject }),
  });
}

export async function sendOtpEmail(to: string, type: OtpTemplate, otp: string) {
  const isReset = type === "forget-password";
  const subject = isReset
    ? "Your Titan Fitness password reset code"
    : "Your Titan Fitness verification code";

  if (!process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY missing — OTP email not sent:", { to, type });
    return;
  }

  await sendViaResend({
    to,
    subject,
    html: renderOtpEmail({
      title: isReset ? "Reset your password" : "Verify your email",
      otp,
      name: "there",
      isReset,
    }),
  });
}

export async function sendNotificationEmail(to: string, subject: string, body: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY missing — email not sent:", { to, subject });
    return;
  }
  await sendViaResend({
    to,
    subject,
    html: renderEmail("notification", { name: body, url: "", title: subject }),
  });
}

async function sendViaResend({ to, subject, html }: { to: string; subject: string; html: string }) {
  const res = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from: EMAIL_FROM, to, subject, html }),
  });

  if (!res.ok) {
    console.error("[email] Resend error:", res.status, await res.text());
  }
}

function renderEmail(template: EmailTemplate, data: { url: string; name: string; title?: string }) {
  const isVerify = template === "verify-email";
  const isReset = template === "reset-password";
  const buttonText = isVerify ? "Verify Email" : isReset ? "Reset Password" : "View";

  return `
  <div style="background:#050505;padding:40px 24px;font-family:Inter,Arial,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#111111;border:1px solid #262626;border-radius:16px;padding:32px;">
      <div style="font-family:Oswald,sans-serif;font-size:22px;font-weight:700;color:#e63946;letter-spacing:1px;margin-bottom:16px;">TITAN FITNESS</div>
      <h1 style="color:#fafafa;font-size:20px;margin:0 0 12px;">${data.title ?? "Welcome to Titan Fitness"}</h1>
      <p style="color:#8b8b8b;font-size:14px;line-height:1.6;">Hi ${data.name},</p>
      <a href="${data.url}" style="display:inline-block;margin:20px 0;background:#e63946;color:#fff;text-decoration:none;padding:12px 28px;border-radius:9999px;font-size:14px;font-weight:600;">${buttonText}</a>
      <p style="color:#8b8b8b;font-size:12px;line-height:1.6;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
    </div>
  </div>`;
}

function renderOtpEmail({
  title,
  otp,
  name,
  isReset,
}: {
  title: string;
  otp: string;
  name: string;
  isReset: boolean;
}) {
  const code = otp.match(/.{1,3}/g)?.join("&nbsp;&nbsp;") ?? otp;

  return `
  <div style="background:#050505;padding:40px 24px;font-family:Inter,Arial,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#111111;border:1px solid #262626;border-radius:16px;padding:32px;">
      <div style="font-family:Oswald,sans-serif;font-size:22px;font-weight:700;color:#e63946;letter-spacing:1px;margin-bottom:16px;">TITAN FITNESS</div>
      <h1 style="color:#fafafa;font-size:20px;margin:0 0 12px;">${title}</h1>
      <p style="color:#8b8b8b;font-size:14px;line-height:1.6;">Hi ${name},</p>
      <p style="color:#8b8b8b;font-size:14px;line-height:1.6;">
        ${isReset ? "Use the code below to reset your password." : "Use the code below to verify your email address."}
      </p>
      <div style="margin:24px 0;padding:20px;background:#1a1a1a;border:1px solid #333;border-radius:12px;text-align:center;font-family:'Courier New',monospace;font-size:32px;font-weight:700;color:#e63946;letter-spacing:8px;">${code}</div>
      <p style="color:#8b8b8b;font-size:12px;line-height:1.6;">This code expires in 5 minutes. If you didn't request this, you can safely ignore this email.</p>
    </div>
  </div>`;
}
