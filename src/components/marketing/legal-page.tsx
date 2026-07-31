import { PageHeader } from "@/components/marketing/page-header";

export interface LegalSection {
  heading: string;
  body: string[];
}

export interface LegalPageData {
  badge: string;
  title: string;
  highlight?: string;
  description: string;
  updated: string;
  sections: LegalSection[];
}

export function LegalPage({ data }: { data: LegalPageData }) {
  return (
    <div className="relative">
      <PageHeader badge={data.badge} title={data.title} highlight={data.highlight} description={data.description} />
      <section className="relative mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <p className="mb-10 text-sm text-muted">Last updated: {data.updated}</p>
        <div className="space-y-10">
          {data.sections.map((section) => (
            <div key={section.heading} className="glass rounded-2xl p-6 sm:p-8">
              <h2 className="font-display mb-4 text-xl font-semibold uppercase tracking-tight sm:text-2xl">
                {section.heading}
              </h2>
              <div className="space-y-3">
                {section.body.map((paragraph, index) => (
                  <p key={index} className="leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
