import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { useCopy } from "@/hooks/use-copy";
import { Testimonials } from "@/components/Testimonials";
import { ArrowUpRight } from "lucide-react";
import {
  getAbout,
  listTestimonials,
  type AboutContent,
  type TestimonialRow,
} from "@/lib/portfolio-db.functions";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Traced in Light" },
      {
        name: "description",
        content:
          "Meet the photographer behind Traced in Light — an Accra-based studio shooting portraits, weddings, and events.",
      },
      { property: "og:title", content: "About — Traced in Light" },
      {
        property: "og:description",
        content:
          "Meet the photographer behind Traced in Light — an Accra-based studio shooting portraits, weddings, and events.",
      },
      { property: "og:url", content: "https://tracer-portraits-studio.lovable.app/about" },
    ],
    links: [{ rel: "canonical", href: "https://tracer-portraits-studio.lovable.app/about" }],
  }),
  loader: async () => {
    const [about, testimonials] = await Promise.all([getAbout(), listTestimonials()]);
    return { about, testimonials };
  },
  errorComponent: () => (
    <div className="min-h-screen flex items-center justify-center pt-32 px-6">
      <p>Couldn&apos;t load the about page.</p>
    </div>
  ),
  notFoundComponent: () => null,
  component: AboutPage,
});

function AboutPage() {
  const t = useCopy();
  const { about, testimonials } = Route.useLoaderData() as {
    about: AboutContent | null;
    testimonials: TestimonialRow[];
  };

  const headline = about?.headline ?? "I make pictures the way I'd want to be remembered.";
  const paragraphs = (about?.body ?? "").split(/\n\s*\n/).filter(Boolean);
  const image = about?.image_url ?? null;

  return (
    <>
      <section className="px-5 md:px-10 pt-32 md:pt-40 pb-6">
        <div className="mx-auto max-w-[1600px]">
          <Reveal>
            <p className="eyebrow mb-5">{t("about.eyebrow")}</p>
            <h1 className="display-xl text-[12vw] leading-[0.9] md:text-[7vw]">
              {t("about.title")}
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="px-5 md:px-10 py-14 md:py-20">
        <div className="mx-auto max-w-[1600px] grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">
          <Reveal className="md:col-span-5">
            <div className="image-hover bg-card aspect-[4/5]">
              {image ? (
                <img
                  src={image}
                  alt="Portrait of the photographer"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center eyebrow">
                  {t("about.image.empty")}
                </div>
              )}
            </div>
          </Reveal>

          <div className="md:col-span-7">
            <Reveal>
              <h2 className="display-xl text-2xl md:text-4xl leading-tight">{headline}</h2>
            </Reveal>
            <div className="mt-8 space-y-6 max-w-2xl text-base font-light leading-relaxed text-muted-foreground">
              {paragraphs.map((p, i) => (
                <Reveal key={i} delay={120 + i * 90}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={400}>
              <Link to="/contact" className="mt-12 btn-pill btn-gold">
                {t("about.cta")} <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <Testimonials items={testimonials} />
    </>
  );
}
