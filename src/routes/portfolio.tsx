import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { Reveal } from "@/components/Reveal";
import { useCopy } from "@/hooks/use-copy";
import { FAQ } from "@/components/FAQ";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { listEvents, listFaqs, type FaqRow } from "@/lib/portfolio-db.functions";

const SITE = "https://tracer-portraits-studio.lovable.app";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Traced in Light" },
      {
        name: "description",
        content: "Portrait, wedding, and event galleries by Traced in Light, Accra, Ghana.",
      },
      { property: "og:title", content: "Portfolio — Traced in Light" },
      {
        property: "og:description",
        content:
          "Browse portrait, wedding, and event galleries — full stories from real sessions in Accra and beyond.",
      },
      { property: "og:url", content: `${SITE}/portfolio` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/portfolio` }],
  }),
  loader: async () => {
    const [events, faqs] = await Promise.all([listEvents(), listFaqs()]);
    return { events, faqs };
  },
  errorComponent: () => (
    <div className="min-h-screen flex items-center justify-center pt-32 px-6">
      <p>Couldn&apos;t load the portfolio.</p>
    </div>
  ),
  notFoundComponent: () => null,
  component: PortfolioPage,
});

type Ev = {
  id: string;
  name: string;
  category: string;
  date: string;
  cover_url: string | null;
  photo_count: number;
};

const SECTIONS: { key: string; label: string }[] = [
  { key: "portrait", label: "Portraits" },
  { key: "wedding", label: "Weddings" },
  { key: "event", label: "Events" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long" });
}

function CategoryRow({ label, events }: { label: string; events: Ev[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  if (!events.length) return null;

  const scrollBy = (dir: number) =>
    scroller.current?.scrollBy({ left: dir * 420, behavior: "smooth" });

  return (
    <section className="px-5 md:px-10 py-14 md:py-20">
      <div className="mx-auto max-w-[1600px]">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-6">
            <h2 className="display-xl text-3xl md:text-5xl">{label}</h2>
            <div className="flex items-center gap-3">
              <span className="eyebrow">
                {events.length} {events.length === 1 ? "collection" : "collections"}
              </span>
              <button
                onClick={() => scrollBy(-1)}
                aria-label={`Previous ${label}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-[var(--gold)] transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scrollBy(1)}
                aria-label={`Next ${label}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-[var(--gold)] transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Reveal>

        <div
          ref={scroller}
          className="mt-8 flex gap-5 overflow-x-auto scrollbar-none snap-x snap-mandatory"
        >
          {events.map((ev, i) => (
            <Reveal
              key={ev.id}
              delay={i * 90}
              className="snap-start shrink-0 w-[85%] sm:w-[48%] lg:w-[32%]"
            >
              <Link to="/portfolio/$eventId" params={{ eventId: ev.id }} className="group block">
                <div className="image-hover bg-card">
                  {ev.cover_url ? (
                    <img
                      src={ev.cover_url}
                      alt={ev.name}
                      loading="lazy"
                      className="w-full aspect-[4/5] object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-[4/5]" />
                  )}
                </div>
                <div className="mt-4 flex items-start justify-between gap-6">
                  <div>
                    <h3 className="display-xl text-lg md:text-xl">{ev.name}</h3>
                    <p className="mt-2 eyebrow">
                      {formatDate(ev.date)} · {ev.photo_count} photos
                    </p>
                  </div>
                  <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PortfolioPage() {
  const t = useCopy();
  const { events, faqs } = Route.useLoaderData() as { events: Ev[]; faqs: FaqRow[] };

  return (
    <>
      <section className="px-5 md:px-10 pt-32 md:pt-40 pb-4">
        <div className="mx-auto max-w-[1600px]">
          <Reveal>
            <p className="eyebrow mb-5">{t("portfolio.eyebrow")}</p>
            <h1 className="display-xl text-[12vw] leading-[0.9] md:text-[7vw]">
              {t("portfolio.title")}
            </h1>
            <p className="mt-8 max-w-xl text-base font-light leading-relaxed text-muted-foreground">
              {t("portfolio.intro")}
            </p>
          </Reveal>
        </div>
      </section>

      {events.length === 0 && (
        <p className="py-24 text-center text-muted-foreground">
          {t("portfolio.empty")}
        </p>
      )}

      {SECTIONS.map((s) => (
        <CategoryRow
          key={s.key}
          label={t(`portfolio.section.${s.key}`)}
          events={events.filter((e) => e.category === s.key)}
        />
      ))}

      <FAQ items={faqs} />
    </>
  );
}
