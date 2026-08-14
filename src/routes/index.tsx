import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { useCopy } from "@/hooks/use-copy";
import { Testimonials } from "@/components/Testimonials";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import {
  listHero,
  listRecentPhotos,
  listPackages,
  listTestimonials,
  type PackageRow,
  type TestimonialRow,
} from "@/lib/portfolio-db.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Traced in Light — Portrait & Wedding Photography" },
      {
        name: "description",
        content:
          "Editorial portrait and wedding photography by Traced in Light, based in Accra, Ghana. Quiet, intentional images that endure.",
      },
      { property: "og:title", content: "Traced in Light — Portrait & Wedding Photography" },
      {
        property: "og:description",
        content:
          "Editorial portrait and wedding photography by Traced in Light, based in Accra, Ghana.",
      },
      { property: "og:url", content: "https://tracer-portraits-studio.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://tracer-portraits-studio.lovable.app/" }],
  }),
  loader: async () => {
    const [hero, recent, packages, testimonials] = await Promise.all([
      listHero(),
      listRecentPhotos(),
      listPackages(),
      listTestimonials(),
    ]);
    return { hero, recent, packages, testimonials };
  },
  errorComponent: () => (
    <div className="min-h-screen flex items-center justify-center pt-32 px-6">
      <p>Couldn&apos;t load the homepage.</p>
    </div>
  ),
  notFoundComponent: () => null,
  component: Index,
});

type Img = { id: string; url: string; alt: string };

function Mosaic({ images }: { images: Img[] }) {
  const slots = [
    "col-span-6 md:col-span-3 aspect-[3/4]",
    "col-span-6 md:col-span-3 aspect-[3/4] md:mt-10",
    "col-span-12 md:col-span-3 aspect-[4/5]",
    "col-span-6 md:col-span-3 aspect-[3/4] md:mt-10",
    "col-span-6 md:col-span-3 aspect-square hidden md:block",
    "col-span-6 md:col-span-3 aspect-[3/4] hidden md:block",
  ];
  const picks = images.slice(0, 6);

  if (picks.length === 0) {
    return (
      <div className="grid grid-cols-12 gap-3 md:gap-5">
        {slots.slice(0, 3).map((s, i) => (
          <div key={i} className={`${s} rounded-[var(--radius)] bg-card`} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-3 md:gap-5">
      {picks.map((img, i) => (
        <Reveal key={img.id} delay={i * 90} className={slots[i % slots.length]}>
          <div className="image-hover h-full w-full">
            <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function Index() {
  const t = useCopy();
  const { hero, recent, packages, testimonials } = Route.useLoaderData() as {
    hero: Img[];
    recent: Array<Img & { event_name: string | null; category: string | null }>;
    packages: PackageRow[];
    testimonials: TestimonialRow[];
  };

  return (
    <>
      {/* HERO */}
      <section className="px-5 md:px-10 pt-32 md:pt-40 pb-6">
        <div className="mx-auto max-w-[1600px]">
          <Reveal>
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow mb-5">{t("home.hero.eyebrow")}</p>
                <h1 className="display-xl text-[15vw] leading-[0.88] md:text-[8vw]">
                  {t("home.hero.title")}
                </h1>
              </div>
              <Link to="/contact" className="btn-pill btn-gold self-start md:mb-4">
                {t("home.hero.cta")} <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-10 md:mt-14">
            <Mosaic images={hero.length ? hero : recent} />
          </div>
        </div>
      </section>

      {/* STATEMENT */}
      <section className="px-5 md:px-10 py-24 md:py-32">
        <div className="mx-auto max-w-[1600px] grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <p className="eyebrow">{t("home.about.eyebrow")}</p>
          </div>
          <div className="md:col-span-8">
            <h2 className="display-xl text-3xl md:text-5xl leading-tight">
              {t("home.about.heading")}
            </h2>
            <p className="mt-8 max-w-2xl text-base font-light leading-relaxed text-muted-foreground">
              {t("home.about.body")}
            </p>
            <Link
              to="/about"
              className="mt-10 inline-flex items-center gap-3 whitespace-nowrap text-[12px] uppercase tracking-widest-xl link-underline"
            >
              {t("home.about.link")} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      {packages.length > 0 && (
        <section className="px-5 md:px-10 pb-8">
          <div className="mx-auto max-w-[1600px]">
            <Reveal>
              <p className="eyebrow mb-4">{t("home.services.eyebrow")}</p>
              <h2 className="display-xl text-3xl md:text-5xl border-b border-border pb-8">
                {t("home.services.heading")}
              </h2>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
              {packages.slice(0, 3).map((p, i) => (
                <Reveal key={p.id} delay={i * 100}>
                  <article className="surface-card h-full p-8 flex flex-col">
                    <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="mt-8 display-xl text-2xl">{p.title}</h3>
                    {p.starting && <p className="mt-2 text-sm text-[var(--gold)]">{p.starting}</p>}
                    <p className="mt-4 text-sm font-light leading-relaxed text-muted-foreground">
                      {p.description}
                    </p>
                    <Link
                      to="/services"
                      className="mt-8 inline-flex w-fit items-center gap-2 text-[11px] uppercase tracking-widest-xl link-underline"
                    >
                      {t("home.services.link")} <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RECENT WORK */}
      {recent.length > 0 && (
        <section className="px-5 md:px-10 py-24 md:py-32">
          <div className="mx-auto max-w-[1600px]">
            <Reveal>
              <p className="eyebrow mb-4">{t("home.recent.eyebrow")}</p>
              <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
                <h2 className="display-xl text-3xl md:text-5xl">{t("home.recent.heading")}</h2>
                <Link to="/portfolio" className="btn-pill btn-outline-light">
                  {t("home.recent.cta")} <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recent.map((p, i) => (
                <Reveal key={p.id} delay={i * 110}>
                  <Link to="/portfolio" className="group block">
                    <div className="image-hover">
                      <img
                        src={p.url}
                        alt={p.alt}
                        loading="lazy"
                        className="w-full aspect-[4/5] object-cover"
                      />
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-4">
                      <span className="text-sm text-foreground truncate">{p.event_name}</span>
                      {p.category && (
                        <span className="eyebrow shrink-0 text-[var(--gold)]">{p.category}</span>
                      )}
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <Testimonials items={testimonials} />
    </>
  );
}
