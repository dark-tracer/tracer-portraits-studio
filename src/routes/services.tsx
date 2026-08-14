import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { useCopy } from "@/hooks/use-copy";
import { FAQ } from "@/components/FAQ";
import { Testimonials } from "@/components/Testimonials";
import { ArrowUpRight } from "lucide-react";
import {
  listPackages,
  listTestimonials,
  listFaqs,
  type PackageRow,
  type TestimonialRow,
  type FaqRow,
} from "@/lib/portfolio-db.functions";

const SITE = "https://tracer-portraits-studio.lovable.app";

export const Route = createFileRoute("/services")({
  head: ({ loaderData }) => ({
    meta: [
      { title: "Services & Investment — Traced in Light" },
      {
        name: "description",
        content:
          "Portrait sessions, wedding coverage, and event photography by Traced in Light in Accra, Ghana. Inquire for pricing.",
      },
      { property: "og:title", content: "Services & Investment — Traced in Light" },
      {
        property: "og:description",
        content:
          "Portrait sessions, wedding coverage, and event photography collections — shaped around your day and your story.",
      },
      { property: "og:url", content: `${SITE}/services` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/services` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: (loaderData?.faqs ?? []).map((f: FaqRow) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }),
      },
      ...(loaderData?.packages?.length
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify(
                loaderData.packages.map((p: PackageRow) => ({
                  "@context": "https://schema.org",
                  "@type": "Service",
                  name: p.title,
                  description: p.description,
                  areaServed: "Ghana",
                  provider: {
                    "@type": "LocalBusiness",
                    name: "Traced in Light",
                    address: {
                      "@type": "PostalAddress",
                      addressLocality: "Accra",
                      addressCountry: "GH",
                    },
                  },
                })),
              ),
            },
          ]
        : []),
    ],
  }),
  loader: async () => {
    const [packages, testimonials, faqs] = await Promise.all([
      listPackages(),
      listTestimonials(),
      listFaqs(),
    ]);
    return { packages, testimonials, faqs };
  },
  errorComponent: () => (
    <div className="min-h-screen flex items-center justify-center pt-32 px-6">
      <p>Couldn&apos;t load services.</p>
    </div>
  ),
  notFoundComponent: () => null,
  component: ServicesPage,
});

function PackageList({ title, items }: { title: string; items: PackageRow[] }) {
  const t = useCopy();
  if (!items.length) return null;
  return (
    <section className="px-5 md:px-10 py-12 md:py-16">
      <div className="mx-auto max-w-[1600px]">
        <Reveal>
          <h2 className="display-xl text-3xl md:text-5xl border-b border-border pb-6">{title}</h2>
        </Reveal>
        <div className="mt-4">
          {items.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <article className="border-b border-border py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-1 eyebrow">{String(i + 1).padStart(2, "0")}</div>
                <div className="md:col-span-4">
                  <h3 className="display-xl text-xl md:text-2xl">{p.title}</h3>
                  {p.starting && <p className="mt-2 text-sm text-[var(--gold)]">{p.starting}</p>}
                </div>
                <div className="md:col-span-5">
                  <p className="text-sm font-light leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                  {p.includes.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {p.includes.map((inc) => (
                        <li
                          key={inc}
                          className="rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground"
                        >
                          {inc}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="md:col-span-2 md:text-right">
                  <Link to="/contact" className="btn-pill btn-gold">
                    {t("services.book.cta")} <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesPage() {
  const t = useCopy();
  const { packages, testimonials, faqs } = Route.useLoaderData() as {
    packages: PackageRow[];
    testimonials: TestimonialRow[];
    faqs: FaqRow[];
  };

  const isWedding = (p: PackageRow) =>
    /wed|event|engage|bridal/i.test(`${p.title} ${p.description}`);
  const weddings = packages.filter(isWedding);
  const portraits = packages.filter((p) => !isWedding(p));

  return (
    <>
      <section className="px-5 md:px-10 pt-32 md:pt-40 pb-4">
        <div className="mx-auto max-w-[1600px]">
          <Reveal>
            <p className="eyebrow mb-5">{t("services.eyebrow")}</p>
            <h1 className="display-xl text-[12vw] leading-[0.9] md:text-[7vw]">
              {t("services.title")}
            </h1>
            <p className="mt-8 max-w-xl text-base font-light leading-relaxed text-muted-foreground">
              {t("services.intro")}
            </p>
          </Reveal>
        </div>
      </section>

      <PackageList title={t("services.portraits.heading")} items={portraits} />
      <PackageList title={t("services.weddings.heading")} items={weddings} />

      {packages.length === 0 && (
        <p className="py-24 text-center text-muted-foreground">
          {t("services.empty")}
        </p>
      )}

      <Testimonials items={testimonials} />
      <FAQ items={faqs} />
    </>
  );
}
