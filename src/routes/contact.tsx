import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Reveal } from "@/components/Reveal";
import { Instagram, Mail, MapPin, Check, ArrowUpRight } from "lucide-react";
import { listHero } from "@/lib/portfolio-db.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Traced in Light" },
      {
        name: "description",
        content:
          "Begin an inquiry with Traced in Light for portrait, wedding, or event photography in Accra, Ghana.",
      },
      { property: "og:title", content: "Contact — Traced in Light" },
      {
        property: "og:description",
        content: "Begin an inquiry for portrait, wedding, or event photography in Accra, Ghana.",
      },
      { property: "og:url", content: "https://tracer-portraits-studio.lovable.app/contact" },
    ],
    links: [{ rel: "canonical", href: "https://tracer-portraits-studio.lovable.app/contact" }],
  }),
  loader: () => listHero(),
  errorComponent: () => (
    <div className="min-h-screen flex items-center justify-center pt-32 px-6">
      <p>Couldn&apos;t load the contact page.</p>
    </div>
  ),
  notFoundComponent: () => null,
  component: ContactPage,
});

const inputClass =
  "w-full border-0 border-b border-border bg-transparent py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors";

function ContactPage() {
  const hero = Route.useLoaderData() as Array<{ id: string; url: string; alt: string }>;
  const cover = hero[0]?.url ?? null;
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <>
      <section className="px-5 md:px-10 pt-32 md:pt-40 pb-4">
        <div className="mx-auto max-w-[1600px]">
          <Reveal>
            <p className="eyebrow mb-5">Contact</p>
            <h1 className="display-xl text-[12vw] leading-[0.9] md:text-[7vw]">
              Get in Touch With Me
            </h1>
          </Reveal>

          <Reveal delay={150}>
            <div className="mt-10 image-hover bg-card">
              {cover ? (
                <img
                  src={cover}
                  alt="Traced in Light at work"
                  className="w-full h-[38vh] md:h-[52vh] object-cover"
                />
              ) : (
                <div className="w-full h-[38vh] md:h-[52vh]" />
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-5 md:px-10 py-16 md:py-24">
        <div className="mx-auto max-w-[1600px] grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20">
          <div className="md:col-span-5">
            <Reveal>
              <h2 className="display-xl text-2xl md:text-4xl leading-tight">
                Let&apos;s plan something honest together.
              </h2>
              <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-muted-foreground">
                Tell me a little about what you&apos;re planning. I respond personally to every
                message — usually within two business days.
              </p>
            </Reveal>

            <Reveal delay={180}>
              <div className="mt-12 space-y-5 text-sm">
                <a
                  href="https://www.instagram.com/trac.erphotography?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 text-foreground hover:text-primary transition-colors"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border">
                    <Instagram className="h-4 w-4" />
                  </span>
                  @trac.erphotography
                </a>
                <a
                  href="mailto:bernieamponsah2@gmail.com"
                  className="flex items-center gap-4 text-foreground hover:text-primary transition-colors"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border">
                    <Mail className="h-4 w-4" />
                  </span>
                  bernieamponsah2@gmail.com
                </a>
                <p className="flex items-center gap-4 text-muted-foreground">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border">
                    <MapPin className="h-4 w-4" />
                  </span>
                  Accra, Ghana
                </p>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-7">
            {sent ? (
              <div className="surface-card flex flex-col items-start gap-4 p-10">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-5 w-5" />
                </span>
                <h3 className="display-xl text-2xl">Message received</h3>
                <p className="text-sm text-muted-foreground">
                  Thank you — I&apos;ll be in touch shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} suppressHydrationWarning className="grid gap-8">
                <div className="grid gap-8 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="eyebrow">
                      Your name
                    </label>
                    <input id="name" name="name" required className={inputClass} placeholder="Full name" />
                  </div>
                  <div>
                    <label htmlFor="email" className="eyebrow">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className={inputClass}
                      placeholder="you@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="eyebrow">
                    What are you planning?
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    className={inputClass}
                    placeholder="Portrait session, wedding, event…"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="eyebrow">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className={`${inputClass} resize-none`}
                    placeholder="Tell me about the day, the place, the people."
                  />
                </div>
                <button type="submit" className="btn-pill btn-gold w-fit">
                  Send Message <ArrowUpRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
