import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { ArrowRight } from "lucide-react";
import { listHero, listRecentPhotos } from "@/lib/portfolio-db.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Traced in Light — Portrait & Wedding Photography" },
      {
        name: "description",
        content:
          "Editorial portrait and wedding photography by Traced in Light. Quiet, intentional images that endure.",
      },
    ],
  }),
  loader: async () => {
    const [hero, recent] = await Promise.all([listHero(), listRecentPhotos()]);
    return { hero, recent };
  },
  component: Index,
});

function HeroCarousel({ images }: { images: { id: string; url: string; alt: string }[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (images.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % images.length), 5500);
    return () => clearInterval(t);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/90 via-foreground/70 to-foreground/40" />
    );
  }
  return (
    <div className="absolute inset-0 bg-foreground">
      {images.map((img, idx) => (
        <img
          key={img.id}
          src={img.url}
          alt={img.alt}
          className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-[1800ms] ${
            idx === i ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-1 transition-all ${
                idx === i ? "w-8 bg-background" : "w-4 bg-background/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Index() {
  const { hero, recent } = Route.useLoaderData() as {
    hero: Array<{ id: string; url: string; alt: string }>;
    recent: Array<{ id: string; url: string; alt: string }>;
  };

  return (
    <>
      {/* HERO CAROUSEL */}
      <section className="relative h-screen w-full overflow-hidden">
        <HeroCarousel images={hero} />
        <div className="absolute inset-0 bg-foreground/25" />
        <div className="relative z-10 h-full w-full flex flex-col items-center justify-center text-center px-6">
          <Reveal delay={200}>
            <p className="text-[11px] uppercase tracking-widest-xl text-background/80 mb-6">
              Studio est. 2018
            </p>
          </Reveal>
          <Reveal delay={400}>
            <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-background font-light leading-none">
              Traced in Light
            </h1>
          </Reveal>
          <Reveal delay={700}>
            <p className="mt-6 text-sm md:text-base text-background/85 font-light tracking-wide">
              Portrait & Wedding Photography
            </p>
          </Reveal>
          <Reveal delay={1000}>
            <Link
              to="/portfolio"
              className="mt-12 inline-flex items-center gap-3 border border-background/60 px-8 py-4 text-[11px] uppercase tracking-widest-xl text-background hover:bg-background hover:text-foreground transition-all duration-500"
            >
              View Work <ArrowRight className="h-3 w-3" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* INTRO STATEMENT */}
      <section className="py-32 md:py-48 px-6 md:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <p className="text-[11px] uppercase tracking-widest-xl text-[var(--gold)] mb-8">
              — A Note from the Studio
            </p>
          </Reveal>
          <Reveal delay={150}>
            <p className="font-serif text-3xl md:text-5xl leading-tight text-foreground font-light">
              "Every photograph is a quiet record of a moment that will not return. I make pictures
              with intention — for those who want to remember the truth of things."
            </p>
          </Reveal>
          <Reveal delay={400}>
            <p className="mt-10 font-script text-3xl text-muted-foreground">Traced in Light</p>
          </Reveal>
        </div>
      </section>

      {/* RECENTLY ADDED */}
      {recent.length > 0 && (
        <section className="px-6 md:px-12 pb-24">
          <div className="mx-auto max-w-[1600px]">
            <Reveal>
              <div className="flex items-end justify-between mb-12 md:mb-20">
                <div>
                  <p className="text-[11px] uppercase tracking-widest-xl text-muted-foreground mb-3">
                    Selected Work
                  </p>
                  <h2 className="font-serif text-4xl md:text-6xl text-foreground">Recently added</h2>
                </div>
                <Link
                  to="/portfolio"
                  className="hidden md:inline-flex link-underline text-[11px] uppercase tracking-widest-xl text-foreground"
                >
                  Full portfolio
                </Link>
              </div>
            </Reveal>

            <div className="grid grid-cols-12 gap-4 md:gap-6">
              {recent.map((p, idx) => (
                <Reveal
                  key={p.id}
                  className={
                    idx === 0
                      ? "col-span-12 md:col-span-7"
                      : idx === 1
                        ? "col-span-12 md:col-span-5 md:mt-24"
                        : "col-span-12 md:col-span-6 md:col-start-4"
                  }
                  delay={idx * 150}
                >
                  <Link to="/portfolio" className="block image-hover">
                    <img
                      src={p.url}
                      alt={p.alt}
                      loading="lazy"
                      className="w-full aspect-[4/5] object-cover"
                    />
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-32 md:py-48 px-6 md:px-12 border-t border-border">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-[11px] uppercase tracking-widest-xl text-[var(--gold)] mb-6">
              Currently booking
            </p>
          </Reveal>
          <Reveal delay={150}>
            <h2 className="font-serif text-4xl md:text-6xl text-foreground">
              Let's make something honest together.
            </h2>
          </Reveal>
          <Reveal delay={300}>
            <Link
              to="/contact"
              className="mt-12 inline-flex items-center gap-3 bg-primary text-primary-foreground px-10 py-4 text-[11px] uppercase tracking-widest-xl hover:opacity-90 transition-opacity"
            >
              Begin an Inquiry <ArrowRight className="h-3 w-3" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
