-- Private bucket for fellowship resume uploads (PDF / Word, max 5MB)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'fellowship-resumes',
  'fellowship-resumes',
  false,
  5242880,
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Anyone can upload fellowship resumes" ON storage.objects;
CREATE POLICY "Anyone can upload fellowship resumes"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'fellowship-resumes');

DROP POLICY IF EXISTS "Admins can read fellowship resumes" ON storage.objects;
CREATE POLICY "Admins can read fellowship resumes"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'fellowship-resumes'
    AND public.has_role(auth.uid(), 'admin')
  );

DROP POLICY IF EXISTS "Admins can delete fellowship resumes" ON storage.objects;
CREATE POLICY "Admins can delete fellowship resumes"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'fellowship-resumes'
    AND public.has_role(auth.uid(), 'admin')
  );
