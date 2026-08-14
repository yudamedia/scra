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
3. ~~**New About Us content/pages**~~ — done: `/about`, `/membership`, `/membership/apply`, and `/contact` all exist. Where a fact wasn't available anywhere, it was flagged rather than invented — see the "Known issues" section below for the historical example of this going wrong.

## Tech stack

- **Next.js 16.2.12** — App Router, TypeScript, Turbopack, `src/` directory
- **Tailwind CSS v4** — no `tailwind.config.ts`; all theme tokens live in `@theme` / `:root` blocks inside `src/app/(frontend)/globals.css`
- **shadcn/ui** — Base UI primitives, "Maia" preset, icon library `hugeicons`. Only `button` was ever formally installed via the CLI; most UI in this project is hand-rolled Tailwind rather than shadcn components, by deliberate choice (see Gotchas)
- **Payload CMS 3.87.0** — installed **manually** (not via `create-payload-app`), runs inside the Next.js app via `withPayload()` in `next.config.ts`
- **PostgreSQL 16** — via Docker (`docker-compose.yml` at repo root, service `postgres`, container `scra_postgres`)
- **Better Auth 1.6.25** — powers the live Member Portal (magic-link sign-in, admin plugin, portal test-login plugin), fully separate from Payload's admin auth. Tables live in a dedicated `auth` Postgres schema (gotcha #3).
- **Resend** — transactional email (magic links, payment/application confirmations, renewal reminders, issue-report status updates). See `src/lib/email.ts`.
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

| Collection          | Key fields                                                                                                                                                                                                                                                                                                            | Notes                                                                                                                        |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `users`             | auth-enabled                                                                                                                                                                                                                                                                                                          | Payload admin login only                                                                                                     |
| `media`             | `alt`, `caption`, image upload                                                                                                                                                                                                                                                                                        | generic image library                                                                                                        |
| `documents`         | `title`, `category` (select), `summary`, `publishedDate`, `visibility` (select: `public`/`membersOnly`, default `public`), PDF/doc upload                                                                                                                                                                            | "Knowledge Centre" — live at `/documents`; `membersOnly` docs gate through `/api/documents/[id]/download` (see Member Portal section). `Documents.access.read` is still `() => true` at the Payload level — enforcement is at the download-route layer, not the collection API |
| `areas`             | `name`, `slug`, `heroImage`, `overview` (richText), `keyServices` (array), `attractions` (richText)                                                                                                                                                                                                                   |                                                                                                                              |
| `issues`            | `title`, `slug`, `category`/`status` (select), `area` (relationship), `featuredImage`, `gallery` (array of upload+caption), `background`/`actionsUndertaken` (richText), `progressUpdates` (array: date+update), `supportingDocuments` (relationship→documents, hasMany), `relatedNews` (relationship→posts, hasMany) | most fully-built collection; good reference for patterns                                                                     |
| `directory-entries` | `name`, `category` (select), `area` (relationship), `address`/`phone`/`email`/`website`, `description`                                                                                                                                                                                                                |                                                                                                                              |
| `committees`        | `name`, `description` (richText)                                                                                                                                                                                                                                                                                      |                                                                                                                              |
| `people`            | `name`, `role`, `committee` (relationship), `photo` (upload), `bio` (richText)                                                                                                                                                                                                                                        | maps to "Leadership" on frontend; **distinct from `memberships` below — do not conflate**                                    |
| `posts`             | `title`, `slug`, `excerpt`, `featuredImage`, `content` (richText), `relatedIssues` (relationship, hasMany), `publishedDate`                                                                                                                                                                                           | maps to "Newsroom"/"News" on frontend                                                                                        |
| `events`            | `title`, `eventType` (select), `area` (relationship), `startDate`/`endDate`, `location`, `description` (richText), `image` (upload), `visibility` (select: `public`/`membersOnly`, default `public`)                                                                                                                | live at `/events` + `/events/[id]`; informational only (no RSVP/attendee tracking) — zero real records still, schema/pages ready |
| `memberships`       | `membershipNumber` (unique, auto-assigned), `type` (select), `adminRevoked`, `revokedReason`, `primaryContact` (group), `postalAddress`/`town`/`postalCode`, `corporateBusinessName`, `additionalMembers` (array), `subscriptionAmount`, `expiryDate`, `importStatus`, `importFlags`, `linkedAuthUsers` (array, not a real relationship), `lastReminderStage` | paying-member records — **distinct from `people`** (committee/leadership bios); see Member Portal section |
| `payments`          | `membership` (relationship), `amount`, `method`, `provider`, `tumaPaymentId`, `paymentStatus`, `confirmedAt`, `confirmedBy` (relationship→users), `rawWebhookPayload` (json), `paymentType`                                                                                                                          | `afterChange` hook on `paymentStatus` → `confirmed` calls the shared `activateMembership()`; see Member Portal section       |
| `issue-reports`     | `referenceCode` (auto, unique), reporter fields, `reportedBy` (text, Better Auth user id), `category`, `description`, `photos` (array), `location` (group), `status`, `statusHistory` (array), `linkedIssue` (relationship→issues)                                                                                  | resident-submitted reports, distinct from curated `issues`; public form at `/report-issue`; see Member Portal section        |

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

