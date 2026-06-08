-- Security hardening: lock down unused public surfaces

-- 1. Remove open waitlist INSERT (no active form; use Edge Functions if re-enabled)
DROP POLICY IF EXISTS "Anyone can submit to waitlist" ON public.waitlist_submissions;

-- 2. Remove anon storage upload for fellowship resumes (forms use URL links only)
DROP POLICY IF EXISTS "Anyone can upload fellowship resumes" ON storage.objects;

-- 3. Add HTML constraint to product_inquiries (parity with contact_submissions)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'pi_no_html'
  ) THEN
    ALTER TABLE public.product_inquiries
      ADD CONSTRAINT pi_no_html CHECK (message !~ '<[^>]+>');
  END IF;
END $$;

NOTIFY pgrst, 'reload schema';
