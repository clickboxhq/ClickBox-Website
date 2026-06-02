
CREATE TABLE public.fellowship_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  linkedin TEXT NOT NULL,
  resume_url TEXT,
  preferred_pathway TEXT NOT NULL,
  certifications TEXT,
  certification_links TEXT,
  relevant_experience TEXT,
  motivation TEXT NOT NULL,
  portfolio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.fellowship_applications TO anon, authenticated;
GRANT ALL ON public.fellowship_applications TO service_role;
ALTER TABLE public.fellowship_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit fellowship applications"
  ON public.fellowship_applications FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE TABLE public.product_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  product_interest TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.product_inquiries TO anon, authenticated;
GRANT ALL ON public.product_inquiries TO service_role;
ALTER TABLE public.product_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit product inquiries"
  ON public.product_inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_submissions TO anon, authenticated;
GRANT ALL ON public.contact_submissions TO service_role;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
