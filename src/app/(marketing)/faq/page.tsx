import { PageHeader } from "@/components/marketing/page-header";
import { Reveal } from "@/components/ui/reveal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "FAQs",
  description:
    "Frequently asked questions about Titan Fitness memberships, AI coaching, classes, and more.",
  path: "/faq",
});

const FAQ_GROUPS = [
  {
    category: "Membership & Billing",
    icon: "💳",
    faqs: [
      {
        q: "How much does a membership cost?",
        a: "Essential starts at $29/month, Pro at $59/month, and Elite at $99/month. New members get 50% off their first month.",
      },
      {
        q: "Can I cancel anytime?",
        a: "Yes. There are no contracts or cancellation fees. Cancel from the dashboard and your access continues until the end of your billing period.",
      },
      {
        q: "Do you offer student or corporate discounts?",
        a: "Yes. Students get 20% off any plan with a valid ID, and corporate teams of 5+ get custom rates. Contact us for details.",
      },
      {
        q: "What payment methods do you accept?",
        a: "All major credit/debit cards, Google Pay, and Apple Pay. Payments are processed securely via Stripe.",
      },
    ],
  },
  {
    category: "AI Features",
    icon: "🤖",
    faqs: [
      {
        q: "How does the AI workout generator work?",
        a: "Enter your goal, weight, height, experience, days per week, and equipment. Our AI builds a full weekly program — exercises, sets, reps, rest, warm-up, and cool-down — that adapts as you log progress.",
      },
      {
        q: "Is the AI nutritionist personalized?",
        a: "Completely. It generates calorie targets, macro splits, daily meal plans, recipes, and shopping lists based on your goals and preferences.",
      },
      {
        q: "Which AI models power Titan?",
        a: "We use OpenAI's GPT and Google Gemini models through the Vercel AI SDK, with structured outputs for reliable results.",
      },
      {
        q: "Can the AI chatbot remember our conversations?",
        a: "Yes. The coach has memory of your chat history and your profile, so recommendations stay consistent.",
      },
    ],
  },
  {
    category: "Training & Classes",
    icon: "🏋️",
    faqs: [
      {
        q: "What classes do you offer?",
        a: "Yoga, CrossFit, HIIT, Zumba, Spinning, Boxing, Pilates, and Strength — 240+ classes per week across all branches.",
      },
      {
        q: "Can I book classes in advance?",
        a: "Yes. Book up to 7 days ahead from the app. Cancel or reschedule free of charge up to 4 hours before the class.",
      },
      {
        q: "How does the QR check-in work?",
        a: "Your membership card in the app shows a unique QR code. Scan it at the front desk — your attendance and streaks update instantly.",
      },
    ],
  },
  {
    category: "Plans & Results",
    icon: "📈",
    faqs: [
      {
        q: "How fast will I see results?",
        a: "Most members notice changes in 4–6 weeks with consistent training. Body composition changes typically become measurable after 8–12 weeks.",
      },
      {
        q: "Can I switch programs?",
        a: "Anytime. Pro and Elite members can switch between any program without fees.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHeader
        badge="Help Center"
        title="Everything You"
        highlight="Need To Know"
        description="Can't find your answer? Contact our team — average response time is under 2 hours."
      />

      <section className="pb-24">
        <div className="mx-auto max-w-4xl space-y-12 px-4 sm:px-6">
          {FAQ_GROUPS.map((group, gi) => (
            <Reveal key={group.category} delay={gi * 0.05}>
              <div className="mb-6 flex items-center gap-3">
                <span className="text-2xl">{group.icon}</span>
                <h2 className="font-display text-foreground text-2xl font-bold tracking-tight uppercase">
                  {group.category}
                </h2>
              </div>
              <div className="space-y-3">
                {group.faqs.map((faq) => (
                  <details
                    key={faq.q}
                    className="group border-border bg-surface/60 open:border-primary/30 rounded-2xl border backdrop-blur-xl transition-colors hover:border-white/15"
                  >
                    <summary className="text-foreground flex cursor-pointer items-center justify-between gap-4 px-6 py-5 text-sm font-medium [&::-webkit-details-marker]:hidden">
                      {faq.q}
                      <span className="text-primary transition-transform duration-300 group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="text-muted-foreground px-6 pb-6 text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
