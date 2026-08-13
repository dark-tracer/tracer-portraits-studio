import { useCopy } from "@/hooks/use-copy";

export function Ticker() {
  const t = useCopy();
  const items = t("ticker.items")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const sequence = [...items, ...items, ...items];

  if (!items.length) return null;

  return (
    <div className="relative overflow-hidden border-y border-border bg-card/40 py-4">
      <div className="ticker-track">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
            {sequence.map((label, i) => (
              <span
                key={`${dup}-${i}`}
                className="flex items-center gap-6 px-6 text-[11px] uppercase tracking-widest-xl text-muted-foreground whitespace-nowrap"
              >
                {label}
                <span className="text-[var(--gold)]">&#10022;</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
