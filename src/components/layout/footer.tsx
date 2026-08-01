import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterXIcon,
  YoutubeIcon,
} from "@/components/shared/social-icons";
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
    <footer className="border-border bg-surface/30 relative border-t">
      <div className="via-primary/50 pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="text-muted-foreground mt-5 max-w-sm text-sm leading-relaxed">
              The AI-powered gym management platform. Personalized workouts, intelligent nutrition,
              and world-class training — all in one place.
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
                  className="border-border bg-surface text-muted-foreground hover:border-primary/50 hover:text-primary hover:shadow-glow flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
            <div>
              <h3 className="font-display text-foreground text-sm font-semibold tracking-widest uppercase">
                Programs
              </h3>
              <ul className="mt-4 space-y-3">
                {PRODUCT_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-foreground text-sm font-semibold tracking-widest uppercase">
                Company
              </h3>
              <ul className="mt-4 space-y-3">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-foreground text-sm font-semibold tracking-widest uppercase">
                Contact
              </h3>
              <ul className="text-muted-foreground mt-4 space-y-3 text-sm">
                <li className="flex items-center gap-2.5">
                  <MapPin className="text-primary h-4 w-4" />
                  Downtown Fitness District
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="text-primary h-4 w-4" />
                  {SUPPORT_PHONE}
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="text-primary h-4 w-4" />
                  {SUPPORT_EMAIL}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-border mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex gap-6">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-primary text-xs transition-colors"
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
