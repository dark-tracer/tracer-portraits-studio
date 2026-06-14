import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { Lightbox } from "@/components/Lightbox";
import { ArrowLeft } from "lucide-react";
import { getEvent } from "@/lib/portfolio-db.functions";

const categoryLabel: Record<string, string> = {
  portrait: "Portrait",
  wedding: "Wedding",
  event: "Event",
};

export const Route = createFileRoute("/portfolio/$eventId")({
  loader: async ({ params }) => {
    const data = await getEvent({ data: { id: params.eventId } });
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.event.name} — Traced in Light` },
          { name: "description", content: loaderData.event.description || loaderData.event.name },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center pt-32 px-6">
      <div className="text-center">
        <h1 className="font-serif text-4xl mb-4">Event not found</h1>
        <Link to="/portfolio" className="link-underline text-[11px] uppercase tracking-widest-xl">
          Back to Portfolio
        </Link>
      </div>
    </div>
  ),
  errorComponent: () => (
    <div className="min-h-screen flex items-center justify-center pt-32 px-6">
      <p>Couldn't load this event.</p>
    </div>
  ),
  component: EventPage,
});

function EventPage() {
  const { event, photos } = Route.useLoaderData() as {
    event: { id: string; name: string; category: string; date: string; description: string };
    photos: Array<{ id: string; url: string; alt: string }>;
  };
  const [idx, setIdx] = useState<number | null>(null);
  const images = photos.map((p) => ({ src: p.url, alt: p.alt }));

  return (
    <section className="pt-32 md:pt-40 pb-32 px-6 md:px-12">
      <div className="mx-auto max-w-[1600px]">
        <Reveal>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest-xl text-muted-foreground hover:text-foreground mb-10"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Portfolio
          </Link>
          <p className="text-[11px] uppercase tracking-widest-xl text-[var(--gold)] mb-3">
            {categoryLabel[event.category]} ·{" "}
            {new Date(event.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="font-serif text-5xl md:text-7xl text-foreground leading-[1.05]">
            {event.name}
          </h1>
          {event.description && (
            <p className="mt-6 max-w-2xl text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          )}
        </Reveal>

        <div className="mt-16 grid grid-cols-12 gap-4 md:gap-6">
          {photos.map((p, i) => (
            <Reveal
              key={p.id}
              className={i % 5 === 0 ? "col-span-12 md:col-span-8" : "col-span-12 md:col-span-4"}
              delay={(i % 3) * 100}
            >
              <button onClick={() => setIdx(i)} className="block w-full image-hover">
                <img
                  src={p.url}
                  alt={p.alt}
                  loading="lazy"
                  className="w-full aspect-[4/5] object-cover"
                />
              </button>
            </Reveal>
          ))}
        </div>

        {photos.length === 0 && (
          <p className="mt-16 text-muted-foreground">No photos uploaded for this event yet.</p>
        )}
      </div>

      <Lightbox
        images={images}
        index={idx}
        onClose={() => setIdx(null)}
        onPrev={() => setIdx((i) => (i === null ? null : (i - 1 + photos.length) % photos.length))}
        onNext={() => setIdx((i) => (i === null ? null : (i + 1) % photos.length))}
      />
    </section>
  );
}
