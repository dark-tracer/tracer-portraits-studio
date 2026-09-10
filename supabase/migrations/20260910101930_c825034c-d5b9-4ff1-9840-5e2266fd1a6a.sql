CREATE TABLE public.service_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  package_name text NOT NULL,
  price_ghs numeric NOT NULL DEFAULT 0,
  duration text NOT NULL DEFAULT '',
  edited_images text NOT NULL DEFAULT '',
  extras text[] NOT NULL DEFAULT ARRAY[]::text[],
  delivery_days integer NOT NULL DEFAULT 7,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.service_packages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_packages TO authenticated;
GRANT ALL ON public.service_packages TO service_role;

ALTER TABLE public.service_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active service packages" ON public.service_packages
  FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE POLICY "Admins manage service packages" ON public.service_packages
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$
LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_service_packages_updated_at
BEFORE UPDATE ON public.service_packages
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.service_packages (category, package_name, price_ghs, duration, edited_images, extras, delivery_days, display_order) VALUES
('Portrait Photography','Essential',350,'1-hour session','20 edited digital images',ARRAY['1 location'],7,1),
('Portrait Photography','Classic',600,'2-hour session','40 edited digital images',ARRAY['Up to 2 locations'],7,2),
('Portrait Photography','Signature',950,'3-hour session','60+ edited digital images',ARRAY['Multiple locations','Online gallery'],5,3),
('Graduation Photography','Graduate',400,'1.5-hour session','25 edited digital images',ARRAY['1 location'],7,1),
('Graduation Photography','Honours',700,'2.5-hour session','50 edited digital images',ARRAY['Up to 2 locations'],7,2),
('Graduation Photography','Distinction',1100,'Half-day session','80+ edited digital images',ARRAY['Multiple locations','Private online gallery'],5,3),
('Weddings & Events','Essential',1500,'4-hour coverage','150+ edited digital images',ARRAY['1 photographer','Online gallery'],14,1),
('Weddings & Events','Classic',2500,'Full-day coverage (8 hours)','300+ edited digital images',ARRAY['1 photographer','Online gallery'],14,2),
('Weddings & Events','Premium',4000,'Full-day coverage (10 hours)','500+ edited digital images',ARRAY['1 photographer plus 1 assistant','Private online gallery'],10,3);