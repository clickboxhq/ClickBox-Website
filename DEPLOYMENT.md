# ClickBox Deployment Architecture

**Last audited:** 2026-06-08  
**Target architecture:** Lovable → GitHub → Vercel → Cloudflare DNS → useclickbox.com

> ⚠️ **Phases 1–7 below predate the 2026-09-04 migration.** They still describe the
> repo as `iamprinceefe/clickbox-shield-guard` and Vercel as a personal project.
> The **Current deployment** section immediately below is authoritative; treat the
> phase docs as historical context for the setup rationale.

---

## Current deployment (updated 2026-09-04)

| Item | Value |
|---|---|
| **Production URL** | https://www.useclickbox.com (apex `useclickbox.com` → 308 → `www`) |
| **GitHub repository** | https://github.com/clickboxhq/ClickBox-Website (`main`) |
| **Vercel team** | **ClickBox** (`click-box`) |
| **Vercel project** | **`clickbox-website`** — Git-connected to `clickboxhq/ClickBox-Website`, auto-deploys `main` |
| **Framework / build** | Vite · `npm run build` → `dist/` · SPA rewrites in `vercel.json` |
| **DNS / CDN** | Cloudflare (registrar + DNS), proxied. Zone `useclickbox.com`. |
| **TLS** | Cloudflare SSL/TLS mode must stay **Full (strict)** while proxied |

### What changed on 2026-09-04

- Repo moved `iamprinceefe/clickbox-shield-guard` → `clickboxhq/ClickBox-Website`
  (GitHub keeps a redirect from the old path).
- The old Vercel project (`clickbox-shield-guard`, personal `iamprinceefe` account)
  did **not** follow the transfer, so `main` stopped auto-deploying there.
- Created **`clickbox-website`** under the **ClickBox** Vercel team, connected it to
  the new repo, and deployed `main`.
- Moved `useclickbox.com` + `www.useclickbox.com` to `clickbox-website` via
  `_vercel` TXT ownership verification in Cloudflare (no registrar transfer needed —
  Cloudflare is the registrar).

### DNS records (Cloudflare zone `useclickbox.com`)

| Type | Name | Value | Notes |
|---|---|---|---|
| A | `@` | `64.29.17.65`, `216.198.79.65` | Vercel shared anycast |
| CNAME | `www` | Vercel-provided target | check Vercel → Domains for the current value |
| TXT | `_vercel` | `vc-domain-verify=useclickbox.com,…` + `…www.useclickbox.com,…` | ownership proof; stale `,dc`-suffixed entries from the old project can be deleted |
| MX / TXT (SPF, DKIM, DMARC) | Zoho mail | — | **do not touch** — unrelated to web hosting |

### Deploy / rollback

- **Deploy:** merge to `main` → Vercel builds and promotes to production automatically.
- **Manual:** `vercel deploy --prod --archive=tgz --scope click-box` from the repo root.
- **Rollback:** Vercel → `clickbox-website` → Deployments → pick a previous one → **Promote to Production**.

### Known follow-ups

- Old Vercel project `clickbox-shield-guard` (`iamprinceefe`) still Git-connects the
  same repo — disconnect its Git integration or delete the project so pushes don't
  build twice.
- Vercel shows a "Proxy Detected" warning; harmless while it worked before, but for
  Vercel's DDoS/bot mitigation set the `@` / `www` records to **DNS only** (grey
  cloud) — only after confirming Cloudflare SSL/TLS is **Full (strict)**.

---

## Phase 1 — Deployment Audit Report

### What is currently serving production

| Item | Finding |
|---|---|
| **Production URL** | https://useclickbox.com |
| **DNS provider** | Cloudflare (`kevin.ns.cloudflare.com`) |
| **Hosting / CDN** | **Vercel** (`Server: Vercel` response header) |
| **GitHub repository** | https://github.com/iamprinceefe/clickbox-shield-guard (`main`) |
| **Build tool** | Vite (`npm run build` → `dist/`) |
| **CI in repo** | None (no `.github/workflows`) — Vercel Git integration handles deploys |

### Why localhost and production previously differed

1. **Multiple deployment paths existed in the repo** (`netlify.toml`, `wrangler.toml`, Cloudflare `_redirects`/`_headers`) but production was not consistently wired to GitHub.
2. **Lovable** was the original publish path (README: Share → Publish). Direct Lovable publishing can bypass GitHub.
3. **Stale builds** were served when the active host was not rebuilding from the latest `main` commit.
4. **Hashed assets** (`/assets/index-*.js`) made it easy to confirm whether production matched GitHub — mismatched hashes = stale deploy.

### Current status (post-audit)

Production HTML now references the same bundle hashes as a fresh local `npm run build`, and includes favicon/manifest changes from recent commits. **Vercel is the active production host.**

### Deployment services inventory

