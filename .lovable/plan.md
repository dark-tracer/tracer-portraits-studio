# Build Plan

## 1. Enable Lovable Cloud
Turn on Cloud to get a database, auth, and file storage for photos. Without it, none of the admin-driven features can work.

## 2. Database schema (migration)
Three new tables in `public`:
- **events** — id, name, category (`portrait` | `wedding` | `event`), date, description, cover_photo_id, created_at
- **photos** — id, event_id (nullable for hero-only), storage_path, public_url, alt, sort_order, created_at
- **hero_images** — id, storage_path, public_url, sort_order, created_at

Plus the standard roles pattern:
- `app_role` enum (`admin`, `user`)
- `user_roles` table + `has_role()` security-definer function
- RLS: public can `SELECT` everything (portfolio is public); only admins can `INSERT/UPDATE/DELETE`

Storage bucket `portfolio` (public read) for all uploads.

## 3. Admin account
- You sign up once at `/auth` with **bernieamponsah12@gmail.com** / **password**
- A one-time setup server function grants you the `admin` role (idempotent: only works if no admin exists yet, or for that specific email)
- Email confirmation disabled so the first login is instant

> Note: "password" is a weak password and Supabase may reject it depending on settings. If so, I'll lower the minimum length or suggest a stronger one. I'll keep what you asked unless it's blocked.

## 4. Admin console — `/admin` (protected)
Single dashboard with three tabs:
- **Events** — create / edit / delete events; upload multiple photos per event; pick a cover; reorder
- **Hero Carousel** — upload / delete / reorder hero images
- **All Photos** — quick view of everything uploaded, delete individual photos

Uses drag-and-drop file input, shows thumbnails, optimistic updates via TanStack Query.

## 5. Public site changes
- **Home hero** — replace static image with a fade/slide carousel of `hero_images` (autoplay, pause on hover). Falls back to a neutral placeholder if empty.
- **Portfolio** — read events + photos from DB instead of `portfolioData.json`. "Recently Added" = 3 newest photos across all events, ordered by `photos.created_at desc`. Delete the JSON file and old portfolio assets.
- **Event page** — same layout, DB-backed.
- **Contact page** — email `bernieamponsah2@gmail.com`, Instagram `@trac.erphotography`, location "Accra, Ghana".

## 6. Cleanup
Delete `src/data/portfolioData.json` and the `portfolio-1..8.jpg` assets so the portfolio starts empty as requested.

---

## Technical notes
- Auth: Lovable Cloud email/password, `_authenticated/` layout already exists for route gating; `/admin` adds an extra `has_role('admin')` check via a server fn.
- Uploads go through a `createServerFn` that streams to the `portfolio` storage bucket and inserts the DB row in one step (so RLS is enforced by `requireSupabaseAuth` + admin check).
- All reads are public via `supabaseAdmin` in server fns (loader-safe for SSR/prerender).
- Hero carousel: lightweight, no extra deps — uses CSS + a `setInterval`.

Confirm and I'll build it.