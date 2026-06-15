import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { Lightbox } from "@/components/Lightbox";
import { listEvents, listRecentPhotos } from "@/lib/portfolio-db.functions";

type Tab = "all" | "portrait" | "wedding" | "event";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Traced in Light" },
      {
        name: "description",
        content: "Portrait, wedding, and event galleries by Traced in Light.",
      },
    ],
  }),
  loader: async () => {
    const [events, recent] = await Promise.all([listEvents(), listRecentPhotos()]);
    return { events, recent };
  },
  component: PortfolioPage,
});

const categoryLabel: Record<string, string> = {
  portrait: "Portrait",
  wedding: "Wedding",
  event: "Event",
};

const SPANS = [
  { span: "md:col-span-7", ratio: "aspect-[4/5]" },
  { span: "md:col-span-5 md:mt-16", ratio: "aspect-[4/5]" },
  { span: "md:col-span-5", ratio: "aspect-[3/4]" },
  { span: "md:col-span-7 md:mt-12", ratio: "aspect-[4/3]" },
  { span: "md:col-span-6", ratio: "aspect-square" },
  { span: "md:col-span-6 md:mt-12", ratio: "aspect-[4/5]" },
];

function matchesTab(cat: string, tab: Tab) {
  if (tab === "all") return true;
  return cat === tab;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function PortfolioPage() {
  const { events, recent } = Route.useLoaderData() as {
    events: Array<{ id: string; name: string; category: string; date: string; cover_url: string | null; photo_count: number }>;
    recent: Array<{ id: string; url: string; alt: string; event_name: string | null; category: string | null }>;
  };
  const [tab, setTab] = useState<Tab>("all");
  const [lbIdx, setLbIdx] = useState<number | null>(null);

  const filtered = useMemo(() => events.filter((e) => matchesTab(e.category, tab)), [events, tab]);
  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "All Work" },
    { key: "portrait", label: "Portraits" },
    { key: "wedding-event", label: "Weddings & Events" },
  ];
  const lbImages = recent.map((p) => ({ src: p.url, alt: p.event_name ?? "" }));

  return (
    <>
      <section className="pt-40 md:pt-48 pb-12 px-6 md:px-12">
        <div className="mx-auto max-w-[1600px]">
          <Reveal>
            <p className="text-[11px] uppercase tracking-widest-xl text-[var(--gold)] mb-4">
              The Archive
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-foreground leading-[1.05]">
              Portfolio
            </h1>
            <p className="mt-8 max-w-xl text-muted-foreground leading-relaxed">
              A small, considered selection. Each frame chosen for the truth it carries — not the
              polish it performs.
            </p>
          </Reveal>

          <Reveal delay={150}>
            <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-8">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`text-[11px] uppercase tracking-widest-xl transition-colors ${
                    tab === t.key
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                  {tab === t.key && (
                    <span className="ml-2 inline-block h-px w-6 align-middle bg-[var(--gold)]" />
                  )}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {recent.length > 0 && (
        <section className="px-6 md:px-12 pb-20">
          <div className="mx-auto max-w-[1600px]">
            <Reveal>
              <div className="flex items-baseline justify-between mb-6">
                <h2 className="text-[11px] uppercase tracking-widest-xl text-foreground">
                  Recently Added
                </h2>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="-mx-6 md:-mx-12 px-6 md:px-12 overflow-x-auto scrollbar-none">
                <div className="flex gap-4 md:gap-6 pb-2">
                  {recent.map((p, i) => (
                    <button
                      key={p.id}
                      onClick={() => setLbIdx(i)}
                      className="group relative shrink-0 image-hover text-left"
                      style={{ width: "clamp(220px, 28vw, 340px)" }}
                    >
                      <img
                        src={p.url}
                        alt={p.alt}
                        loading="lazy"
                        className="w-full aspect-[4/5] object-cover"
                      />
                      <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-widest-xl text-muted-foreground">
                        <span className="truncate pr-3">{p.event_name}</span>
                        {p.category && (
                          <span className="text-[var(--gold)] shrink-0">
                            {categoryLabel[p.category]}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <section className="px-6 md:px-12 pb-32">
        <div className="mx-auto max-w-[1600px]">
          <Reveal>
            <div className="flex items-baseline justify-between mb-8 border-t border-border pt-8">
              <h2 className="text-[11px] uppercase tracking-widest-xl text-foreground">
                Events & Sessions
              </h2>
              <span className="text-[11px] uppercase tracking-widest-xl text-muted-foreground">
                {filtered.length} {filtered.length === 1 ? "collection" : "collections"}
              </span>
            </div>
          </Reveal>

          {filtered.length === 0 ? (
            <p className="text-muted-foreground py-20 text-center">
              No events to show yet — check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-12 gap-4 md:gap-8">
              {filtered.map((ev, i) => {
                const layout = SPANS[i % SPANS.length];
                return (
                  <Reveal
                    key={ev.id}
                    className={`col-span-12 ${layout.span}`}
                    delay={(i % 3) * 120}
                  >
                    <Link
                      to="/portfolio/$eventId"
                      params={{ eventId: ev.id }}
                      className="group block image-hover"
                    >
                      {ev.cover_url ? (
                        <img
                          src={ev.cover_url}
                          alt={ev.name}
                          loading="lazy"
                          className={`w-full ${layout.ratio} object-cover`}
                        />
                      ) : (
                        <div className={`w-full ${layout.ratio} bg-muted`} />
                      )}
                      <div className="mt-4 flex items-start justify-between gap-6">
                        <div>
                          <h3 className="font-serif text-2xl md:text-3xl text-foreground leading-tight">
                            {ev.name}
                          </h3>
                          <p className="mt-2 text-[11px] uppercase tracking-widest-xl text-muted-foreground">
                            {formatDate(ev.date)}
                          </p>
                        </div>
                        <span className="text-[11px] uppercase tracking-widest-xl text-[var(--gold)] shrink-0 mt-2">
                          {categoryLabel[ev.category]}
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Lightbox
        images={lbImages}
        index={lbIdx}
        onClose={() => setLbIdx(null)}
        onPrev={() =>
          setLbIdx((i) => (i === null ? null : (i - 1 + recent.length) % recent.length))
        }
        onNext={() => setLbIdx((i) => (i === null ? null : (i + 1) % recent.length))}
      />
    </>
  );
}
