# Size projection: side-branch content against the five shipped-size budgets (2026-11-20)

Read-only measurement. No build was run, no test was run, and no worktree was touched. Inputs were git object queries in
`/home/user/wt/line`, after `git fetch` of `lane/*` (and `--deepen=400` on the veil refs, because the repository is shallow
at the veil root `d7abcdc55`). BASE = `origin/lane/join-2026-11-14` at `8196e5712`, as expected.

**Labels used throughout**
- **MEASURED**: blob byte sizes from `git cat-file -s`, UTF-8 bytes of extracted wordings, and gzip/Brotli of a concrete
  byte string.
- **EST-MIN**: an estimate. Each file's old and new blob were minified separately with esbuild 0.24 `transformSync({minify:true})`,
  installed in the scratchpad, not the project. This is closer to shipped bytes than source bytes, because the codebase
  is heavily commented. Vite's real minifier, scope hoisting and tree-shaking will differ.
- **EST-ROUTE**: the bundle a file lands in, read by a static emulation of `vite.config.js`'s routing, run on each tip's own
  tree and its own `vite.config.js` (see "How bundles were assigned").

## How the budgets are measured (the repo's truth)

| figure | where it is enforced | what it measures | at the base's predecessor (CI, given) | over by |
|---|---|---|---:|---:|
| worker | `tests/build/generationWorkerLazy.test.js` `WORKER_BUNDLE_CEILING_BYTES = 2579708` | bytes of `dist/assets/generation.worker-*.js` | 2,587,733 / 2,579,708 | 8,025 |
| engine chunk | `tests/build/vendorPdfLazy.test.js` `toBeLessThan(909_928)` | bytes of `engine-*.js` (not `engine-core-*`) | 913,178 / 909,928 | 3,250 |
| first paint raw | `vendorPdfLazy.test.js` `CLOSURE_BUDGET_BYTES = 1_175_492` | the entry's static chunk closure (BFS over static imports from `dist/index.html`'s module script) | 1,177,668 / 1,175,492 | 2,176 |
| gzip | `CLOSURE_GZIP_BUDGET_BYTES = 373_999` | per-file `gzipSync(level 9)` summed over that closure | 374,681 / 373,999 | 682 |
| Brotli | `CLOSURE_BROTLI_BUDGET_BYTES = 313_994` | per-file Brotli q11 summed over that closure | 314,577 / 313,994 | 583 |

The CI "Gate / build and dist" job runs `npm run build` and then `npm run verify:dist`
(`node scripts/check-test-ratchet.mjs --verify-dist`, which runs `vitest tests/build/`). `scripts/.size-baseline.json` is
per-file **line** ceilings for eslint `max-lines`, not a byte budget. There is no `size-limit` and no other `budget` script.

**Routing facts from `vite.config.js` that decide the classes below**
- `/src/generators/*` and `src/data/narrativeData.js` go to the `engine` chunk. This is the budgeted "engine chunk": lazy,
  and not modulepreloaded.
- A domain module that any generator reaches (`computeEngineSharedDomain`), minus the excision lists, goes to
  **`engine-core`**. That chunk is EAGER and is part of the first-paint closure, because `rulingPower.js` sits in it and is
  statically reached from `main.jsx` → `store/index.js` → … → `events/mutateWorld.js`.
- Modules in `FIRSTPAINT2_LAZY_DOMAIN` go to the lazy `coherence-lazy` chunk.
- `src/data/*` goes to the eager `data` chunk if it is in `EAGER_MODULES`; otherwise it goes to the lazy `data-lazy` chunk.
- `src/kernel/*` goes to `kernel`, which is eager.
- The generation worker is its own bundle. It holds the static closure of `src/workers/generation.worker.js`, so
  generators, data-lazy tables and engine-core domain modules are copied into it again.
- The derivation walks THROUGH pinned modules. The config itself documents this pitfall for `facts/ironAtHand.js`, and it
  recurs here: `seat/seatLaw.js` is reached via `rulingPowerCoup.js` (pinned lazy), and `facts/causeHouses.js` via
  `facts/factsOf.js` (pinned lazy). Both still land in eager engine-core.
- **`domain/hookThemes.js :: AUTHORED_HOOK_THEMES` is keyed by the hook's full text.** Every hook line therefore ships
  twice: once in `data/npcData.js` (worker + data-lazy) and once in `hookThemes.js` (worker + eager engine-core = first paint).

## Branch selection (step 1–2)

