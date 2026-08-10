CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faqs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read faqs" ON public.faqs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage faqs" ON public.faqs FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.faqs (question, answer, sort_order) VALUES
('How far in advance should I book?', 'I recommend booking at least 3 months in advance for portrait sessions and 6–12 months for weddings and events, especially during peak season.', 0),
('How many photos will I receive?', 'Portrait sessions typically deliver 50–80 edited images. Wedding and event coverage delivers 300–500+ images depending on the package.', 1),
('How long does it take to receive my photos?', 'Portrait sessions are delivered within 7–10 business days. Wedding and event galleries are delivered within 3–4 weeks after the date.', 2),
('Do you travel for shoots?', 'Yes. I''m based in Accra and available for shoots across Ghana. Travel outside Accra may attract an additional fee depending on location and duration.', 3),
('What happens if it rains on my wedding day?', 'I''ve shot in all conditions. We''ll adapt the plan together — some of the most beautiful shots come from unexpected weather.', 4),
('Do you offer payment plans?', 'Yes. A deposit is required to secure your date, with the balance due before your session or event. Contact me to discuss a payment plan that works for you.', 5);