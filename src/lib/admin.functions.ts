import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ADMIN_EMAIL = "bernieamponsah12@gmail.com";

async function requireAdmin(userId: string, email: string | undefined) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // Bootstrap: if user email matches admin email, ensure role exists
  if (email?.toLowerCase() === ADMIN_EMAIL) {
    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });
  }
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Forbidden: admin access required");
  return supabaseAdmin;
}

export const ensureAdminRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const email = (context.claims as any).email as string | undefined;
    if (email?.toLowerCase() !== ADMIN_EMAIL) {
      return { isAdmin: false };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: context.userId, role: "admin" }, { onConflict: "user_id,role" });
    return { isAdmin: true };
  });

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data };
  });

// ============ EVENTS ============
export const createEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        name: z.string().min(1).max(120),
        category: z.enum(["portrait", "wedding", "event"]),
        date: z.string().min(1),
        description: z.string().max(2000).default(""),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const sb = await requireAdmin(context.userId, (context.claims as any).email);
    const { data: row, error } = await sb.from("events").insert(data).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const sb = await requireAdmin(context.userId, (context.claims as any).email);
    // Remove storage files first
    const { data: photos } = await sb.from("photos").select("storage_path").eq("event_id", data.id);
    if (photos?.length) {
      await sb.storage.from("portfolio").remove(photos.map((p) => p.storage_path));
    }
    const { error } = await sb.from("events").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============ PHOTOS (upload via FormData) ============
function makePath(name: string, prefix: string) {
  const ext = name.split(".").pop()?.toLowerCase() || "jpg";
  const id = crypto.randomUUID();
  return `${prefix}/${id}.${ext}`;
}

export const uploadEventPhoto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => {
    if (!(d instanceof FormData)) throw new Error("FormData required");
    const eventId = d.get("eventId");
    const file = d.get("file");
    if (typeof eventId !== "string" || !(file instanceof File))
      throw new Error("Missing eventId or file");
    return { eventId, file };
  })
  .handler(async ({ data, context }) => {
    const sb = await requireAdmin(context.userId, (context.claims as any).email);
    const path = makePath(data.file.name, `events/${data.eventId}`);
    const buf = await data.file.arrayBuffer();
    const { error: upErr } = await sb.storage
      .from("portfolio")
      .upload(path, buf, { contentType: data.file.type || "image/jpeg", upsert: false });
    if (upErr) throw new Error(upErr.message);
    const url = `/api/public/img/${path}`;
    const { data: row, error } = await sb
      .from("photos")
      .insert({ event_id: data.eventId, storage_path: path, url, alt: data.file.name })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deletePhoto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const sb = await requireAdmin(context.userId, (context.claims as any).email);
    const { data: p } = await sb
      .from("photos")
      .select("storage_path")
      .eq("id", data.id)
      .maybeSingle();
    if (p) await sb.storage.from("portfolio").remove([p.storage_path]);
    await sb.from("photos").delete().eq("id", data.id);
    return { ok: true };
  });

// ============ HERO IMAGES ============
export const uploadHeroImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => {
    if (!(d instanceof FormData)) throw new Error("FormData required");
    const file = d.get("file");
    if (!(file instanceof File)) throw new Error("Missing file");
    return { file };
  })
  .handler(async ({ data, context }) => {
    const sb = await requireAdmin(context.userId, (context.claims as any).email);
    const path = makePath(data.file.name, "hero");
    const buf = await data.file.arrayBuffer();
    const { error: upErr } = await sb.storage
      .from("portfolio")
      .upload(path, buf, { contentType: data.file.type || "image/jpeg", upsert: false });
    if (upErr) throw new Error(upErr.message);
    const url = `/api/public/img/${path}`;
    const { data: row, error } = await sb
      .from("hero_images")
      .insert({ storage_path: path, url, alt: data.file.name })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteHeroImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const sb = await requireAdmin(context.userId, (context.claims as any).email);
    const { data: h } = await sb
      .from("hero_images")
      .select("storage_path")
      .eq("id", data.id)
      .maybeSingle();
    if (h) await sb.storage.from("portfolio").remove([h.storage_path]);
    await sb.from("hero_images").delete().eq("id", data.id);
    return { ok: true };
  });

