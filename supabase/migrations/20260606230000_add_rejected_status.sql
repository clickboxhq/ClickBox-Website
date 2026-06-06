-- Add "rejected" to status handling (no enum change needed — status is TEXT type already)
-- Ensure the index exists for faster status queries
CREATE INDEX IF NOT EXISTS idx_fellowship_status ON public.fellowship_applications (status);
CREATE INDEX IF NOT EXISTS idx_product_status ON public.product_inquiries (status);
CREATE INDEX IF NOT EXISTS idx_contact_status ON public.contact_submissions (status);

-- Add rejected_at timestamp column to fellowship applications
ALTER TABLE public.fellowship_applications ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ;
ALTER TABLE public.product_inquiries ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ;
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ;