## File storage (Cloudflare R2)

`media` and `documents` uploads are stored in Cloudflare R2, not local disk — required because Vercel's filesystem is ephemeral and uploads wouldn't survive a redeploy otherwise. Wired via `@payloadcms/storage-s3@3.87.0` (R2 is S3-compatible; there's no R2-specific Payload package) in two separate `s3Storage()` plugin instances in `payload.config.ts`, since the plugin's `bucket` option is a single string per instance — you cannot split two collections across two buckets in one call.

- **`scra-media`** — public bucket, custom S3 endpoint credentials, served via `R2_MEDIA_PUBLIC_URL` (currently the `pub-*.r2.dev` dev URL; **swap for a real Custom Domain before launch** — Cloudflare explicitly flags the dev URL as rate-limited and not for production).
- **`scra-documents`** — private bucket, `signedDownloads: true`, so every read is proxied through Payload's own route and gets a short-lived signed URL rather than a raw public bucket URL.
- Both buckets: same Cloudflare account (`R2_ACCOUNT_ID`), one scoped API token with Object Read & Write on just these two buckets (not account-wide, not Admin).
- Env vars (local `.env` + Vercel Production/Preview): `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_MEDIA_BUCKET`, `R2_DOCUMENTS_BUCKET`, `R2_MEDIA_PUBLIC_URL`.

**Known gap:** `Documents.access.read` is still `() => true` — the `visibility` field (`public` / `membersOnly`) is enforced only at the app layer, by `/api/documents/[id]/download` (checks `getPortalSession()` + `isMembershipActive()` before streaming the file), not by Payload's own collection access control. `signedDownloads`/`shouldUseSignedURL` still isn't wired to that check either. This means a `membersOnly` document is still fetchable through Payload's raw REST/GraphQL API or `doc.url` if someone finds it directly — the frontend (`/documents` page) never links to that raw URL for `membersOnly` docs, but the collection-level hole itself hasn't been closed.

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

12. **Cloudflare R2 rejects the CRC32 checksums `@aws-sdk/client-s3` sends by default** since SDK v3.729.0 — without `requestChecksumCalculation: 'WHEN_REQUIRED'` and `responseChecksumValidation: 'WHEN_REQUIRED'` in the S3 client `config`, every R2 read/write fails with a generic, unhelpful `S3ServiceException: UnknownError`. Both `s3Storage()` instances in `payload.config.ts` already have this set — don't remove it. See https://developers.cloudflare.com/r2/examples/aws/aws-sdk-js-v3/.

13. **R2 access key ID and secret access key are easy to swap by mistake** when copying from the Cloudflare dashboard — they're stacked close together in the UI. Access key ID is 32 hex characters; secret access key is 64. If R2 uploads fail with `Credential access key has length 64, should be 32`, they've been pasted into the wrong env vars.

14. **Production has two entirely separate migration systems that must both be run — neither covers the other.** Payload's Postgres adapter only auto-syncs schema (the "Pulling schema from database..." push you see in `pnpm dev`) in non-production `NODE_ENV`; production requires real migration files. This bit once already: a full session's worth of new collections/columns (`memberships`, `payments`, `issue-reports`, `documents.visibility`, `events.visibility`) never reached production and broke the build with `column "visibility" does not exist` on `/about`. Fixed by hand-pruning an auto-generated `payload migrate:create` output down to just the true incremental diff (see `src/migrations/20260808_023123_initial_migration.ts` — the file header explains why it's hand-pruned, not auto-generated verbatim) and adding `"vercel-build": "payload migrate && next build"` to `package.json`. **This only covers Payload's own schema.** Better Auth's schema (in the separate `auth` Postgres schema, gotcha #3) is migrated independently via `npx @better-auth/cli migrate` and is *not* invoked by `vercel-build` — after adding/changing anything in `src/lib/auth.ts` (e.g. the `admin` plugin's `role`/`banned`/`banReason`/`banExpires` columns), that command must be run by hand against production's `DATABASE_URI` too, or Member Portal auth breaks at runtime with no build-time warning. Also confirm Vercel's Build Command is actually set to `pnpm run vercel-build` — Vercel does not necessarily auto-detect a non-default script name.

15. **`NEXT_PUBLIC_*` env vars are inlined into the client bundle at build time, not read at request time.** Saving a new value in Vercel's dashboard does nothing on its own — a redeploy has to actually run for the new value to reach the browser. This bit production once already: `NEXT_PUBLIC_BETTER_AUTH_URL` was left at a placeholder value, so every client-side Better Auth session check (`authClient.useSession()` in `site-header.tsx`) fetched a different origin than the real site and failed with a CORS error in the browser console. Applies to every `NEXT_PUBLIC_*` var in this project, including `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` (see the reCAPTCHA section) — after changing any of them in Vercel, trigger a new deployment, don't just save and assume it's live.

## Known issues to fix or verify

- **`/directory` page reliability was never conclusively re-confirmed** after a stray duplicate `[slug]` route (see Gotcha #1) was found and deleted late in the previous session. Load-test it and the rest of the site for any similar orphaned/duplicate route files before building further.
- **`Documents.access.read` doesn't enforce `visibility`** — see the R2 section's "Known gap" above. The download route gates the app's own UI correctly; the collection's own API access control does not.
- **Vercel build WARNs that `media` and `documents` have no storage adapter for uploads on Vercel** — this is about local filesystem uploads via the admin UI, not the R2 wiring itself (R2 is correctly configured via `s3Storage()` in `payload.config.ts`); confirm this warning is actually spurious (R2 already covers it) before spending time on it, don't assume it's a real gap.
- **Production deploys require two separate migration steps, not one** — see Gotcha #14. Forgetting the Better Auth one is easy to do since it produces no build-time error, only runtime auth failures.

## Member Portal, Payments & Related Modules (implemented — Tuma live calls still scaffolded)

Everything described in this section is built and working, except the actual Tuma HTTP calls
(gated behind env vars, see below) and the map (still pending, sequenced last). Field names below
are believed current as of this writing, but **the code wins if this section and the actual
collection configs ever disagree** — check `src/collections/*.ts` for ground truth.

### `memberships` collection — `src/collections/Memberships.ts`

Replaces the paper Personal/Household/Corporate forms (`materials/Member_Application_Form.pdf`).
**Distinct from `people`** — `people` is committee/leadership bios, `memberships` is paying-member
records. Fields match the Content Model table above. Notable implementation choices:

- **Active/expired is computed, never stored** — `isMembershipActive()` in `src/lib/memberships.ts`: `!adminRevoked && expiryDate >= today`.
- **`membershipNumber` auto-assignment** is a `beforeChange` hook (`getNextMembershipNumber()`, same file) — finds the current max numeric value across all records and increments, padded to at least 3 digits. Fires identically whether a membership is created by the public application form, the legacy seed script, or directly in the admin.
- **`linkedAuthUsers` is a plain `array` of `{ authUserId, email }`, not a real Payload `relationship`** — Better Auth's users live in the separate `auth` Postgres schema, outside Payload's collection registry, so the relationship field type can't target them. Read-only in the admin; populated only by `activateMembership()`.
- **`lastReminderStage`** (`none | 30day | 7day | dueday | lapsed`) — idempotency marker for the renewal cron, not a status field; doesn't conflict with the "don't store active/expired" rule above since it tracks reminder cadence, not membership state.

### `payments` collection — `src/collections/Payments.ts`

Fields match the Content Model table above. **The shared activation path is an `afterChange` hook**, not a function called separately from two route handlers: whenever `paymentStatus` transitions to `confirmed` (checked against `previousDoc`), the hook calls `activateMembership()` from `src/lib/membership-activation.ts`. Both the Tuma webhook route and a secretariat admin edit ultimately do a `payload.update()` on a `payments` record, so they are structurally guaranteed to hit the same code path — there is no way for them to drift apart.

`activateMembership({ payment, req })` takes the already-written payment doc and the hook's `req` — not a payment ID to re-fetch. This matters: a payment created already-`confirmed` in one step (not created-pending-then-updated) is a row that hasn't committed yet outside its own transaction, and a `findByID` without `req` would 404 on it. This was a real production bug (member 466's payment record failing with "Not Found") — fixed by threading `req` through every Payload call in the activation function so everything stays in the same transaction. **Don't remove the `req` threading.**

`activateMembership()` also: extends `expiryDate` by 365 days from `confirmedAt`, provisions Better Auth accounts for any contact with an email not already in `linkedAuthUsers` (primary contact for personal/household; up to 4 contacts — primary + `additionalMembers` — for corporate), and sends a payment-confirmed email via Resend.

### Tuma payment integration (www.tuma.co.ke) — `src/lib/tuma.ts`, scaffolded, not live

Real function signatures matching Tuma's documented API are wired up (`createSTKPush()`, `verifyWebhookSignature()`, JWT auth flow via `/auth/login`), but the actual `fetch()` calls are gated behind `TUMA_API_KEY`/`TUMA_API_EMAIL` and throw a clear "Tuma integration not yet configured" error while those env vars are unset. The webhook route (`src/app/(frontend)/api/webhooks/tuma/route.ts`) is fully wired: verifies an HMAC-SHA256 signature (scheme not yet confirmed against a real Tuma callback — flagged in the code), finds the matching `payments` record by `tumaPaymentId`, and does a plain `payload.update({ paymentStatus: 'confirmed', ... })` — the `Payments` hook takes it from there. Explicitly guards `paymentStatus !== 'confirmed'` before acting, since Tuma callbacks can arrive late, twice, or not at all.

**Manual reconciliation works today without Tuma**: the public membership application (`/membership/apply`) and the portal renewal flow (`/portal/renew`) both create a `payments` record with `provider: 'manual'`, `paymentStatus: 'pending'`, and instructions to pay via M-Pesa Paybill **880100**, account **PAYSCRA** (or cash at the Safarilink Office, Diani). Secretariat confirms the payment by editing the record in the admin — same hook fires.

### Better Auth — Member Portal accounts — `src/lib/auth.ts`

- Tables isolated in the `auth` Postgres schema (gotcha #3) — unchanged.
- `emailAndPassword` stays `enabled: true` (Better Auth needs the credential provider registered) but `disableSignUp: true` closes the public `/api/auth/sign-up/email` route.
- **Passwordless, magic-link-only accounts**: the `admin` plugin's `auth.api.createUser({ body: { email, name } })` creates a user with no password, from `activateMembership()` only — never from any public route. The `magicLink` plugin (`disableSignUp: true`) is the only sign-in path; a magic-link request for an email with no pre-existing account never provisions one.
- `sendMagicLinkEmail()` (Resend, `src/lib/email.ts`) fires on every login, not just the first — there's no separate "set your password" email since there's never a password.
- **A standing, non-expiring test login exists for one hardcoded account** — see gotcha #11 (`src/lib/portal-test-login.ts`).

Frontend routes under `src/app/(frontend)/portal/`:
- `login/page.tsx` — email input, calls `authClient.signIn.magicLink()`.
- `(authenticated)/layout.tsx` — redirects to `/portal/login` if no Better Auth session.
- `(authenticated)/account/page.tsx` — profile view, reachable even with a lapsed membership.
- `(authenticated)/renew/page.tsx` — manual-reconciliation renewal flow (M-Pesa/bank/cash instructions + a disabled "coming soon" Tuma STK button), also reachable while lapsed.
- `(authenticated)/(protected)/layout.tsx` — nested layout enforcing an *active* membership (`isMembershipActive()`, not just a session); redirects to `/portal/renew` if lapsed or unlinked. Wraps a placeholder dashboard at `(protected)/page.tsx`.

The header's primary CTA (`src/components/site-header.tsx`, both desktop and mobile) is "Member Login" → `/portal/login`, swapping to a "Logout" button when a session exists.

### Public membership application — `/membership/apply`

The no-login-required sign-up path (`materials/Member_Application_Form.pdf` digitized). `src/components/membership-application-form.tsx` (client) posts to `src/app/(frontend)/api/membership-applications/route.ts`, validated both sides by `src/lib/membership-application-schema.ts`. Creates a `pending` `memberships` record (type `personal|household|corporate`; `expiryDate` set to "now" as a placeholder — the activation hook sets the real one once payment is confirmed) plus a `manual`/`pending` `payments` record, and emails a confirmation via `sendMembershipApplicationConfirmationEmail()`.

**Additional-member caps** (`maxAdditionalMembersByType` in the schema file, enforced via `.superRefine()` server-side and by slicing the rendered/submitted rows client-side): personal → 0, household ("Family") → **1** (2 members total, matching the paper form), corporate → 3 (4 total). Spam prevention is a honeypot field + a minimum 3-second fill-time check (`MIN_FILL_TIME_MS`) plus reCAPTCHA v3 — see the reCAPTCHA section below.

Nav: "Membership" is a header dropdown ("Membership Overview" / "Apply for Membership"); the footer also links directly to `/membership/apply`.

### `documents` and `events` — `visibility` field

Both collections have `visibility: 'public' | 'membersOnly'` (default `public`), toggled per-record by secretariat discretion. Payload's built-in access functions only know Payload's own `users` collection, not Better Auth sessions, so a `membersOnly` document can't rely on Payload's normal read check — see the R2 section's "Known gap" above for the current state of that enforcement (app-layer only, via `/api/documents/[id]/download`; collection-level API access is still `() => true`). Events have no file to gate, so `membersOnly` events just get a lock badge/redirect-to-login treatment on `/events` and `/events/[id]` — informational-only, no RSVP/attendee tracking, per the original v1 decision.

### `issue-reports` collection — `src/collections/IssueReports.ts`

Distinct from curated `issues` (committee-authored). Open to any resident, membership optional — logged-in members' Better Auth user id is captured in `reportedBy` (plain text, same cross-schema constraint as `linkedAuthUsers`), anonymous reporters get a `referenceCode` (`SCRA-{n}`, auto-assigned by a `beforeChange` hook that scans existing codes for the current max). Public submission form at `/report-issue` (`src/components/issue-report-form.tsx` → `src/app/(frontend)/api/issue-reports/route.ts`), same honeypot + min-fill-time + reCAPTCHA guard as the membership application. Up to 3 photos, images only, ≤5MB each, uploaded as `media` records via the Local API. An `afterChange` hook emails the reporter (`sendIssueStatusChangedEmail()`) whenever `status` changes and `reporterEmail` is on file.

### Google reCAPTCHA v3 — bot/spam protection

Every public, unauthenticated endpoint that accepts input or does a lookup is gated by reCAPTCHA v3 (invisible, score-based — no checkbox, no challenge, just a 0.0–1.0 bot-likelihood score per request). Two shared utilities, reused everywhere rather than duplicated per route:

- **`src/lib/recaptcha-client.ts`** (client) — `getRecaptchaToken(action)` waits for the globally-loaded `window.grecaptcha` (script tag lives in `src/app/(frontend)/layout.tsx`, loaded once for the whole frontend via `next/script`) and resolves a token for the given action name.
- **`src/lib/recaptcha.ts`** (server) — `verifyRecaptcha(token, { action, minScore? })` posts to Google's `siteverify` endpoint and checks `success`, that the returned `action` matches what was expected (defends against a token minted for one action being replayed against another), and that `score >= minScore` (env `RECAPTCHA_MIN_SCORE`, defaults to `0.5` — Google's own suggested starting point; tune from the reCAPTCHA admin console's traffic analytics if real users start getting false-positive rejections).

**Five surfaces are gated, each with its own action name**: `membership_application`, `issue_report`, `contact`, `issue_report_status`, `portal_login`. The existing honeypot (`website` field) + `MIN_FILL_TIME_MS` checks on the membership/issue-report/contact forms were **kept, not replaced** — reCAPTCHA is a second layer, slotted in right after those checks and before Zod validation/DB writes in each route.

**Contact form was converted from a `mailto:` link to a real server-side form** to make it gateable at all — previously `src/components/contact-form.tsx` had no backend, just built a `mailto:chair@scra.co.ke` URL client-side. Now posts JSON to `src/app/(frontend)/api/contact/route.ts` (schema: `src/lib/contact-schema.ts`), which emails `chair@scra.co.ke` via `sendContactFormEmail()` in `src/lib/email.ts` (with the submitter's address as `replyTo`).

**Portal magic-link login is the non-obvious one** — `src/app/(frontend)/api/auth/[...all]/route.ts` is Better Auth's own catch-all handler, so there's no route file to add a check to directly. Instead, `src/lib/auth.ts` registers a `hooks.before` on the `betterAuth()` config itself, using `createAuthMiddleware` (from `better-auth/api`) manually scoped to `ctx.path === "/sign-in/magic-link"` (Better Auth has no per-path matcher option at this level — the `magicLink` plugin itself exposes no lifecycle hook either). Confirmed by reading Better Auth 1.6.25's dispatch source that a `hooks.before` handler runs — and can throw an `APIError` to abort — *before* the endpoint's own handler, so a failed check means the magic-link email is never sent. `ctx.body` is the raw, unvalidated request body at that point, so a `recaptchaToken` field the endpoint's own zod schema doesn't declare still survives. Client-side, `authClient.signIn.magicLink()`'s typed params only cover `email`/`callbackURL` — the extra field is passed via that client method's **second** argument, which is itself a fetch-options object (not nested under a `fetchOptions` key): `authClient.signIn.magicLink({ email, callbackURL }, { body: { recaptchaToken } })`.

Env vars: `RECAPTCHA_SECRET_KEY` (server-only), `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_MIN_SCORE` (optional). **`NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is inlined at build time** — see gotcha #15 — changing it in Vercel needs a redeploy, not just a saved env var, or the client will still ship the old (or missing) key.

### Renewal reminder cron — `vercel.json`, `src/app/(frontend)/api/cron/renewal-reminders/route.ts`

Daily at 06:00 UTC (Vercel Hobby caps cron at once/day with up to ~1hr drift — fine for a date-offset digest job). `computeReminderStage()` (`src/lib/memberships.ts`) returns the due stage (`30day | 7day | dueday | lapsed`) for a given `expiryDate`; the route compares against each membership's `lastReminderStage` before sending, so a re-run the same day is a no-op. Auth is `Authorization: Bearer $CRON_SECRET`. Reuses `sendRenewalReminderEmail()` from the same Resend wrapper as every other transactional email in the app.

### Legacy data migration (2025 spreadsheet) — `src/seed/run-memberships.ts`, already run

Source: `materials/SCRA 2025 as at 16.06.2025.xlsx`, sheet **"2025 Members (2)"**. **241 primary membership records** imported and verified, including all 8 duplicate-number collisions resolved exactly per the original plan (Cronchey Christina→459, Winfred Deborah→460, Ashtel Aninah→461; Matiba Susan keeps 202, Van Niekerk Esme→462; Huth Valentina keeps 342, Stone Gillian→463; Genevier Chrisme keeps 414, Midi Agnes→464, Soprani Andrea→465 — all flagged in `importFlags` as reassigned-by-tiebreak). Every record: `expiryDate = 2026-12-31`, `importStatus: 'imported'`, `AMOUNT`/`NOTES` columns carried forward verbatim as free-text `importFlags` (never auto-mapped to a structured paid-amount field). No Better Auth accounts were created for any imported record — consistent with "account only after confirmed payment." Idempotent (upsert by `membershipNumber`), safe to re-run.

### Production deploy requirement

**Read gotcha #14 before deploying schema changes to production** — Payload's dev-mode schema push is disabled in production, and Better Auth has its own, separate migration command. Both must run, or the build fails (Payload) or auth silently breaks (Better Auth).

### Map (two distinct builds, sequenced)

1. **Static area/service map — built.** `areas`, `directory-entries`, and `issues` each got a `location` group (`{ lat, lng }`, both plain numbers) auto-filled by a `beforeChange` hook via `applyGeocodeHook()`/`geocodeAddress()` (`src/lib/geocode.ts`, calls OSM's free Nominatim geocoder — no API key/billing account). The hook **only fills in empty lat/lng**, so a manually-corrected pin is never clobbered by a later save. Geocode source per collection: `areas` from `` `${name}, Kenya` `` (do **not** append a "South Coast" region string — Nominatim doesn't recognize it as a place and the query silently returns zero results, which is what happened on the first pass); `directory-entries` from the existing `address` field; `issues` from a new optional `locationText` field (admin-facing, e.g. "Diani Beach Road near the Nakumatt roundabout" — most issues don't have one set, which is fine, see fallback below). A one-off backfill script, `src/seed/backfill-locations.ts` (throttled ~1.1s/call per Nominatim's usage policy), geocoded all 9 existing areas on first run.

   Marker categories/colors live in `src/lib/map-categories.ts` (`getMapMarkers()`), mapping the mockup's 5 legend categories onto `issues.category`/`directory-entries.category` values, with **areas never plotted directly** — an area's `location` is purely a fallback center for entries/issues in it that have no location of their own (`getMapMarkers()` resolves each record's own coords first, then its related `area.location`, dropping the marker entirely if neither resolves — never a fabricated (0,0) pin). Map UI: `src/components/map/leaflet-map.tsx` (client, react-leaflet v5 + Leaflet 1.9, colored inline-SVG `divIcon` pins, no external marker image assets) wrapped by `src/components/map/map-view.tsx` (client, `next/dynamic(..., { ssr: false })` — required since `next/dynamic` with `ssr:false` cannot be called directly inside a Server Component; the legend/category-filter checkboxes and `preview` mode toggle live here). Full page at `/map` (`src/app/(frontend)/map/page.tsx`); a smaller non-interactive preview embeds on the homepage, right after the existing "Upcoming Events / Explore the South Coast" row.

   **Known content gap, not a bug**: as of this build, only 1 of 14 `directory-entries` and 7 of 21 `issues` actually have their `area` relationship set, and essentially none have `address`/`locationText` filled in — so most records currently have no resolvable location anywhere and are correctly dropped rather than plotted at a guessed spot. Only ~8 markers show up today. This needs secretariat data entry (linking `area`, and optionally `address`/`locationText` for a more precise pin than the area-center fallback) via the admin panel over time — re-run `pnpm payload run src/seed/backfill-locations.ts` after a batch of such edits to geocode the newly-filled-in text fields in bulk.

2. **Live issue-report heatmap** (build second, near-free once `issue-reports` exist): plots `issue-reports` pins, filterable by category/status. Depends on `issue-reports.location` being
   real lat/lng, already specified above. Not started.

```bash
# from ~/projects/scra
docker compose up -d postgres        # start the database

# from ~/projects/scra/apps/web
pnpm dev                             # start Next.js (Turbopack)
pnpm payload generate:importmap      # after adding new field types
pnpm payload run src/seed/<script>.ts  # run a seed script via Payload's Local API
```

Admin panel: `http://localhost:3000/admin`
