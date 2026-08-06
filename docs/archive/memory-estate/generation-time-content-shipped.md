---
name: generation-time-content-shipped
description: "GENERATION-TIME CONTENT park wave (task #27 remaining half) built + PARKED on claude/generation-time-content (base w7-prep @ 07d3a1d2, 3 commits, tip f9720b5a, UNFOLDED). Grew the world-pulse event-prose slice: calamity (bucket-neutral) + all 22 war/peace receipts + upswing/resource/lifecycle kernel news, via a new pure FNV picker src/domain/worldPulse/eventProse.js. EMPIRICAL 0 golden reds; eager delta ~0 B; dossier/naming surfaces DEFERRED to a sibling lane."
metadata: 
  node_type: memory
  type: project
  originSessionId: 4e5bd424-21ab-4307-ba41-bd048bb9061e
---

# GENERATION-TIME CONTENT — BUILT + PARKED (2026-07-17)

Task #27's remaining half (the content-volume commission's generation-time class). On
`claude/generation-time-content` (base = claude/w7-prep @ `07d3a1d2`), 3 commits, tip
`f9720b5a`. **UNFOLDED — parks for the ONE REGEN** (joins the composite as-is; never
re-record goldens here). Shift map in-branch: `docs/GENERATION_TIME_SHIFT_MAP.md`.

## What shipped (the world-pulse EVENT-PROSE slice)
- New pure leaf `src/domain/worldPulse/eventProse.js`: FNV-1a `pickLine(pool, seed, interp)`
  — **canonical-at-zero** (falsy seed ⇒ index 0 = the exact old string ⇒ every seedless
  caller byte-identical) + all the variant pools + a self-deriving `EVENT_PROSE_REGISTRY`
  (57 pools) for the walker guards.
- Calamity (CRITICAL): title/summary/reason pools, keyed on stable ids. **Bucket-neutral**
  (no flood/fire/quake/earthquake/storm substring; every title keeps "Great Calamity",
  every summary speaks "calamity"). Title variety lives in the LAZY `calamityKernel` —
  `spatial/calamity.js` `stampTitle` LEFT UNCHANGED (so no spatial→worldPulse import, no
  eager risk; and its two unit pins stay green).
- War + peace receipts: all 22 reason types (10 warReasons + 10 peaceReasons + 2
  hegemonyFear) + decree-default, **seeded on the DIRECTED PAIR KEY** (`${from}>${to}`,
  stable across ticks ⇒ no per-tick churn; different pairs differ). Branch logic
  (belief-convergence, economic-strangulation base/blockade/supplyweb, realignment,
  founded-provenance) preserved; interpolated numbers/names threaded through unchanged.
- Kernel news (upswing 4 / resource 2 / lifecycle 5): FRAMING-ONLY variety keyed on
  `${id}:${tick}`; every semantic token (counts, cause, artery, provenance) preserved so
  keyword/structural pins hold. Lifecycle in-record `history` state-log strings and all
  `impactKind`s left untouched (they ARE pinned; only the news headline/summary/reasons vary).

## The load-bearing design facts (reuse these)
- **Selection is a PURE hash — NO rng consumed.** So the rng stream is unperturbed and no
  structural/numeric field can move; only display/record-only prose text varies. This makes
  the shift map tight and dormancy byte-identical when flags are dark.
- **HONEST FINDING: the "park" is a no-op against the CURRENT suite (0 reds).** The slice IS
  golden-BINDING (prose persists into wizardNews / calamityHistory / warReasons+peaceReasons
  ledgers / pulseHistory on LIT paths; regens at the ONE REGEN). But the current suite
  exact-pins almost none of it — war/peace lit tests assert `receipt.length>0`; scorer unit
  tests are seedless (⇒ canonical, keywords held: unforgotten/oathbreach/same truth/supply
  web/blockaded/exhaustion/horde|passes/coalition thins); dormancy goldens hash the DARK
  projection; the one exact calamity title pin (`calamity.kernel.integration.test.js:156`,
  Thornwood/year-2) hashes to the CANONICAL variant. Full suite: 12408 passed / 0 failed.
- Variety is proven by the NEW guards `tests/domain/eventProse.test.js` (129): register laws
  (bucket-neutrality/no-leak), full reachability (every pool line reachable — use DIVERSE
  seeds, `String(i)`; structured `pair-i>foe-i` seeds CLUSTER in the FNV low bits and give
  false failures), determinism (same pair→same pick, different pairs differ, no tick churn).
- **Eager delta ≈ 0 B**: `eventProse.js` rides lazy chunks only (advanceInterval.worker,
  peaceTerms, pdfRender.worker) — never the eager index/engine-core (vendorPdfLazy budget green).
- The docs live on the LEDGER branch `review-fixes-2026-07-08`, NOT on w7-prep — the survey
  `docs/review-r2/CONTENT_THINNESS_SURVEY_RAW.txt` + the 2052-line program doc are there;
  the w7-prep copy is a pruned older snapshot (1063 lines). `git show review-fixes-2026-07-08:<path>`.

## Deferred-with-reason → sibling CONTENT-GT-DOSSIER lane (spawn-chip task_56fe7e02)
The DOSSIER + NAMING generation-time prose (pressure sentence CRITICAL, history events,
founding/arrival, political flavor, institution descs 301 / services 935, NPC persona,
faction names CRITICAL, institution NAME tables, deity/naming cultures) — the commission's
"AI-bulk + owner TASTE-SAMPLE" class. Faction names' real fix is a WORLD-SCOPED dedupe
registry (survey's rec); institution NAME variety needs a displayName SCHEMA field
(owner-gated, they're load-bearing substring lookup keys); deity/naming are owner-ratified.
Realm order/refusal news also deferred (DM-order-only ⇒ zero organic repetition; its refusal
prose delegates to the load-bearing code-matched `realmVetoProse` — do not touch).
