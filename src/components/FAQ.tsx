import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { Plus } from "lucide-react";
import { useCopy } from "@/hooks/use-copy";
import type { FaqRow } from "@/lib/portfolio-db.functions";

export function FAQ({ items }: { items: FaqRow[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const t = useCopy();

  if (!items.length) return null;

  const half = Math.ceil(items.length / 2);
  const columns = [items.slice(0, half), items.slice(half)];

  return (
    <section className="px-6 md:px-12 py-24 md:py-32">
      <div className="mx-auto max-w-[1600px]">
        <Reveal>
          <p className="eyebrow mb-4">{t("faq.eyebrow")}</p>
          <h2 className="display-xl text-3xl md:text-5xl border-b border-border pb-8">
            {t("faq.heading")}
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-16">
          {columns.map((col, c) => (
            <div key={c}>
              {col.map((f, j) => {
                const i = c * half + j;
                const isOpen = open === i;
                return (
                  <Reveal key={f.id} delay={j * 60}>
                    <div className="border-b border-border">
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        className="w-full flex items-start justify-between gap-6 py-6 text-left"
                      >
                        <span className="text-sm md:text-base uppercase tracking-wide font-medium leading-snug">
                          {f.question}
                        </span>
                        <Plus
                          className={`mt-1 h-4 w-4 shrink-0 text-[var(--gold)] transition-transform duration-300 ${
                            isOpen ? "rotate-45" : ""
                          }`}
                        />
                      </button>
                      <div
                        className="grid transition-all duration-500 ease-out"
                        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                      >
                        <div className="overflow-hidden">
                          <p className="pb-6 pr-10 text-sm leading-relaxed text-muted-foreground">
                            {f.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
