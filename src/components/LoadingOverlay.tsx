import { useEffect, useState } from "react";

const STORAGE_KEY = "til-intro-played";

export function LoadingOverlay() {
  const [phase, setPhase] = useState<"hidden" | "writing" | "fading" | "done">("hidden");

  useEffect(() => {
    let played = false;
    try {
      played = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // ignore
    }

    if (played) {
      setPhase("fading");
      const t = setTimeout(() => setPhase("done"), 400);
      return () => clearTimeout(t);
    }

    setPhase("writing");
    document.body.style.overflow = "hidden";

    const fadeTimer = setTimeout(() => setPhase("fading"), 2400);
    const doneTimer = setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // ignore
      }
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  const isFirstVisit = phase === "writing" || phase === "fading";
  // For revisit (instant fade), don't show the text at all — just a quick white fade.
  const showText = phase === "writing" || (phase === "fading" && isFirstVisit);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-700 ease-out ${
        phase === "fading" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {showText && (
        <div className="relative px-6">
          {/* Handwritten reveal: clip-path swipes left → right like a pen drawing */}
          <h1
            className={`font-script text-foreground text-6xl sm:text-7xl md:text-8xl leading-none til-write ${
              phase === "writing" ? "is-writing" : ""
            }`}
          >
            Traced in Light
          </h1>
        </div>
      )}
    </div>
  );
}
