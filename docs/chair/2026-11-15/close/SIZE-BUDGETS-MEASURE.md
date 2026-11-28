# SIZE-BUDGETS-MEASURE — the two red size budgets, measured by module (TAIL-TIES-7, ruling T24)

**Measured, not trimmed. No budget, test or `vite.config.js` line was touched.** Ruling T24 says a size budget is a
measured envelope: a re-record is the owner's door and a trim is ours. This file tells the owner which applies, with
numbers. The tip measured is `448860c2`: `lane/tail-ties-2026-11-14` with the joined line `0b45a28d` merged and
T25 (b) applied.

## How it was measured (reproducible)

- **The recording commits.** `git log -S` on each number in `tests/build/vendorPdfLazy.test.js`:
  - **First paint** (`1_121_260`, gzip `357_225`, Brotli `299_985`): `7dc7757f` (STYLE-2-MERGE closing act 7, 2026-11-11).
  - **Engine ceiling** (`toBeLessThan(726_454)`): `git log -S` stops at `dfbf78df`, but that is the **shallow history's
    root** (no parent), and its build reads 728,177. So it is not the measured tree. The recording commit is `188a2c49`
    ("budgets(MERGE-TRAIN, the final tip): … the lazy engine chunk re-recorded"), found by its note's own figure
    `726,453`. It is the first commit whose test holds the line, and its parent's does not.
