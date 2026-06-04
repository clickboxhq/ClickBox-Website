
## ClickBox — Admin Portal, UI Fixes, Content & Premium CTA

A single coordinated update across backend, navigation, accordions, blog, About page, and CTA. The existing ClickBox brand, glassmorphism, typography, palette, and animations are preserved throughout.

---

### 1. Secure Admin Portal (replaces Google Sheets)

**Backend (single migration)**
- Enable Supabase **email/password auth** (no auto-confirm, no public signup from app — admins created in Cloud).
- Create `app_role` enum (`admin`, `moderator`) and `user_roles` table with `has_role()` security-definer function (per Lovable user-roles standard — roles never on profiles).
- Add admin-management columns to existing submission tables (no data loss):
  - `fellowship_applications`, `product_inquiries`, `contact_submissions` each get:
    `status` text default `'new'`, `notes` text, `reviewed_at`, `contacted_at`, `shortlisted_at`, `updated_at`.
- Add `SELECT`, `UPDATE`, `DELETE` RLS policies restricted to `has_role(auth.uid(), 'admin')` on all three tables (INSERT for anon stays as-is so forms keep working).
- Create `admin_audit_log` table (actor, action, target_table, target_id, payload, ts) with admin-only RLS, written on every status/notes change and delete.
- Add `updated_at` trigger.

**Frontend**
- New routes (lazy-loaded):
  - `/admin/login` — email + password sign-in, error states, redirect to `/admin` on success.
  - `/admin` — protected dashboard wrapper that checks session + `admin` role; otherwise redirect to `/admin/login`.
- Dashboard layout: sidebar with three tabs — **Fellowship**, **Product**, **Contact**. Top bar: search input, status filter, sort dropdown, "Export CSV", logout.
- Submissions table with columns from the spec, pagination (20/page), row click → detail drawer (full record + notes textarea + status chips: New / Reviewed / Contacted / Shortlisted + Delete with confirm).
- CSV export uses currently filtered/sorted set.
- All admin mutations go through `supabase` client; RLS enforces server-side; audit log written via DB trigger.

**Remove Google Sheets**
- Delete `mirror-to-sheets` calls in `FormShell.tsx` and the edge function directory. Forms now write to DB only and are immediately visible in the admin portal.

**Note:** First admin user must be created in the Lovable Cloud Auth panel (Users → Add user) and then assigned the `admin` role via a one-time `supabase--insert` after the migration runs. I'll guide you through this.

---

### 2. Fellowship Nav Button

- Remove dot indicator + glow styling.
- Restyle as a **grey rounded CTA button** matching "Our Services" / "Apply to the Fellowship" (border `white/10`, `bg-secondary/80`, hover `bg-muted`).
- Ensure it appears once in both desktop and mobile menus.

---

### 3. Site-wide Accordion Behavior

Audit and fix every accordion to: closed by default, only one open at a time, smooth animation.
- `ServicesAccordion.tsx` — already correct, verify.
- `Internship.tsx` — `WeekCard` currently uses local state per card (multiple can open). Refactor to lift `open` state to the phase container so only one week is open at a time.
- FAQ uses native `<details>` (multiple open). Convert to controlled accordion (single open index, framer-motion height animation) matching the rest of the system.

---

### 4. Blog Article Pages

- Extend `BlogPost` with `heroImage`, `tags`, optional `relatedSlugs`.
- New route `/resources/:slug` → `BlogPost.tsx` page with: hero image, category chip, title, publish date, author + role, read time, article body (renders paragraphs), Share buttons (Twitter/LinkedIn/copy-link), Related articles grid (3 cards).
- Make article cards in `Resources.tsx` actual `<Link to={'/resources/' + slug}>`.
- Add a `Resources` filter chip set: **All / Blog / Insights / Updates / Fellowship News** (mapping from existing categories).

---

### 5. About Page — Updated Values

Replace the 4 placeholder values with the 5 official ClickBox values:
**Integrity, Competence, Teamwork, Effectiveness, Fairness** — each as a glass card with a fitting Lucide icon (ShieldCheck, GraduationCap, Users, Target, Scale) and the supplied descriptions. Stagger fade-in animation, 5-col grid on `lg`, 2-col on `sm`.

---

### 6. Premium CTA Section (Homepage)

- Import the uploaded **ClickBox HQ building** image as a Lovable Asset (CDN pointer JSON, not bundled).
- Replace the existing closing area with a new full-width CTA:
  - Full-bleed building image background, dark gradient overlay (`from-background via-background/60 to-background/95`).
  - Centered glass content container (`max-w-3xl`, `backdrop-blur-2xl`, white/10 border).
  - Eyebrow: "Enterprise Cybersecurity".
  - Headline: **"Build Securely With ClickBox"**.
  - Subheadline as specified.
  - Two CTAs: **Book a Security Consultation** (primary → `/contact`), **Explore Services** (secondary → `/#services`).
  - Subtle parallax/scale on scroll, fade-in via framer-motion.
- Responsive: image stays cover on mobile, headline scales to `text-3xl` → `text-6xl`.

---

### Technical Notes

- Stack additions: `@tanstack/react-table` is **not** added — admin table is built with a small custom component to keep bundle lean.
- Auth state: lightweight `useAuth` hook with `onAuthStateChange` listener + `getUser()` re-validation; `<ProtectedRoute>` wrapper.
- `react-helmet-async` is not added; SEO meta for blog detail uses `useEffect` document.title updates.
- All forms continue to submit anonymously (public INSERT policy preserved); admin reads are gated.
- No region-specific copy added.

---

### Out of scope (flagging for awareness)

- Multi-admin self-serve invitation flow (only role-table foundation is added; future).
- Rich-text blog editor (content stays in `src/data/blog.ts` for now — easy to migrate to DB later).
- Email notifications on new submissions (can be added next round if desired).
