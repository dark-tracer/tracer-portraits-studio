import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import {
  listPackages,
  listTestimonials,
  type PackageRow,
  type TestimonialRow,
} from "@/lib/portfolio-db.functions";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Investment — Traced in Light" },
      {
        name: "description",
        content:
          "Portrait sessions, wedding coverage, and event photography by Traced in Light. Inquire for pricing.",
      },
    ],
  }),
  loader: async () => {
    const [packages, testimonials] = await Promise.all([listPackages(), listTestimonials()]);
    return { packages, testimonials };
  },
  errorComponent: () => (
    <div className="min-h-screen flex items-center justify-center pt-32 px-6">
      <p>Couldn't load services.</p>
    </div>
  ),
  notFoundComponent: () => null,
  component: ServicesPage,
});

function ServicesPage() {
  const { packages, testimonials } = Route.useLoaderData() as {
    packages: PackageRow[];
    testimonials: TestimonialRow[];
  };

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
            <Reveal key={p.id} delay={i * 120} className="bg-background">
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
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-12 font-serif text-3xl md:text-4xl">{p.title}</h2>
                {p.starting && (
                  <p className="mt-3 text-[11px] uppercase tracking-widest-xl text-[var(--gold)]">
                    {p.starting}
                  </p>
                )}
                <p
                  className={`mt-6 text-sm leading-relaxed font-light ${
                    p.featured ? "md:text-background/80" : "text-foreground/80"
                  }`}
                >
                  {p.description}
                </p>

                {p.includes.length > 0 && (
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
                )}

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
          {packages.length === 0 && (
            <p className="bg-background p-12 text-muted-foreground col-span-3 text-center">
              Packages will appear here once added.
            </p>
          )}
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="px-6 md:px-12 py-32 md:py-48 border-t border-border">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <p className="text-center text-[11px] uppercase tracking-widest-xl text-[var(--gold)] mb-16">
                Kind Words
              </p>
            </Reveal>
            <div className="space-y-24 md:space-y-32">
              {testimonials.map((t, i) => (
                <Reveal key={t.id} delay={i * 100}>
                  <figure className="text-center max-w-3xl mx-auto">
                    <blockquote className="font-serif italic text-2xl md:text-4xl leading-snug text-foreground font-light">
                      "{t.quote}"
                    </blockquote>
                    {t.attribution && (
                      <figcaption className="mt-8 text-[11px] uppercase tracking-widest-xl text-muted-foreground">
                        {t.attribution}
                      </figcaption>
                    )}
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