| Service | Status | Action |
|---|---|---|
| **Lovable** | Keep — development & prototyping only | Disable direct production publish to useclickbox.com |
| **GitHub** | Keep — single source of truth | All production changes must land here first |
| **Vercel** | Keep — sole production deploy target | Connect to `main`, auto-deploy on push |
| **Cloudflare** | Keep — DNS, SSL, CDN proxy | Point domain to Vercel (instructions below) |
| **Netlify** (`netlify.toml`) | **Legacy / inactive** | Safe to ignore; not used by Vercel |
| **Cloudflare Pages** (`wrangler.toml`, `public/_redirects`, `public/_headers`) | **Legacy / inactive** | Safe to ignore; Vercel uses `vercel.json` |
| **Supabase Edge Functions** | Separate deploy path | Deploy via Supabase CLI/dashboard, not Vercel |

### Lovable publishing configuration

Evidence of Lovable in this project:

- `README.md` — "Share → Publish" workflow
- `lovable-tagger` in `vite.config.ts` (dev-only, stripped in production)
- `.lovable/plan.md`
- `src/assets/clickbox-hq.asset.json` — Lovable CDN asset pointer

**Required Lovable settings:**

1. Keep Lovable connected to the GitHub repo for bidirectional sync.
2. In Lovable → Project → Settings → Domains: **disconnect** `useclickbox.com` if still connected.
3. Use Lovable only for design/dev; never publish directly to production domain.

---

## Phase 2 — Repository Deployment Readiness

### Build verification

```bash
npm install
npm run build
```

| Check | Expected |
|---|---|
| Build command | `npm run build` |
| Output directory | `dist/` |
| Framework | Vite + React |
| Node version | 20 (recommended) |

### Environment variables (required in Vercel)

Set in **Vercel → Project → Settings → Environment Variables** for Production, Preview, and Development:

| Variable | Purpose |
|---|---|
| `ADMIN_EMAIL` | Admin login email (server-only) |
| `ADMIN_PASSWORD` | Admin login password (server-only) |
| `ADMIN_SECRET` | JWT signing secret, min 16 chars (server-only) |
| `BLOB_READ_WRITE_TOKEN` | Optional — persistent submission store on Vercel |
| `VITE_TURNSTILE_SITE_KEY` | Cloudflare Turnstile on forms (optional but recommended) |

See `.env.example` for the template. **Never commit `.env` to Git.**

### Static assets

| Asset | Location | Bundled by Vite |
|---|---|---|
| HQ building (CTA) | `src/assets/clickbox-hq.jpg` | Yes (hashed in `/assets/`) |
| Official logo | `src/assets/clickbox-logo.jpeg` | Yes (nav, admin, PDF export) |
| Favicon / PWA | `public/clickbox-logo.jpeg`, `public/site.webmanifest` | Copied to `dist/` root |
| Cert images | `src/assets/certifications/` | Yes |

### Redirects & SPA routing

Vercel handles SPA fallback via `vercel.json` rewrites. All client routes (`/about`, `/admin`, `/resources`, etc.) serve `index.html`.

---

## Phase 3 — Remove Deployment Conflicts

### Conflicting files (documented, not deleted)

These files remain in the repo for reference but **must not** be used for production:

| File | Original intent | Vercel behavior |
|---|---|---|
| `netlify.toml` | Netlify headers + build | Ignored by Vercel |
| `wrangler.toml` | Cloudflare Pages build | Ignored by Vercel |
| `public/_redirects` | Cloudflare Pages SPA | Copied to dist but Vercel uses `vercel.json` |
| `public/_headers` | Cloudflare Pages headers | Copied to dist but Vercel uses `vercel.json` |

### Checklist — eliminate duplicate deploy paths

- [ ] Vercel project connected to `iamprinceefe/clickbox-shield-guard` / `main`
- [ ] Vercel auto-deploy enabled for `main` branch
- [ ] Lovable custom domain **disconnected** from useclickbox.com
- [ ] Cloudflare Pages project (if any) **deleted or disconnected** from useclickbox.com
- [ ] Netlify site (if any) **deleted or disconnected** from useclickbox.com
- [ ] No manual/direct uploads to any host except via Vercel Git deploy

---

## Phase 4 — Vercel Deployment Configuration

### Vercel project settings

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |
| Node.js Version | 20.x |
| Production Branch | `main` |

### Repo config

`vercel.json` at project root defines SPA rewrites, asset caching, and security headers.

### First-time Vercel setup

1. Go to https://vercel.com/new
2. Import `iamprinceefe/clickbox-shield-guard` from GitHub
3. Confirm build settings match table above
4. Add environment variables from `.env.example`
5. Deploy
6. Attach custom domain `useclickbox.com` (see Phase 5)

---

## Phase 5 — Domain Preparation (Cloudflare DNS → Vercel)

**Do not modify DNS until Vercel project is deployed and healthy.**

