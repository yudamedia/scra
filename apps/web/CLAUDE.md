# SCRA Website — Project Context for Claude Code

This file exists so you don't have to rediscover, the expensive way, decisions and mistakes already made in this project's development history. Read it fully before making changes.

## What this project is

The website for the **South Coast Residents Association (SCRA)**, a Kenyan civic association representing residents, property owners, and businesses on Kenya's South Coast, from Likoni to Lunga Lunga. Production domain (current live site, being replaced): www.scra.co.ke.

Reference materials live in `~/projects/scra/apps/web/materials/`:

- `project-synopsis.md` — original site brief, information architecture, technology choices
- `SCRA Design System Stylesheet.md` — full design system (colors, type, spacing, components) as originally specified
- `DesignSystemlrg.png` — visual reference sheet for the design system (palette swatches, type scale, UI components, imagery style)
- `scraproposed.png` — a full homepage mockup showing the intended nav structure and page layout
- `Member_Application_Form.pdf` — the paper Personal/Household/Corporate membership form; source of truth for the `memberships` collection fields (see Member Portal section)
- `SCRA_2025_as_at_16_06_2025.xlsx` — the real 2025 membership register (241 records); source data for the legacy migration (see Member Portal section)

**Read `scraproposed.png` carefully before building the homepage or nav** — it is the visual target, not a rough guide. Match its section order, nav structure, and layout intent closely, adapting only where real data availability requires it.

Images to use as header background cn be found in ~/projects/scra/apps/web/materials/images 

## Immediate goals for this phase

1. **Full navigation menu** matching the structure implied by `scraproposed.png` and `project-synopsis.md`'s information architecture (Home, About Us, Issues, News & Events, Resources, Membership, Contact — likely with dropdowns for sub-pages). The current nav (`src/components/site-header.tsx`) is a flat list of only 6 links and needs to be replaced/expanded.
2. **Homepage rebuild** to match `scraproposed.png`'s layout: hero, quick-link icon row, news/updates cards, "issues we're working on" cards, membership CTA banner, upcoming events + map row, footer with quick links and social icons. The current homepage (`src/app/(frontend)/page.tsx`) is a simpler first pass and should be treated as a working draft, not a fixed foundation.
3. **New About Us content/pages** — "About SCRA", possibly "Membership" and "Contact" as their own pages. Draft this content from `project-synopsis.md` (brand purpose, mission) and the organizational facts already seeded in Payload (see Content State below), not invented. Where a fact isn't available anywhere, flag it for the client rather than inventing it — see the "Known issues" section below for an example of this going wrong previously.

## Tech stack

- **Next.js 16.2.12** — App Router, TypeScript, Turbopack, `src/` directory
- **Tailwind CSS v4** — no `tailwind.config.ts`; all theme tokens live in `@theme` / `:root` blocks inside `src/app/(frontend)/globals.css`
- **shadcn/ui** — Base UI primitives, "Maia" preset, icon library `hugeicons`. Only `button` was ever formally installed via the CLI; most UI in this project is hand-rolled Tailwind rather than shadcn components, by deliberate choice (see Gotchas)
- **Payload CMS 3.87.0** — installed **manually** (not via `create-payload-app`), runs inside the Next.js app via `withPayload()` in `next.config.ts`
- **PostgreSQL 16** — via Docker (`docker-compose.yml` at repo root, service `postgres`, container `scra_postgres`)
- **Better Auth 1.x** — installed but **no UI built yet**; wired for a future Member Portal, fully separate from Payload's admin auth
- **pnpm 11.18.0**

## Directory structure

