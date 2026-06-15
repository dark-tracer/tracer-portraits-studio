import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import {
  checkIsAdmin,
  ensureAdminRole,
  createEvent,
  updateEvent,
  deleteEvent,
  uploadEventPhoto,
  deletePhoto,
  uploadHeroImage,
  deleteHeroImage,
  updateAbout,
  uploadAboutImage,
  createPackage,
  updatePackage,
  deletePackage,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  adminListAbout,
  adminListPackages,
  adminListTestimonials,
} from "@/lib/admin.functions";
import { listEvents, listHero, getEvent } from "@/lib/portfolio-db.functions";
import { Trash2, Upload, Plus, LogOut, X, Pencil } from "lucide-react";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin — Traced in Light" }] }),
  component: AdminPage,
});

type Tab = "events" | "hero" | "about" | "packages" | "testimonials";
type Category = "portrait" | "wedding" | "event";

function AdminPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const ensure = useServerFn(ensureAdminRole);
  const check = useServerFn(checkIsAdmin);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("events");

  useEffect(() => {
    if (loading) return;
    if (!session) {
      navigate({ to: "/auth" });
      return;
    }
    ensure()
      .then((r) => (r.isAdmin ? setIsAdmin(true) : check().then((c) => setIsAdmin(c.isAdmin))))
      .catch(() => setIsAdmin(false));
  }, [loading, session, navigate, ensure, check]);

  if (loading || isAdmin === null) {
    return <div className="min-h-screen flex items-center justify-center pt-32">Loading…</div>;
  }
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32 px-6 text-center">
        <div>
          <h1 className="font-serif text-3xl mb-4">Not authorized</h1>
          <p className="text-muted-foreground">Sign in with the admin account.</p>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "events", label: "Events & Sessions" },
    { key: "hero", label: "Hero Carousel" },
    { key: "about", label: "About Page" },
    { key: "packages", label: "Packages" },
    { key: "testimonials", label: "Testimonials" },
  ];

  return (
    <section className="min-h-screen pt-32 pb-20 px-6 md:px-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-[11px] uppercase tracking-widest-xl text-[var(--gold)] mb-2">Studio</p>
            <h1 className="font-serif text-5xl">Admin Console</h1>
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/" });
            }}
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest-xl text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-3 border-b border-border mb-10">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`pb-4 text-[11px] uppercase tracking-widest-xl ${
                tab === t.key
                  ? "text-foreground border-b-2 border-[var(--gold)] -mb-px"
                  : "text-muted-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "events" && <EventsTab />}
        {tab === "hero" && <HeroTab />}
        {tab === "about" && <AboutTab />}
        {tab === "packages" && <PackagesTab />}
        {tab === "testimonials" && <TestimonialsTab />}
      </div>
    </section>
  );
}

// ============ EVENTS TAB ============
type EventItem = {
  id: string;
  name: string;
  category: Category;
  date: string;
  description: string;
  cover_url: string | null;
  photo_count: number;
};

