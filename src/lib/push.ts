import webpush from "web-push";

export const pushEnabled = () =>
  Boolean(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);

export const getVapidPublicKey = () => process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

export function getWebPush() {
  const publicKey = getVapidPublicKey();
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) {
    throw new Error("Push notifications not configured: VAPID keys missing");
  }
  webpush.setVapidDetails(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    publicKey,
    privateKey
  );
  return webpush;
}
