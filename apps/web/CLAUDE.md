# SCRA Website — Project Context for Claude Code

This file exists so you don't have to rediscover, the expensive way, decisions and mistakes already made in this project's development history. Read it fully before making changes.

## What this project is

The website for the **South Coast Residents Association (SCRA)**, a Kenyan civic association representing residents, property owners, and businesses on Kenya's South Coast, from Likoni to Lunga Lunga. Production domain (current live site, being replaced): www.scra.co.ke.

Reference materials live in `~/projects/scra/apps/web/materials/`:

- `project-synopsis.md` — original site brief, information architecture, technology choices
- `SCRA Design System Stylesheet.md` — full design system (colors, type, spacing, components) as originally specified
- `DesignSystemlrg.png` — visual reference sheet for the design system (palette swatches, type scale, UI components, imagery style)
- `scraproposed.png` — a full homepage mockup showing the intended nav structure and page layout

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
| `documents`         | `title`, `category` (select), `summary`, `publishedDate`, PDF/doc upload                                                                                                                                                                                                                                              | "Knowledge Centre" source data — **no frontend pages built yet** |
| `areas`             | `name`, `slug`, `heroImage`, `overview` (richText), `keyServices` (array), `attractions` (richText)                                                                                                                                                                                                                   |                                                                  |
| `issues`            | `title`, `slug`, `category`/`status` (select), `area` (relationship), `featuredImage`, `gallery` (array of upload+caption), `background`/`actionsUndertaken` (richText), `progressUpdates` (array: date+update), `supportingDocuments` (relationship→documents, hasMany), `relatedNews` (relationship→posts, hasMany) | most fully-built collection; good reference for patterns         |
| `directory-entries` | `name`, `category` (select), `area` (relationship), `address`/`phone`/`email`/`website`, `description`                                                                                                                                                                                                                |                                                                  |
| `committees`        | `name`, `description` (richText)                                                                                                                                                                                                                                                                                      |                                                                  |
| `people`            | `name`, `role`, `committee` (relationship), `photo` (upload), `bio` (richText)                                                                                                                                                                                                                                        | maps to "Leadership" on frontend                                 |
| `posts`             | `title`, `slug`, `excerpt`, `featuredImage`, `content` (richText), `relatedIssues` (relationship, hasMany), `publishedDate`                                                                                                                                                                                           | maps to "Newsroom"/"News" on frontend                            |
| `events`            | `title`, `eventType` (select), `area` (relationship), `startDate`/`endDate`, `location`, `description` (richText), `image` (upload)                                                                                                                                                                                   | **schema exists, zero records, no frontend pages**               |

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

## Known issues to fix or verify

- 
- **`/directory` page reliability was never conclusively re-confirmed** after a stray duplicate `[slug]` route (see Gotcha #1) was found and deleted late in the previous session. Load-test it and the rest of the site for any similar orphaned/duplicate route files before building further.
- No frontend pages exist yet for `documents` (Knowledge Centre) or `events`, despite both having live schemas (and 17 real records for `documents`).
- No pages exist yet for About Us, Membership, or Contact — these are core to this phase's goal.
- Better Auth is fully wired (env vars, schema, route handler, verified working via `/api/auth/get-session`) but has zero UI — no sign-up/login pages exist.

## Commands reference

```bash
# from ~/projects/scra
docker compose up -d postgres        # start the database

# from ~/projects/scra/apps/web
pnpm dev                             # start Next.js (Turbopack)
pnpm payload generate:importmap      # after adding new field types
pnpm payload run src/seed/<script>.ts  # run a seed script via Payload's Local API
```

Admin panel: `http://localhost:3000/admin`
