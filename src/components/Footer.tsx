import { Link } from "@tanstack/react-router";
import { Instagram, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 className="font-script text-5xl mb-4 leading-none">Traced in Light</h3>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            Portrait & wedding photography. Quiet, intentional, made to last.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="text-[11px] uppercase tracking-widest-xl text-muted-foreground mb-2">
            Explore
          </span>
          <Link to="/portfolio" className="link-underline w-fit">Portfolio</Link>
          <Link to="/about" className="link-underline w-fit">About</Link>
          <Link to="/services" className="link-underline w-fit">Services</Link>
          <Link to="/contact" className="link-underline w-fit">Contact</Link>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="text-[11px] uppercase tracking-widest-xl text-muted-foreground mb-2">
            Elsewhere
          </span>
          <a
            href="https://www.instagram.com/trac.erphotography?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noreferrer"
            className="link-underline w-fit inline-flex items-center gap-2"
          >
            <Instagram className="h-4 w-4" />@trac.erphotography
          </a>
          <a
            href="mailto:bernieamponsah2@gmail.com"
            className="link-underline w-fit inline-flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />bernieamponsah2@gmail.com
          </a>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] uppercase tracking-widest-xl text-muted-foreground">
          <span>© {new Date().getFullYear()} Traced in Light Studio</span>
          <span>Made with quiet intent</span>
        </div>
      </div>
    </footer>
  );
}
