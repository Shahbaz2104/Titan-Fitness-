import { Hero } from "@/components/marketing/hero";
import { StatsBar } from "@/components/marketing/stats-bar";
import { ProgramsGrid } from "@/components/marketing/programs-grid";
import { WhyChooseUs } from "@/components/marketing/why-choose-us";
import { TrainerShowcase } from "@/components/marketing/trainer-showcase";
import { Testimonials } from "@/components/marketing/testimonials";
import { TransformationGallery } from "@/components/marketing/transformation-gallery";
import { PricingSection } from "@/components/marketing/pricing-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { BlogPreview } from "@/components/marketing/blog-preview";
import { CtaSection } from "@/components/marketing/cta-section";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata();

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <ProgramsGrid />
      <WhyChooseUs />
      <TrainerShowcase />
      <Testimonials />
      <TransformationGallery />
      <PricingSection />
      <FaqSection />
      <BlogPreview />
      <CtaSection />
    </>
  );
}
