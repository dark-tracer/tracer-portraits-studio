import { useRef } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import type { TestimonialRow } from "@/lib/portfolio-db.functions";

export function Testimonials({ items }: { items: TestimonialRow[] }) {
  const scroller = useRef<HTMLDivElement>(null);

  if (!items.length) return null;

  const scrollBy = (dir: number) => {
    scroller.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  return (
    <section className="px-6 md:px-12 py-24 md:py-32">
      <div className="mx-auto max-w-[1600px]">
        <Reveal>
          <p className="eyebrow mb-4">Testimonials</p>
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
            <div>
              <h2 className="display-xl text-3xl md:text-5xl">What My Clients Say</h2>
              <p className="mt-4 text-sm text-muted-foreground">
                Total reviews
                <span className="block text-foreground">{items.length}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollBy(-1)}
                aria-label="Previous testimonials"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scrollBy(1)}
                aria-label="Next testimonials"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Reveal>

        <div
          ref={scroller}
          className="mt-10 flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory"
        >
          {items.map((t, i) => (
            <Reveal
              key={t.id}
              delay={i * 90}
              className="snap-start shrink-0 w-[85%] sm:w-[46%] lg:w-[31%]"
            >
              <figure className="surface-card h-full p-8">
                <figcaption className="text-sm text-foreground">
                  {t.attribution || "Client"}
                </figcaption>
                <div className="mt-3 flex gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  {t.quote}
                </blockquote>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
