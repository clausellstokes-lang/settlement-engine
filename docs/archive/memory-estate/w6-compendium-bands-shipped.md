---
name: ""
metadata: 
  node_type: memory
  type: project
  date: 2026-07-21
  tags: 
    - walk
    - compendium
    - band-ladders
    - finite-semantics
    - generator
    - shared-tree-hazard
  branch: claude/w6-compendium-bands
  commit: 490e1c46
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-21T17:36:28.866Z
---

# W6 — Compendium banded concepts render their full band ladder (SHIPPED)

## What / Why
Owner order (walk lane W6): banded concepts in the Compendium described the concept
generally but never ENUMERATED their bands. Example: the Economy tab said prosperity
runs "Subsistence to **Affluent**" — and 'Affluent' was never a real rung (the prose
had drifted from the typed truth). Every banded object's entry must now render its
full ladder: each level NAMED + a one-line reading of how to read a settlement there.

## How (composite-r4 architecture — the REGISTRY-RENDER LAW)
On composite-r4 the Compendium renders every enumerable from the GENERATED artifact
`src/domain/compendium/generated/compendiumData.generated.js` (`COMPENDIUM_DATA`/`CD`),
built by `scripts/generate-compendium-data.mjs` (`npm run gen:compendium-data`) and
pinned by `tests/docs/compendiumDataFreshness.test.js` (byte-identity + parity). Band
ladders route through that generator:
- NEW `src/domain/compendium/bandLadders.js` — `buildBandLadders()` is a GENERATOR
  INPUT (not a runtime import). Assembles 4 ladders from typed tables:
  - **prosperity** — names from `PROSPERITY_TIERS` (constants.js); 7 **authored** readings.
  - **stability / strain / capture** — name+reading READ from `glossaryByCategory()`
    (`stability-band`=BAND_HINT, `strain-band`=CAPACITY_BANDS+STRAIN_DEFS,
    `capture-rung`=CAPTURE_LADDER+CAPTURE_DEFS). Zero re-authoring, zero drift; tab
    routing mirrors the glossary's own LINK map (stress / stress / power).
- Generator bakes `bandLadders: buildBandLadders()` into `CD`; regenerated (byte-identical
  double-run). Tabs render `CD.bandLadders` (pure frozen data → the lazy Compendium chunk
  gains NO glossary/engine weight; readings live in `compendiumData.generated-*.js`).
- `BandLadder` primitive (`compendium/primitives.jsx`) + Economy/Stress/Power tabs.
- NEW `tests/ui/compendiumBandLadders.test.jsx` — totality walker: every ladder renders
  every canonical rung with a non-empty reading in the tab DOM; each ladder coverage-pinned
  to its engine table (a new band without a reading REDS); `CD.bandLadders` === fresh build.

## Authored-new copy (the ONLY authored lines — for the Fable copy review)
7 prosperity readings in `bandLadders.js` `PROSPERITY_READINGS`: Subsistence / Struggling /
Poor / Moderate / Comfortable / Prosperous / Wealthy. Plus 4 short blurbs (concept
one-liners) in `LADDER_META`. Everything else (band names, stability/strain/capture
readings) is READ from typed sources. No em-dash, no exclamation, no engine tokens in
authored copy; anchored to causalState PROSPERITY_BASE (Subsistence 28 … Wealthy 86).

## ⚠️⚠️ THE HAZARD THIS SESSION HIT (record for every worktree task)
I first did the ENTIRE task against the **main tree** (`/Users/cstokes/Desktop/settlement-engine`,
branch review-fixes-2026-07-08) because my Edit/Write calls used MAIN-TREE absolute paths and
my `cd` for bash was the main tree — then committed to the wrong branch (9e74628e). The wave-e
**worktree** is at `.../.claude/worktrees/wave-e` on **composite-r4 (5e23db2d)**, and the two
lineages DIVERGE hard in the compendium files (CatalogTabs.jsx differs ~188 lines; composite-r4
has the "restoration-compendium" restyle + the compendium-data generator; review-fixes has
neither). So the work was on the wrong branch AND the wrong source.
- **Lesson**: in a worktree task, edit files under the WORKTREE absolute path and run git from
  the worktree dir. Verify `git -C <worktree> rev-parse --abbrev-ref HEAD` before editing/committing.
- **Recovery done**: redid correctly on the worktree (490e1c46, full gate green); reverted the
  misplaced main-tree commit with `git revert --no-commit 9e74628e` → commit `fdf24e1c` on
  review-fixes-2026-07-08 (two empty ledger commits WALK ADDENDUM 7 / 3c SPEC AMENDMENT had
  landed on top of mine, so reset was unsafe — revert was the only clean option; the empty
  ledger commits are message-only, `git diff --name-only 9e74628e HEAD` was empty).

## Other durable facts
- The brief's premise "compendium data is GENERATED (gen:compendium-data)" is TRUE on
  composite-r4 (false on review-fixes). `CD` already carried `prosperity.tiers` (7) and
  `causal.bands` (5) as NAME-ONLY enumerables — the owner's complaint at the data layer.
- `PROSPERITY_TIERS` (constants.js) is the canonical 7-rung ladder; `prosperity.js` holds
  TWO private 6-name label arrays (`LABELS`, `_PLABELS`) that drift from it — do not read those.
- `Viability` is NOT banded (it's `generateEconomicViability` → warnings/suggestions). Tier /
  Trade Route / Monster Threat were already fully enumerated in TiersTab (not offenders; left as-is).
- verify:dist emits pre-existing stderr noise (VENDOR-MANIFEST `flatqueue.js`/`__exact_set_probe__`,
  e2e anti-vacuity) from the FMG map-fork + e2e harness — unrelated to compendium; suite still passes.

## Scope deferrals (documented, not bugs to re-find)
- Severity / Magnitude dials EXCLUDED (DM action inputs, not "interpret a settlement at that band";
  also the `MAGNITUDE_BANDS` mirror hazard: array in `tableEvents.js` vs map in `tableLedger.js`,
  canonical = tableLedger). Documented in the glossary already.
- The ~20 other engine band systems the census found (magic profiles, districts, threat stages,
  occupation, tempo, hegemony, army, flow, age, calamity …) are NOT documented in the Compendium;
  adding them is new-content authoring beyond "enumerate what's already described." Deferred.
- Tier/Threat/Route ladders in TiersTab are hand-authored literals (already enumerated); NOT
  converted to derive-from-CD (owner complaint doesn't apply). Deferred.

## Gate receipts (worktree, composite-r4) — all CONFIRMED
band-ladder pin + compendiumDataFreshness + glossaryFreshness + compendium smoke/search = 53 green;
gen:compendium-data double-run byte-identical; domain-strict 0; tsc default+full 0; eslint 0 (incl.
generated artifact); NUL clean; `npm run build` + `VERIFY_DIST=1 vitest tests/build/` = 220 green,
readings in the lazy `compendiumData.generated-*.js` chunk (no eager first-paint growth).
