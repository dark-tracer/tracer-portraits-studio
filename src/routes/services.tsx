import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Investment — Traced in Light" },
      {
        name: "description",
        content: "Portrait sessions, wedding coverage, and event photography by Traced in Light. Inquire for pricing.",
      },
      { property: "og:title", content: "Services & Investment — Traced in Light" },
      {
        property: "og:description",
        content: "Portrait, wedding, and event photography. Inquire for pricing.",
      },
    ],
  }),
  component: ServicesPage,
});

const packages = [
  {
    n: "01",
    title: "Portrait Session",
    starting: "Starting from $650",
    desc: "An intimate, two-hour session for individuals, couples, or families. Includes pre-session consult, location scouting, and a curated gallery of 40+ refined frames.",
    includes: ["2-hour session", "1 location", "40+ edited images", "Online gallery"],
  },
  {
    n: "02",
    title: "Wedding Coverage",
    starting: "Inquire for pricing",
    desc: "Full-day documentary coverage for couples who value presence over performance. From the quiet morning to the last dance — captured in full editorial detail.",
    includes: ["8–10 hr coverage", "Second photographer", "500+ images", "Heirloom album option"],
    featured: true,
  },
  {
    n: "03",
    title: "Events & Brand",
    starting: "Starting from $1,200",
    desc: "Editorial event and brand photography for studios, launches, and celebrations. Designed to give your moment the same quiet weight as a portrait.",
    includes: ["Half or full day", "Editorial direction", "150+ images", "Commercial license"],
  },
];

function ServicesPage() {
  return (
    <>
      <section className="pt-40 md:pt-48 pb-16 px-6 md:px-12">
        <div className="mx-auto max-w-[1600px]">
          <Reveal>
            <p className="text-[11px] uppercase tracking-widest-xl text-[var(--gold)] mb-4">
              Services & Investment
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-foreground max-w-4xl leading-[1.05]">
              A few ways we can work together.
            </h1>
            <p className="mt-8 max-w-xl text-muted-foreground leading-relaxed">
              Every session is shaped to its subject. The collections below are starting
              points — your day, your story, your details inform the rest.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-32">
        <div className="mx-auto max-w-[1600px] grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
          {packages.map((p, i) => (
            <Reveal key={p.n} delay={i * 120} className="bg-background">
              <article
                className={`h-full p-10 md:p-12 flex flex-col ${
                  p.featured ? "md:bg-foreground md:text-background" : ""
                }`}
              >
                <p
                  className={`font-serif text-2xl ${
                    p.featured ? "md:text-background/60" : "text-muted-foreground"
                  }`}
                >
                  {p.n}
                </p>
                <h2 className="mt-12 font-serif text-3xl md:text-4xl">{p.title}</h2>
                <p
                  className={`mt-3 text-[11px] uppercase tracking-widest-xl ${
                    p.featured ? "md:text-[var(--gold)]" : "text-[var(--gold)]"
                  }`}
                >
                  {p.starting}
                </p>
                <p
                  className={`mt-6 text-sm leading-relaxed font-light ${
                    p.featured ? "md:text-background/80" : "text-foreground/80"
                  }`}
                >
                  {p.desc}
                </p>

                <ul
                  className={`mt-10 space-y-3 text-sm border-t pt-8 ${
                    p.featured ? "md:border-background/20" : "border-border"
                  }`}
                >
                  {p.includes.map((inc) => (
                    <li key={inc} className="flex items-start gap-3">
                      <span
                        className={`mt-2 h-px w-3 flex-none ${
                          p.featured ? "md:bg-background/60" : "bg-foreground/40"
                        }`}
                      />
                      <span className="font-light">{inc}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  className={`mt-12 inline-flex items-center justify-center w-full border px-8 py-4 text-[11px] uppercase tracking-widest-xl transition-colors ${
                    p.featured
                      ? "md:border-background md:text-background md:hover:bg-background md:hover:text-foreground border-foreground text-foreground hover:bg-foreground hover:text-background"
                      : "border-foreground text-foreground hover:bg-foreground hover:text-background"
                  }`}
                >
                  Book Now
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 md:px-12 py-32 md:py-48 border-t border-border">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="text-center text-[11px] uppercase tracking-widest-xl text-[var(--gold)] mb-16">
              Kind Words
            </p>
          </Reveal>

          <div className="space-y-24 md:space-y-32">
            {[
              {
                q: "Tracer made us forget the camera was there. What came back felt less like a wedding album and more like a memory we could hold.",
                who: "— Elena & Marcus, Wedding 2024",
              },
              {
                q: "She has a way of seeing people. The portraits she made of my mother are the only photographs of her I'll ever need.",
                who: "— Naomi K., Portrait Session",
              },
              {
                q: "Calm, precise, completely trustworthy. The kind of artist you book once and recommend forever.",
                who: "— Atelier Norte, Brand Event",
              },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 100}>
                <figure className="text-center max-w-3xl mx-auto">
                  <blockquote className="font-serif italic text-2xl md:text-4xl leading-snug text-foreground font-light">
                    "{t.q}"
                  </blockquote>
                  <figcaption className="mt-8 text-[11px] uppercase tracking-widest-xl text-muted-foreground">
                    {t.who}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
