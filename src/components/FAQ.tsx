import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "How far in advance should I book?",
    a: "I recommend booking at least 3 months in advance for portrait sessions and 6–12 months for weddings and events, especially during peak season.",
  },
  {
    q: "How many photos will I receive?",
    a: "Portrait sessions typically deliver 50–80 edited images. Wedding and event coverage delivers 300–500+ images depending on the package.",
  },
  {
    q: "How long does it take to receive my photos?",
    a: "Portrait sessions are delivered within 7–10 business days. Wedding and event galleries are delivered within 3–4 weeks after the date.",
  },
  {
    q: "Do you travel for shoots?",
    a: "Yes. I'm based in Accra and available for shoots across Ghana. Travel outside Accra may attract an additional fee depending on location and duration.",
  },
  {
    q: "What happens if it rains on my wedding day?",
    a: "I've shot in all conditions. We'll adapt the plan together — some of the most beautiful shots come from unexpected weather.",
  },
  {
    q: "Do you offer payment plans?",
    a: "Yes. A deposit is required to secure your date, with the balance due before your session or event. Contact me to discuss a payment plan that works for you.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="px-6 md:px-12 py-32 md:py-48 border-t border-border">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="font-serif text-4xl md:text-6xl font-light text-center mb-16 md:mb-24">
            Frequently Asked Questions
          </h2>
        </Reveal>

        <div className="divide-y divide-border">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 60}>
                <div>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-start justify-between gap-6 py-7 text-left"
                  >
                    <span className="font-serif text-xl md:text-2xl font-light leading-snug">
                      {f.q}
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
                        {f.a}
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