```
~/projects/scra/
├── docker-compose.yml              # Postgres only
└── apps/web/                       # the actual Next.js project — run all commands from here
    ├── materials/                  # reference docs for this handoff (see above)
    ├── src/
    │   ├── app/
    │   │   ├── (frontend)/         # public site — has its own root layout (html/body)
    │   │   │   ├── layout.tsx      # loads Poppins/Inter fonts, wraps SiteHeader/SiteFooter
    │   │   │   ├── page.tsx        # homepage
    │   │   │   ├── globals.css     # Tailwind v4 theme tokens live here
    │   │   │   ├── areas/          # index + [slug] detail
    │   │   │   ├── issues/         # index + [slug] detail
    │   │   │   ├── news/           # index + [slug] detail (maps to `posts` collection)
    │   │   │   ├── directory/
    │   │   │   ├── committees/
    │   │   │   ├── leadership/     # maps to `people` collection
    │   │   │   └── api/auth/[...all]/route.ts   # Better Auth handler
    │   │   └── (payload)/          # Payload admin — also its own root layout, do not hand-edit
    │   ├── collections/            # Payload collection configs (see Content Model below)
    │   ├── components/             # site-header, site-footer, issue-card, person-card, etc.
    │   ├── lib/
    │   │   ├── payload.ts          # getPayloadClient() — use this for all Local API reads
    │   │   ├── auth.ts             # Better Auth instance (Postgres `auth` schema)
    │   │   ├── format.ts           # formatLabel(), statusStyles, directoryCategoryLabels, roleOrder
    │   │   └── default-thumbnail.ts
    │   ├── payload.config.ts       # collections registered here
    │   └── seed/                   # one-off seed scripts — see Content State below
    ├── next.config.ts              # wrapped with withPayload()
    └── .env                        # DATABASE_URI, PAYLOAD_SECRET, BETTER_AUTH_SECRET, etc. — gitignored
```

## Content model (Payload collections)

| Collection          | Key fields                                                                                                                                                                                                                                                                                                            | Notes                                                            |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `users`             | auth-enabled                                                                                                                                                                                                                                                                                                          | Payload admin login only                                         |
| `media`             | `alt`, `caption`, image upload                                                                                                                                                                                                                                                                                        | generic image library                                            |
| `documents`         | `title`, `category` (select), `summary`, `publishedDate`, PDF/doc upload                                                                                                                                                                                                                                              | "Knowledge Centre" source data — **no frontend pages built yet**; needs `visibility` field added (see Member Portal section) |
| `areas`             | `name`, `slug`, `heroImage`, `overview` (richText), `keyServices` (array), `attractions` (richText)                                                                                                                                                                                                                   |                                                                  |
| `issues`            | `title`, `slug`, `category`/`status` (select), `area` (relationship), `featuredImage`, `gallery` (array of upload+caption), `background`/`actionsUndertaken` (richText), `progressUpdates` (array: date+update), `supportingDocuments` (relationship→documents, hasMany), `relatedNews` (relationship→posts, hasMany) | most fully-built collection; good reference for patterns         |
| `directory-entries` | `name`, `category` (select), `area` (relationship), `address`/`phone`/`email`/`website`, `description`                                                                                                                                                                                                                |                                                                  |
| `committees`        | `name`, `description` (richText)                                                                                                                                                                                                                                                                                      |                                                                  |
| `people`            | `name`, `role`, `committee` (relationship), `photo` (upload), `bio` (richText)                                                                                                                                                                                                                                        | maps to "Leadership" on frontend; **distinct from `memberships` below — do not conflate** |
| `posts`             | `title`, `slug`, `excerpt`, `featuredImage`, `content` (richText), `relatedIssues` (relationship, hasMany), `publishedDate`                                                                                                                                                                                           | maps to "Newsroom"/"News" on frontend                            |
| `events`            | `title`, `eventType` (select), `area` (relationship), `startDate`/`endDate`, `location`, `description` (richText), `image` (upload)                                                                                                                                                                                   | **schema exists, zero records, no frontend pages**; needs `visibility` field added (see Member Portal section) |
| `memberships`       | *(planned, not yet built — see Member Portal section)*                                                                                                                                                                                                                                                                | new collection for Personal/Household/Corporate membership records |
| `payments`          | *(planned, not yet built — see Member Portal section)*                                                                                                                                                                                                                                                                | new collection for Tuma STK Push + manual reconciliation records |
| `issue-reports`     | *(planned, not yet built — see Member Portal section)*                                                                                                                                                                                                                                                                | new collection — resident-submitted reports, distinct from curated `issues` |


Rich text is Lexical. Render with `<RichText data={field} />` from `@payloadcms/richtext-lexical/react`. Seed scripts build Lexical JSON via a helper at `src/seed/lexical.ts` (`toLexicalRichText(plainText)`).

## Content state — what's real vs. what's missing

All seeded content is **real, sourced material** — either scraped/paraphrased from SCRA's live site (www.scra.co.ke), pulled from an authoritative "Executive Office Bearers" document, or extracted from a batch of real PDFs (letters, memoranda, meeting minutes, a court judgement) the SCRA chairman provided directly. Nothing is placeholder Lorem Ipsum. Approximate current counts:

