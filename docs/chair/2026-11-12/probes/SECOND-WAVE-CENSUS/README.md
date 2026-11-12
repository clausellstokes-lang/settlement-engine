# SECOND-WAVE-CENSUS — the instrument

The counter behind `docs/chair/2026-11-12/SECOND-WAVE-CENSUS-2026-11-12.md`, kept so a reviewer can count any tree, base and tip, with one instrument.

## Count a tree

```sh
sh docs/chair/2026-11-12/probes/SECOND-WAVE-CENSUS/census.sh <tree-root> <out-dir> [workers=4]
```

- **`<tree-root>`:** any checkout or worktree with `node_modules` installed (`npm ci` there; a byte-identical lockfile may link another checkout's).
- **`<out-dir>`:** scratch, outside the repository.
- **What it does:** births the 720 seeds in that tree, renders every dossier through that tree's own `OutputContainer`, counts, and prints one row per pattern. Nothing is written in the tree.
- **Time:** measured at 15–20 minutes per tree on a 4-core container (births about 1, render 12–18, count about 1).

## Compare two trees

```sh
node docs/chair/2026-11-12/probes/SECOND-WAVE-CENSUS/compare.mjs <base-out>/counts.perseed.json <tip-out>/counts.perseed.json
```

- One row per pattern: towns of the 720 in base and in tip, a verdict, and a reader class.
  - Verdicts: OLD when |Δ| ≤ max(5, 20% of base); NEW when base is 0; WORSE; BETTER.
  - Reader classes: GLANCE, SECOND READ, CROSS-CHECK.
- Then the towns carrying a GLANCE pattern, and the median patterns per town.

## The corpus (`seeds.txt`, 720)

Every birth is `birthConfig({ ...DEFAULT_CONFIG, ...dials, settType })`, after `loadGenerationLawPayloads()`, then `generateSettlementPipeline(cfg, null, { seed, customContent: {} })`.

- **Dials:** `tradeRouteAccess: 'random_trade'`, `culture: 'random_culture'`, `monsterThreat: 'random_threat'`, `nearbyResourcesRandom`, `selectedStressesRandom`, `_randomizePriorities`, `magicExists`, `contentProfile: 'grounded'`.
- **`r2r-<size>-<i>`:** 6 sizes × 60 = 360, calm.
- **`r2s-<crisis>-<size>-<i>`:** 15 crises × 6 sizes × 4 = 360, with `selectedStresses: [crisis]` and `selectedStressesRandom: false`.
- **The crisis list:** fixed in `births.mjs`, as at 8866a0ddd.

## The render (`render.census.jsx`)

- **Owner's view:** not `readOnly`; premium. The shared page hides every DM-only line, and three patterns live there.
- **Public prose:** stamped with `withPublicProse(composePublicProse(town))` where the tree has it. `census.sh` drops the stamp on older trees.
- **The walk** is `dossierPhoneFloorAllViews`'s: every group and sub-tab clicked, every `aria-expanded` disclosure opened, single-valued accordions opened in turn.
- **Dump format:** one line per block element per view. A repeated line is kept once per view. `<style>` text is tagged `[STYLE]` (pattern 21: never visible, so it is not a row).
- **Naming:** the file is named `*.census.jsx` so the repository's test glob never picks it up.

## The counter (`count.mjs`, `load.mjs`, `pools.snapshot.json`)

- **One test per pattern.** Each test, its two writers and its home are in the census document.
- **Regex vocabulary:** the DS prose pools, `pools.snapshot.json` (db832c892 ∪ 8866a0ddd) unioned with the counted tree's own pools. So a variant that exists in only one tree is read in both.
- **Two record-read rows:** 18 (via `institutionDisplayName` of the counted tree) and F4's open question.
- **Two gap forms:** pattern 6 reads both ("No X reaches the Y." and the older "Y exists but lacks access to X").

## The columns (`columns/`)

- **Files:** `db832c892.counts.*` (master before the integration) and `8866a0ddd.counts.*` (the integration tip), each counted with this instrument.
- **`compare-db832c892-vs-8866a0ddd.txt`** is their comparison: nine NEW, sixteen OLD, one BETTER.
- **Not comparable on master:** 5a (the hall card), 8 (the Faith view) and 16a (the "who really runs" panel) had no page there. Their base zero is not a measurement.
- **Identity:** the same seeds give the same towns on both trees (name, size, population, terrain: 720/720; roster 661/720), with different narrative draws.