function EventsTab() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [openEvent, setOpenEvent] = useState<string | null>(null);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [filter, setFilter] = useState<"all" | Category>("all");
  const list = useServerFn(listEvents);
  const del = useServerFn(deleteEvent);

  const refresh = useCallback(() => list().then((r) => setEvents(r as EventItem[])), [list]);
  useEffect(() => {
    refresh();
  }, [refresh]);

  const filters: { key: "all" | Category; label: string }[] = [
    { key: "all", label: "All" },
    { key: "portrait", label: "Portraits" },
    { key: "wedding", label: "Weddings" },
    { key: "event", label: "Events" },
  ];
  const filtered = events.filter((e) => filter === "all" || e.category === filter);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-6">
          <h2 className="font-serif text-2xl">Events ({events.length})</h2>
          <div className="flex gap-4">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`text-[11px] uppercase tracking-widest-xl ${
                  filter === f.key ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 text-[11px] uppercase tracking-widest-xl hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> New Event
        </button>
      </div>

      {showNew && <EventForm onClose={() => setShowNew(false)} onSaved={refresh} />}
      {editing && (
        <EventForm
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={refresh}
        />
      )}

      <div className="grid gap-4">
        {filtered.map((e) => (
          <div key={e.id} className="border border-border p-5 flex items-center gap-5">
            {e.cover_url ? (
              <img src={e.cover_url} alt={e.name} className="h-20 w-20 object-cover" />
            ) : (
              <div className="h-20 w-20 bg-muted" />
            )}
            <div className="flex-1">
              <h3 className="font-serif text-xl">{e.name}</h3>
              <p className="text-[11px] uppercase tracking-widest-xl text-muted-foreground mt-1">
                {e.category} · {e.date} · {e.photo_count} photos
              </p>
            </div>
            <button
              onClick={() => setOpenEvent(e.id)}
              className="text-[11px] uppercase tracking-widest-xl link-underline"
            >
              Manage Photos
            </button>
            <button
              onClick={() => setEditing(e)}
              className="text-foreground/70 hover:text-foreground"
              title="Edit event"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={async () => {
                if (!confirm(`Delete "${e.name}" and all its photos?`)) return;
                await del({ data: { id: e.id } });
                refresh();
              }}
              className="text-destructive hover:opacity-70"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-muted-foreground py-12 text-center">No events in this view.</p>
        )}
      </div>

      {openEvent && (
        <EventPhotosModal
          eventId={openEvent}
          onClose={() => {
            setOpenEvent(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}

function EventForm({
  initial,
  onClose,
  onSaved,
}: {
  initial?: EventItem;
  onClose: () => void;
  onSaved: () => void;
}) {
  const create = useServerFn(createEvent);
  const update = useServerFn(updateEvent);
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState<Category>(initial?.category ?? "portrait");
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState(initial?.description ?? "");
  const [busy, setBusy] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
          if (initial) {
            await update({ data: { id: initial.id, name, category, date, description } });
          } else {
            await create({ data: { name, category, date, description } });
          }
          onSaved();
          onClose();
        } finally {
          setBusy(false);
        }
      }}
      className="border border-border p-6 mb-6 grid gap-4"
    >
      <div className="flex justify-between items-center">
        <h3 className="font-serif text-xl">{initial ? "Edit event" : "New event"}</h3>
        <button type="button" onClick={onClose}>
          <X className="h-4 w-4" />
        </button>
      </div>
      <input
        required
        placeholder="Event name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border-b border-border bg-transparent py-2 outline-none"
      />
      <div className="grid md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-[11px] uppercase tracking-widest-xl text-muted-foreground">
            Category
          </span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="mt-1 w-full border-b border-border bg-transparent py-2 outline-none"
          >
            <option value="portrait">Portrait</option>
            <option value="wedding">Wedding</option>
            <option value="event">Event</option>
          </select>
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border-b border-border bg-transparent py-2 outline-none"
        />
      </div>
      <textarea
        placeholder="Description (shown on the event page)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border border-border bg-transparent p-3 outline-none min-h-[100px]"
      />
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={busy}
          className="bg-primary text-primary-foreground px-6 py-3 text-[11px] uppercase tracking-widest-xl"
        >
          {busy ? "Saving…" : initial ? "Save changes" : "Create"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="text-[11px] uppercase tracking-widest-xl text-muted-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function EventPhotosModal({ eventId, onClose }: { eventId: string; onClose: () => void }) {
  const fetchEvent = useServerFn(getEvent);
  const upload = useServerFn(uploadEventPhoto);
  const removePhoto = useServerFn(deletePhoto);
  const [data, setData] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(() => {
    fetchEvent({ data: { id: eventId } }).then(setData);
  }, [eventId, fetchEvent]);
  useEffect(() => {
    refresh();
  }, [refresh]);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      for (const f of Array.from(files)) {
        const fd = new FormData();
        fd.append("eventId", eventId);
        fd.append("file", f);
        await upload({ data: fd });
      }
      refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/80 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 pt-20"
      onClick={onClose}
    >
      <div className="bg-background w-full max-w-4xl p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-serif text-2xl">{data?.event?.name ?? "Loading…"}</h2>
            <p className="text-[11px] uppercase tracking-widest-xl text-muted-foreground mt-2">
              {data?.photos?.length ?? 0} photos · {data?.event?.category}
            </p>
          </div>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <label className="block border border-dashed border-border p-8 text-center cursor-pointer hover:bg-muted/30 mb-6">
          <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
          <span className="text-[11px] uppercase tracking-widest-xl">
            {busy ? "Uploading…" : "Click to upload photos"}
          </span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            disabled={busy}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {data?.photos?.map((p: any) => (
            <div key={p.id} className="relative group">
              <img src={p.url} alt={p.alt} className="w-full aspect-square object-cover" />
              <button
                onClick={async () => {
                  await removePhoto({ data: { id: p.id } });
                  refresh();
                }}
                className="absolute top-2 right-2 bg-background/90 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ HERO TAB ============
function HeroTab() {
  const list = useServerFn(listHero);
  const upload = useServerFn(uploadHeroImage);
  const remove = useServerFn(deleteHeroImage);
  const [hero, setHero] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(() => list().then(setHero), [list]);
  useEffect(() => {
    refresh();
  }, [refresh]);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      for (const f of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", f);
        await upload({ data: fd });
      }
      refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h2 className="font-serif text-2xl mb-6">Hero Carousel ({hero.length})</h2>
      <label className="block border border-dashed border-border p-10 text-center cursor-pointer hover:bg-muted/30 mb-8">
        <Upload className="h-6 w-6 mx-auto mb-3 text-muted-foreground" />
        <span className="text-[11px] uppercase tracking-widest-xl">
          {busy ? "Uploading…" : "Upload hero images"}
        </span>
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          disabled={busy}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {hero.map((h) => (
          <div key={h.id} className="relative group">
            <img src={h.url} alt={h.alt} className="w-full aspect-[4/3] object-cover" />
            <button
              onClick={async () => {
                await remove({ data: { id: h.id } });
                refresh();
              }}
              className="absolute top-2 right-2 bg-background/90 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </button>
          </div>
        ))}
      </div>
      {hero.length === 0 && (
        <p className="text-muted-foreground py-12 text-center">No hero images yet.</p>
      )}
    </div>
  );
}

// ============ ABOUT TAB ============
function AboutTab() {
  const load = useServerFn(adminListAbout);
  const save = useServerFn(updateAbout);
  const uploadImg = useServerFn(uploadAboutImage);
  const [a, setA] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    load().then(setA);
  }, [load]);

  if (!a) return <p className="text-muted-foreground">Loading…</p>;

  async function handleImage(file: File | null) {
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("id", a.id);
      fd.append("file", file);
      await uploadImg({ data: fd });
      const fresh = await load();
      setA(fresh);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setMsg("");
        try {
          await save({
            data: {
              id: a.id,
              headline: a.headline,
              body: a.body,
              weddings_captured: a.weddings_captured,
              years_behind_lens: a.years_behind_lens,
            },
          });
          setMsg("Saved.");
        } finally {
          setBusy(false);
        }
      }}
      className="grid md:grid-cols-2 gap-10"
    >
      <div>
        <label className="block">
          <span className="text-[11px] uppercase tracking-widest-xl text-muted-foreground">
            Photo
          </span>
          <div className="mt-3 border border-border aspect-[4/5] overflow-hidden bg-muted">
            {a.image_url ? (
              <img src={a.image_url} alt="About" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                No image
              </div>
            )}
          </div>
          <label className="mt-3 inline-flex items-center gap-2 cursor-pointer text-[11px] uppercase tracking-widest-xl link-underline">
            <Upload className="h-4 w-4" /> {busy ? "Uploading…" : "Replace photo"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImage(e.target.files?.[0] ?? null)}
            />
          </label>
        </label>
      </div>

      <div className="grid gap-5">
        <label className="block">
          <span className="text-[11px] uppercase tracking-widest-xl text-muted-foreground">
            Headline
          </span>
          <input
            value={a.headline}
            onChange={(e) => setA({ ...a, headline: e.target.value })}
            className="mt-2 w-full border-b border-border bg-transparent py-2 outline-none"
          />
        </label>
        <label className="block">
          <span className="text-[11px] uppercase tracking-widest-xl text-muted-foreground">
            About text (separate paragraphs with a blank line)
          </span>
          <textarea
            value={a.body}
            onChange={(e) => setA({ ...a, body: e.target.value })}
            rows={10}
            className="mt-2 w-full border border-border bg-transparent p-3 outline-none"
          />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-[11px] uppercase tracking-widest-xl text-muted-foreground">
              Weddings captured
            </span>
            <input
              value={a.weddings_captured}
              onChange={(e) => setA({ ...a, weddings_captured: e.target.value })}
              className="mt-2 w-full border-b border-border bg-transparent py-2 outline-none"
            />
          </label>
          <label className="block">
            <span className="text-[11px] uppercase tracking-widest-xl text-muted-foreground">
              Years behind the lens
            </span>
            <input
              value={a.years_behind_lens}
              onChange={(e) => setA({ ...a, years_behind_lens: e.target.value })}
              className="mt-2 w-full border-b border-border bg-transparent py-2 outline-none"
            />
          </label>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <button
            type="submit"
            disabled={busy}
            className="bg-primary text-primary-foreground px-6 py-3 text-[11px] uppercase tracking-widest-xl"
          >
            {busy ? "Saving…" : "Save changes"}
          </button>
          {msg && <span className="text-[11px] text-muted-foreground">{msg}</span>}
        </div>
      </div>
    </form>
  );
}

// ============ PACKAGES TAB ============
function PackagesTab() {
  const load = useServerFn(adminListPackages);
  const create = useServerFn(createPackage);
  const update = useServerFn(updatePackage);
  const remove = useServerFn(deletePackage);
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [showNew, setShowNew] = useState(false);

  const refresh = useCallback(() => load().then(setItems), [load]);
  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-2xl">Packages ({items.length})</h2>
        <button
          onClick={() => setShowNew(true)}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 text-[11px] uppercase tracking-widest-xl"
        >
          <Plus className="h-4 w-4" /> New package
        </button>
      </div>

      {showNew && (
        <PackageForm
          onClose={() => setShowNew(false)}
          onSubmit={async (data) => {
            await create({ data });
            refresh();
          }}
        />
      )}
      {editing && (
        <PackageForm
          initial={editing}
          onClose={() => setEditing(null)}
          onSubmit={async (data) => {
            await update({ data: { id: editing.id, ...data } });
            refresh();
          }}
        />
      )}

      <div className="grid gap-4">
        {items.map((p) => (
          <div key={p.id} className="border border-border p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-serif text-xl">{p.title}</h3>
                  {p.featured && (
                    <span className="text-[10px] uppercase tracking-widest-xl text-[var(--gold)]">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-[11px] uppercase tracking-widest-xl text-muted-foreground mt-1">
                  {p.starting} · sort {p.sort_order}
                </p>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{p.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setEditing(p)} className="text-foreground/70 hover:text-foreground">
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={async () => {
                    if (!confirm(`Delete "${p.title}"?`)) return;
                    await remove({ data: { id: p.id } });
                    refresh();
                  }}
                  className="text-destructive hover:opacity-70"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-muted-foreground py-12 text-center">No packages yet.</p>
        )}
      </div>
    </div>
  );
}

function PackageForm({
  initial,
  onClose,
  onSubmit,
}: {
  initial?: any;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [starting, setStarting] = useState(initial?.starting ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [includes, setIncludes] = useState<string>(((initial?.includes ?? []) as string[]).join("\n"));
  const [featured, setFeatured] = useState<boolean>(initial?.featured ?? false);
  const [sortOrder, setSortOrder] = useState<number>(initial?.sort_order ?? 0);
  const [busy, setBusy] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
          await onSubmit({
            title,
            starting,
            description,
            includes: includes
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
            featured,
            sort_order: sortOrder,
          });
          onClose();
        } finally {
          setBusy(false);
        }
      }}
      className="border border-border p-6 mb-6 grid gap-4"
    >
      <div className="flex justify-between items-center">
        <h3 className="font-serif text-xl">{initial ? "Edit package" : "New package"}</h3>
        <button type="button" onClick={onClose}><X className="h-4 w-4" /></button>
      </div>
      <input
        required
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border-b border-border bg-transparent py-2 outline-none"
      />
      <input
        placeholder="Starting (e.g. Starting from $650)"
        value={starting}
        onChange={(e) => setStarting(e.target.value)}
        className="border-b border-border bg-transparent py-2 outline-none"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        className="border border-border bg-transparent p-3 outline-none"
      />
      <label className="block">
        <span className="text-[11px] uppercase tracking-widest-xl text-muted-foreground">
          Includes (one per line)
        </span>
        <textarea
          value={includes}
          onChange={(e) => setIncludes(e.target.value)}
          rows={4}
          className="mt-2 w-full border border-border bg-transparent p-3 outline-none"
        />
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label className="flex items-center gap-3 text-[11px] uppercase tracking-widest-xl">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          Featured
        </label>
        <label className="block">
          <span className="text-[11px] uppercase tracking-widest-xl text-muted-foreground">
            Sort order
          </span>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(parseInt(e.target.value || "0", 10))}
            className="mt-2 w-full border-b border-border bg-transparent py-2 outline-none"
          />
        </label>
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={busy}
          className="bg-primary text-primary-foreground px-6 py-3 text-[11px] uppercase tracking-widest-xl"
        >
          {busy ? "Saving…" : initial ? "Save changes" : "Create"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="text-[11px] uppercase tracking-widest-xl text-muted-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ============ TESTIMONIALS TAB ============
function TestimonialsTab() {
  const load = useServerFn(adminListTestimonials);
  const create = useServerFn(createTestimonial);
  const update = useServerFn(updateTestimonial);
  const remove = useServerFn(deleteTestimonial);
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [showNew, setShowNew] = useState(false);

  const refresh = useCallback(() => load().then(setItems), [load]);
  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-2xl">Testimonials ({items.length})</h2>
        <button
          onClick={() => setShowNew(true)}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 text-[11px] uppercase tracking-widest-xl"
        >
          <Plus className="h-4 w-4" /> New testimonial
        </button>
      </div>

      {showNew && (
        <TestimonialForm
          onClose={() => setShowNew(false)}
          onSubmit={async (d) => {
            await create({ data: d });
            refresh();
          }}
        />
      )}
      {editing && (
        <TestimonialForm
          initial={editing}
          onClose={() => setEditing(null)}
          onSubmit={async (d) => {
            await update({ data: { id: editing.id, ...d } });
            refresh();
          }}
        />
      )}

      <div className="grid gap-4">
        {items.map((t) => (
          <div key={t.id} className="border border-border p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <blockquote className="font-serif italic text-base leading-relaxed">
                  "{t.quote}"
                </blockquote>
                <p className="text-[11px] uppercase tracking-widest-xl text-muted-foreground mt-3">
                  {t.attribution} · sort {t.sort_order}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setEditing(t)} className="text-foreground/70 hover:text-foreground">
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={async () => {
                    if (!confirm("Delete this testimonial?")) return;
                    await remove({ data: { id: t.id } });
                    refresh();
                  }}
                  className="text-destructive hover:opacity-70"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-muted-foreground py-12 text-center">No testimonials yet.</p>
        )}
      </div>
    </div>
  );
}

function TestimonialForm({
  initial,
  onClose,
  onSubmit,
}: {
  initial?: any;
  onClose: () => void;
  onSubmit: (d: any) => Promise<void>;
}) {
  const [quote, setQuote] = useState(initial?.quote ?? "");
  const [attribution, setAttribution] = useState(initial?.attribution ?? "");
  const [sortOrder, setSortOrder] = useState<number>(initial?.sort_order ?? 0);
  const [busy, setBusy] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
          await onSubmit({ quote, attribution, sort_order: sortOrder });
          onClose();
        } finally {
          setBusy(false);
        }
      }}
      className="border border-border p-6 mb-6 grid gap-4"
    >
      <div className="flex justify-between items-center">
        <h3 className="font-serif text-xl">{initial ? "Edit testimonial" : "New testimonial"}</h3>
        <button type="button" onClick={onClose}><X className="h-4 w-4" /></button>
      </div>
      <textarea
        required
        placeholder="Quote"
        value={quote}
        onChange={(e) => setQuote(e.target.value)}
        rows={4}
        className="border border-border bg-transparent p-3 outline-none"
      />
      <input
        placeholder="Attribution (e.g. — Elena & Marcus, Wedding 2024)"
        value={attribution}
        onChange={(e) => setAttribution(e.target.value)}
        className="border-b border-border bg-transparent py-2 outline-none"
      />
      <label className="block">
        <span className="text-[11px] uppercase tracking-widest-xl text-muted-foreground">
          Sort order
        </span>
        <input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(parseInt(e.target.value || "0", 10))}
          className="mt-2 w-full border-b border-border bg-transparent py-2 outline-none"
        />
      </label>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={busy}
          className="bg-primary text-primary-foreground px-6 py-3 text-[11px] uppercase tracking-widest-xl"
        >
          {busy ? "Saving…" : initial ? "Save changes" : "Create"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="text-[11px] uppercase tracking-widest-xl text-muted-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
