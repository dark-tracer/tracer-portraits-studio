import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Reveal } from "@/components/Reveal";
import { Instagram, Mail, MapPin, Check } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — By Tracer" },
      { name: "description", content: "Begin an inquiry with By Tracer for portrait, wedding, or event photography." },
      { property: "og:title", content: "Contact — By Tracer" },
      { property: "og:description", content: "Begin an inquiry for portrait, wedding, or event photography." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <section className="pt-40 md:pt-48 pb-32 px-6 md:px-12">
      <div className="mx-auto max-w-[1400px] grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24">
        {/* Left intro */}
        <div className="md:col-span-5">
          <Reveal>
            <p className="text-[11px] uppercase tracking-widest-xl text-[var(--gold)] mb-4">
              Begin an Inquiry
            </p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.05]">
              Let's talk.
            </h1>
            <p className="mt-8 text-muted-foreground leading-relaxed max-w-md">
              Tell me a little about what you're planning. I respond personally to every
              message — usually within two business days.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-16 space-y-6 text-sm">
              <a
                href="mailto:hello@bytracer.studio"
                className="flex items-start gap-4 link-underline w-fit"
              >
                <Mail className="h-4 w-4 mt-0.5 text-[var(--gold)]" />
                <span>hello@bytracer.studio</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-4 link-underline w-fit"
              >
                <Instagram className="h-4 w-4 mt-0.5 text-[var(--gold)]" />
                <span>@bytracer</span>
              </a>
              <div className="flex items-start gap-4">
                <MapPin className="h-4 w-4 mt-0.5 text-[var(--gold)]" />
                <span className="text-foreground/80">
                  Based in Lisbon — available worldwide
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right form */}
        <div className="md:col-span-7">
          <Reveal delay={150}>
            {sent ? (
              <div className="border border-border p-10 md:p-16 text-center">
                <div className="mx-auto w-12 h-12 rounded-full border border-[var(--gold)] flex items-center justify-center mb-6">
                  <Check className="h-5 w-5 text-[var(--gold)]" />
                </div>
                <h2 className="font-serif text-3xl text-foreground">Message received.</h2>
                <p className="mt-4 text-sm text-muted-foreground max-w-sm mx-auto">
                  Thank you for reaching out. I'll write back personally within two business
                  days.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-10">
                <Field label="Your Name" name="name" required />
                <Field label="Email Address" name="email" type="email" required />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <SelectField
                    label="Event Type"
                    name="type"
                    options={["Portrait Session", "Wedding", "Event", "Brand / Editorial", "Other"]}
                  />
                  <Field label="Approximate Date" name="date" type="date" />
                </div>
                <TextareaField label="Tell me a little about it" name="message" />

                <button
                  type="submit"
                  className="w-full md:w-auto inline-flex items-center justify-center bg-primary text-primary-foreground px-12 py-4 text-[11px] uppercase tracking-widest-xl hover:opacity-90 transition-opacity"
                >
                  Send Inquiry
                </button>
                <p className="text-xs text-muted-foreground">
                  By submitting, you agree to be contacted regarding your inquiry. Your details
                  stay between us.
                </p>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-widest-xl text-muted-foreground">
        {label}
        {required && <span className="text-[var(--gold)]"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-3 block w-full bg-transparent border-0 border-b border-border px-0 py-3 text-foreground focus:outline-none focus:border-foreground transition-colors"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-widest-xl text-muted-foreground">
        {label}
      </span>
      <select
        name={name}
        defaultValue=""
        className="mt-3 block w-full bg-transparent border-0 border-b border-border px-0 py-3 text-foreground focus:outline-none focus:border-foreground transition-colors"
      >
        <option value="" disabled>Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function TextareaField({ label, name }: { label: string; name: string }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-widest-xl text-muted-foreground">
        {label}
      </span>
      <textarea
        name={name}
        rows={5}
        className="mt-3 block w-full bg-transparent border-0 border-b border-border px-0 py-3 text-foreground focus:outline-none focus:border-foreground transition-colors resize-none"
      />
    </label>
  );
}
