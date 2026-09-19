---
name: ""
metadata:
  node_type: memory
  title: "FIX WAVE SB4 (SEO/discoverability) shipped — hubs prerendered, world unfurl-not-index, noindex single-sourced, 28B closure headroom"
  date: 2026-07-21
  tags:
    - review-fix-wave
    - sb4
    - seo
    - lane-complete
  branch: claude/sb4-seo
  tip: 938fb820
  base: de590e3c
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-21T05:04:43.301Z
---

## What shipped (ONE commit 938fb820 on claude/sb4-seo, worktree vision-e, NOT folded/pushed)
Cluster CLUSTER_SB4-seo, 10 findings: 8 fixed, 1 partly-stale-residual-fixed, 1 struck/deferred. +15 pins.

- **Facet hubs prerendered**: all 15 gallery hubs (`GALLERY_HUBS`) are now static dist documents
  (`prerender-routes.mjs renderHub`) with exactly the `setGalleryHubMeta` runtime head (CollectionPage
  LD under the same `ld-gallery-item` id). They previously unfurled generic (at-war/most-alive hit the
  /gallery/:slug rewrite; terrain/tier fell to the catch-all). Vercel FS-before-rewrites is the
  load-bearing assumption. ⚠ `dist/gallery/index.html` must NEVER exist (shadows the unlisted ?slug=
  meta-shell rewrite) — dist-walk pin enforces.
- **World family = UNFURL-BUT-NOINDEX** (judgment, vetoable): `'world'` added to `NOINDEX_VIEWS`;
  `_metaShell.js` world kind noindex:true (X-Robots-Tag + robots meta; still public-cacheable, unlike
  unlisted's private no-store); `/world` dropped from sitemap (337→336) and prerender (13→12 views).
  Rationale: /world/:code is an unbounded generated URL space; bare /world renders an error state.
  /world deliberately NOT in robots.txt (noindex must stay crawlable).
- **World cards carry decoded facts**: `_metaShell.js` imports `decodeWorldCode` (pure) — realm size +
  tone on the card, seed never in the head. ⚠ FIXED latent bug: the path-form world matcher rejected
  every REAL dotted code (`w1.<b64>.<checksum>`); production had survived only via the ?worldCode=
  rewrite query.
- **NOINDEX_VIEWS single-sourced**: seo.js exports it; generate-sitemap.mjs imports + re-exports
  (its old local copy claimed test-enforced lockstep that never existed); identity pin (`toBe`, same
  Set object) in sitemap.test.js.
- **Redirect loop cured**: on shell-fetch failure meta-shell/gallery-meta now 302 to `/` (static,
  rewrite-free) — the old `/gallery` target re-entered meta-shell forever. Handler-level tests added
  (stubbed fetch), plus a VERIFY_DIST pin injecting over the REAL dist/index.html.
- **og-image fail-safe** now redirects to `og-craft.png` (was the retired pre-seal og-default.png).
  ⚠ Edge-function redeploy rides the owner deploy tail; deno og-image suite green (11 passed).
- **Descriptions**: covenant/bounty/roadmap/first-hundred got hand-written SERP-length copy;
  new pin forbids any indexable route shipping DEFAULT_DESCRIPTION. Declared copy change: the
  oversized compendium (233ch) and howto (195ch) descriptions were trimmed to ~130/120 to fund the
  eager bytes; no golden observes description text.
- **STRUCK/deferred (owner-gated)**: bar-14's 'letter' shareable artifact — no letter-share route
  exists repo-wide; building one is new public capability, not repair.

## ⚠⚠ THE SHARPEST HAZARD: closure headroom on this lineage is 28 BYTES
First-paint closure after SB4 = 1,039,972 / 1,040,000. seo.js is EAGER — ANY future eager addition
on the vision-e/sb4 lineage fails the ratchet; fund it by trimming or lazy-leafing first. The
composite-r4 lineage sits ~1,024.5K (~15.5K headroom), so folding SB4's ~+320B net is safe there.

## Gate (verbatim shape)
domain-strict 0 → tsc full 0 → eslint 0 (touched files) → focused suites 116 passed | 5 dist-gated
(9 files) → npm run build (sitemap 336 URLs; prerender 321 docs = 12 views + 15 hubs + 294 entries)
→ verify:dist 212 passed / 28 files → deno og-image 11 passed → NUL scan clean. Post-commit hook
(eslint --fix) changed nothing: quick gate re-run green on HEAD; foreign stash@{0} preserved.

## How to apply
- Folding SB4: bring the sitemap.xml regen with it (byte-match test), and re-run `npm run build`
  before verify:dist on the fold branch (stale-dist gotcha).
- If a hub vocabulary change reshapes GALLERY_HUBS, the prerender + sitemap + dist pins all follow
  automatically; regenerate public/sitemap.xml.
- Never re-add a local NOINDEX_VIEWS copy anywhere — import from src/lib/seo.js (identity pin bites).
