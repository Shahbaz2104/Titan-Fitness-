import { LegalPage } from "@/components/marketing/legal-page";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How Titan Fitness collects, uses, and protects your personal data.",
  path: "/privacy",
});

const data = {
  badge: "Legal",
  title: "Privacy",
  highlight: "Policy",
  description:
    "Your data belongs to you. Here's exactly what we collect, why we collect it, and how we protect it.",
  updated: "August 1, 2026",
  sections: [
    {
      heading: "1. Data We Collect",
      body: [
        "Account data: name, email, phone, date of birth, and gender. Profile data you add: height, weight, body fat, fitness goals, progress photos, and workout logs.",
        "Usage data: workout sessions, attendance check-ins, class bookings, payment history, and AI interactions. Technical data: device type, browser, and IP address for security and performance.",
      ],
    },
    {
      heading: "2. How We Use Your Data",
      body: [
        "To provide our services — generating workouts and meal plans, tracking progress, processing payments, and managing memberships.",
        "To personalize your experience — the AI coach uses your goals, body metrics, and history to tailor recommendations. To communicate — membership expiry reminders, class alerts, and product updates.",
      ],
    },
    {
      heading: "3. AI & Your Data",
      body: [
        "When you use AI features, the relevant inputs (goal, weight, height, preferences) are sent to our AI providers to generate your results. We do not train third-party models on your personal data.",
        "You can delete your AI chat history and usage logs at any time from Settings.",
      ],
    },
    {
      heading: "4. Payments",
      body: [
        "Card payments are processed by Stripe. We never store your full card number — Stripe handles all card data and remains PCI-DSS compliant.",
      ],
    },
    {
      heading: "5. Cookies & Analytics",
      body: [
        "We use essential cookies for authentication and optional analytics (PostHog) to improve the product. You can opt out of analytics from Settings.",
      ],
    },
    {
      heading: "6. Data Retention & Deletion",
      body: [
        "We keep your data for as long as your account is active. You may request full deletion of your account and data at any time — most data is removed within 30 days, with billing records retained as required by law.",
      ],
    },
    {
      heading: "7. Your Rights",
      body: [
        "You have the right to access, correct, export, and delete your personal data. Email privacy@titanfitness.com to exercise any of these rights.",
      ],
    },
  ],
};

export default function PrivacyPage() {
  return <LegalPage data={data} />;
}
