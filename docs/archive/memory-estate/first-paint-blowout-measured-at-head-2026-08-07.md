---
name: first-paint-blowout-measured-at-head-2026-08-07
description: "The verify:dist first-paint blowout re-measured at HEAD 1e4c493b — 3 real reds not 5, the gap is 12.3% not 65%, the ENGINE_SHARED_DOMAIN-widening hypothesis is REFUTED (ESD SHRANK 51->42), and a 5-family cure ledger is proven by cut-simulation to release ~169,578 minified bytes"
metadata: 
  node_type: memory
  type: project
  lane: FP-2026-08-07 (nice-matsumoto-a3389c)
  measuredAtSha: 1e4c493b
  modified: 2026-08-10T18:13:58.876Z
  originSessionId: b9b3328b-d890-4f5d-8fa7-27c8f2e33a79
---

# ⭐⭐ FIRST-PAINT BLOWOUT — MEASURED AT HEAD, AND THE HANDED HYPOTHESIS IS REFUTED

Measured 2026-08-07 in worktree `.claude/worktrees/nice-matsumoto-a3389c`,
branch `claude/nice-matsumoto-a3389c`, HEAD **`1e4c493b`**, own `npm ci` +
`npm run build` + `VERIFY_DIST=1 vitest run tests/build/`. Tree clean apart from
this lane's own one-file edit.

## ⚠⚠ THE BRIEF'S FIGURES WERE SIX COMMITS STALE — AND THE NEXT COMMIT FIXED MOST OF IT

The census was taken at `f707a905`. `67f8a58e` ("Layering: three regressions the
dark gate hid") landed **one commit later** and cut the entry chunk from **335
modules / 5,923,725 source bytes to 202 / 2,932,200**. Anyone inheriting the
f707a905 numbers is sizing a program against a defect two-thirds already repaired.

| test | at f707a905 (brief) | at HEAD 1e4c493b | budget | verdict |
|---|---|---|---|---|
| first-paint raw closure | 1,712,432 (+65%) | **1,168,130 (+12.3%)** | 1,040,000 | RED |
| first-paint gzip | 544,314 (+61%) | **367,507 (+9.1%)** | 337,000 | RED |
| render-blocking CSS | 19,813 | 19,813 | 19,800 | RED (+13 B) |
| engine chunk ceiling | 677,023 | **665,920** | <673,000 | ✅ GREEN |
| townScene3d bounded payload | 392,728 | (passes) | 350,000 | ✅ GREEN |

The three layering-lane reds the brief fenced off (domainGeneratorsBoundary ×2,
userRouteIdentityLeaf) are also GREEN at HEAD. `npm run smoke:boot` PASSES —
490/490 chunks initialise, shell mounts, 31,706 B under `#root`.

## ⚠⚠ THE HYPOTHESIS — "a domain→generators edge widened ENGINE_SHARED_DOMAIN and
dragged engine code eager" — IS REFUTED BY MEASUREMENT

ESD size and engine-core membership, computed from source at each sha:

| sha | date | ESD | engine-core mods | ENTRY-chunk mods | ENTRY src bytes |
|---|---|---|---|---|---|
| 8033ddbe | 07-22 | 26 | 16 | 146 | 2,049,627 |
| a82a5c70 | 08-01 | 51 | 25 | 164 | 2,254,159 |
| aaa4b3ac | 08-02 | 51 | 25 | 173 | 2,339,749 |
| f707a905 | 08-07 | 41 | 29 | **335** | **5,923,725** |
| 67f8a58e | 08-07 | 42 | 28 | 202 | 2,932,200 |
| 1e4c493b | 08-07 | 42 | 28 | 202 | 2,932,674 |

**ESD SHRANK 51 → 42.** engine-core gained 3 modules. The whole overage is in the
**entry chunk itself** — +29 eager modules and +592,925 source bytes of ordinary
store/domain/UI growth since 2026-08-02, not engine code escaping its chunk.
`index-xVYJfX40.js` = 716,630 B minified from 2,442,070 B rendered (ratio 0.2936).

Where the entry chunk's bytes actually are (RENDERED, post-treeshake, from
`ANALYZE=1 npm run build` → `dist/stats.html`): worldPulse 424,576 (33 mod) ·
events 283,138 (17) · region 175,960 (5) · settlementSlice 104,574 · theme.js
90,270 (grew +94,721 B of SOURCE in place since 08-02) · content 85,798 (10).

## ⭐⭐ THE CURE LEDGER — PROVEN BY CUT-SIMULATION BEFORE A LINE IS EDITED

Every entry is the SAME recorded class as [[barrel-hop-drags-the-whole-family]]:
a module reaching for one or two symbols through a heavy module or a barrel.
Projected minified saving = released RENDERED bytes × 0.2936.

