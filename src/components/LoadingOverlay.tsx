import { useEffect, useState } from "react";

const STORAGE_KEY = "til-intro-played";

type Phase = "writing" | "fading" | "done";

export function LoadingOverlay() {
  // Start "done" so SSR/initial render is invisible — pick the real phase on mount.
  const [phase, setPhase] = useState<Phase>("done");

  useEffect(() => {
    let played = false;
    try {
      played = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // ignore
    }

    if (played) {
      // Quick fade only — flash a white overlay, then disappear.
      setPhase("fading");
      const t = setTimeout(() => setPhase("done"), 350);
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

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-700 ease-out ${
        phase === "fading" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {phase === "writing" && (
        <div className="relative px-6">
          <h1 className="font-script text-foreground text-6xl sm:text-7xl md:text-8xl leading-none til-write is-writing">
            Traced in Light
          </h1>
        </div>
      )}
    </div>
  );
}
