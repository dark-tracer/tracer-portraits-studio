import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Lightbox } from "@/components/Lightbox";
import { getEventById, categoryLabel, formatDate, type PortfolioEvent } from "@/lib/portfolio";

export const Route = createFileRoute("/portfolio/$eventId")({
  loader: ({ params }): { event: PortfolioEvent } => {
    const event = getEventById(params.eventId);
    if (!event) throw notFound();
    return { event };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.event.name} — Traced in Light` },
          { name: "description", content: loaderData.event.description },
          { property: "og:title", content: `${loaderData.event.name} — Traced in Light` },
          { property: "og:description", content: loaderData.event.description },
          { property: "og:image", content: loaderData.event.coverImage },
          { name: "twitter:image", content: loaderData.event.coverImage },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="font-serif text-5xl text-foreground">Event not found</h1>
      <p className="mt-4 text-muted-foreground">This gallery doesn’t exist or has been moved.</p>
      <Link
        to="/portfolio"
        className="mt-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-widest-xl text-foreground link-underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Portfolio
      </Link>
    </div>
  ),
  component: EventGalleryPage,
});

// Varied masonry-ish layout pattern
const PHOTO_SPANS = [
  "md:col-span-7 aspect-[4/3]",
  "md:col-span-5 aspect-[3/4]",
  "md:col-span-5 aspect-[4/5]",
  "md:col-span-7 aspect-[16/10]",
  "md:col-span-6 aspect-square",
  "md:col-span-6 aspect-[4/5]",
  "md:col-span-8 aspect-[16/9]",
  "md:col-span-4 aspect-[3/4]",
];

function EventGalleryPage() {
  const { event } = Route.useLoaderData();
  const [active, setActive] = useState<number | null>(null);

  const images = event.photos.map((src) => ({ src, alt: event.name }));

  return (
    <>
      <section className="pt-32 md:pt-40 pb-10 px-6 md:px-12">
        <div className="mx-auto max-w-[1600px]">
          <Reveal>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest-xl text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Portfolio
            </Link>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-t border-border pt-10">
              <div className="max-w-3xl">
                <p className="text-[11px] uppercase tracking-widest-xl text-[var(--gold)] mb-4">
                  {categoryLabel[event.category]} · {formatDate(event.date)}
                </p>
                <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground leading-[1.05]">
                  {event.name}
                </h1>
                <p className="mt-6 text-muted-foreground leading-relaxed max-w-xl">
                  {event.description}
                </p>
              </div>
              <span className="text-[11px] uppercase tracking-widest-xl text-muted-foreground">
                {event.photos.length} frames
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-32">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid grid-cols-12 gap-4 md:gap-8">
            {event.photos.map((src, i) => {
              const cls = PHOTO_SPANS[i % PHOTO_SPANS.length];
              return (
                <Reveal
                  key={`${src}-${i}`}
                  className={`col-span-12 ${cls.split(" ")[0]}`}
                  delay={(i % 3) * 100}
                >
                  <button
                    onClick={() => setActive(i)}
                    className="block w-full image-hover"
                    aria-label={`Open photo ${i + 1} of ${event.photos.length}`}
                  >
                    <img
                      src={src}
                      alt={`${event.name} — ${i + 1}`}
                      loading="lazy"
                      className={`w-full object-cover ${cls.split(" ").slice(1).join(" ")}`}
                    />
                  </button>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <Lightbox
        images={images}
        index={active}
        onClose={() => setActive(null)}
        onPrev={() =>
          setActive((i) => (i === null ? null : (i - 1 + images.length) % images.length))
        }
        onNext={() => setActive((i) => (i === null ? null : (i + 1) % images.length))}
      />
    </>
  );
}
