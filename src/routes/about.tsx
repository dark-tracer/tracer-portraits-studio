import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import about from "@/assets/about.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — By Tracer" },
      { name: "description", content: "Meet Tracer, a portrait and wedding photographer making quiet, honest images." },
      { property: "og:title", content: "About — By Tracer" },
      { property: "og:description", content: "Meet Tracer — portrait and wedding photographer." },
      { property: "og:image", content: about },
      { name: "twitter:image", content: about },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="pt-40 md:pt-48 pb-24 px-6 md:px-12">
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-start">
          <Reveal className="md:col-span-5 md:sticky md:top-32">
            <div className="image-hover">
              <img
                src={about}
                alt="Portrait of Tracer with camera"
                loading="lazy"
                width={1024}
                height={1280}
                className="w-full aspect-[4/5] object-cover"
              />
            </div>
            <p className="mt-4 text-[11px] uppercase tracking-widest-xl text-muted-foreground">
              Tracer — Founder & Photographer
            </p>
          </Reveal>

          <div className="md:col-span-7 md:pt-12">
            <Reveal>
              <p className="text-[11px] uppercase tracking-widest-xl text-[var(--gold)] mb-4">
                About the Studio
              </p>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.05]">
                I make pictures the way I'd want to be remembered.
              </h1>
            </Reveal>

            <div className="mt-12 space-y-6 text-base md:text-lg leading-relaxed text-foreground/85 max-w-xl font-light">
              <Reveal delay={150}>
                <p>
                  I'm Tracer — a portrait and wedding photographer based between studios and
                  the open road. My work began with film, with the patience it requires, and
                  with the belief that a single honest frame outlives a hundred polished ones.
                </p>
              </Reveal>
              <Reveal delay={250}>
                <p>
                  For nearly a decade I've photographed people in the most ordinary and the
                  most consequential days of their lives — quiet portraits in slow afternoon
                  light, weddings that felt more like family dinners than productions, events
                  measured not by their scale but by the care given to each face inside them.
                </p>
              </Reveal>
              <Reveal delay={350}>
                <p>
                  My approach is calm, observational, and deeply collaborative. We'll talk
                  long before the camera comes out. The pictures will follow.
                </p>
              </Reveal>
            </div>

            <Reveal delay={500}>
              <div className="mt-16 grid grid-cols-2 gap-8 max-w-md border-t border-border pt-10">
                <div>
                  <p className="font-serif text-4xl text-foreground">200+</p>
                  <p className="mt-1 text-[11px] uppercase tracking-widest-xl text-muted-foreground">
                    Weddings Captured
                  </p>
                </div>
                <div>
                  <p className="font-serif text-4xl text-foreground">9 yrs</p>
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
    </>
  );
}
