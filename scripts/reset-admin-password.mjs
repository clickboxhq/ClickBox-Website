/**
 * Reset admin password for info@useclickbox.com
 *
 * Uses current credentials to authenticate, then sets a new secure password.
 * Requires the OLD password to be correct (default: info@useclickbox.com).
 *
 * Usage:
 *   node scripts/reset-admin-password.mjs
 *
 * NEVER commit generated passwords to git.
 */

import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ADMIN_EMAIL = "info@useclickbox.com";
const OLD_PASSWORD = process.env.ADMIN_OLD_PASSWORD ?? "info@useclickbox.com";

function loadEnv() {
  const envPath = resolve(__dirname, "../.env");
  try {
    const raw = readFileSync(envPath, "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq);
      const val = trimmed.slice(eq + 1).replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    /* .env optional if vars already set */
  }
}

function generatePassword() {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const digits = "23456789";
  const special = "!@#$%&*";
  const all = upper + lower + digits + special;
  const pick = (chars) => chars[crypto.randomInt(chars.length)];
  const required = [pick(upper), pick(lower), pick(digits), pick(special)];
  const rest = Array.from({ length: 12 }, () => pick(all));
  const combined = [...required, ...rest];
  for (let i = combined.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }
  return combined.join("");
}

async function main() {
  loadEnv();

  const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const anonKey =
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.error("Missing VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env");
    process.exit(1);
  }

  const supabase = createClient(url, anonKey);
  const newPassword = generatePassword();

  console.log(`Signing in as ${ADMIN_EMAIL}...`);
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: OLD_PASSWORD,
    });

  if (signInError) {
    console.error("Sign-in failed:", signInError.message);
    console.error(
      "If the old password was already changed, set ADMIN_OLD_PASSWORD env var.",
    );
    process.exit(1);
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  await supabase.auth.signOut();

  if (updateError) {
    console.error("Password update failed:", updateError.message);
    process.exit(1);
  }

  console.log("\n✓ Admin password updated successfully\n");
  console.log("  Email:    ", ADMIN_EMAIL);
  console.log("  Password: ", newPassword);
  console.log("\nStore this password securely. It is NOT saved in the repository.\n");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
