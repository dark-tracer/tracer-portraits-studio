import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { useCopy } from "@/hooks/use-copy";
import { FAQ } from "@/components/FAQ";
import { Testimonials } from "@/components/Testimonials";
import { ArrowUpRight } from "lucide-react";
import {
  listServicePackages,
  listTestimonials,
  listFaqs,
  type ServicePackageRow,
  type TestimonialRow,
  type FaqRow,
} from "@/lib/portfolio-db.functions";

const SITE = "https://tracer-portraits-studio.lovable.app";

const CATEGORY_ORDER = [
  "Portrait Photography",
  "Graduation Photography",
  "Weddings & Events",
] as const;

const CATEGORY_BLURB: Record<string, string> = {
  "Portrait Photography": "Quiet, considered sessions built around who you are.",
  "Graduation Photography": "Marking the milestone with images worth framing.",
  "Weddings & Events": "Full-day storytelling, from first look to last dance.",
};

const TERMS = [
  "50% deposit required to secure your date — non-refundable",
  "Balance due 48 hours before the shoot",
  "Travel outside Accra: additional fee based on distance, quote on request",
  "Rush delivery faster than standard turnaround: GHS 200 surcharge",
  "Additional edited images beyond package limit: GHS 15 per image",
];

const cedis = (n: number) =>
  `GHS ${Number(n).toLocaleString("en-GH", { maximumFractionDigits: 0 })}`;

export const Route = createFileRoute("/services")({
  head: ({ loaderData }) => ({
    meta: [
      { title: "Services & Investment — Traced in Light" },
      {
        name: "description",
        content:
          "Portrait, graduation, and wedding photography packages in Accra, Ghana. Transparent GHS pricing from Traced in Light.",
      },
      { property: "og:title", content: "Services & Investment — Traced in Light" },
      {
        property: "og:description",
        content:
          "Portrait, graduation, and wedding & event collections — shaped around your day and your story.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
      ...(loaderData?.servicePackages?.length
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify(
                loaderData.servicePackages.map((p: ServicePackageRow) => ({
                  "@context": "https://schema.org",
                  "@type": "Service",
                  name: `${p.category} — ${p.package_name}`,
                  description: `${p.duration}, ${p.edited_images}`,
                  areaServed: "Ghana",
                  offers: {
                    "@type": "Offer",
                    price: p.price_ghs,
                    priceCurrency: "GHS",
                  },
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
    const [servicePackages, testimonials, faqs] = await Promise.all([
      listServicePackages(),
      listTestimonials(),
      listFaqs(),
    ]);
    return { servicePackages, testimonials, faqs };
  },
  errorComponent: () => (
    <div className="min-h-screen flex items-center justify-center pt-32 px-6">
      <p>Couldn&apos;t load services.</p>
    </div>
  ),
  notFoundComponent: () => null,
  component: ServicesPage,
});

function inclusions(p: ServicePackageRow) {
  return [
    p.duration,
    p.edited_images,
    ...(p.extras ?? []),
    `Delivered in ${p.delivery_days} days`,
  ].filter(Boolean);
}

function PackageCard({
  pkg,
  popular,
  cta,
}: {
  pkg: ServicePackageRow;
  popular: boolean;
  cta: string;
}) {
  return (
    <div
      className={`relative flex h-full flex-col rounded-[var(--radius)] border p-7 md:p-8 ${
        popular ? "border-primary bg-primary/5" : "border-border bg-card"
      }`}
    >
      {popular && (
        <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-[10px] uppercase tracking-widest-xl text-primary-foreground">
          Most Popular
        </span>
      )}
      <h3 className="text-lg uppercase tracking-widest-xl">{pkg.package_name}</h3>
      <p className="mt-4 text-4xl md:text-5xl font-semibold">{cedis(pkg.price_ghs)}</p>
      <div className="my-6 h-px w-full bg-border" />
      <ul className="flex-1 space-y-3 text-sm font-light leading-relaxed text-muted-foreground">
        {inclusions(pkg).map((line) => (
          <li key={line} className="flex gap-3">
            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--gold)]" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
      <Link to="/contact" className="btn-pill btn-gold mt-8 w-fit">
        {cta} <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function CategorySection({
  category,
  items,
  cta,
}: {
  category: string;
  items: ServicePackageRow[];
  cta: string;
}) {
  if (!items.length) return null;
  const middle = Math.floor(items.length / 2);
  return (
    <section className="px-5 md:px-10 py-12 md:py-16">
      <div className="mx-auto max-w-[1600px]">
        <Reveal>
          <h2 className="display-xl text-3xl md:text-5xl uppercase">{category}</h2>
          <p className="mt-3 text-sm font-light text-muted-foreground">
            {CATEGORY_BLURB[category] ?? ""}
          </p>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((p, i) => (
            <Reveal key={p.id} delay={i * 80} className="h-full">
              <PackageCard pkg={p} popular={items.length === 3 && i === middle} cta={cta} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function GoodToKnow() {
  return (
    <section className="px-5 md:px-10 py-12 md:py-16">
      <div className="mx-auto max-w-[1600px]">
        <Reveal>
          <div className="rounded-[var(--radius)] border border-border bg-card p-8 md:p-12">
            <h2 className="display-xl text-2xl md:text-3xl uppercase">Good to Know</h2>
            <ul className="mt-6 grid gap-4 text-sm font-light leading-relaxed text-muted-foreground md:grid-cols-2">
              {TERMS.map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--gold)]" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ServicesPage() {
  const t = useCopy();
  const { servicePackages, testimonials, faqs } = Route.useLoaderData() as {
    servicePackages: ServicePackageRow[];
    testimonials: TestimonialRow[];
    faqs: FaqRow[];
  };

  const categories = [
    ...CATEGORY_ORDER.filter((c) => servicePackages.some((p) => p.category === c)),
    ...Array.from(new Set(servicePackages.map((p) => p.category))).filter(
      (c) => !CATEGORY_ORDER.includes(c as (typeof CATEGORY_ORDER)[number]),
    ),
  ];

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

      {categories.map((c) => (
        <CategorySection
          key={c}
          category={c}
          items={servicePackages
            .filter((p) => p.category === c)
            .sort((a, b) => a.display_order - b.display_order)}
          cta={t("services.book.cta")}
        />
      ))}

      {servicePackages.length === 0 && (
        <p className="py-24 text-center text-muted-foreground">{t("services.empty")}</p>
      )}

      <GoodToKnow />
      <Testimonials items={testimonials} />
      <FAQ items={faqs} />
    </>
  );
}
