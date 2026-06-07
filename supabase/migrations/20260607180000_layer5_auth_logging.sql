-- Layer 5: Auth event logging columns on admin_audit_log
-- Migration: 20260607180000_layer5_auth_logging.sql

ALTER TABLE admin_audit_log
  ADD COLUMN IF NOT EXISTS ip_address TEXT,
  ADD COLUMN IF NOT EXISTS user_agent TEXT,
  ADD COLUMN IF NOT EXISTS session_id TEXT;

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON admin_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON admin_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor ON admin_audit_log(actor_id);
