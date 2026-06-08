-- Ensure rejected_at columns exist on all submission tables.
-- Safe to run multiple times (IF NOT EXISTS).
-- Migration: 20260608120000_ensure_rejected_at_columns.sql

ALTER TABLE public.fellowship_applications
  ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ;

ALTER TABLE public.product_inquiries
  ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ;

ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ;

-- Refresh PostgREST schema cache after column changes
NOTIFY pgrst, 'reload schema';
