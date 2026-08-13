import { Link } from "@tanstack/react-router";
import { Instagram, Mail, ArrowUpRight } from "lucide-react";
import { useCopy } from "@/hooks/use-copy";

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
  const t = useCopy();

  return (
    <footer className="relative overflow-hidden border-t border-border">
      {/* Oversized watermark */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
        <span className="watermark-text text-[22vw] translate-y-[18%]">{t("footer.watermark")}</span>
      </div>

      <div className="relative mx-auto max-w-[1600px] px-6 md:px-12 py-20 md:py-28">
        {/* CTA */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-6">{t("footer.eyebrow")}</p>
            <h2 className="display-xl text-5xl md:text-7xl lg:text-8xl">
              <span className="flex items-center gap-5">
                {t("footer.heading.line1")}
                <Link
                  to="/contact"
                  aria-label="Go to contact page"
                  className="icon-btn-gold inline-flex h-12 w-16 md:h-14 md:w-20 items-center justify-center rounded-full transition-transform hover:scale-105"
                >
                  <ArrowUpRight className="h-6 w-6" />
                </Link>
              </span>
              <span className="block">{t("footer.heading.line2")}</span>
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
            © {new Date().getFullYear()} {t("footer.copyright")}
          </span>

          <div className="flex items-center gap-3">
            <a
              href={t("site.instagram.url")}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${t("site.email")}`}
              aria-label="Email"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>

          <span className="text-[11px] uppercase tracking-widest-xl text-muted-foreground">
            {t("site.location")}
          </span>
        </div>
      </div>
    </footer>
  );
}
