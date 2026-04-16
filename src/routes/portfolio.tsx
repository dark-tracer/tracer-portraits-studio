import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { Lightbox } from "@/components/Lightbox";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";
import p5 from "@/assets/portfolio-5.jpg";
import p6 from "@/assets/portfolio-6.jpg";
import p7 from "@/assets/portfolio-7.jpg";
import p8 from "@/assets/portfolio-8.jpg";

type Category = "all" | "portraits" | "weddings";
type Item = { src: string; alt: string; cat: Exclude<Category, "all">; span: string; ratio: string };

const items: Item[] = [
  { src: p1, alt: "Bride and groom at golden hour", cat: "weddings", span: "md:col-span-7", ratio: "aspect-[4/5]" },
  { src: p2, alt: "Black and white portrait of a young man", cat: "portraits", span: "md:col-span-5 md:mt-16", ratio: "aspect-[4/5]" },
  { src: p4, alt: "Portrait at sunset in field", cat: "portraits", span: "md:col-span-5", ratio: "aspect-[3/4]" },
  { src: p3, alt: "Wedding ceremony in soft light", cat: "weddings", span: "md:col-span-7 md:mt-12", ratio: "aspect-[4/3]" },
  { src: p6, alt: "Candid portrait by the window", cat: "portraits", span: "md:col-span-7", ratio: "aspect-[4/3]" },
  { src: p5, alt: "Bride holding white bouquet", cat: "weddings", span: "md:col-span-5 md:mt-20", ratio: "aspect-square" },
  { src: p8, alt: "Studio portrait in window light", cat: "portraits", span: "md:col-span-6", ratio: "aspect-square" },
  { src: p7, alt: "Wedding couple silhouette", cat: "weddings", span: "md:col-span-6 md:mt-12", ratio: "aspect-[4/5]" },
];

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Traced in Light" },
      { name: "description", content: "A selection of portrait and wedding photography by Traced in Light." },
      { property: "og:title", content: "Portfolio — Traced in Light" },
      { property: "og:description", content: "A selection of portrait and wedding photography." },
      { property: "og:image", content: p1 },
      { name: "twitter:image", content: p1 },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const [filter, setFilter] = useState<Category>("all");
  const [active, setActive] = useState<number | null>(null);

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.cat === filter)),
    [filter],
  );

  const filters: { key: Category; label: string }[] = [
    { key: "all", label: "All Work" },
    { key: "portraits", label: "Portraits" },
    { key: "weddings", label: "Weddings & Events" },
  ];

  return (
    <>
      <section className="pt-40 md:pt-48 pb-16 px-6 md:px-12">
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

          <Reveal delay={200}>
            <div className="mt-16 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-8">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`text-[11px] uppercase tracking-widest-xl transition-colors ${
                    filter === f.key
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f.label}
                  {filter === f.key && (
                    <span className="ml-2 inline-block h-px w-6 align-middle bg-[var(--gold)]" />
                  )}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-32">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid grid-cols-12 gap-4 md:gap-8">
            {filtered.map((item, i) => (
              <Reveal
                key={item.src}
                className={`col-span-12 ${item.span}`}
                delay={(i % 3) * 120}
              >
                <button
                  onClick={() => setActive(i)}
                  className="group block w-full text-left image-hover"
                  aria-label={`Open ${item.alt}`}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    className={`w-full ${item.ratio} object-cover`}
                  />
                  <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-widest-xl text-muted-foreground">
                    <span>{item.cat === "portraits" ? "Portrait" : "Wedding"}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--gold)]">
                      View →
                    </span>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Lightbox
        images={filtered}
        index={active}
        onClose={() => setActive(null)}
        onPrev={() =>
          setActive((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length))
        }
        onNext={() => setActive((i) => (i === null ? null : (i + 1) % filtered.length))}
      />
    </>
  );
}
