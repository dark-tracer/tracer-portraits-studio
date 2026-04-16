import { useEffect, useState } from "react";

const STORAGE_KEY = "til-intro-played";

export function LoadingOverlay() {
  // Start as null to avoid SSR/client mismatch — decide on mount.
  const [phase, setPhase] = useState<"hidden" | "writing" | "fading" | "done">("hidden");

  useEffect(() => {
    let played = false;
    try {
      played = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // ignore
    }

    if (played) {
      // Quick fade only
      setPhase("fading");
      const t = setTimeout(() => setPhase("done"), 400);
      return () => clearTimeout(t);
    }

    setPhase("writing");
    document.body.style.overflow = "hidden";

    const fadeTimer = setTimeout(() => setPhase("fading"), 2200);
    const doneTimer = setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // ignore
      }
    }, 2900);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-700 ease-out ${
        phase === "fading" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <svg
        viewBox="0 0 600 160"
        className="w-[78%] max-w-[640px] h-auto"
        role="img"
        aria-label="Traced in Light"
      >
        <text
          x="50%"
          y="58%"
          textAnchor="middle"
          className={`til-handwrite ${phase === "writing" ? "is-writing" : ""}`}
          style={{
            fontFamily: '"Pinyon Script", "Great Vibes", "Dancing Script", cursive',
            fontSize: "92px",
            fill: "transparent",
            stroke: "var(--foreground)",
            strokeWidth: 0.9,
          }}
        >
          Traced in Light
        </text>
      </svg>
    </div>
  );
}
