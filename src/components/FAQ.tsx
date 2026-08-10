import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { Plus } from "lucide-react";
import type { FaqRow } from "@/lib/portfolio-db.functions";

export function FAQ({ items }: { items: FaqRow[] }) {
  const [open, setOpen] = useState<number | null>(null);

  if (!items.length) return null;

  return (
    <section className="px-6 md:px-12 py-32 md:py-48 border-t border-border">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="font-serif text-4xl md:text-6xl font-light text-center mb-16 md:mb-24">
            Frequently Asked Questions
          </h2>
        </Reveal>

        <div className="divide-y divide-border">
          {items.map((f, i) => {

            const isOpen = open === i;
            return (
              <Reveal key={f.id} delay={i * 60}>
                <div>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-start justify-between gap-6 py-7 text-left"
                  >
                    <span className="font-serif text-xl md:text-2xl font-light leading-snug">
                      {f.question}
                    </span>
                    <Plus
                      className={`mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    />
                  </button>
                  <div
                    className="grid transition-all duration-500 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-8 pr-10 text-sm md:text-base leading-relaxed text-muted-foreground">
                        {f.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