There are 210 `lane/*` branches dated 2026-11-20. Families were grouped as asked. Within each family, the newest main
branch is the primary tip. Every other tip that is not an ancestor of another family branch was checked with
`git merge-base --is-ancestor`, measured against its merge-base with the primary, and checked with `git cherry`.

**Counted at zero, or not counted**
- **goals**: goals-4 and goals-3-b9 have no src change. Goals-1, -2, b4, b5, b7 and b8 are in BASE.
- **people**: people-1, people-2 and m1–m6 have no src delta, or are patch-equivalent to the primary.
- **same**: same-2 and same-1-door have no src delta.
- **prose**: prose-2, prose-2-wording and prose-1 have no src delta. Only prose-1-build-1-wip carries src.
- **kernel-mix**: `kernel-mix-2026-11-20` is already in BASE.
- **page-8**: there is no branch dated 2026-11-20.
- **page-9**: `page-9-2026-11-20` is blob-for-blob identical to page-4 on all 22 src files (`git diff page-4 page-9 -- src`
  is empty). It is counted once, under page-4.
- **page-6-lines**: no src delta.
- **review-veil** (10, 11, 13): its src holds OLDER versions of the same files veil-27 carries (for example
  `gallerySecondHomes.js` at 101,242 B against veil-27's 101,909 B). It is superseded and not counted.
- **veil-21-r2, r2b, r6, veil-22-r3, r6, veil-23-r3c**: earlier repair rounds. Every src file they touch, veil-27 also
  carries, in a later version. They are superseded and not counted.
- **veil-22-r4** (`galleryVeilPeople.js` +13,732, 07:32 UTC, "NOT GREEN"): a new file that is absent from veil-27. Its fate
  cannot be read from git, so it is held OUT of the totals and reported as UNCERTAIN: +15,427 B src, lazy.
- **Duplicate across families**: `src/kernel/proseHash.js` is the same blob (`14819cfb3`, +1,420 B) on trad-5 and depth-2.
  It is counted once, under trad.
- **Overlapping changes** (different blobs, so counted additively): `facts/factVocabulary.js` (page-7, depth-2, place),
  `factsOf.js` (page-7, depth-2, place), `data/npcData.js` (page-6, depth-3, depth-2), `densityCreateBoundary.js` (seat,
  fortune), `OutputContainer.jsx` (frame, trad), `journalPages.js` (page-4, frame) and `publicProseCompose.js` (trad,
  veil).

## (a) By family: tips counted, merge-base, src byte delta, split by bundle

All figures are bytes. "src Δ" is MEASURED. "min" is EST-MIN. The split is EST-ROUTE. A file in the worker AND a
main-thread chunk counts in both columns, because they are separate bundles. Lazy and not-shipped are unbudgeted.

| family | tip counted | measured from (merge-base) | src Δ | min Δ | worker | engine chunk | first paint | lazy | not shipped (unwired) |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|
| page-4 (= page-9) | page-4-2026-11-20 | 0c9069489 (BASE) | +33,628 | +6,462 | 0 | 0 | 0 | +33,628 | 0 |
| page-6 | page-6-2026-11-20 | 43ab0f5eb (BASE) | +27,061 | +13,735 | +27,061 | +12,616 | 0 | +14,445 | 0 |
| page-7 | page-7-2026-11-20 | 43ab0f5eb (BASE) | +86,630 | +46,001 | +9,120 | +15 | +6,860 | +2,245 | **+77,510** |
| frame | frame-7-2026-11-20 | 43ab0f5eb (BASE) | +98,899 | +33,316 | +6,873 | 0 | 0 | +98,899 | 0 |
| frame | frame-6-…-c2b-wip | a170832e5 (frame-7) | +217 | −92 | 0 | 0 | 0 | +217 | 0 |
| frame | frame-2-…-b10 | 8df635b61 (frame-7) | +3,011 | +277 | +3,011 | 0 | 0 | +3,011 | 0 |
| trad | trad-5-2026-11-20 | 0c9069489 (BASE) | +81,561 | +23,650 | +1,420 | 0 | +1,420 | +80,141 | 0 |
| trad | trad-5-…-u11-wip | e97a917b7 (trad-5) | +144 | −24 | 0 | 0 | 0 | +144 | 0 |
| depth | depth-3-2026-11-20 | 43ab0f5eb (BASE) | +14,918 | +13,906 | +14,918 | 0 | +7,681 | +7,237 | 0 |
| depth | depth-2-2026-11-20 (proseHash excluded) | e0d108bb0 (depth-3) | +30,157 | +16,262 | +28,624 | +6,132 | +8,555 | +13,937 | +1,533 |
| depth | depth-2-…-hooks-2 | c89edfd98 (depth-2) | +199 | +52 | +199 | 0 | 0 | +199 | 0 |
| place | place-1-entrepotnote-…-wip | 0b41e9fd4 (place-1) | +24,578 | +14,855 | +24,578 | +447 | +897 | +23,234 | 0 |
| place | place-1-safetydesc-…-wip | 550d7d8b3 (place-1) | +13,910 | +9,577 | +13,910 | +1,855 | 0 | +12,055 | 0 |
| prose | prose-1-build-1-…-wip | 87f03395b (prose-2) | +46,869 | +25,868 | 0 | 0 | 0 | +46,869 | 0 |
| daily | daily-2-2026-11-20 | bd42d63c7 (BASE) | −57 | −65 | 0 | 0 | 0 | −57 | 0 |
| seat | seat-6-2026-11-20 | e356c94f2 (BASE) | +58,561 | +12,129 | +55,762 | +301 | +22,172 | +36,067 | +21 |
| seat | seat-2026-11-20-u5-cure | 6e697f5db (seat-6) | +6,734 | +1,207 | +6,480 | 0 | +5,218 | +1,516 | 0 |
| fortune | fortune-3-2026-11-20 | 43ab0f5eb (BASE) | +23,485 | +4,382 | +20,741 | +8,879 | +11,862 | +2,744 | 0 |
| veil | veil-27-2026-11-20 | 8f3b8bf4b (BASE) | +277,329 | +129,640 | +985 | 0 | 0 | +204,063 | **+73,266** |
| veil | veil-27-r3c8 | 5f45144ae (veil-27) | +434 | +58 | 0 | 0 | 0 | +434 | 0 |
| veil | veil-doors-3 | bedd5a392 (veil-27) | +16,698 | +6,993 | 0 | 0 | 0 | +1,175 | +15,523 |
| **total counted** | | | **+844,966** | **+358,189** | **+213,682** | **+30,245** | **+64,665** | **+582,203** | **+167,853** |

Every other family tip (goals, people, same, prose-2/-1/-wording, kernel-mix, review-veil, page-9, the superseded veil
rounds) adds 0 src bytes beyond the rows above. The per-file table, with every file's route, is in `appendix-files.md`
(beside this file); the same data is in `per-file.json`.

## (b) The unbuilt wordings (step 4)

The table counts UTF-8 bytes of the wording text only. It was extracted per document format: numbered lines, quoted
lines, table cells, and `text:` strings in `m3-pools.mjs`'s two objects. Wordings already verbatim in BASE src (each
pool's "index 0 = today's text") are dropped. No set was found already built on any counted branch: every wording was
searched in the added lines of every counted tip, and there were 0 hits. The new hook themes for tranche 2 are built on
depth-2, but HOOKS-4 is tranche 3 and is not built anywhere.

| set (ref:path) | lines (unbuilt / total) | raw B (MEASURED) | gzip -9 | Brotli q11 (node zlib) | lands in | how inferred |
|---|---:|---:|---:|---:|---|---|
| WANT-LINES-FINAL (goals-3-b9) | 380 / 380 | 27,216 | 8,522 | 7,323 | worker + lazy (data-lazy) | the doc appends to `GOAL_FAMILY_LINES` in `src/data/people/goalFamilies.js`, which routes data-lazy and sits in the worker closure |
| LINES-1 + LINES-1b (daily-1) | 154 / 170 (16 in BASE) | 11,996 | 3,657 | 3,089 | lazy (data-lazy) | `briefs/B-BUILD-COMMON.md` rule 1: "every new pool in its own new data file under `src/data/dailyLife/`". Its reader `src/domain/dailyLife.js` is reached only via `import()` (`regenerationDelta.js`), is not in the worker closure, and is not eager |
| LINES-2 + LINES-2b (daily-1) | 446 / 454 (8 in BASE) | 32,056 | 10,829 | 9,246 | lazy (data-lazy) | as above |
| LINES-power-tranche2 (people-2) | 78 / 78 | 7,509 | 2,163 | 1,795 | worker + lazy (data-lazy) | `briefs/P2-B2-powerLines-BUILD.md` names the new `src/data/powerLineVariants.js`, read by `factionStanding.js` / `factionDynamics.js` (generators) |
| m3-pools FOUNDER_VARIANTS (people-2) | 108 / 108 | 8,862 | 1,871 | 1,493 | worker + lazy (data-lazy), UNCERTAIN | no build brief. Sibling pattern: P2-B2 and P2-B3 each put pools in a new `src/data/*Variants.js`. If they are inlined in `generators/narrative/settlementOriginProse.js` instead, they land in the engine chunk |
| m3-pools OVERCOMING_VARIANTS | 36 / 36 | 2,107 | 877 | 681 | same as above | same as above |
| HOOKS-4 (depth-3) | 60 / 60 | 7,803 | 2,950 | 2,410 | worker ×2 + lazy (data-lazy) + **first paint** | the doc: append to `src/data/npcData.js :: NPC_FACTION_LOYALTY` AND tag in `src/domain/hookThemes.js :: AUTHORED_HOOK_THEMES`, which is keyed by full text and routes to eager engine-core |
| safetyDesc-VILLAGE-LINES (place-1-safetydesc-wip) | 17 / 17 | 1,250 | 615 | 480 | worker + lazy (data-lazy) | appended to `src/data/safetyDescLines.js`, which is not in BASE and is new on that wip branch (data-lazy, worker) |
| **total** | 1,279 | **98,799** | | | | |

The raw sum of each set's own gzip is 31,484 B (MEASURED, but not a bundle figure). The wording bytes exclude per-row
syntax (quotes, commas, `needs:` objects, the hookThemes `[text,'theme']` pairs: about 20–25 B a row, about 1.2–1.5 kB for
HOOKS-4's tags).

## (c) Totals per bundle beside the five budgets

Projected = the CI figure + built minified delta (EST-MIN) + unbuilt wording bytes (MEASURED text). The "upper" column uses
raw source deltas instead of minified ones. For gzip and Brotli, "best" uses per-file minified gzip/Brotli deltas
(EST-MIN), and "upper" uses compression of the raw added source lines (step 5's method).

| budget | CI now / budget | built Δ: min (EST) · src (MEASURED) | unbuilt Δ (MEASURED text) | projected (best, ESTIMATED) | **projected over budget by about** | upper bound (raw src) over by |
|---|---|---:|---:|---:|---:|---:|
| worker | 2,587,733 / 2,579,708 | +86,995 · +213,682 | +62,550 (HOOKS-4 counted twice) | 2,737,278 | **≈ 157,600 (estimated)** | ≈ 284,300 |
| engine chunk | 913,178 / 909,928 | +7,664 · +30,245 | 0 (or +10,969 if the m3 pools are inlined in a generator) | 920,842 | **≈ 10,900 (estimated; ≈ 21,900 if m3 is inlined)** | ≈ 33,500 |
| first paint raw | 1,177,668 / 1,175,492 | +21,606 · +64,665 | +7,803 (HOOKS-4 in hookThemes; + ~1.3 k tags) | 1,207,077 | **≈ 31,600 (estimated; ≈ 32,900 with tags)** | ≈ 74,600 |
| first paint gzip | 374,681 / 373,999 | +7,750 (min-gz) · +21,980 (gzip of added src lines) | +2,950 | 385,381 | **≈ 11,400 (estimated)** | ≈ 25,600 |
| first paint Brotli | 314,577 / 313,994 | +6,738 (min-br) · +18,553 | +2,410 | 323,725 | **≈ 9,700 (estimated)** | ≈ 21,500 |

**Unbudgeted classes**
- **Lazy**: built src +582,203, min +222,554, min-gz +76,190. Unbuilt wordings add +98,799 raw; gzip of the added text is
  209,299 B for built and unbuilt combined (upper style).
- **Unbudgeted workers**: pdfRender, advanceInterval, customContentPreview and townScene also receive many of these
  bytes; see the appendix.
- **Not shipped (unwired at the tip)**: src +167,853, min +106,365.

**Step 5 (compression of the ADDED text, per class)**. All figures are MEASURED. `gzip -9 | wc -c` was used. There is no
`brotli` binary on this machine, so Brotli is node `zlib.brotliCompressSync` at quality 11, the repo's own method.

| class | built added lines raw / gzip / Brotli | unbuilt wordings raw / gzip / Brotli | together raw / gzip / Brotli |
|---|---|---|---|
| worker | 230,324 / 67,246 / 55,189 | 54,747* / 16,061 / 13,795 | 285,077 / 83,110 / 68,836 |
| engine chunk | 39,811 / 13,787 / 11,991 | 0 | 39,812 / 13,788 / 11,992 |
| first paint | 68,729 / 21,980 / 18,553 | 7,803 / 2,950 / 2,410 | 76,533 / 24,870 / 20,848 |
| lazy | 616,225 / 180,153 / 144,418 | 98,799 / 29,454 / 25,497 | 715,032 / 209,299 / 169,616 |
| not shipped | 171,094 / 44,827 / 38,074 | 0 | 171,095 / 44,828 / 38,046 |

\* HOOKS-4 is counted once in this row; the worker projection in (c) counts it twice.

**Caveats on these figures.** They are upper-bound style. The added lines include comments and whitespace that
minification strips, and both "added" columns are compressed in isolation, so they get no shared dictionary with the
existing text. Minification changes code, not strings. A shared dictionary with the existing chunk text would compress
better. Per-file minified-gzip deltas (the "best" column) are also only an approximation of how the summed per-chunk
gzip moves.

## (d) The three biggest single contributors

**By raw src delta, whole set** (MEASURED):
1. `src/domain/display/gallerySecondHomes.js`, veil-27: +101,909 B (min +42,680). Lazy: the gallery/veil path, reached by
   `import()` through `OutputContainer.jsx` / `galleryImportSettlement.js`.
2. `src/domain/veil/rosterChoiceRegistry.js`, veil-27: +73,266 B (min +55,356). **Not shipped**: only tests and
   `scripts/veil/rosterChoiceRegistry.mjs` import it.
3. `src/domain/traditions/traditionDescription.js`, trad-5: +41,383 B (min +9,105). Lazy (dossier search / tabs, and the
   pdfRender worker).

**Against the BUDGETED bundles** (EST-MIN):
- **worker**: `src/data/entrepotNotes.js` (place-1-entrepotnote-wip) +14,354; `src/data/safetyDescLines.js`
  (place-1-safetydesc-wip) +9,344; `src/data/arrivalProse.js` (page-6) +7,824. The unbuilt WANT-LINES-FINAL (+27,216
  text) is bigger than any of them.
- **first paint**: `src/domain/hookThemes.js`, built +12,384 (depth-3 +7,441, depth-2 +4,943), plus HOOKS-4's unbuilt
  ≈ +7.8–9.2 k, together ≈ 20–21 k. Then `src/domain/seat/seatTable.js` (seat-6) +4,705 and
  `src/domain/fortune/fortuneLaw.js` (fortune-3) +1,759.
- **engine chunk**: `src/data/narrativeData.js` (page-6) +2,534; `src/generators/npc/factionLeaderSecret.js` (page-6)
  +1,953; `src/generators/power/quarrelPick.js` (depth-2) +984.

## (e) What could not be determined

1. **page-7's tension-cause tables are unwired at the tip.** This is +77,510 B src / +43,932 B min:
   `data/tensionCauses.js`, `tensionSideMeanings.js`, `tensionSidePower.js`, `display/tensionCause.js` and
   `tensionCauseHolds.js`. Only tests import `display/tensionCause.js`, so where it ships once wired is unknown. If it is
   reached through `facts/causeHouses.js` or another generator-reached domain module, the derivation would put its
   domain half in EAGER engine-core, that is, first paint. This is the biggest unknown.
2. `veil/rosterChoiceRegistry.js` (+73,266) and `display/galleryDoors.js` (+15,523) are test/script-only today. I assume
   they are not shipped.
3. **veil-22-r4's `galleryVeilPeople.js`** (+13,732, lazy): it is neither in veil-27 nor visibly abandoned. It is held out
   of the totals.
4. **Chunk placement is emulated, not built.** The emulation copies the config's import regex, `ENGINE_SHARED_DOMAIN`
   derivation, excision lists and `EAGER_MODULES` on each tip's own tree. Rollup's placement of unpinned modules is not
   emulated (it affects only `people/seatKeeper.js`, +49). The named lazy entry for each file is the first `import()`
   boundary found that reaches it, so it is not unique.
5. **The m3 founder/overcoming pools have no build brief.** They land in either data-lazy (assumed) or the engine chunk.
6. **The LINES-2/2b reconciliation is approximate.** The cut branches were dropped, and lines overwritten by
   (branch, index) were replaced. Today's index-0 texts that are templated (`${…}`) in `dailyLife.js` cannot be matched
   verbatim, so they are counted as new: at most ≈ 50 lines, an over-count.
7. **The worker, engine and first-paint figures are given only for the base's predecessor (CI).** I did not build BASE
   itself, so any drift between that predecessor and `8196e5712` is not included.
8. **Minified and compressed estimates use esbuild 0.24 per module.** Vite's minifier, scope hoisting and tree-shaking,
   and the per-chunk gzip/Brotli of concatenated modules, will differ, likely somewhat lower.
