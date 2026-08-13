import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Ticker } from "@/components/Ticker";
import { getSiteContent } from "@/lib/site-content.functions";

import appCss from "../styles.css?url";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl text-foreground">404</h1>
        <h2 className="mt-4 font-serif text-2xl text-foreground">Page not found</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-primary px-8 py-4 text-[11px] uppercase tracking-widest-xl text-primary-foreground transition-opacity hover:opacity-90"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Traced in Light — Portrait & Wedding Photography" },
      {
        name: "description",
        content:
          "Traced in Light is a portrait and wedding photography studio in Accra, Ghana, capturing quiet, intentional images that endure.",
      },
      { name: "author", content: "Traced in Light" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Traced in Light" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Traced in Light — Portrait & Wedding Photography" },
      { name: "twitter:title", content: "Traced in Light — Portrait & Wedding Photography" },
      {
        property: "og:description",
        content:
          "Unhurried, intentional portrait and wedding photography from Accra, Ghana — images made to be lived with, not just looked at.",
      },
      {
        name: "twitter:description",
        content:
          "Unhurried, intentional portrait and wedding photography from Accra, Ghana — images made to be lived with, not just looked at.",
      },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/309941ba-39b9-4c15-998e-8b9e2bf2f297/id-preview-9731ad13--52d8a40a-f791-40f2-9206-20f134fd985a.lovable.app-1776884951224.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/309941ba-39b9-4c15-998e-8b9e2bf2f297/id-preview-9731ad13--52d8a40a-f791-40f2-9206-20f134fd985a.lovable.app-1776884951224.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": "https://tracer-portraits-studio.lovable.app/#website",
              name: "Traced in Light",
              url: "https://tracer-portraits-studio.lovable.app/",
              inLanguage: "en",
            },
            {
              "@type": "LocalBusiness",
              "@id": "https://tracer-portraits-studio.lovable.app/#business",
              name: "Traced in Light",
              description:
                "Portrait, wedding, and event photography studio based in Accra, Ghana.",
              url: "https://tracer-portraits-studio.lovable.app/",
              email: "bernieamponsah2@gmail.com",
              telephone: "+233502605560",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Accra",
                addressCountry: "GH",
              },
              areaServed: "Ghana",
              sameAs: ["https://www.instagram.com/trac.erphotography"],
            },
          ],
        }),
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&family=Pinyon+Script&display=swap",
      },
    ],
  }),
  loader: async () => ({ copy: await getSiteContent() }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});


function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <LoadingOverlay />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Ticker />
      <Footer />
      <WhatsAppButton />
    </>
  );
}
