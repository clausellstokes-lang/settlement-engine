# MERGE-CAR: the people car merged into the integration branch, and the integration line's goldens signed in stage order (2026-11-07) — DRAFT, §0 only

Seat: MERGE-CAR (Opus 5.5), a child of the cloud chair (Fable 5.1, session `01FE9mEvGxnFx6WTBkEC6ie9`), under the owner's delegation of 2026-11-06. Brief: `docs/chair/2026-11-07/BRIEF-MERGE-CAR-2026-11-07.md`. Phase A (step 0) only: nothing merged, no golden, register or freeze-register byte touched. Steps 1–6 wait for the chair's "THE CAR IS FINAL at <tip>".

## 0. Step 0 — measured

**Tips.** Integration tip `740a916fc` (the carry). Car tip at phase A: `origin/lane/people-land-2026-11-07` `5242c6422` (not final; PEOPLE-LAND-2 is still finishing its registers, budgets, proof and soak). `git merge-base` = `262e8b255`, the integration branch's base for this range. Records 0a (`5b444331a`) and 0b (`fc834a6bd`) are ancestors of both sides.

**Instrument.** The integration tip carries the OLD `scripts/audit/landing-stage.sh`: it measures 3 surfaces, and its guard is path-only. The measurement here ran the car's version (`5242c6422`: the content-law guard from the chair's two rulings, the six-surface measure, `stage-chain.mjs`). It ran from a scratch worktree of `740a916fc` with those two files overlaid, uncommitted, so the carry is the integration tip's committed door paths. `npm ci` was run first, because this container had no `node_modules`.

### 0.1 The first-parent points `262e8b255..740a916fc` (32), by generator path

The check for each point: `git diff --name-only <c>^1 <c> -- src` (the generator and its data live under `src/`). The edge bundle under `supabase/functions/_shared` is a derived artifact and is listed separately.

| point | what it is | src touched | disposition |
|---|---|---|---|
| `d71e7d00d` | lint debts cured | none (tests/lint, tests/joins, tests/generators, mutation manifest, docs) | no generator path touched |
| `0e7e5044a` `1031233a4` `748cac71e` `13ba23f38` `99fabe439` `c31e7c71e` | chair docs | none (docs/chair; 3 also tests/lint roster) | no generator path touched |
| `3d664cc63` | W0-CLOSE merge | `src/generators/stressGenerator.js` (−3/+1) | **built and measured: moves NONE** |
| `7e6eafcdf` `f3b0b9e6a` `9b2c5fcb6` `84eeb0f23` | the five-seat merges | none (docs/chair, tests/lint roster; 84eeb0f23 also scripts/mutation-*, docs) | no generator path touched |
| `686f56c37` `8a2fb5c55` `237042beb` | registers at the five-seat tip | none (`237042beb`: 7 `supabase/functions/_shared` bundle files, the derived edge bundle, re-emitted) | no generator path touched |
| `68851cdd4` `34b0e73fc` `a8daff92c` | chair docs | none | no generator path touched |
| `10b8f09b4` | the rung-2 landing's merge (MERGE-R2) | 159 census docs, 100 src/domain, 47 src/generators, 33 src/data, 12 src/components, … | **MOVES all six** (measured at the stage of `572c15018`, §0.3) |
| `f7bc53623` `a709af16d` `6c3e25661` `fbe335614` `572c15018` `7eeef76bc` `b14223b6b` `9710200cc` `36688d025` | MERGE-R2's registers, pins, scripts/lib contracts | none | no generator path touched |
| `b3700711d` | MERGE-R2's budgets | `src/components/home/landingFixture.js` | **built and measured: moves NONE** |
| `a55ffb648` `ee3b7a168` `7c6b3b05d` `29145d14b` `0773f0743` `f34b993a5` `740a916fc` | records, rulings, brief | none | no generator path touched |

**src identity, proved with `git diff --quiet … -- src`:**
- `262e8b255` = `d71e7d00d` = `3d664cc63^1`
- `3d664cc63` = `84eeb0f23` = `10b8f09b4^1`
- `10b8f09b4` = `572c15018` = `b3700711d^1`
- `b3700711d` = `740a916fc`
- `fc834a6bd` = `262e8b255`, so the base's output is record 0b's post-state.

### 0.2 THE GUARD'S STOP at `10b8f09b4` (reported, not worked around)

`landing-stage.sh guard 10b8f09b4` (the content law, carry `740a916fc`):
- Eleven touched door paths are carried as equal to the carry: the five `rung2-01..05` records, the 525, the prose manifest, the herald, the witness fixtures and two suites.
- **STOP** on two paths:
  - `tests/fixtures/.golden-freeze-register.json`, first unsigned toucher `572c15018`.
  - `tests/property/espionageDormancyFence.test.js`, first unsigned toucher `572c15018`.

