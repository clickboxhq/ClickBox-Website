-- Restore public form INSERT policies (direct client submissions, no Edge Functions)

DROP POLICY IF EXISTS "anon_insert_contact" ON public.contact_submissions;
DROP POLICY IF EXISTS "anon_insert_product" ON public.product_inquiries;
DROP POLICY IF EXISTS "anon_insert_fellowship" ON public.fellowship_applications;
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
DROP POLICY IF EXISTS "Anyone can submit product inquiries" ON public.product_inquiries;
DROP POLICY IF EXISTS "Anyone can submit fellowship applications" ON public.fellowship_applications;

CREATE POLICY "anon_insert_contact"
  ON public.contact_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "anon_insert_product"
  ON public.product_inquiries FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "anon_insert_fellowship"
  ON public.fellowship_applications FOR INSERT TO anon, authenticated
  WITH CHECK (true);

GRANT INSERT ON public.contact_submissions TO anon, authenticated;
GRANT INSERT ON public.product_inquiries TO anon, authenticated;
GRANT INSERT ON public.fellowship_applications TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
