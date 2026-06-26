
CREATE POLICY "Users read own scalp photos" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'scalp-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users upload own scalp photos" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'scalp-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users update own scalp photos" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'scalp-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users delete own scalp photos" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'scalp-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
