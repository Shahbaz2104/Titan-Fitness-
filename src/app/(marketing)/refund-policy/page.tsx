import { LegalPage } from "@/components/marketing/legal-page";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Refund Policy",
  description: "Titan Fitness refund and cancellation policy for memberships and services.",
  path: "/refund-policy",
});

const data = {
  badge: "Legal",
  title: "Refund",
  highlight: "Policy",
  description:
    "Fair, transparent refunds. Here's exactly what you're entitled to and how to claim it.",
  updated: "August 1, 2026",
  sections: [
    {
      heading: "1. Monthly Memberships",
      body: [
        "Monthly memberships can be cancelled anytime from your dashboard. You keep access until the end of the current billing period.",
        "No refunds are issued for partially used monthly periods.",
      ],
    },
    {
      heading: "2. Annual & Long-Term Plans",
      body: [
        "Annual, half-yearly, and quarterly plans purchased directly through our website are refundable within 14 days of purchase, provided fewer than 3 sessions were attended.",
        "Refunds are prorated to the date of cancellation minus a 10% processing fee.",
      ],
    },
    {
      heading: "3. Personal Training Sessions",
      body: [
        "Sessions can be rescheduled up to 12 hours before the start time. Missed sessions without notice are forfeited.",
        "Unused PT session credits are refundable only as part of a full membership cancellation within the 14-day window.",
      ],
    },
    {
      heading: "4. Freezes & Pauses",
      body: [
        "Elite members may freeze their membership for up to 30 days per year at no cost. Freezes extend your end date by the frozen period.",
      ],
    },
    {
      heading: "5. How to Request a Refund",
      body: [
        "Open a support ticket from your dashboard, or email billing@titanfitness.com with your name and membership details.",
        "Approved refunds are returned to the original payment method within 5–10 business days.",
      ],
    },
    {
      heading: "6. Failed Payments & Reinstatement",
      body: [
        "If a renewal payment fails, we retry for 3 days. If it still fails, your membership is suspended and you lose access. Reinstatement reactivates your plan and billing resumes normally.",
      ],
    },
  ],
};

export default function RefundPolicyPage() {
  return <LegalPage data={data} />;
}