| # | cut | released | ~minified |
|---|---|---|---|
| A | `worldPulse/worldState.js` → envoyErrandRecords + dispositionLedger + warCoalitionLedger (ONE symbol each: `normalizeEnvoyErrands`, `migrateDispositionStats`, `normalizeJoinAnchor`) | 15 mod / 230,169 B | **67,576** |
| B | `domain/region/index.js` (BARREL) → propagation + wizardNews + discoverDependencyCandidates | 3 mod / 115,166 B | **33,812** |
| E | `events/eventPipeline.js` → factionRelationshipUpdate + factionResponses | 2 mod / 72,004 B | **21,140** |
| C | `store/aiSlice.js` → aiOverlayLifecycle → aiOverlayVerifier → historyBeats → simulationSpine | 4 mod / 70,512 B | **20,702** |
| D | `events/mutate.js` → mutateWorld.js | 2 mod / 64,073 B | **18,811** |
| | **A+B+C+D+E together** | **27 mod / 577,596 B** | **~169,578** |

Gap to close is **128,130** raw. A+B+C+D+E projects the closure to ~998,552
(≈41 kB under budget) and gzip to roughly 314 kB (under 337,000). **No budget
needs raising.** Address chain for A: `main.jsx → store/index.js →
campaignSlice.js → worldState.js → envoyErrandRecords.js → negotiationPictures.js
→ peaceTermsCarriedSheet.js → peaceTermsCatalog.js`.

⚠ Cutting `campaignSlice.js → region/index.js` releases ZERO — the barrel has
several eager importers. The releasable edges are the barrel's OWN three
downward edges. **A walker/intuition names the wrong edge; only the cut sim is
right.**

## ⚠ TWO tests/build FAILURES IN A FULL PARALLEL RUN ARE FAKE

`townScene3dLazy` "emits an honest withhold receipt" and
`townSceneLocalMatrixAudit` "covers every pair…" fail as **`Test timed out in
20000ms`** under full parallel load, and BOTH pass under
`VERIFY_DIST=1 npx vitest run --no-file-parallelism …` (25/25). Three tests in
townScene3dLazy run 10.4–**20.5 s** against the global 20 s `testTimeout`, so
this file is a coin flip under any contention. Extends
[[generation-remediation-gate-state]]'s "parallel-load reds are FAKE".

## The instruments (rebuild them, do not re-derive by reading imports)

Kept at this session's scratchpad, prefix `nm-`:
`nm-entry-census.mjs` (replicates vite.config.js's ESD/EAGER/manualChunks and
reports entry-chunk membership from SOURCE at any sha — reads the excision list
out of vite.config.js text so it cannot drift) · `nm-cut-sim.mjs` (removes each
of the 517 intra-frontier edges and re-derives membership) · `nm-stats.mjs` +
`nm-project-cut.mjs` (parse `dist/stats.html`'s `const data = {…}` for
`nodeMetas`/`nodeParts` `renderedLength`, keyed `assets/<chunk>.js`, to turn a
simulated cut into REAL projected bytes).

⚠ **A SOURCE-BYTE census OVERSTATES.** `peaceTermsCatalog.js`'s literal
`coalition_betrayal` is absent from the shipped entry chunk — treeshaking. Size a
cure in RENDERED bytes from stats.html, never in `wc -c`.

## Also found, and FIXED in this lane (uncommitted)

`1e4c493b` chained `npm run validate:hazard-registry` into package.json's `check`
as step ONE but never added it to `.github/workflows/ci.yml` — so the registry
gate, whose own docblock says a registry nobody validates commits the defect it
diagnoses, was **dark in CI**. `tests/build/ciCheckParity.test.js` caught it.
Added a "Validate hazard registry" step; that file is 2/2 green.

**How to apply:** re-measure any inherited bundle figure at YOUR head before
sizing a program — this is the third recorded instance of an inherited blocker
that had already moved. Never raise a first-paint budget; the cure ledger above
closes this one with room to spare. Related: [[barrel-hop-drags-the-whole-family]],
[[dist-boot-chunk-cycle-tdz]], [[step12-test-ratchet-landed]],
[[sizebaseline-exact-ceiling-hazard]], [[concurrency-law-ruled]].

## ✅ OUTCOME 2026-08-10 — ALL THREE REDS RECLAIMED, NO BUDGET MOVED

The cure ledger delivered. Re-measured from the built artifact: raw **1,013,926 /
1,040,000** · gzip **320,925 / 337,000** · brotli **269,548 / 283,000** ·
render-blocking CSS **19,795 / 19,800**. Budget constants are UNCHANGED
(`tests/build/vendorPdfLazy.test.js:468-475`, `tests/build/firstPaintNonJs.test.js:37`),
which is what makes this a reclaim rather than a re-pin — check those constants first
when anyone reports this closed. Cured by `f52a7b75` (2026-08-08, "S12 closeout:
reclaim the render-blocking CSS budget") and `6e7acc4d` (2026-08-09, "isolate campaign
runtime and strict hydration").

⚠⚠ **The CSS budget has FIVE BYTES of headroom (19,795 of 19,800).** Any
render-blocking CSS addition is budget-breaking until proven otherwise; this is the
tightest ceiling in the build and it will read as a mystery red.

⚠ **Receipt grade: CONFIRMED at the artifact, PLAUSIBLE at HEAD.** The dist was built
from the LIVE shared tree, not from a `git archive` of `9df7e428` — by this estate's own
ARCHIVE-CENSUS LAW ([[receipt-vacuity-and-shared-ratchet-rules]]) that is not
census-grade, because a concurrent lane's uncommitted edits are in the measured bytes.
Re-run inside a clean archive before quoting these numbers as a HEAD receipt.
