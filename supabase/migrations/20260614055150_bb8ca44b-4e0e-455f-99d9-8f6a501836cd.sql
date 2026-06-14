
CREATE POLICY "Admins manage portfolio objects"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'));
