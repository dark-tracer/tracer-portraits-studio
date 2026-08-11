import { Link } from "@tanstack/react-router";
import { Instagram, Mail, ArrowUpRight } from "lucide-react";

const columns: { title: string; links: { to: string; label: string }[] }[] = [
  {
    title: "Menu",
    links: [
      { to: "/", label: "Home" },
      { to: "/about", label: "About" },
      { to: "/portfolio", label: "Portfolio" },
    ],
  },
  {
    title: "Work",
    links: [
      { to: "/services", label: "Services" },
      { to: "/contact", label: "Contact" },
      { to: "/portfolio", label: "Galleries" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border">
      {/* Oversized watermark */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
        <span className="watermark-text text-[22vw] translate-y-[18%]">Traced in Light</span>
      </div>

      <div className="relative mx-auto max-w-[1600px] px-6 md:px-12 py-20 md:py-28">
        {/* CTA */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-6">A more meaningful home for photography</p>
            <h2 className="display-xl text-5xl md:text-7xl lg:text-8xl">
              <span className="flex items-center gap-5">
                Let&apos;s
                <Link
                  to="/contact"
                  aria-label="Go to contact page"
                  className="inline-flex h-12 w-16 md:h-14 md:w-20 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
                >
                  <ArrowUpRight className="h-6 w-6" />
                </Link>
              </span>
              <span className="block">Work Together</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            {columns.map((col) => (
              <div key={col.title} className="flex flex-col gap-3">
                <span className="eyebrow mb-1">{col.title}</span>
                {col.links.map((l) => (
                  <Link
                    key={l.label}
                    to={l.to}
                    className="link-underline w-fit text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 border-t border-border pt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <span className="text-[11px] uppercase tracking-widest-xl text-muted-foreground">
            © {new Date().getFullYear()} Traced in Light Studio
          </span>

          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/trac.erphotography?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="mailto:bernieamponsah2@gmail.com"
              aria-label="Email"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>

          <span className="text-[11px] uppercase tracking-widest-xl text-muted-foreground">
            Accra, Ghana
          </span>
        </div>
      </div>
    </footer>
  );
}
