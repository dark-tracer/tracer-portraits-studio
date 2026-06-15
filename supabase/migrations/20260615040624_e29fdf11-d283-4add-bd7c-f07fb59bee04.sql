
-- ============ SECURITY FIXES ============

-- Lock down user_roles writes
DROP POLICY IF EXISTS "Admins manage user_roles" ON public.user_roles;
CREATE POLICY "Admins manage user_roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Restrict has_role execution to server (service_role only); revoke from end users
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

-- Storage policies for the private 'portfolio' bucket — admins only;
-- public read is served via our /api/public/img proxy (service role).
DROP POLICY IF EXISTS "Admins read portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Admins write portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Admins update portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete portfolio" ON storage.objects;
CREATE POLICY "Admins read portfolio" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins write portfolio" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update portfolio" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete portfolio" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'::app_role));

-- ============ ABOUT CONTENT (singleton) ============
CREATE TABLE public.about_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_storage_path text,
  image_url text,
  headline text NOT NULL DEFAULT 'I make pictures the way I''d want to be remembered.',
  body text NOT NULL DEFAULT '',
  weddings_captured text NOT NULL DEFAULT '200+',
  years_behind_lens text NOT NULL DEFAULT '9 yrs',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.about_content TO anon, authenticated;
GRANT ALL ON public.about_content TO service_role;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read about" ON public.about_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage about" ON public.about_content FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.about_content (body) VALUES (
'Traced in Light began with film, with the patience it requires, and with the belief that a single honest frame outlives a hundred polished ones.

For nearly a decade I''ve photographed people in the most ordinary and the most consequential days of their lives — quiet portraits in slow afternoon light, weddings that felt more like family dinners than productions.

My approach is calm, observational, and deeply collaborative. We''ll talk long before the camera comes out. The pictures will follow.'
);

-- ============ PACKAGES ============
CREATE TABLE public.packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  starting text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  includes text[] NOT NULL DEFAULT ARRAY[]::text[],
  featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.packages TO anon, authenticated;
GRANT ALL ON public.packages TO service_role;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read packages" ON public.packages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage packages" ON public.packages FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.packages (title, starting, description, includes, featured, sort_order) VALUES
('Portrait Session', 'Starting from $650', 'An intimate, two-hour session for individuals, couples, or families. Includes pre-session consult, location scouting, and a curated gallery of 40+ refined frames.', ARRAY['2-hour session','1 location','40+ edited images','Online gallery'], false, 1),
('Wedding Coverage', 'Inquire for pricing', 'Full-day documentary coverage for couples who value presence over performance. From the quiet morning to the last dance — captured in full editorial detail.', ARRAY['8–10 hr coverage','Second photographer','500+ images','Heirloom album option'], true, 2),
('Events & Brand', 'Starting from $1,200', 'Editorial event and brand photography for studios, launches, and celebrations. Designed to give your moment the same quiet weight as a portrait.', ARRAY['Half or full day','Editorial direction','150+ images','Commercial license'], false, 3);

-- ============ TESTIMONIALS ============
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote text NOT NULL,
  attribution text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage testimonials" ON public.testimonials FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.testimonials (quote, attribution, sort_order) VALUES
('Tracer made us forget the camera was there. What came back felt less like a wedding album and more like a memory we could hold.', '— Elena & Marcus, Wedding 2024', 1),
('She has a way of seeing people. The portraits she made of my mother are the only photographs of her I''ll ever need.', '— Naomi K., Portrait Session', 2),
('Calm, precise, completely trustworthy. The kind of artist you book once and recommend forever.', '— Atelier Norte, Brand Event', 3);
