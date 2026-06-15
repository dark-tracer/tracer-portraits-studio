import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type Category = "portrait" | "wedding" | "event";

export type EventRow = {
  id: string;
  name: string;
  category: Category;
  date: string;
  description: string;
  cover_url: string | null;
  created_at: string;
};

export type PhotoRow = {
  id: string;
  event_id: string | null;
  url: string;
  alt: string;
  created_at: string;
};

export type HeroRow = {
  id: string;
  url: string;
  alt: string;
  sort_order: number;
};

export const listEvents = createServerFn({ method: "GET" }).handler(
  async (): Promise<(EventRow & { photo_count: number })[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: events } = await supabaseAdmin
      .from("events")
      .select("*")
      .order("date", { ascending: false });
    const { data: photos } = await supabaseAdmin.from("photos").select("event_id, url, created_at");
    const list = (events ?? []) as EventRow[];
    // derive cover from newest photo if cover_url missing
    return list.map((e) => {
      const eventPhotos = (photos ?? []).filter((p) => p.event_id === e.id);
      const cover =
        e.cover_url ||
        eventPhotos.sort((a, b) => b.created_at.localeCompare(a.created_at))[0]?.url ||
        null;
      return { ...e, cover_url: cover, photo_count: eventPhotos.length };
    });
  },
);

export const getEvent = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }): Promise<{ event: EventRow; photos: PhotoRow[] } | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: event } = await supabaseAdmin
      .from("events")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (!event) return null;
    const { data: photos } = await supabaseAdmin
      .from("photos")
      .select("id, event_id, url, alt, created_at")
      .eq("event_id", data.id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    return { event: event as EventRow, photos: (photos ?? []) as PhotoRow[] };
  });

export const listRecentPhotos = createServerFn({ method: "GET" }).handler(
  async (): Promise<(PhotoRow & { event_name: string | null; category: Category | null })[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("photos")
      .select("id, event_id, url, alt, created_at, events(name, category)")
      .order("created_at", { ascending: false })
      .limit(3);
    return (data ?? []).map((p: any) => ({
      id: p.id,
      event_id: p.event_id,
      url: p.url,
      alt: p.alt,
      created_at: p.created_at,
      event_name: p.events?.name ?? null,
      category: p.events?.category ?? null,
    }));
  },
);

export const listHero = createServerFn({ method: "GET" }).handler(async (): Promise<HeroRow[]> => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("hero_images")
    .select("id, url, alt, sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  return (data ?? []) as HeroRow[];
});

// ============ ABOUT / PACKAGES / TESTIMONIALS (public reads) ============
export type AboutContent = {
  id: string;
  image_url: string | null;
  headline: string;
  body: string;
  weddings_captured: string;
  years_behind_lens: string;
};

export const getAbout = createServerFn({ method: "GET" }).handler(
  async (): Promise<AboutContent | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("about_content")
      .select("id, image_url, headline, body, weddings_captured, years_behind_lens")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return (data as AboutContent | null) ?? null;
  },
);

export type PackageRow = {
  id: string;
  title: string;
  starting: string;
  description: string;
  includes: string[];
  featured: boolean;
  sort_order: number;
};

export const listPackages = createServerFn({ method: "GET" }).handler(
  async (): Promise<PackageRow[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("packages")
      .select("id, title, starting, description, includes, featured, sort_order")
      .order("sort_order", { ascending: true });
    return (data ?? []) as PackageRow[];
  },
);

export type TestimonialRow = {
  id: string;
  quote: string;
  attribution: string;
  sort_order: number;
};

export const listTestimonials = createServerFn({ method: "GET" }).handler(
  async (): Promise<TestimonialRow[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("testimonials")
      .select("id, quote, attribution, sort_order")
      .order("sort_order", { ascending: true });
    return (data ?? []) as TestimonialRow[];
  },
);
