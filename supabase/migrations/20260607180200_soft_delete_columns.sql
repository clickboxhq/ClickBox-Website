-- Layer 10: Soft delete columns on submission tables
-- Migration: 20260607180200_soft_delete_columns.sql

ALTER TABLE fellowship_applications
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

ALTER TABLE product_inquiries
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

ALTER TABLE contact_submissions
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

-- Indexes for filtering out deleted rows efficiently
CREATE INDEX IF NOT EXISTS idx_fellowship_deleted_at ON fellowship_applications(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_product_deleted_at ON product_inquiries(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_contact_deleted_at ON contact_submissions(deleted_at) WHERE deleted_at IS NULL;
