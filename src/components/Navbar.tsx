import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Me" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/services", label: "Services" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/85 backdrop-blur-xl py-3" : "bg-background/40 backdrop-blur-sm py-5"
      }`}
    >
      <nav className="mx-auto max-w-[1600px] px-5 md:px-10 flex items-center justify-between gap-6">
        <Link
          to="/"
          className="font-script text-3xl md:text-4xl leading-none text-foreground shrink-0"
          onClick={() => setOpen(false)}
        >
          Traced in Light
        </Link>

        <ul className="hidden md:flex items-center gap-1 rounded-full border border-border bg-card/60 p-1">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="block rounded-full px-5 py-2 text-[12px] uppercase tracking-widest-xl text-muted-foreground transition-colors hover:text-foreground"
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "bg-secondary text-foreground" }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link to="/contact" className="hidden md:inline-flex btn-pill btn-purple">
          Contact Me
        </Link>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          className="md:hidden text-foreground"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-0 top-[64px] bg-background transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col items-center justify-center gap-8 pt-20">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                onClick={() => setOpen(false)}
                className="display-xl text-3xl text-foreground"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/contact" onClick={() => setOpen(false)} className="btn-pill btn-purple mt-4">
              Contact Me
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
