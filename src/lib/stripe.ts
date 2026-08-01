import Stripe from "stripe";

export function stripeEnabled(): boolean {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  return Boolean(key && key.length >= 10 && key.startsWith("sk_"));
}

export function getStripe(): Stripe | null {
  if (!stripeEnabled()) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export function getStripeWebhookSecret(): string | null {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  return secret && secret.startsWith("whsec_") ? secret : null;
}

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
