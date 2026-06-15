import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { getAbout, type AboutContent } from "@/lib/portfolio-db.functions";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Traced in Light" },
      { name: "description", content: "Meet the photographer behind Traced in Light." },
      { property: "og:title", content: "About — Traced in Light" },
      { property: "og:description", content: "Meet the photographer behind Traced in Light." },
    ],
  }),
  loader: () => getAbout(),
  errorComponent: () => (
    <div className="min-h-screen flex items-center justify-center pt-32 px-6">
      <p>Couldn't load the about page.</p>
    </div>
  ),
  notFoundComponent: () => null,
  component: AboutPage,
});

function AboutPage() {
  const about = Route.useLoaderData() as AboutContent | null;
  const headline =
    about?.headline ?? "I make pictures the way I'd want to be remembered.";
  const body = about?.body ?? "";
  const weddings = about?.weddings_captured ?? "200+";
  const years = about?.years_behind_lens ?? "9 yrs";
  const image = about?.image_url ?? null;

  const paragraphs = body.split(/\n\s*\n/).filter(Boolean);

  return (
    <section className="pt-40 md:pt-48 pb-24 px-6 md:px-12">
      <div className="mx-auto max-w-[1400px] grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-start">
        <Reveal className="md:col-span-5 md:sticky md:top-32">
          <div className="image-hover bg-muted aspect-[4/5] overflow-hidden">
            {image ? (
              <img
                src={image}
                alt="Portrait of the photographer"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs uppercase tracking-widest-xl">
                Photo coming soon
              </div>
            )}
          </div>
          <p className="mt-4 text-[11px] uppercase tracking-widest-xl text-muted-foreground">
            Founder & Photographer
          </p>
        </Reveal>

        <div className="md:col-span-7 md:pt-12">
          <Reveal>
            <p className="text-[11px] uppercase tracking-widest-xl text-[var(--gold)] mb-4">
              About the Studio
            </p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.05]">
              {headline}
            </h1>
          </Reveal>

          <div className="mt-12 space-y-6 text-base md:text-lg leading-relaxed text-foreground/85 max-w-xl font-light">
            {paragraphs.map((p, i) => (
              <Reveal key={i} delay={150 + i * 100}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={500}>
            <div className="mt-16 grid grid-cols-2 gap-8 max-w-md border-t border-border pt-10">
              <div>
                <p className="font-serif text-4xl text-foreground">{weddings}</p>
                <p className="mt-1 text-[11px] uppercase tracking-widest-xl text-muted-foreground">
                  Weddings Captured
                </p>
              </div>
              <div>
                <p className="font-serif text-4xl text-foreground">{years}</p>
                <p className="mt-1 text-[11px] uppercase tracking-widest-xl text-muted-foreground">
                  Behind the Lens
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={650}>
            <Link
              to="/contact"
              className="mt-16 inline-flex items-center gap-3 bg-primary text-primary-foreground px-10 py-4 text-[11px] uppercase tracking-widest-xl hover:opacity-90 transition-opacity"
            >
              Work With Me
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
