import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { FacebookIcon, InstagramIcon, TwitterXIcon, YoutubeIcon } from "@/components/shared/social-icons";
import { APP_NAME, SOCIALS, SUPPORT_EMAIL, SUPPORT_PHONE } from "@/lib/constants";

const PRODUCT_LINKS = [
  { label: "Programs", href: "/programs" },
  { label: "Trainers", href: "/trainers" },
  { label: "Pricing", href: "/pricing" },
  { label: "BMI Calculator", href: "/bmi" },
  { label: "Gallery", href: "/gallery" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "FAQs", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Refund Policy", href: "/refund-policy" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-surface/30">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              The AI-powered gym management platform. Personalized workouts,
              intelligent nutrition, and world-class training — all in one place.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { icon: InstagramIcon, href: SOCIALS.instagram, label: "Instagram" },
                { icon: TwitterXIcon, href: SOCIALS.twitter, label: "Twitter" },
                { icon: YoutubeIcon, href: SOCIALS.youtube, label: "YouTube" },
                { icon: FacebookIcon, href: SOCIALS.facebook, label: "Facebook" },
              ].map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition-all duration-300 hover:border-primary/50 hover:text-primary hover:shadow-glow"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
            <div>
              <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-foreground">
                Programs
              </h3>
              <ul className="mt-4 space-y-3">
                {PRODUCT_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-foreground">
                Company
              </h3>
              <ul className="mt-4 space-y-3">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-foreground">
                Contact
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 text-primary" />
                  Downtown Fitness District
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-primary" />
                  {SUPPORT_PHONE}
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-primary" />
                  {SUPPORT_EMAIL}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex gap-6">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
