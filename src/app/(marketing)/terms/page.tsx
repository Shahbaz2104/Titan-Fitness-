import { LegalPage } from "@/components/marketing/legal-page";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of Service",
  description:
    "The terms and conditions governing your use of the Titan Fitness platform and facilities.",
  path: "/terms",
});

const data = {
  badge: "Legal",
  title: "Terms of",
  highlight: "Service",
  description:
    "The agreement between you and Titan Fitness covering use of our platform, facilities, and services.",
  updated: "August 1, 2026",
  sections: [
    {
      heading: "1. Acceptance of Terms",
      body: [
        "By creating an account, purchasing a membership, or using any Titan Fitness service — online or in person — you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.",
        "We may update these terms from time to time. Continued use of the platform after changes are posted constitutes acceptance of the revised terms.",
      ],
    },
    {
      heading: "2. Membership & Billing",
      body: [
        "Memberships are billed in advance on the cycle selected at checkout (monthly, quarterly, half-yearly, or yearly). Monthly plans auto-renew until cancelled. Annual plans are non-recurring unless auto-renew is enabled.",
        "You can manage or cancel your membership from the Membership page in your dashboard at any time. Cancellation takes effect at the end of the current billing period; no partial refunds are issued for mid-cycle cancellations.",
        "Promo codes, coupons, and referral rewards are subject to their own terms and may not be combined unless stated otherwise.",
      ],
    },
    {
      heading: "3. Health & Safety",
      body: [
        "You are responsible for consulting a physician before beginning any exercise or nutrition program. Our AI-generated workouts, meal plans, and coaching advice are informational and are not a substitute for professional medical advice.",
        "Use equipment safely and follow staff instructions. Titan Fitness is not liable for injuries resulting from improper form, overexertion, or failure to follow facility rules.",
      ],
    },
    {
      heading: "4. Acceptable Use",
      body: [
        "You agree not to misuse the platform: no scraping, no abuse of the AI services, no impersonation, no interference with other members' accounts, and no unlawful activity of any kind.",
        "We reserve the right to suspend or terminate accounts that violate these terms, with or without notice.",
      ],
    },
    {
      heading: "5. Intellectual Property",
      body: [
        "All content on the platform — including software, design, branding, and generated content — is owned by Titan Fitness or its licensors. You may not copy, modify, or redistribute it without written permission.",
      ],
    },
    {
      heading: "6. Limitation of Liability",
      body: [
        "To the maximum extent permitted by law, Titan Fitness shall not be liable for indirect, incidental, or consequential damages arising from your use of the platform or facilities.",
      ],
    },
    {
      heading: "7. Contact",
      body: [
        "Questions about these terms? Email support@titanfitness.com or visit the Contact page.",
      ],
    },
  ],
};

export default function TermsPage() {
  return <LegalPage data={data} />;
}