- **The builds.** Each tree is a `git archive`. Its `node_modules` is symlinked to the tip's `npm ci`; `package-lock.json`
  is identical in all three trees. Each tree builds with its own `vite.config.js` through a scratch wrapper config. The
  wrapper adds one read-only `generateBundle` plugin that writes each chunk's static imports, each module's
  `renderedLength` and the module graph's importers. The bytes are the written `dist/assets` files, read the test's way
  (raw `statSync`, gzip level 9, Brotli quality 11, over the entry's static chunk closure).
- **The instrument reproduces both records exactly:**
  - `7dc7757f` reads raw **1,121,260**, gzip **357,225**, Brotli **299,985**.
  - `188a2c49` reads the engine chunk at **726,453**, and the ceiling is that + 1.
- **"Needed" vs "rider".** A module in a first-paint chunk is NEEDED if a static import path reaches it from the entry
  chunk's own modules, through the module graph (not the chunk graph). Otherwise it is a RIDER: it sits in an eager chunk
  only because of the chunk grouping. Two groupings do this. `engine-core` is derived as every domain module any generator
  imports (`ENGINE_SHARED_DOMAIN`, minus `ENGINE_SHARED_DOMAIN_EXCISIONS`). The eager `data` chunk holds every table that
  any member of an eager chunk reaches (`EAGER_DATA`), riders included.
- Module sizes below are Rollup's `renderedLength`: tree-shaken but **pre-minify**. The minified ratio over these chunks is
  about 0.29 for first paint and 0.32 for the engine. Chunk totals are the real written bytes.

## 1. First paint: 1,164,953 B against 1,121,260 (+43,693 raw; gzip 371,012 against 357,225, +13,787; Brotli 310,916 against 299,985, +10,931)

TAIL-TIES-6 read 1,164,844 at its own tip. The +109 since then is the join's later line and (b)'s leaf header.

- **The same 8 chunks** in both trees: index, vendor-state, vendor-react, engine-core, data, kernel, content-identity and
  vendor-icons.
- **All the growth is in two of them:**
  - `engine-core`: 258,195 → 277,921 (+19,726).
  - `data`: 150,145 → 174,060 (+23,915).
  - `index`: +52. Every other chunk: 0.
- **By module** (rendered): +148,190. Of that, **+16,967 is NEEDED and +131,223 is RIDERS.** There are 22 new members
  (+109,786) and 22 members that grew in place (+38,404).

**The top ten members of the growth** (rendered bytes, pre-minify):

| # | module | chunk | growth | class | why it is on first paint |
|---|---|---|---:|---|---|
| 1 | `src/data/faceHonorifics.js` | data | +21,284 (new) | (ii) rider | Its only eager importer is `domain/people/seatKeeper.js`, itself a rider. Its other importers are lazy (cardDoor, patronage, the generators). |
| 2 | `src/domain/display/labelBands.js` | engine-core | +9,898 (new) | (ii) rider | Its importers are OverviewTab, economyStateProse (lazy) and historyGenerator (engine). In engine-core only by the generator-import grouping. |
| 3 | `src/data/stressPowerFaces.js` | data | +9,696 (new) | (ii) rider | Eager only through `domain/people/stressPowerFaces.js`, a rider. |
| 4 | `src/data/institutionLadders.js` | data | +9,529 (new) | (ii) rider | Eager only through `domain/institutions/houseScale.js`, a rider. |
| 5 | `src/domain/institutions/houseScale.js` | engine-core | +8,367 (new) | (ii) rider | Its only importer is `generators/defenseGenerator.js` (engine). |
| 6 | `src/domain/foodways.js` | engine-core | +7,836 (7,225 → 15,061) | (ii) rider | It was already a rider at the record. It grew in place. |
| 7 | `src/domain/facts/keep.js` | engine-core | +5,885 (new) | (ii) rider | Its importers are factsOf and prosperityInCrisis (coherence-lazy), magicProfile (lazy) and the generators. |
| 8 | `src/domain/institutions/defenseInstitutionBuckets.js` | engine-core | +5,549 (10,237 → 15,786) | (ii) rider | Grew in place. Already a rider. |
| 9 | `src/domain/people/seatKeeper.js` | engine-core | +5,247 (new) | (ii) rider | Its importers are all lazy (npcComponents, crisisCast, governanceAccount, powerStrata, patronage). It also drags rows 1 and 15 eager. |
| 10 | `src/domain/display/institutionDisplayName.js` | engine-core | +4,984 (8,313 → 13,297) | (ii) rider | Grew in place. Already a rider. |

The NEEDED growth (i), all of it:
- `domain/people/cardPowers.js` +4,524
- `domain/facts/factVocabulary.js` +3,205
- `domain/display/chainPrintName.js` +2,335
- `data/stressTypes.js` +1,868
- small growth in reachable modules, making up the rest of the +16,967.

This is the product's own code that the first page reaches.

**What safe cuts would recover, measured by trial build.** These were scratch archives of the tip with rows added to
`ENGINE_SHARED_DOMAIN_EXCISIONS`, the FP-G7 idiom. Nothing was committed.

- **Trial 1: excise the 16 riders that are NEW since the record.** The 16 riders:
  - `labelBands`, `houseScale`, `facts/keep`, `people/seatKeeper`, `people/stressPowerFaces`, `summary/storesSpanWords`
  - `facts/founder`, `chainYield`, `facts/sharedPower`, `facts/rivalPower`, `facts/rulingBody`, `facts/rulerKindLabel`
  - `facts/liveInstitutionNames`, `display/clergyHouse`, `display/pluralPowerName`, `display/powerSentenceName` (the shim)

  Results:
  - Four data tables leave with them, to `data-lazy`: `faceHonorifics`, `stressPowerFaces`, `institutionLadders` and
    `holderTitleForms`.
  - First paint goes to raw **1,130,109** (−34,844), gzip 360,004 (−11,008) and Brotli 302,226 (−8,690).
  - The bundle **boots** (boot smoke PASS), and `engineChunkLazy`, `engineCoreLazyEdge` and `cultureProfilesLazy` stay
    green. The only reds are the size arms.
  - The excised modules land in `coherence-lazy`, `engine` and `resource-chains`. The engine chunk grows by 6,973 for it
    (858,616 → 865,589).
  - **This still leaves 8,849 raw, 2,779 gzip and 2,241 Brotli over the budget.**
- **Trial 2: excise all 38 engine-core riders** (including the older ones that grew in place: foodways,
  defenseInstitutionBuckets, institutionDisplayName, …). First paint goes to 1,087,754 (−77,199, under budget by 33,506).
  But it is **NOT SAFE as a block**:
  - The boot smoke FAILS: STAGE 1 finds a chunk cycle of 7 chunks (coherence-lazy ↔ data-lazy ↔ engine, custom-registry, …).
  - The WEAVE ST-2 goods roster pin disagrees (`resourceTerrainCompatibility.js`: declared eager, the tree says lazy).
  - The engine grows by 30,419.

  Some of the older riders can leave one at a time, and some cannot. Each would need its own trial.

**For the owner (first paint):**
- The 16 new riders are a trim (ours): recoverable through excision rows, measured −34,844 raw and boot-safe. Each one still
  needs its own lane under the FP-G7 discipline: a `vite.config.js` row, the eager-graph classifier agreeing, and the
  goods roster.
- About 8.8 kB raw (2.2 kB Brotli) remains after that trim. It is the NEEDED growth (about 5 kB minified) plus older riders
  growing in place. It is not recoverable without per-module trials, so it is a **re-record (the owner's door)** unless a
  per-module trim is found.

## 2. The engine chunk: 858,616 B against the ceiling 726,454 (+132,162 over; +132,163 over the recorded 726,453)

TAIL-TIES-6 read 857,204 at its own tip; the join's later line adds the rest.

- **By module:** rendered +418,950 (1,813,226 → 2,232,176). There are 13 new members (+147,189), 59 members that grew in
  place (+271,277) and 7 that shrank (−7,447).
- **By directory** (rendered):
  - `src/generators/*.js` +160,896
  - `generators/power` +74,483
  - `generators/economy` +60,560
  - `generators/narrative` +42,871
  - `generators/people` +41,426
  - `generators/steps` +18,663
  - `src/data` +5,109 (`narrativeData.js` alone)
  - history, services, npc and density +15,000 together
- **No module outside `src/generators` grew except `narrativeData.js`.** Every member is reached by static imports from
  the generators. No display, UI or domain module rides in the engine by an edge that need not be there.

**The top ten members of the growth** (rendered bytes, pre-minify; all (i), the product's own generation code):

| # | module | growth | what it is (its header; the lane that brought it) |
|---|---|---:|---|
| 1 | `generators/narrative/foundingRowAdmits.js` | +28,974 (new) | The founding rows the record refuses (R2-CODE-A-5, `299e79cc`). |
| 2 | `generators/economy/incomeLineSiblings.js` | +24,116 (new) | The income lines that name the town's own land or stores, declared: a sibling table (COHERENCE-AGREE-3, `ed6f99d3`). |
| 3 | `generators/people/castPowers.js` | +23,080 (20,952 → 44,032) | The powers' people (15 commits since the record). |
| 4 | `generators/power/conflictIssues.js` | +21,811 (new) | The quarrels' issues, each with its cast (COHERENCE-QUARREL, `83de59ac`). |
| 5 | `generators/safetyProfile.js` | +21,564 (56,622 → 78,186) | The safety profile (34 commits since the record). |
| 6 | `generators/generationCoherence.js` | +20,332 (17,901 → 38,233) | The final coherence receipt (28 commits). |
| 7 | `generators/power/claimStanding.js` | +19,071 (new) | A power's description claims no standing its label denies (COHERENCE-POWERS-8, `1900b88f`: "F31's ceiling met by a split"). |
| 8 | `generators/historyGenerator.js` | +17,046 (51,208 → 68,254) | The history (22 commits). |
| 9 | `generators/resourceGenerator.js` | +16,512 (22,216 → 38,728) | The resources (18 commits). |
| 10 | `generators/safetyLineTruth.js` | +15,146 (new) | The safety lines say only what the record holds (UPKEEP-8, `48ad4da9`). |

**What safe cuts would recover:** none was found by this measure. No member rides there by an import that need not be
eager. The engine is the lazy generation chunk, and its growth is the truth and coherence work of the lanes since
2026-11-09 (declared rows, sibling tables, claim tables). A split would move bytes to another lazy chunk without
removing any: the `engineChunkLazy` contract, and a design call. The first-paint Trial 1 would ADD 6,973 to this chunk.

**For the owner (engine):** the whole +132,162 over is the product's own growth. It is a **re-record (the owner's door)**
at the measured figure + 1, or a ruling that the engine ceiling becomes an envelope with headroom. No trim of ours
recovers it.

## Against the other T24 file on this branch (`docs/chair/2026-11-14/tail/TAIL-TIES-T24-SIZES.md`, `145b79cd`, pushed by another session while this one ran)

- **Agreed:**
  - the first-paint record point `7dc7757f`, to the byte;
  - the engine's top members;
  - the engine is the owner's re-record.
- **Added here:**
  - the engine ceiling's true record point `188a2c49`, reproduced at 726,453 (`7dc7757f` reads its engine at 722,677,
    under a ceiling it did not set);
  - the reachability walk (needed vs riders);
  - Trial 1's measured recovery (−34,844 raw, boot-safe; that file's "one to two thirds" estimate, now measured at 0.80);
  - Trial 2's refusal.
- **Corrected (CONFIRMED):** its line "`labelBands` and `stressPowerFaces` are read by first-paint screens" is not borne
  out. Neither is reachable from the entry chunk by static imports. `labelBands`' readers are OverviewTab (its own lazy
  chunk), economyStateProse (lazy) and historyGenerator (engine). `stressPowerFaces`' readers are PowerStrata (lazy),
  applyDensityLaw and castPowers (engine). Both leave first paint in Trial 1, and the bundle boots.

## Instruments (scratch, not committed)

They are in `/home/user/tt7-measure/`, removable:
- `measure.vite.config.mjs`: the wrapper.
- `diff.py`: the chunk-set diff by module.
- `reach.py`: needed vs riders.
- `xfer.mjs`: raw, gzip and Brotli.

The trees: `t-7dc7757f`, `t-188a2c49` (the records), `t-tip`, and `t-x1` / `t-x2` (the two trials).