`572c15018` is MERGE-R2's own composition commit (no `Owner-Signed:` trailer). It set the register rows "from the side that moved it" and took "the rung-2 side's bytes exactly" for the fence suite. That **deleted the five W0 movement blocks (w0-01..05, the 62nd–66th movements) from the fence suite's history comment** at the integration tip. The guard's rule (b), "every later move of the path signed", fails. Per the rule this is a STOP.

**Proposed cure (the chair's to rule):** stage the rung-2 composition at `572c15018`, the first-parent point where MERGE-R2's composition of the two door paths completed. Its src is byte-identical to `10b8f09b4`'s, and its guard passes: both paths are touched by the step and equal to the carry. The alternative is to rule `572c15018` a merge-resolution follow-up whose register/suite bytes are written over by this landing's own step-2 records, which restore the W0 blocks under the composition record. Under either form, the record's cause stays "the rung-2 landing's merge over the integration branch".

### 0.3 The figures (the six surfaces, stage to stage)

Each figure is the stage's tree with the door paths carried from `740a916fc`, measured by `landing-stage.sh measure`, and chained by `stage-chain.mjs`.

| stage | 525 golden master | fence corpus (360) | herald desk | prose rows (1,050) | witness (8) | PDF snapshot (18 lines) |
|---|---|---|---|---|---|---|
| `262e8b255` (base = 0b post-state) | `6b0d226e…` | `f1aa52d8…` | `3c879080…` 435 rows | `abe94c20…` | `5033cae6…` | `b1a92886…` |
| `3d664cc63` (W0-CLOSE) vs base | 0 moved | 0 | 0 | 0 | 0 | 0 |
| `572c15018` (= `10b8f09b4`'s src) vs `3d664cc63` | **525/525** → `6d651bde…` | **360/360** → corpus `9eb258a4…` (360 distinct) | **2 moved, +54 / −55** → 434 rows, `b8a8ed19…` | **1,050/1,050** → `50fdc9a4…` | **4/8** → `ed83e218…` | **1 line** → `1e32b1a8…` |
| `b3700711d` (landing fixture) vs `572c15018` | 0 | 0 | 0 | 0 | 0 | 0 |

The base digests match record 0b's post-state exactly (525 `6b0d226e…`, fence `f1aa52d8…`, herald `3c879080…`, PDF `b1a92886…`), so the chain joins the car's records with no gap.

**Against the integration tip's carried fixtures (the banked red):**
- At `572c15018`/`b3700711d`, the 525 has 525 rows red. The fixture holds the rung-2 lane's rows (register `d1429bcc…`), not the composed output.
- The herald: 2 moved, +40 / −44 against the carried `85e293d0…`.
- The PDF: the carried snap is `b1a92886…`, the pre-rung-2 bytes; the composed output is `1e32b1a8…`.
- The witness is GREEN (`ed83e218…` = the register's digest), as MERGE-R2 recorded.

This is MERGE-R2's banked list, and nothing else.

**Movers, in stage order: ONE, `10b8f09b4`.** It moves all six surfaces (the brief's five plus the witness). `3d664cc63`, the five-seat merges and `b3700711d` move none (proved above).

### 0.4 The compositions planned for step 1 (the car × the integration side, under src)

`git diff --stat 262e8b255 <car> -- src`: 98 files. `262e8b255..740a916fc -- src`: 200 files. 23 files are touched by both. A trial `git merge-tree --write-tree` (no worktree touched) conflicts in 12 of them. The other 11 auto-merge.

| file | the car's intent | the integration side's intent | rule → composition |
|---|---|---|---|
| `src/data/institutionalCatalog.js` (17 hunks) | `face` / `noPower` marks, `FACE_SEAT`, each row `face:` (R-P1, M-1b) | `NOTE_KEYS` (`thresholdNote`, CENSUS-4 R8); the `'guild'` tag dropped from 8 rows (census) | both, independent fields: INT's row plus the car's `face`; `ENTRY_KEYS` = MARK ∪ NOTE |
| `src/domain/coherence/readerBattery.js` (2) | `exemptedVerdict` reads memberships (`cardPowerNames`) | block moved to `src/domain/roles/roleClass.js` (CENSUS-4); new imports | INT's file layout; the car's membership read ported into `roleClass.js` (the car governs memberships) |
| `src/domain/crisis/crisisCast.js` (1) | brunt's power = `firstRankMembershipOf` | no lead where the brunt's house holds the seat (RUNG2-F13) | both (crisis field rung-2's, membership read the car's) |
| `src/domain/crisis/crisisHooks.js` (1) | imports for memberships | imports for the declared desk | union |
| `src/domain/dossier/plotHooks.js` (1) | `powerNames` from `hookPartyRosterOf` | the conflict draw takes `factsOf` (prose desk) | both |
| `src/domain/generation/generationForkRegistry.js` (1) | `fnv1a32External` 15 (the `::tie` draw retired) | 32 (R3 +9, R12 +8) | a register: re-measured at the merged tip by the fork census (M-3), never picked |
| `src/domain/prose/holderTable.js` (1) | cites `narrativeGenerator.js:1004` | cites `:1039` | mechanical: re-cited to the merged line |
| `src/generators/power/settlementNarrative.js` (1) | comment: ties directed | comment: STRESS_RUMORS | both |
| `src/generators/npcGenerator.js` (3) | one hook per person (`drawPersonHook`); `generateRelationships` retired (R-P7) | twin tables deleted → declared siblings (CENSUS-1c); held-registry raw/spoken goal (MERGE-R2 ruling 2); R3 `tieArchetype` | the car's shapes (one hook, one tie writer); INT's imports, held-registry line and declared-sibling resolution ported INTO the car's `drawPersonHook` and `people/ties.js` (prose desk rung-2's) |
| `src/generators/steps/generatePopulation.js` (1) | ties drawn at the seam, the pin `[]` | `{government, tier}` facts into `generateRelationships` | the car's; INT's facts carried into `drawTies` → `createTieProseDraw` |
| `src/generators/generateSettlementPipeline.js` (3) | `generateRepresentatives`, `drawTies`; `relinkFactionMembers` and `generateRelationships` gone | `fitFactionRoster` (CENSUS-4 **R12**) wraps `enrichNpcCoherence`; facts into `generateRelationships` | the car's; facts into `drawTies` — **R12: STOP-CANDIDATE 1** |
| `src/generators/steps/assembleSettlement.js` (4) | grouping deleted (M-2 shim-out); `truePersonHooks`, `npcsHeld` | `fitFactionRoster` + `generateFactions`; `resolveFactionLabelsAtClose` (R-AW); `fishTradeTwinned` | the car's grouping-free shape; INT's R-AW label close kept after `truePersonHooks` (it renames through `memberships[].power`); `fishTradeTwinned` kept — R12 per STOP-CANDIDATE 1 |

**The auto-merge is not clean in meaning.** The following break the merged tree with no conflict marker. Each is composed in step 1 by the rules (each is CONFIRMED by reading both tips):

1. **Imports of files the integration side deleted.**
   - `src/data/inlandHookLines.js`, `defenceTwinLines.js` and `src/domain/marketInstitution.js` are gone at `740a916fc` and present on the car.
   - The car's `src/generators/people/representatives.js:49` imports `inlandHookLine` (used at `:215`). So does the car's `drawPersonHook` in `npcGenerator.js`.
   - Composition: re-pointed to `NPC_HOOK_SIBLINGS` / `resolveSibling` (prose desk rung-2's, the card the car's).
2. **Pool shape.** INT's `NPC_FACTION_LOYALTY` rows became `{text, needs}` (CENSUS-3e). The car's `representatives.js` `spareHookLine` reads them as strings. Composition: `lineText` plus the declared `needs` gate.
3. **Tie prose without facts.** INT's `createTieProseDraw(force, facts)` fails closed without facts (R-N). The car's `people/ties.js:114` passes none, so every declared tie line would be refused silently. Composition: the facts thunk passed, plus R3's `tieArchetype` ported.
4. **Readers of `factionAffiliation` that the integration side added, which the car no longer writes.** Each also trips the car's `noLegacyFactionReaders` walker.
   - `src/domain/roles/roleClass.js:151`.
   - `src/domain/coherence/crisisFactFindings.js:212` (`plotter_governs`).
   - `src/generators/npc/tieKind.js`.
   - `readerBattery.js` R12's `faction-role-fit` reader.
   - `src/generators/power/factionRoleFit.js` (the fitter).
   - Composition: re-pointed to `firstRankMembershipOf` / memberships, as the car did in crisisCast and crisisHooks. R12's reader and fitter per STOP-CANDIDATE 1.
5. **Tests.**
   - `tests/generators/narrativeQualityCorpus.test.js` (INT) calls the retired `generateRelationships`.
   - `tests/lint/heldKeyWriterCensus.walker.test.js` lists `fitFactionRoster`, `generateFactions` and `relinkFactionMembers`.
   - Both are re-keyed by identity in step 1.

**STOP-CANDIDATES (for the chair before phase B):**

- **SC-1: CENSUS-4 R12, the faction-role fitter.**
  - What it does: `fitFactionRoster` in the pipeline and assembly, `factionRoleFit.js`, and readerBattery's `faction-role-fit` reader. It re-homes a misfit NPC by rewriting `factionAffiliation`.
  - The conflict: the car governs memberships, and that field no longer exists after the car's shim-out (`2981f23f6`). But R12 is a pool-census ruling, which the rung-2 side governs.
  - Proposed composition: retire R12's generator half (the fitter is moot once memberships are written at birth by rank) and retire its reader with it, or port its check to `memberships[]` as a membership-fit reader.
  - Either way, a chair ruling's generator half leaves the tree.
- **SC-2: CENSUS-4 R9 (`deriveThorpSecondRole`, `guildTitleName` in `generateNPCs`).** These have no caller on the car's path: representatives use `generateSingleNPC`. R9's effect vanishes silently.
  - Proposed: the car governs cards, so the record names R9 as superseded by the representative generator.
  - Or, if the chair holds that the thorp's second role is a pool-census fact: port it into `generateRepresentatives`.
- **SC-0: the guard's STOP at `10b8f09b4` (§0.2).** The stage-at-`572c15018` cure is proposed.

**The registers (step 1 (c)) conflict as expected:**
- the observed-shape baseline and its three scripts (the car's rung 31 stands)
- the lighting census
- writer reach
- the tuning inventory
- the wiring census
- the dated roster (`.source-citation-baseline.json`)
- the size baseline
- the mutation manifest
- `docs/implementation/PACKET_MANIFEST.json`
- the 11 edge bundle files (re-emitted, `build:edge-shared`)

The golden fixtures, the freeze register and the fence/herald/prose suites also conflict. They are taken from one side at the merge commit and moved by step 2.

### 0.5 The chain planned for step 2

1. **Rung-2 composition at `10b8f09b4` (staged per SC-0's ruling).**
   - From 0b's post-state to `6d651bde…` / `9eb258a4…` / `b8a8ed19…` / `50fdc9a4…` / `ed83e218…` / `1e32b1a8…`.
   - Components: `rung2-01..05` and the integration-side moves since 0b. None are measured: W0-CLOSE and the five-seat merges move no byte.
2. No other mover.
3. **The car composition at the step-1 merge commit.** Components: the car's seven lane records (`people-1`, `-2`, `-3`, `-4`, `-5a`, `-5b`, shim-out). 0a and 0b are already on the chain.

### 0.6 The chair's rulings on phase A (2026-11-07, 20:02 UTC)

The chair accepted phase A as measured.

- **SC-0, accepted.**
  - The rung-2 composition is staged at `572c15018`. The record names both commits: the cause event is the merge `10b8f09b4`, and the stage commit is `572c15018`. The record gives the reason in one sentence: MERGE-R2's composition commit took the rung-2 side's freeze-register and fence-suite bytes without a signature, and this record is that signature.
  - The composition record restores the five W0 movement blocks (w0-01..05) in the fence suite's history comment, through the door's transplant, with its own block after them. The order is 0a, 0b, w0-01..05 as components, the rung-2 composition, then the car's.
  - No other door path is hand-edited.
- **SC-1, retire R12's generator half.** That is `fitFactionRoster` in the pipeline and in `assembleSettlement`, and `factionRoleFit.js`'s rewrite. The cause: superseded by construction (one face per face-bearing institution, role = the institution's title (M-1b), memberships born by rank).
  - The reader (readerBattery `faction-role-fit`): retire it if the car's suites already pin what it checks (cause "superseded by construction; covered by <suite>"). Otherwise port it to `memberships[]` as a reader only.
  - Any CENSUS-4 count or ratchet that tallied R12 is re-keyed with the cause. R12's fate is named in the composition table.
- **SC-2, superseded.**
  - R9's thorp second role contradicts M-1b and the charter: one NPC per institution; a thorp's two faces are two people. `guildTitleName` is superseded by the census titles and the honorific pools (R-P9). Both are retired with the cause named.
  - The wiring census is then measured. A pool whose reads were R9's is re-keyed to the car's shape where the car holds the same fact. Otherwise it is declared UNREACHABLE with the cause.
- **The five silent breaks are composed in step 1 as listed:**
  1. `drawPersonHook` reads the hook lines from where the rung-2 landing moved them, never from a restored `inlandHookLines.js`.
  2. `.text` is read, and `needs` is honoured through the held-set refusal filter (MERGE-R2's ruling).
  3. `ties.js` passes the facts; a tie draw that fails closed is pinned as a defect.
  4. The factionAffiliation readers are re-pointed to memberships. The car's legacy-reader walker is GREEN at the merged tip, with `fpz-list.json` unchanged unless the read is the simulation's (M-6).
  5. The two tests are re-keyed with the cause.