### Step 1 — Add domain in Vercel

Vercel → Project → Settings → Domains → Add `useclickbox.com` and `www.useclickbox.com`

Vercel will show the required DNS records.

### Step 2 — Cloudflare DNS records

| Type | Name | Value | Proxy |
|---|---|---|---|
| **A** | `@` | `76.76.21.21` | DNS only (grey cloud) recommended for Vercel |
| **CNAME** | `www` | `cname.vercel-dns.com` | DNS only recommended |

> Vercel may provide different values — always use what Vercel dashboard shows for your project.

### Step 3 — SSL

- Vercel provisions SSL automatically once DNS propagates.
- In Cloudflare → SSL/TLS: set mode to **Full** (not Flexible) when proxying through Cloudflare.

### Step 4 — WWW redirect

Configure in Vercel → Domains:

- `www.useclickbox.com` → redirect to `useclickbox.com` (or vice versa — pick one canonical).

### Step 5 — Remove old DNS records

Delete any A/CNAME records pointing to:

- Cloudflare Pages (`*.pages.dev`)
- Netlify (`*.netlify.app`)
- Lovable publish endpoints
- Old manual upload hosts

### Step 6 — Verify

```bash
# Should return Vercel
curl -sI https://useclickbox.com | findstr /i "server x-vercel"

# Bundle hash should match latest build
curl -sL https://useclickbox.com | findstr "index-"
```

---

## Phase 6 — Production Validation Checklist

Run after every production deploy. Compare against `npm run dev` locally.

### Core pages

- [ ] Landing page (`/`)
- [ ] About (`/about`)
- [ ] Resources (`/resources`)
- [ ] ThreatLens solution (`/solutions/threatlens`; `/product` and `/solutions` client-redirect to it)
- [ ] Fellowship / Internship (`/internship`)
- [ ] Contact (`/contact`)
- [ ] Blog posts (`/resources/:slug`)
- [ ] Privacy (`/privacy`)
- [ ] 404 (`/not-found`)

### CTA section

- [ ] **Desktop CTA** — building visible, logo on building visible, no layout change
- [ ] **Mobile CTA** — building visible, roof logo visible, no excessive zoom/crop
- [ ] **Tablet (≥768px)** — matches desktop CTA

### Forms

- [ ] Contact form submission
- [ ] Product inquiry form
- [ ] Fellowship application form
- [ ] Turnstile widget loads (if `VITE_TURNSTILE_SITE_KEY` set)

### Admin portal

- [ ] `/admin/login` — login works
- [ ] `/admin` — dashboard loads after auth
- [ ] MFA setup/verify flows
- [ ] Export CSV / Excel / PDF
- [ ] Reject / status updates

### Branding

- [ ] Navbar logo (`clickbox-logo.jpeg`)
- [ ] Browser tab favicon
- [ ] Apple touch icon
- [ ] Mobile navigation

### Responsiveness

- [ ] iPhone (Safari + Chrome)
- [ ] Android (Chrome)
- [ ] Tablet landscape
- [ ] Desktop (Chrome, Firefox, Edge, Safari)

### Deployment parity

- [ ] Production JS/CSS hash matches latest Vercel deployment
- [ ] `git log -1` commit matches Vercel deployment commit

---

## Phase 7 — Future Deployment Workflow

```
┌─────────────┐     ┌──────────────┐     ┌─────────┐     ┌────────────┐     ┌─────────────────┐
│   Lovable   │ ──► │    GitHub    │ ──► │  Vercel │ ──► │ Cloudflare │ ──► │ useclickbox.com │
│  (design)   │     │ (source of   │     │ (build  │     │   (DNS)    │     │   (production)  │
│             │     │   truth)     │     │ + host) │     │            │     │                 │
└─────────────┘     └──────────────┘     └─────────┘     └────────────┘     └─────────────────┘
       ▲                    ▲
       │                    │
   Cursor IDE          Manual PRs
 (engineering)        (code review)
```

### Rules

1. **All production changes** go through GitHub `main`.
2. **Lovable** syncs to GitHub; never publish directly to production domain.
3. **Vercel** auto-deploys on every push to `main`.
4. **Cloudflare** manages DNS only (SSL optional via proxy).
5. **Cursor** is used for engineering, security, and maintenance — same GitHub flow.
6. **Supabase** migrations and Edge Functions deploy separately via Supabase tooling.

### Rollback

Vercel → Deployments → select previous deployment → **Promote to Production**.

---

## Success Criteria

- [x] Production hosted on Vercel
- [x] `vercel.json` in repository
- [x] Environment variable template (`.env.example`)
- [ ] Lovable direct publish disconnected from useclickbox.com
- [ ] Cloudflare DNS points exclusively to Vercel
- [ ] Every `main` push auto-deploys within minutes
- [ ] Localhost, GitHub, and production render identically
