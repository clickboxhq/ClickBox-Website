-- Migration: Layer 7 — Database Hardening
-- Adds DB-level constraints, soft-delete columns, ip/user_agent tracking,
-- resume URL columns, and waitlist admin SELECT policy.

-- ─── IP address & user agent tracking ────────────────────────────────────────

ALTER TABLE contact_submissions
  ADD COLUMN IF NOT EXISTS ip_address TEXT,
  ADD COLUMN IF NOT EXISTS user_agent TEXT;

ALTER TABLE fellowship_applications
  ADD COLUMN IF NOT EXISTS ip_address TEXT,
  ADD COLUMN IF NOT EXISTS user_agent TEXT;

ALTER TABLE product_inquiries
  ADD COLUMN IF NOT EXISTS ip_address TEXT,
  ADD COLUMN IF NOT EXISTS user_agent TEXT;

-- ─── Resume URL columns (Layer 6) ─────────────────────────────────────────────

ALTER TABLE fellowship_applications
  ADD COLUMN IF NOT EXISTS resume_url_domain TEXT,
  ADD COLUMN IF NOT EXISTS resume_url_verified_at TIMESTAMPTZ;

-- ─── DB-level constraints ─────────────────────────────────────────────────────

-- contact_submissions
ALTER TABLE contact_submissions
  DROP CONSTRAINT IF EXISTS cs_email_format,
  DROP CONSTRAINT IF EXISTS cs_name_length,
  DROP CONSTRAINT IF EXISTS cs_message_length,
  DROP CONSTRAINT IF EXISTS cs_no_html;

ALTER TABLE contact_submissions
  ADD CONSTRAINT cs_email_format CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  ADD CONSTRAINT cs_name_length   CHECK (char_length(name) BETWEEN 1 AND 120),
  ADD CONSTRAINT cs_message_length CHECK (char_length(message) BETWEEN 5 AND 5000),
  ADD CONSTRAINT cs_no_html       CHECK (message !~ '<[^>]+>');

-- product_inquiries
ALTER TABLE product_inquiries
  DROP CONSTRAINT IF EXISTS pi_email_format,
  DROP CONSTRAINT IF EXISTS pi_name_length,
  DROP CONSTRAINT IF EXISTS pi_message_length;

ALTER TABLE product_inquiries
  ADD CONSTRAINT pi_email_format  CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  ADD CONSTRAINT pi_name_length   CHECK (char_length(name) BETWEEN 1 AND 120),
  ADD CONSTRAINT pi_message_length CHECK (char_length(message) BETWEEN 5 AND 5000);

-- fellowship_applications
ALTER TABLE fellowship_applications
  DROP CONSTRAINT IF EXISTS fa_email_format,
  DROP CONSTRAINT IF EXISTS fa_name_length,
  DROP CONSTRAINT IF EXISTS fa_resume_https,
  DROP CONSTRAINT IF EXISTS fa_resume_length;

ALTER TABLE fellowship_applications
  ADD CONSTRAINT fa_email_format  CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  ADD CONSTRAINT fa_name_length   CHECK (char_length(full_name) BETWEEN 1 AND 120),
  ADD CONSTRAINT fa_resume_https  CHECK (resume_url IS NULL OR resume_url LIKE 'https://%'),
  ADD CONSTRAINT fa_resume_length CHECK (resume_url IS NULL OR char_length(resume_url) <= 500);

-- ─── Soft delete columns ──────────────────────────────────────────────────────

ALTER TABLE fellowship_applications
  ADD COLUMN IF NOT EXISTS deleted_at  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS deleted_by  UUID REFERENCES auth.users(id);

ALTER TABLE contact_submissions
  ADD COLUMN IF NOT EXISTS deleted_at  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS deleted_by  UUID REFERENCES auth.users(id);

ALTER TABLE product_inquiries
  ADD COLUMN IF NOT EXISTS deleted_at  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS deleted_by  UUID REFERENCES auth.users(id);

-- ─── Waitlist admin SELECT policy ─────────────────────────────────────────────

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'waitlist_submissions'
  ) THEN
    -- Drop existing conflicting policy if any
    DROP POLICY IF EXISTS "admins_select_waitlist" ON waitlist_submissions;

    CREATE POLICY "admins_select_waitlist" ON waitlist_submissions
      FOR SELECT TO authenticated
      USING (has_role(auth.uid(), 'admin'));
  END IF;
END$$;

-- ─── Postgres trigger for automatic audit logging ─────────────────────────────

CREATE OR REPLACE FUNCTION log_submission_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO admin_audit_log (action, target_table, target_id, payload, created_at)
    VALUES (
      'row_updated',
      TG_TABLE_NAME,
      OLD.id::TEXT,
      jsonb_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW)),
      NOW()
    );
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO admin_audit_log (action, target_table, target_id, payload, created_at)
    VALUES (
      'row_deleted',
      TG_TABLE_NAME,
      OLD.id::TEXT,
      row_to_json(OLD)::jsonb,
      NOW()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS audit_fellowship_changes  ON fellowship_applications;
DROP TRIGGER IF EXISTS audit_contact_changes     ON contact_submissions;
DROP TRIGGER IF EXISTS audit_product_changes     ON product_inquiries;

CREATE TRIGGER audit_fellowship_changes
  AFTER UPDATE OR DELETE ON fellowship_applications
  FOR EACH ROW EXECUTE FUNCTION log_submission_changes();

CREATE TRIGGER audit_contact_changes
  AFTER UPDATE OR DELETE ON contact_submissions
  FOR EACH ROW EXECUTE FUNCTION log_submission_changes();

CREATE TRIGGER audit_product_changes
  AFTER UPDATE OR DELETE ON product_inquiries
  FOR EACH ROW EXECUTE FUNCTION log_submission_changes();
