-- Layer 3: Remove direct anon inserts — all form submissions must go through Edge Functions.
-- Migration: 20260607180100_remove_anon_insert_policies.sql

-- Drop any existing anon INSERT policies so browser console attacks are blocked.
DROP POLICY IF EXISTS "anon_insert_contact" ON contact_submissions;
DROP POLICY IF EXISTS "anon_insert_product" ON product_inquiries;
DROP POLICY IF EXISTS "anon_insert_fellowship" ON fellowship_applications;

-- Also drop any generic "allow anon insert" policies that may exist.
DROP POLICY IF EXISTS "Allow public inserts" ON contact_submissions;
DROP POLICY IF EXISTS "Allow public inserts" ON product_inquiries;
DROP POLICY IF EXISTS "Allow public inserts" ON fellowship_applications;
DROP POLICY IF EXISTS "Enable insert for anon" ON contact_submissions;
DROP POLICY IF EXISTS "Enable insert for anon" ON product_inquiries;
DROP POLICY IF EXISTS "Enable insert for anon" ON fellowship_applications;

-- Edge Functions use the service_role key which bypasses RLS entirely.
-- No new anon INSERT policies are added.
