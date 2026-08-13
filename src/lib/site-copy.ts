// Central registry of every editable piece of text on the public site.
// Add a field here and it automatically shows up in Admin → Page Text.

export type CopyField = {
  key: string;
  label: string;
  multiline?: boolean;
  default: string;
};

export type CopyGroup = {
  title: string;
  fields: CopyField[];
};

export const COPY_GROUPS: CopyGroup[] = [
  {
    title: "Home — Hero",
    fields: [
      { key: "home.hero.eyebrow", label: "Small label", default: "Portrait · Wedding · Events — Accra, Ghana" },
      { key: "home.hero.title", label: "Big heading", default: "Traced in Light" },
      { key: "home.hero.cta", label: "Button text", default: "Let's Work Together" },
    ],
  },
  {
    title: "Home — About the studio",
    fields: [
      { key: "home.about.eyebrow", label: "Small label", default: "About the studio" },
      {
        key: "home.about.heading",
        label: "Heading",
        multiline: true,
        default: "Every photograph is a quiet record of a moment that will not return.",
      },
      {
        key: "home.about.body",
        label: "Paragraph",
        multiline: true,
        default:
          "I make pictures with intention — for people who want to remember the truth of things, not a performance of it. Unhurried, honest, made to be lived with.",
      },
      { key: "home.about.link", label: "Link text", default: "More about me" },
    ],
  },
  {
    title: "Home — Services & recent work",
    fields: [
      { key: "home.services.eyebrow", label: "Services label", default: "Services" },
      { key: "home.services.heading", label: "Services heading", default: "What I Offer" },
      { key: "home.services.link", label: "Card link text", default: "Learn more" },
      { key: "home.recent.eyebrow", label: "Recent work label", default: "Portfolio" },
      { key: "home.recent.heading", label: "Recent work heading", default: "Recently Added" },
      { key: "home.recent.cta", label: "Recent work button", default: "View all work" },
    ],
  },
  {
    title: "About page",
    fields: [
      { key: "about.eyebrow", label: "Small label", default: "About me" },
      { key: "about.title", label: "Big heading", default: "About Traced in Light" },
      { key: "about.cta", label: "Button text", default: "Work With Me" },
      { key: "about.image.empty", label: "Empty photo message", default: "Photo coming soon" },
    ],
  },
  {
    title: "Portfolio page",
    fields: [
      { key: "portfolio.eyebrow", label: "Small label", default: "The archive" },
      { key: "portfolio.title", label: "Big heading", default: "Visual Poetry in Pixels" },
      {
        key: "portfolio.intro",
        label: "Intro paragraph",
        multiline: true,
        default:
          "A considered selection, grouped by the kind of story it tells. Open any collection to see the full gallery.",
      },
      { key: "portfolio.section.portrait", label: "Portraits section title", default: "Portraits" },
      { key: "portfolio.section.wedding", label: "Weddings section title", default: "Weddings" },
      { key: "portfolio.section.event", label: "Events section title", default: "Events" },
      {
        key: "portfolio.empty",
        label: "Empty state message",
        default: "Collections will appear here once added.",
      },
    ],
  },
  {
    title: "Services page",
    fields: [
      { key: "services.eyebrow", label: "Small label", default: "Services & investment" },
      { key: "services.title", label: "Big heading", default: "Diverse Photography Offerings" },
      {
        key: "services.intro",
        label: "Intro paragraph",
        multiline: true,
        default:
          "Every session is shaped to its subject. The collections below are starting points — your day, your story, your details inform the rest.",
      },
      { key: "services.portraits.heading", label: "Portraits heading", default: "Portrait Sessions" },
      { key: "services.weddings.heading", label: "Weddings heading", default: "Weddings & Events" },
      { key: "services.book.cta", label: "Package button text", default: "Book" },
      {
        key: "services.empty",
        label: "Empty state message",
        default: "Packages will appear here once added.",
      },
    ],
  },
  {
    title: "Contact page",
    fields: [
      { key: "contact.eyebrow", label: "Small label", default: "Contact" },
      { key: "contact.title", label: "Big heading", default: "Get in Touch With Me" },
      {
        key: "contact.heading",
        label: "Sub heading",
        multiline: true,
        default: "Let's plan something honest together.",
      },
      {
        key: "contact.body",
        label: "Paragraph",
        multiline: true,
        default:
          "Tell me a little about what you're planning. I respond personally to every message — usually within two business days.",
      },
      { key: "contact.form.cta", label: "Send button text", default: "Send Message" },
      { key: "contact.success.title", label: "Success heading", default: "Message received" },
      {
        key: "contact.success.body",
        label: "Success message",
        default: "Thank you — I'll be in touch shortly.",
      },
    ],
  },
  {
    title: "Contact details (used site-wide)",
    fields: [
      { key: "site.email", label: "Email address", default: "bernieamponsah2@gmail.com" },
      { key: "site.instagram.handle", label: "Instagram handle", default: "@trac.erphotography" },
      {
        key: "site.instagram.url",
        label: "Instagram link",
        default:
          "https://www.instagram.com/trac.erphotography?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      },
      { key: "site.location", label: "Location", default: "Accra, Ghana" },
      { key: "site.whatsapp.phone", label: "WhatsApp number (digits only)", default: "233502605560" },
      {
        key: "site.whatsapp.message",
        label: "WhatsApp pre-filled message",
        multiline: true,
        default: "Hi Tracer, I'd like to inquire about your photography services.",
      },
    ],
  },
  {
    title: "Testimonials & FAQ headings",
    fields: [
      { key: "testimonials.eyebrow", label: "Testimonials label", default: "Testimonials" },
      { key: "testimonials.heading", label: "Testimonials heading", default: "What My Clients Say" },
      { key: "faq.eyebrow", label: "FAQ label", default: "FAQ's" },
      { key: "faq.heading", label: "FAQ heading", default: "Frequently Asked Questions" },
    ],
  },
  {
    title: "Ticker strip",
    fields: [
      {
        key: "ticker.items",
        label: "Scrolling words (separate with commas)",
        multiline: true,
        default:
          "Portrait Photography, Wedding Photography, Event Photography, Graduation Photography",
      },
    ],
  },
  {
    title: "Footer",
    fields: [
      {
        key: "footer.eyebrow",
        label: "Small label",
        default: "A more meaningful home for photography",
      },
      { key: "footer.heading.line1", label: "Heading line 1", default: "Let's" },
      { key: "footer.heading.line2", label: "Heading line 2", default: "Work Together" },
      { key: "footer.copyright", label: "Copyright name", default: "Traced in Light Studio" },
      { key: "footer.watermark", label: "Watermark text", default: "Traced in Light" },
    ],
  },
];

export const COPY_DEFAULTS: Record<string, string> = Object.fromEntries(
  COPY_GROUPS.flatMap((g) => g.fields.map((f) => [f.key, f.default])),
);

export type CopyMap = Record<string, string>;

/** Returns a lookup that falls back to the built-in default text. */
export function makeCopy(map: CopyMap | null | undefined) {
  return (key: string): string => {
    const v = map?.[key];
    return v !== undefined && v !== "" ? v : (COPY_DEFAULTS[key] ?? "");
  };
}
