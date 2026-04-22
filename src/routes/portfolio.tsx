import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { Lightbox } from "@/components/Lightbox";
import {
  events,
  recentPhotos,
  categoryLabel,
  formatDate,
  type Category,
} from "@/lib/portfolio";

type Tab = "all" | "portrait" | "wedding-event";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Traced in Light" },
      { name: "description", content: "Portrait, wedding, and event galleries by Traced in Light." },
      { property: "og:title", content: "Portfolio — Traced in Light" },
      { property: "og:description", content: "Portrait, wedding, and event galleries." },
    ],
  }),
  component: PortfolioPage,
});

// Asymmetric span pattern for event cards (deterministic by index → no layout jitter on filter)
const SPANS = [
  { span: "md:col-span-7", ratio: "aspect-[4/5]" },
  { span: "md:col-span-5 md:mt-16", ratio: "aspect-[4/5]" },
  { span: "md:col-span-5", ratio: "aspect-[3/4]" },
  { span: "md:col-span-7 md:mt-12", ratio: "aspect-[4/3]" },
  { span: "md:col-span-6", ratio: "aspect-square" },
  { span: "md:col-span-6 md:mt-12", ratio: "aspect-[4/5]" },
];

function matchesTab(cat: Category, tab: Tab): boolean {
  if (tab === "all") return true;
  if (tab === "portrait") return cat === "portrait";
  return cat === "wedding" || cat === "event";
}

function PortfolioPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [recentIdx, setRecentIdx] = useState<number | null>(null);

  const filteredEvents = useMemo(() => events.filter((e) => matchesTab(e.category, tab)), [tab]);

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "All Work" },
    { key: "portrait", label: "Portraits" },
    { key: "wedding-event", label: "Weddings & Events" },
  ];

  const recent = recentPhotos.slice(0, 3);
  const lightboxImages = recent.map((p) => ({ src: p.src, alt: p.eventName }));

  return (
    <>
      {/* Header */}
      <section className="pt-40 md:pt-48 pb-12 px-6 md:px-12">
        <div className="mx-auto max-w-[1600px]">
          <Reveal>
            <p className="text-[11px] uppercase tracking-widest-xl text-[var(--gold)] mb-4">
              The Archive
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-foreground max-w-4xl leading-[1.05]">
              Portfolio
            </h1>
            <p className="mt-8 max-w-xl text-muted-foreground leading-relaxed">
              A small, considered selection. Each frame chosen for the truth it carries — not
              the polish it performs.
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

      {/* Recently Added — always visible, unfiltered */}
      <section className="px-6 md:px-12 pb-20">
        <div className="mx-auto max-w-[1600px]">
          <Reveal>
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-[11px] uppercase tracking-widest-xl text-foreground">
                Recently Added
              </h2>
              <span className="text-[11px] uppercase tracking-widest-xl text-muted-foreground">
                Across all events
              </span>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="-mx-6 md:-mx-12 px-6 md:px-12 overflow-x-auto scrollbar-none">
              <div className="flex gap-4 md:gap-6 pb-2">
                {recent.map((p, i) => (
                  <button
                    key={`${p.eventId}-${i}`}
                    onClick={() => setRecentIdx(i)}
                    className="group relative shrink-0 image-hover text-left"
                    style={{ width: "clamp(220px, 28vw, 340px)" }}
                    aria-label={`Open photo from ${p.eventName}`}
                  >
                    <img
                      src={p.src}
                      alt={`${p.eventName} — recent`}
                      loading="lazy"
                      className="w-full aspect-[4/5] object-cover"
                    />
                    <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-widest-xl text-muted-foreground">
                      <span className="truncate pr-3">{p.eventName}</span>
                      <span className="text-[var(--gold)] shrink-0">{categoryLabel[p.category]}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Event Cards — asymmetric grid */}
      <section className="px-6 md:px-12 pb-32">
        <div className="mx-auto max-w-[1600px]">
          <Reveal>
            <div className="flex items-baseline justify-between mb-8 border-t border-border pt-8">
              <h2 className="text-[11px] uppercase tracking-widest-xl text-foreground">
                Events & Sessions
              </h2>
              <span className="text-[11px] uppercase tracking-widest-xl text-muted-foreground">
                {filteredEvents.length} {filteredEvents.length === 1 ? "collection" : "collections"}
              </span>
            </div>
          </Reveal>

          {filteredEvents.length === 0 ? (
            <p className="text-muted-foreground">No events in this category yet.</p>
          ) : (
            <div className="grid grid-cols-12 gap-4 md:gap-8">
              {filteredEvents.map((ev, i) => {
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
                      <img
                        src={ev.coverImage}
                        alt={ev.name}
                        loading="lazy"
                        className={`w-full ${layout.ratio} object-cover`}
                      />
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
        images={lightboxImages}
        index={recentIdx}
        onClose={() => setRecentIdx(null)}
        onPrev={() =>
          setRecentIdx((i) => (i === null ? null : (i - 1 + recent.length) % recent.length))
        }
        onNext={() => setRecentIdx((i) => (i === null ? null : (i + 1) % recent.length))}
      />
    </>
  );
}