// ============ UPDATE EVENT (category, name, date, description) ============
export const updateEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        id: z.string().uuid(),
        name: z.string().min(1).max(120),
        category: z.enum(["portrait", "wedding", "event"]),
        date: z.string().min(1),
        description: z.string().max(2000).default(""),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const sb = await requireAdmin(context.userId, (context.claims as any).email);
    const { id, ...rest } = data;
    const { data: row, error } = await sb.from("events").update(rest).eq("id", id).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

// ============ ABOUT ============
export const updateAbout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        id: z.string().uuid(),
        headline: z.string().min(1).max(300),
        body: z.string().max(5000).default(""),
        weddings_captured: z.string().max(20).default("200+"),
        years_behind_lens: z.string().max(20).default("9 yrs"),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const sb = await requireAdmin(context.userId, (context.claims as any).email);
    const { id, ...rest } = data;
    const { error } = await sb
      .from("about_content")
      .update({ ...rest, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const uploadAboutImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => {
    if (!(d instanceof FormData)) throw new Error("FormData required");
    const id = d.get("id");
    const file = d.get("file");
    if (typeof id !== "string" || !(file instanceof File))
      throw new Error("Missing id or file");
    return { id, file };
  })
  .handler(async ({ data, context }) => {
    const sb = await requireAdmin(context.userId, (context.claims as any).email);
    const path = makePath(data.file.name, "about");
    const buf = await data.file.arrayBuffer();
    const { error: upErr } = await sb.storage
      .from("portfolio")
      .upload(path, buf, { contentType: data.file.type || "image/jpeg", upsert: false });
    if (upErr) throw new Error(upErr.message);
    const url = `/api/public/img/${path}`;
    // remove previous file if any
    const { data: prev } = await sb
      .from("about_content")
      .select("image_storage_path")
      .eq("id", data.id)
      .maybeSingle();
    if (prev?.image_storage_path) {
      await sb.storage.from("portfolio").remove([prev.image_storage_path]);
    }
    const { error } = await sb
      .from("about_content")
      .update({ image_storage_path: path, image_url: url, updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { url };
  });

// ============ PACKAGES ============
const packageSchema = z.object({
  title: z.string().min(1).max(120),
  starting: z.string().max(120).default(""),
  description: z.string().max(2000).default(""),
  includes: z.array(z.string().max(200)).default([]),
  featured: z.boolean().default(false),
  sort_order: z.number().int().default(0),
});

export const createPackage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => packageSchema.parse(d))
  .handler(async ({ data, context }) => {
    const sb = await requireAdmin(context.userId, (context.claims as any).email);
    const { data: row, error } = await sb.from("packages").insert(data).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const updatePackage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => packageSchema.extend({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const sb = await requireAdmin(context.userId, (context.claims as any).email);
    const { id, ...rest } = data;
    const { error } = await sb.from("packages").update(rest).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deletePackage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const sb = await requireAdmin(context.userId, (context.claims as any).email);
    const { error } = await sb.from("packages").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============ TESTIMONIALS ============
const testimonialSchema = z.object({
  quote: z.string().min(1).max(2000),
  attribution: z.string().max(200).default(""),
  sort_order: z.number().int().default(0),
});

export const createTestimonial = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => testimonialSchema.parse(d))
  .handler(async ({ data, context }) => {
    const sb = await requireAdmin(context.userId, (context.claims as any).email);
    const { data: row, error } = await sb.from("testimonials").insert(data).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const updateTestimonial = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => testimonialSchema.extend({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const sb = await requireAdmin(context.userId, (context.claims as any).email);
    const { id, ...rest } = data;
    const { error } = await sb.from("testimonials").update(rest).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteTestimonial = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const sb = await requireAdmin(context.userId, (context.claims as any).email);
    const { error } = await sb.from("testimonials").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============ ADMIN LIST READS (consistent with portfolio-db public reads) ============
export const adminListAbout = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const sb = await requireAdmin(context.userId, (context.claims as any).email);
    const { data } = await sb
      .from("about_content")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return data;
  });

export const adminListPackages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const sb = await requireAdmin(context.userId, (context.claims as any).email);
    const { data } = await sb.from("packages").select("*").order("sort_order", { ascending: true });
    return data ?? [];
  });

export const adminListTestimonials = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const sb = await requireAdmin(context.userId, (context.claims as any).email);
    const { data } = await sb.from("testimonials").select("*").order("sort_order", { ascending: true });
    return data ?? [];
  });
