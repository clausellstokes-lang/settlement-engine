---
name: ""
metadata: 
  node_type: memory
  title: VISION LANE V-J complete (V-19 THE FINDABLE TRUTH)
  date: 2026-07-20
  branch: claude/vision-j
  tip: 3f3805b7
  base: 212758ad
  status: "shipped, NOT folded, NOT pushed"
  tags: 
    - vision-wave
    - V-19
    - discoverability
    - SEO
    - prerender
    - unfurl
    - sitemap
    - compendium
    - meta-shell
    - unlisted
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-20T16:53:41.825Z
---

# VISION LANE V-J complete — V-19 THE FINDABLE TRUTH

Raised dimension 14 (DISCOVERABILITY) to A/A+ in the build phase. Branch
`claude/vision-j`, base 212758ad, tip **3f3805b7** (one commit, 17 files,
+2615/-40). NOT folded, NOT pushed.

## What shipped (4 deliverables)
1. **Prerender** — `scripts/prerender-routes.mjs`, wired as npm **`postbuild`** so
   `npm run build` (Vercel's build command) always runs it. Writes a static
   `dist/<path>/index.html` for every indexable public PATH route with baked head
   (title/desc/OG+Twitter/canonical/JSON-LD) + a `<noscript>` crawl-graph. The
   ROOT `/` PRESERVES its hand-authored marketing card (only adds canonical +
   JSON-LD). Head content from `headForView` (newly exported from `src/lib/seo.js`)
   — single source shared with the runtime SPA. Zero eager, zero new servers.
2. **Dynamic meta-shell** — `api/_metaShell.js` (pure route-pattern resolver +
   `buildMetaForKind`) + `api/meta-shell.js` (handler). Covers gallery-index,
   `gallery-unlisted` (noindex, still unfurls), `world`. `injectGalleryMeta`
   (api/_galleryMeta.js) extended with a `noindex` field. `api/gallery-meta.js`
   (public /gallery/:slug) UNCHANGED.
3. **Long tail** — ONE param route `/compendium/:entryId` in `src/lib/routes.js`
   carries all **289** compendium entries; sitemap + prerender fan them from
   `src/domain/compendium/searchIndex.js` (COMPENDIUM_INDEX). Per-entry head via
   `src/lib/seoCompendium.js` (`compendiumEntryHead` → DefinedTerm JSON-LD).
   CompendiumPanel consumes `routeEntry` (AppViews passes `params.entry`).
4. **Pins** — `tests/build/prerenderRoutes.test.js` (dist-walk, VERIFY_DIST),
   `tests/build/metaShell.test.js`, `tests/lib/seoCompendium.test.js`, extended
   sitemap + injectGalleryMeta tests.

## Gate (all green)
strict 0 · tsc 0 · lint 0 · verify:dist **179 passed** (was 162) · closure
**1,025,213 ≤ 1,040,000** (Δ +479 B eager = the one compendium param route + the
net-zero seo refactor) · NUL clean · sitemap **327 URLs** (was 38). Live browser
receipt: `/compendium/tier-thorp` mounts, head correct (title/og/type=article/
canonical/DefinedTerm), no console errors.

## Why (the problem)
SPA was crawler-invisible: deep links unfurled as the homepage (unfurlers don't
run JS), client JSON-LD never ran, compendium funnel stopped at the tab index.
All repo-controlled; V-13 seed-post virality DEPENDS on per-world unfurls.

## How to apply / FOLD SEAMS (what the manager wires)
- **Vercel serves the filesystem BEFORE afterFiles rewrites** — so `dist/create/
  index.html` beats the SPA catch-all `/((?!.*\.).*) -> /index.html`. This is THE
  load-bearing assumption of the prerender (CONFIRMED by Vercel docs + a live vite
  preview boot). dist/ is gitignored — prerender output is rebuilt, not committed.
- **/gallery is DELIBERATELY NOT prerendered** (DYNAMIC_VIEWS in
  prerender-routes.mjs): a static dist/gallery/index.html would SHADOW the fold's
  unlisted `?slug=` rewrite. Keep it excluded on fold.
- **The fold adds these vercel.json rewrites** (documented in api/_metaShell.js):
  `{source:'/gallery', destination:'/api/meta-shell?gallery=1'}` (bare index +
  merged `?slug=` → unlisted) and `{source:'/world/:code', destination:'/api/
  meta-shell?worldCode=:code'}`. The resolver keys off query flags because Vercel
  rewrites hand the function the DESTINATION path, not the original — do NOT make
  the handler read the original pathname.
- **V-E provides `get_unlisted_dossier(p_slug)`** (migration 168, MODEL B) — the
  meta-shell's unlisted fetcher already calls it and degrades to a generic
  noindex card until it exists. Unlisted URL shape confirmed = `/gallery?slug=
  <slug>` (matches V-E's handoff). The `/world` seed decode + an og-image world
  variant are fold items (world card falls back to og-craft.png until then).

## Durable hazards (each could bite the fold or a successor)
- **applyDocumentHead RACE (fixed here, keep the fix):** App's eager
  `applyDocumentHead` set a GENERIC compendium head that out-raced CompendiumPanel
  and clobbered the baked entry head (the per-tab SEO has the SAME latent race —
  its og:title is still generic). Fix: applyDocumentHead now DEFERS the
  entry-owned title/description/OG fields for a `/compendium/:entry` route (owns
  only site-level bits). Root cause: `useRoute()` returns a FRESH `params` object
  every render (resolveLocation), so `[view, params]` effects re-run on every App
  render and can run AFTER a lazy child's mount effects.
- **JSON-LD escaping:** bake `JSON.stringify(obj).replace(/</g,'\\u003c')` so a
  description can never break out of the `<script>` element.
- **seo.js is Node-importable** (guards document/import.meta.env) — the prerender
  imports headForView/siteGraph at build time. seoCompendium is LAZY (rides the
  compendium chunk + build), zero eager.
- **docCounts/validate:edge cover supabase/functions ONLY, not api/** — new
  Vercel serverless functions (api/meta-shell.js) don't touch those counts.
