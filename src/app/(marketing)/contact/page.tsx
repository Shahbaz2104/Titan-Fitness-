"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Mail, MapPin, Phone, Send, Clock } from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GsapReveal } from "@/components/ui/gsap-reveal";
import { SUPPORT_EMAIL, SUPPORT_PHONE } from "@/lib/constants";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send");
      toast.success("Message sent!", {
        description: "Our team will get back to you within 24 hours.",
      });
      reset();
    } catch {
      toast.error("Something went wrong", {
        description: "Please try again in a moment.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        badge="Contact"
        title="Let's Start"
        highlight="The Conversation"
        description="Questions about membership, training, or AI coaching? We're here 7 days a week."
      />

      <section className="pb-24">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
          <GsapReveal className="lg:col-span-2">
            <div className="space-y-4">
              {[
                {
                  icon: MapPin,
                  title: "Visit us",
                  lines: ["Titan Fitness HQ", "128 Powerhouse Street, Downtown District"],
                },
                {
                  icon: Phone,
                  title: "Call us",
                  lines: [SUPPORT_PHONE, "Mon–Sat, 6am – 11pm"],
                },
                {
                  icon: Mail,
                  title: "Email us",
                  lines: [SUPPORT_EMAIL, "Replies within 24 hours"],
                },
                {
                  icon: Clock,
                  title: "Open hours",
                  lines: ["Mon–Fri: 5am – 12am", "Sat–Sun: 7am – 10pm"],
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="border-border bg-surface/60 flex items-start gap-4 rounded-xl border p-6"
                >
                  <span className="bg-primary/15 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
                    <item.icon className="text-primary h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-foreground text-sm font-semibold">{item.title}</h3>
                    {item.lines.map((line) => (
                      <p key={line} className="text-muted-foreground mt-1 text-sm">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </GsapReveal>

          <GsapReveal delay={0.1} className="lg:col-span-3">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="border-border bg-surface/60 rounded-2xl border p-8"
            >
              <h2 className="text-foreground text-xl font-bold tracking-[-0.01em]">
                Send a message
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                We typically respond within 24 hours.
              </p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    {...register("name")}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && <p className="text-primary text-xs">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...register("email")}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <p className="text-primary text-xs">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input id="phone" placeholder="+1 555 000 0000" {...register("phone")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Membership question"
                    {...register("subject")}
                    aria-invalid={!!errors.subject}
                  />
                  {errors.subject && (
                    <p className="text-primary text-xs">{errors.subject.message}</p>
                  )}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us how we can help…"
                    rows={6}
                    {...register("message")}
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && (
                    <p className="text-primary text-xs">{errors.message.message}</p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="mt-8 w-full sm:w-auto"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send message
                  </>
                )}
              </Button>
            </form>
          </GsapReveal>
        </div>
      </section>
    </>
  );
}
