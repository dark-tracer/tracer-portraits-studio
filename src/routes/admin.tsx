import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import {
  checkIsAdmin,
  ensureAdminRole,
  createEvent,
  deleteEvent,
  uploadEventPhoto,
  deletePhoto,
  uploadHeroImage,
  deleteHeroImage,
} from "@/lib/admin.functions";
import { listEvents, listHero, getEvent } from "@/lib/portfolio-db.functions";
import { Trash2, Upload, Plus, LogOut, X } from "lucide-react";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin — Traced in Light" }] }),
  component: AdminPage,
});

type Tab = "events" | "hero";

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
          <p className="text-muted-foreground">
            Sign in with the admin account to manage the portfolio.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen pt-32 pb-20 px-6 md:px-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-[11px] uppercase tracking-widest-xl text-[var(--gold)] mb-2">
              Studio
            </p>
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

        <div className="flex gap-8 border-b border-border mb-10">
          {(["events", "hero"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-4 text-[11px] uppercase tracking-widest-xl ${
                tab === t
                  ? "text-foreground border-b-2 border-[var(--gold)] -mb-px"
                  : "text-muted-foreground"
              }`}
            >
              {t === "events" ? "Events & Sessions" : "Hero Carousel"}
            </button>
          ))}
        </div>

        {tab === "events" ? <EventsTab /> : <HeroTab />}
      </div>
    </section>
  );
}

// ============ EVENTS TAB ============
function EventsTab() {
  const [events, setEvents] = useState<any[]>([]);
  const [openEvent, setOpenEvent] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const list = useServerFn(listEvents);
  const del = useServerFn(deleteEvent);

  const refresh = useCallback(() => list().then(setEvents), [list]);
  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-2xl">Events ({events.length})</h2>
        <button
          onClick={() => setShowNew(true)}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 text-[11px] uppercase tracking-widest-xl hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> New Event
        </button>
      </div>

      {showNew && <NewEventForm onClose={() => setShowNew(false)} onCreated={refresh} />}

      <div className="grid gap-4">
        {events.map((e) => (
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
        {events.length === 0 && (
          <p className="text-muted-foreground py-12 text-center">
            No events yet. Create one above.
          </p>
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

function NewEventForm({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const create = useServerFn(createEvent);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"portrait" | "wedding" | "event">("portrait");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
          await create({ data: { name, category, date, description } });
          onCreated();
          onClose();
        } finally {
          setBusy(false);
        }
      }}
      className="border border-border p-6 mb-6 grid gap-4"
    >
      <input
        required
        placeholder="Event name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border-b border-border bg-transparent py-2 outline-none"
      />
      <div className="grid md:grid-cols-2 gap-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as any)}
          className="border-b border-border bg-transparent py-2 outline-none"
        >
          <option value="portrait">Portrait</option>
          <option value="wedding">Wedding</option>
          <option value="event">Event</option>
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border-b border-border bg-transparent py-2 outline-none"
        />
      </div>
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border border-border bg-transparent p-3 outline-none min-h-[80px]"
      />
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={busy}
          className="bg-primary text-primary-foreground px-6 py-3 text-[11px] uppercase tracking-widest-xl"
        >
          {busy ? "Creating…" : "Create"}
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
      <div
        className="bg-background w-full max-w-4xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-serif text-2xl">{data?.event?.name ?? "Loading…"}</h2>
            <p className="text-[11px] uppercase tracking-widest-xl text-muted-foreground mt-2">
              {data?.photos?.length ?? 0} photos
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
        <p className="text-muted-foreground py-12 text-center">
          No hero images yet. Upload some above.
        </p>
      )}
    </div>
  );
}