- **Areas**: 9 (all — Likoni, Shelly Beach, Tiwi, Diani, Galu, Kinondo, Msambweni, Shimoni, Lunga Lunga)
- **Issues**: ~20, several with real multi-entry progress-update timelines and `resolved` status backed by actual outcomes (e.g. a real 2023 court judgement)
- **Committees**: 3 (Security Group, Noise Pollution Sub-Committee, Executive Committee)
- **People**: 11 — the real, current Executive Office Bearers, several with real bios; only the Chairman currently has a linked photo
- **Directory Entries**: 14
- **Documents**: 17 real uploaded PDFs (letters, memoranda, minutes, a court judgement, an advisory)
- **Posts**: 9 real news items
- **Media**: several real uploaded images (extracted from the PDFs' embedded photos, a site logo, a "no photo" placeholder), linked selectively to specific Issues/Posts/People
- **Events**: **0** — schema exists, never populated
- **Users**: 1 (Payload admin)

Seed scripts (`src/seed/run*.ts`) are idempotent (upsert by slug/name/filename) and safe to inspect for the patterns used — but **do not treat them as the final content-authoring mechanism**. They were a means to bulk-load real historical data; new pages going forward should generally be authored through the Payload admin panel unless bulk-loading another real data source.

## Design system reference

Full spec is in `materials/SCRA Design System Stylesheet.md`; the **implemented** version (what's actually live) is in `src/app/(frontend)/globals.css`, mapped onto shadcn's semantic token names:

- `--primary` = Ocean Navy `#0D2B5B`, `--primary-dark` `#071C3D`, `--primary-light` `#214E8C`
- `--secondary` = Ocean Blue `#0077C8`, `--secondary-light` `#2D9CDB`
- Custom coastal tokens also defined: `--ocean` `#00B4DB`, `--lagoon` `#27C5C3`, `--sand` `#F2E8D5`, `--beach` `#FFF9EF`, `--brand-green` `#139A3D`
- Fonts: `--font-heading` = Poppins (loaded via `next/font/google` in `(frontend)/layout.tsx`, weights 500–700), `--font-sans`/body = Inter
- Radius scale: `--radius-xs` 4px through `--radius-xl` 24px, plus `--radius-pill` for badges
- A `@layer base` rule applies `font-heading font-bold text-primary` to all `h1–h5` automatically — don't fight this with per-component overrides unless intentional
- **Dark mode values in `globals.css` are placeholder/derived**, not from the source design system (which is light-only). Confirm with the client whether dark mode is even wanted before investing more in it.

## Critical gotchas (read before you repeat these)

1. **Heredoc writes have silently corrupted files multiple times** in this project's history — sometimes dropping a single line (e.g. a lone `<a` JSX opening tag, breaking the parser several lines later with a confusing error), sometimes failing to create a file at all with zero error output. This has specifically bitten `[slug]` dynamic route folders more than once, including one that ended up as a stray duplicate route at the wrong nesting level (`(frontend)/[slug]/` instead of `(frontend)/issues/[slug]/`) and broke the entire dev compilation. **After any heredoc-based file write, verify with `find`/`ls`/`cat` before assuming it worked.** Prefer your own file-editing tools over shell heredocs where practical.

2. **Payload's dev-mode schema push** (Postgres adapter's auto-migration) will prompt when it detects new tables, asking whether each is a genuine create or a rename of something else. **Always choose "create" for anything you intend as new** — accepting a "rename" suggestion by mistake can silently and destructively alter or drop existing tables. This already happened once to Better Auth's tables early in the project.

3. **Better Auth's tables live in a separate Postgres schema (`auth`)**, not `public`, specifically because Payload's schema push treats the entire `public` schema as its own domain and will delete tables there that it doesn't recognize. This isolation is configured via `search_path=auth,public` in the `pg.Pool` options inside `src/lib/auth.ts`. **Do not move Better Auth's tables back into `public`.**

4. **Run `pnpm payload generate:importmap`** any time you add a new field type to a collection (richText, upload, an array containing an upload, etc.) — skipping this causes a runtime error in the admin panel (`PayloadComponent not found in importMap`) rather than a build-time error, so it can go unnoticed until you click into the affected collection.

5. **`pnpm` version 11 moved native-build approval out of `package.json`** and into `pnpm-workspace.yaml` under an `allowBuilds` map. If a fresh `pnpm install` on another machine complains about ignored build scripts (`sharp`, `esbuild`, `unrs-resolver`), check `pnpm-workspace.yaml` first.

6. **`graphql` must stay pinned to `^16.8.1`**, not v17 — Payload's GraphQL layer requires v16.

7. **Payload serves uploaded files at a predictable path**: `/api/media/file/{filename}` (or `/api/documents/file/{filename}` for the `documents` collection). This is stable enough to hardcode (e.g. the site logo in the header) without an extra DB query, but be aware `filename` is Payload's stored value, which may differ from your original upload filename if it collided with an existing one.

8. **Payload's Local API file uploads use exact `filePath` matching** — no fuzzy matching, no slugification of the source filename. If you're scripting a bulk upload, verify real on-disk filenames with `ls` first; assumed/sanitized filenames (e.g. from a chat interface or copy-paste) will not match.

9. **Tailwind v4 has no JS config file** — don't create `tailwind.config.ts` expecting it to do anything; all theme extension happens in `globals.css`.

10. Both `(frontend)` and `(payload)` are **separate root layouts** (Next.js's multiple-root-layouts pattern) — each defines its own `<html>`/`<body>`. Don't try to unify them under a single top-level `app/layout.tsx`.

11. **A standing, non-expiring Member Portal sign-in link exists for one hardcoded test account only** (membership #466, `yudamedia@gmail.com`) — see `src/lib/portal-test-login.ts`, registered as a Better Auth plugin in `src/lib/auth.ts`. It's a `GET /api/auth/portal-test-login?token=...` endpoint gated by the `PORTAL_TEST_LOGIN_SECRET` env var (gitignored `.env` only, never committed); the target email is hardcoded in the plugin, not derived from the request, so the token can never be used to sign in as anyone else. Functionally equivalent to a permanent password for that one account — keep the token out of chat logs, tickets, and git history. Disable by removing the env var; rotate by changing it. Cookie/session max-age is capped at 400 days (RFC/browser ceiling), but the link itself never expires and can be revisited to mint a fresh 400-day session at any time.

## Known issues to fix or verify

- 
- **`/directory` page reliability was never conclusively re-confirmed** after a stray duplicate `[slug]` route (see Gotcha #1) was found and deleted late in the previous session. Load-test it and the rest of the site for any similar orphaned/duplicate route files before building further.
- No frontend pages exist yet for `documents` (Knowledge Centre) or `events`, despite both having live schemas (and 17 real records for `documents`).
- No pages exist yet for About Us, Membership, or Contact — these are core to this phase's goal.
- Better Auth is fully wired (env vars, schema, route handler, verified working via `/api/auth/get-session`) but has zero UI — no sign-up/login pages exist. **Do not build generic sign-up UI** — account creation is gated to "only after a Tuma payment confirms" per the Member Portal section below, not a normal open registration form.

## Member Portal, Payments & Related Modules (planned — not yet implemented)

This section is planning output, not yet built. Nothing below exists in the codebase yet. It's
settled enough to build from, but verify against the live schema before assuming any field name is
final if this section and the actual code ever disagree — the code wins.

### `memberships` collection (new)

Replaces the paper Personal/Household/Renewal and Corporate forms (see
`materials/Member_Application_Form.pdf`). **Distinct from `people`** — `people` is committee/leadership
bios, `memberships` is paying-member records.

| Field | Type | Notes |
|---|---|---|
| `membershipNumber` | string, unique | Preserve legacy numbering exactly, including zero-padding (`"003"`, `"099"`). New signups get the next available number as a plain string. |
| `type` | enum: `personal \| household \| corporate \| free` | `free` = exempted legacy members. |
| *(active/expired)* | **computed, not stored** | Active = `!adminRevoked && expiryDate >= today`. Don't add a separate stored status field — it will drift out of sync with `expiryDate`. |
| `adminRevoked` | boolean, default false | Manual override, independent of expiry. |
| `revokedReason` | text, optional | Admin-only. |
| `primaryContact` | group: `surname`, `firstName`, `phone`, `email` | `email` optional at DB level (legacy imports may lack one) but required for any new portal signup. |
| `postalAddress`, `town`, `postalCode` | text | |
| `corporateBusinessName` | text, conditional on `type = corporate` | |
| `additionalMembers` | array of `{ surname, firstName, phone?, email? }` | Household: names only (paper form doesn't collect contact info for additional household members). Corporate: up to 4, each with own phone/email. |
| `subscriptionAmount` | number | Stored per-record, not just derived from `type`, so future rate changes don't rewrite history. |
| `expiryDate` | date | Single source of truth for active/expired. Legacy imports: `2026-12-31` for all. New/renewed: `paymentConfirmedDate + 365 days`. |
| `importStatus` | enum: `native \| imported` | |
| `importFlags` | text (free text) | Carries anything ambiguous from the source spreadsheet forward for admin review rather than silently interpreting it. |
| `linkedAuthUsers` | relationship (array) → Better Auth `auth` schema users | Populated only once an account actually exists (see Account Creation below). |

### `payments` collection (new)

| Field | Type | Notes |
|---|---|---|
| `membership` | relationship → `memberships` | |
| `amount` | number | |
| `method` | enum: `stk_push \| bank_transfer \| cash \| other` | |
| `provider` | enum: `tuma \| manual` | |
| `tumaPaymentId` | string, nullable | From Tuma's STK push response. |
| `paymentStatus` | enum: `pending \| confirmed \| failed` | |
| `confirmedAt` | datetime, nullable | |
| `confirmedBy` | relationship → `users`, nullable | Null if confirmed by webhook; set if secretariat manually reconciled it. |
| `rawWebhookPayload` | json, nullable | Raw Tuma callback body, for audit/debugging. |
| `paymentType` | enum: `new \| renewal` | |

**Critical**: webhook-confirmed and manually-reconciled payments must call the *same* underlying
activation function (confirm → extend `expiryDate` → provision `linkedAuthUsers`). Don't let the two
paths diverge. Webhook handler must check `paymentStatus !== 'confirmed'` before acting — Tuma
callbacks can arrive late, twice, or (rarely) not at all.

### Tuma payment integration (www.tuma.co.ke)

- Auth: email + API key → JWT. **Server-side only, never exposed to the client.**
- STK Push: `POST /payment/stk-push` with amount, phone, description, `callback_url` → returns `payment_id`.
- Callback is async — Tuma calls our `callback_url` on its own schedule, this is not a synchronous
  response. Frontend polls or subscribes for status; don't assume an immediate answer.
- New route: `/api/webhooks/tuma` — verifies payload, updates matching `payments` record, calls the
  shared activation function.
- Bank transfer/cash uses the same activation function via a manual admin action (`provider = manual`).

### Better Auth — Member Portal accounts

- Keep tables isolated in the `auth` Postgres schema (existing gotcha #3 above — do not change).
- **Account creation only after payment is confirmed.** No credential is ever collected at
  application time.
- Personal/household → one account (primary contact). Corporate → up to 4, one per named member with
  a valid email.
- New accounts get a "set your password"/magic-link invite email (same mechanism as legacy migration
  claim emails below — one email system, not two).
- **Route guard**: any protected portal route checks the linked membership's `expiryDate` first. If
  lapsed, redirect straight to `/renew` — no partial access. Account/profile and renewal pages stay
  reachable.

### `documents` and `events` — add `visibility` field

Both collections need a new field: `visibility` — enum `public | membersOnly`, default `public`.
Per-record toggle, secretariat discretion (not a blanket rule per collection).

Access-control gap: Payload's built-in access functions only know Payload's own `users` collection,
not Better Auth sessions. A `membersOnly` document/event can't rely on Payload's normal read check.
Needs a dedicated route: `/api/documents/[id]/download` — checks Better Auth session + membership
`expiryDate`, then streams the file or issues a short-lived signed URL. `public` documents keep
serving from Payload's normal media URL, no extra hop.

Events: decided **informational-only for v1** — no RSVP, no attendee tracking, no recurring-event
support. `visibility` reuses the same pattern.

### `issue-reports` collection (new)

Distinct from curated `issues` (committee-authored). `issue-reports` is resident-submitted raw input,
optionally linkable to a curated `issues` page so its "Progress updates" can reflect real report
volume. **Open to any resident, membership optional** — logged-in members get status tracking/
notifications, anonymous reporters get a reference code.

| Field | Type | Notes |
|---|---|---|
| `referenceCode` | string, auto-generated, unique | e.g. `SCRA-2847`. How anonymous reporters check status without an account. |
| `reporterName`, `reporterPhone`, `reporterEmail` | text | Always captured regardless of login state. |
| `reportedBy` | relationship → Better Auth user, nullable | Set only if logged in at submission. |
| `category` | enum: `roads \| security \| street_lighting \| illegal_development \| environmental \| other` | |
| `description` | text | |
| `photos` | array of media | |
| `location` | group: `lat`, `lng`, `addressText` | Real coordinates from day one — needed for the future map layer. |
| `status` | enum: `received \| under_review \| in_progress \| resolved` | Matches progress stepper in `DesignSystemlrg.png`. |
| `statusHistory` | array of `{ status, changedAt, changedBy, note }` | Audit trail; powers reporter-facing timeline. |
| `linkedIssue` | relationship → `issues`, nullable | |

### Renewal reminder emails

- Cadence: 30 days before expiry, 7 days before, on the day, then a distinct "lapsed" nudge after.
- Idempotency: track last-sent state per membership so a cron re-run doesn't double-send.
- **Burst-send note**: all migrated legacy records share the identical `2026-12-31` expiry, so the
  first reminder wave fires simultaneously rather than trickling in — check email provider rate
  limits against this.
- Delivery: Vercel Cron Job, **once daily** — confirmed compatible with the project's current Vercel
  Hobby plan (Hobby caps cron at once/day with up to ~1hr timing drift; irrelevant for a daily digest
  job checking date-offset windows). Route handler queries memberships in each reminder window and
  fires the batch.
- Reuses the same email provider as the Better Auth invite/claim emails — one system.

### Legacy data migration (2025 spreadsheet)

Source: `SCRA_2025_as_at_16_06_2025.xlsx`, sheet **"2025 Members (2)"** (confirmed authoritative —
more complete/alphabetically full than sheet "2025 Members," which was a partial cut). **241 primary
membership records** (322 rows incl. household/corporate sub-members).

- Membership numbers preserved exactly as strings, including zero-padding.
- 8 duplicate-number collisions found and resolved during planning:
  - Round 1 (incomplete side flagged "Details update" in source notes → read as pending/misassigned): Cronchey Christina → `459`, Winfred Deborah → `460`, Ashtel Aninah → `461`.
  - Round 2 (both/all sides fully populated, no data-driven signal → resolved alphabetically by surname, first-alphabetically keeps the original number): `#202` Matiba Susan keeps `202`, Van Niekerk Esme → `462`. `#342` Huth Valentina keeps `342`, Stone Gillian → `463`. `#414` Genevier Chrisme keeps `414`, Midi Agnes → `464`, Soprani Andrea → `465`. Flag these five in `importFlags` as reassigned-by-tiebreak, not verified fact — sanity-check with secretariat if any of them ever raise a question about their number.
- Every legacy record gets `expiryDate = 2026-12-31` regardless of original join date.
- **No accounts auto-created for any imported record**, even with a clean email — consistent with
  the "account only after confirmed payment" rule above. Records with an email get a "claim your
  portal account" invite instead. The subset with no email on file (~43 records) stay data-only;
  their first portal payment doubles as account creation.
- Source `AMOUNT`/`NOTES` columns mix real numeric partial payments, status text ("Paid in Nov",
  "Exempted," "Not paid"), and blanks — **do not auto-map to a structured paid-amount field**. Carry
  forward as free text in `importFlags` for secretariat review.
- Seed script follows the existing `src/seed/` pattern (Payload Local API, `pnpm payload run`,
  excluded from TS checking).

### Map (two distinct builds, sequenced)

1. **Static area/service map** (build first, data mostly exists already): sources `areas`,
   `directory-entries`, curated `issues` with a location. Matches the marker categories in
   `scraproposed.png`'s homepage mock (road projects, community facilities, healthcare, schools,
   environmental areas).
2. **Live issue-report heatmap** (build second, near-free once #1 and `issue-reports` exist): plots
   `issue-reports` pins, filterable by category/status. Depends on `issue-reports.location` being
   real lat/lng, already specified above.



```bash
# from ~/projects/scra
docker compose up -d postgres        # start the database

# from ~/projects/scra/apps/web
pnpm dev                             # start Next.js (Turbopack)
pnpm payload generate:importmap      # after adding new field types
pnpm payload run src/seed/<script>.ts  # run a seed script via Payload's Local API
```

Admin panel: `http://localhost:3000/admin`
