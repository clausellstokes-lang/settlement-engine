# MERGE-CAR: the people car merged into the integration branch, and the integration line's goldens signed in stage order (2026-11-07) — COMPLETE

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

## §1–§8 — written by MERGE-CAR-2 (2026-11-08)

Seat: MERGE-CAR-2 (Opus 5.5, effort high), a child of the cloud chair (session `session_01FbPLbejcfwX5nii12VM673`), under the owner's delegation (2026-11-06/07, renewed 2026-11-08 18:01 UTC). Brief: `docs/chair/2026-11-08/BRIEF-MERGE-CAR-2-2026-11-08.md`. MERGE-CAR (session `01FE9mEwy643NkyrKw6VdiRq`) did and pushed everything through e376ee6a3: §1–§5 below are written from its commit bodies and the three shift records, figure for figure. Its last three steps were not pushed before its account ended. This seat did them at the integration tip: the tree classified, the composition reds cured, lint, the final 1,000, and this record (§6). Nothing in §0 is changed.

## 1. The merge — 8dff691f3

`git merge --no-ff` of the car `lane/people-land-2026-11-07` at 373a2947b (the chair's "THE CAR IS FINAL") into the integration branch at 7b3ffb6ee. The base is 262e8b255. 69 files conflicted. They were composed under BRIEF-MERGE-CAR §1 (a), never picked by side. The car governs cards, powers, memberships, the institution join, honorifics and the display/edit layers. The rung-2 landing governs the pool census, the prose desks and the crisis/migration fields. One writer per fact.

| file | composition · rule |
|---|---|
| `src/data/institutionalCatalog.js` | both: the census's `thresholdNote` (R8) and tag drops, plus the car's face marks and `FACE_SEAT`; `ENTRY_KEYS` = MARK ∪ NOTE |
| `src/domain/crisis/crisisCast.js` | the car's first-rank brunt power, plus RUNG2-F13's `holdsTheSeat` guard |
| `crisisHooks.js`, `plotHooks.js` | both sides' imports and lines (the desk's `factsOf`; the car's `powerNames`) |
| `src/domain/coherence/readerBattery.js` | the integration side's layout (the role rule lives in `roles/roleClass.js`); the car's membership read ported into `roleClass.js :: exemptedVerdict` |
| R12's reader `faction-role-fit` | ported to the first-rank membership as a reader only (SC-1) |
| `crisisFactFindings.js` (`plotter_governs`), `tieKind.js`, `facts/guild.js` | re-pointed to memberships: the integration side's new readers of the retired field (silent break 4; the legacy walker GREEN, `fpz-list.json` unchanged) |
| `src/generators/npcGenerator.js` | the car's shapes (one hook per person; `generateRelationships` retired, R-P7) with the integration side's imports and held-registry line; `drawPersonHook` draws through the census's facts via `NPC_HOOK_SIBLINGS` (silent break 1) |
| CENSUS-4 R9 `guildTitleName` | retired with its module and test (SC-2, corrected by measurement: `deriveThorpSecondRole` is BASE code and stays) |
| `people/representatives.js`, `castPowers.js`, `personHooks.js` | the hook place carries the world law, the roster and the tier; `spareHookLine` reads `.text` and honours `needs` beside the held set (silent break 2) |
| `people/ties.js` | R3's `tieArchetype` after the roll; `createTieProseDraw` handed the facts thunk, so a declared tie line no longer fails closed (silent break 3); all three `drawTies` callers pass tier and government |
| `generatePopulation.js`, `generateSettlementPipeline.js`, `assembleSettlement.js` | the car's shapes: no pair writer, no roll floor, no grouping; CENSUS-4 R12's `fitFactionRoster` retired with `factionRoleFit.js` (SC-1); R-AW's `resolveFactionLabelsAtClose` kept after `truePersonHooks`, its rename cascading through `memberships[].power` |
| `holderTable.js`, `generationForkRegistry.js`, `settlementNarrative.js` | the car's side at the merge; re-measured after it (§2) |
| tests | both comment histories kept; `narrativeQualityCorpus` hands the facts to `drawTies` (silent break 5); `heldKeyWriterCensus` the union less `fitFactionRoster`; `personHooks`, `foundingSeeds`, `readerBattery` and `factionRoleFit` re-keyed |
| the golden fixtures, the freeze register, the three golden suites | THE CAR'S SIDE. The car's fence suite already carries w0-01..05, 0a and 0b, so SC-0's history is in place with no hand edit. Step 2's records move them. |
| the observed-shape tooling and register | the car's rung 31 (its genesis stands); the integration side's census readers admitted at rung 32 (§2) |

## 2. The registers through their doors

| register | receipt | commit |
|---|---|---|
| wiring census | 709 pools / 2,344 variants / 165 relation rows; `--check` exit 0; no pool read R9's `secondRole` or a guild title; `gen:dossier-prose --check` green. Fork register `fnv1a32External` and A6 15 → 16 (R12's hashes retired with it; R3's at the one tie writer; PLAUSIBLE). Holder table cite `narrativeGenerator.js` 1004 → 1006 | c12c28af0 |
| observed shape, rung 31 → 32 | act 1: the rung declared (findings 2,193 → 2,202, identities 1,545 → 1,548, NEW 15 / GONE 12 / SAME 1,533). Act 2: the governed ritual end to end; 1,561 review decisions; a tampered count refused (negative control); froze 2,202 findings / 1,548 identities across 431 files; bank 77/51 → 76/50. The walker's pins: banked 77 → 76; wizard news 399/2518/400 → 395/2511/396 (an interaction of −4/−7/−4, PLAUSIBLE); 47/47 | bd47c29c7, 5e2b0c008, 3ebfbfa68 |
| writer reach | `--write` refused 2 identities (`fac.military_party`, a re-dealt faction id on two banked shapes) → `--rebank --charter=§934.105`; 7 stale members folded; cohort 1,397 → 1,392; judged 11,997 · LIT 597 · LIT-NAME 9,966 · DARK 1,434; dark register 44 → 42; walker 52/52 | 93b5965b2 |
| lighting census | files 2,976 → 3,118, parked 372 → 384, credited 2,604 → 2,734, titles 28,043 → 28,609; 34/34. Later 28,609 → 28,614 after the cure | 2cffe66cd, 8e1929f8c |
| tuning inventory | 271 tables / 536 named / 6,934 bare (car 263/536/6,935, integration 270/535/6,944); Register VII v2 stands, 76/76 | a0e2790bc |
| dated roster | dated 93 + 44 + 11 = 148; tree 95 + 5 + 9 = 109; `RELATIONSHIP_STRENGTHS`' two citations re-addressed to `people/ties.js`. Later tree 109 → 112 (records A, B, C) | efb597a0b, 2a95b5917 |
| the frozen listing's sha-pin class | `docs/chair/2026-11-07/people-5-prep/walker-draft-at-base.txt` takes `**Snapshot base:** 1031233a4` (the chair's ruling (a)); `pastEofCitationsExcluded` 377 → 382; no row re-addressed | e3ed07f9a |
| news and prose contracts (one act) | Wizard News 400/1/399/40 → 396/1/395/40; address 596/800 → 588/792; prose scalar rows 37,469 → 37,359; each parent reproduces its own pins; voice debt empty; 24/24 | ffafe2a0e |
| five lint pins | `cardDoor.js`'s any-cast cured (type only); the mutation manifest +5 owed rows (`guildTitleName` out); raw colour 1,229 → 1,228; ruin roster 101 → 105; size `npcGenerator.js` 1,201 → 1,192 | 848e28fde |
| writer reach's shapes digest; prose numerics by line | after the cure: shapes digest re-taken (cohort 1,392 unmoved); two `npcComponents.jsx` rows re-keyed by line; 99/99 | 2a95b5917 |

The display rulings inside phase B (7ad0b04e1, display-only): the harbour master's pool on a coastless settlement is Dockmaster · Wharfinger, read from `waterOf(settlement).coast` (A-11). A hook line two cards hold prints once on the hooks tab (`tabSentencesOnce`, attributed to the car's lane 3). A doubled comment composed at the merge was cured in 73bdcc153.

## 3. The chain — records A, B and C (`Owner-Signed: §934.105`)

The integration line's first-parent chain per surface: … 0a, 0b (the car's, on the chain) → **A** → **B** → **C**.

| record | stage · cause | surface · from → to | acts | components |
|---|---|---|---|---|
| **A** `2026-11-08-merge-car-a-rung2-composition.json` | staged at 572c15018 (SC-0); cause event the merge 10b8f09b4, "the rung-2 landing's merge over the integration branch" | gm 525/525 → `6d651bde`; fence 360/360 (the 76th movement) → corpus `9eb258a4`; herald 2 moved, +54/−55 → 434 keys; prose 1,050/1,050; PDF 1 line; witness 4/8 → `ed83e218` (its act moved the register onto the bytes the merge had auto-merged) | 4e22bb6ad, 49dca2e27, c883a9eb0, 7a014344b (provenance), 0c37506ef, af604ce8a, 75a9da9bc | rung2-01..05 |
| **B** `2026-11-08-merge-car-b-people-car-composition.json` | the car's merge 8dff691f3 | against A: gm 525/525 → `9be37cae`; fence 360/360 (the 77th) → corpus `d08f716d`; herald 434 → 470 keys (+226/−190) → `b853c045`; prose 832/1,050 → `f2d3410b`; PDF 1 line → `2a785d50`; witness 0 | 6196cdec8, 0a9982a46, 3f7c63dcc, 626b39d53 (provenance, signed), 130d45b35, c18d10f13 | people-1, -2, -3, -4, -5a, -5b and the shim out (0a/0b already on the chain) |
| **C** `2026-11-08-merge-car-c-composition-cure.json` | the composition cure b19740ab3 | the fence 2/360 (the 78th movement), register `6b13f87e` → `ef26e06d`; gm, herald, prose and PDF unmoved | 3f95e3484 | — |

The by-hand restatements per record: the shift-record row, the herald length (470 → 434 at A, 434 → 470 at B), the misjudgment beats, the DRIFT tally, and A7. Each stage's receipt: `landing-stage.sh suites` 52/52 files and 473/473 tests; `worldFactRederive` 7/7; the freeze walker 90/90 at A. Plain worktrees of 8dff691f3 and the tip measure equal on all six surfaces after B; there is no other mover. The fork census's control hash goes `b58f9562` → `2432ade0` (A) → `882e592f` (B), and the unpinned population draws 560 → 547 (2c7437030; PLAUSIBLE).

**The guard's two cures (the chair's rulings):**
- 6d674cb5a, the merge-side arm. `LANDING_STAGE_MERGE_SIDE=<one merge sha>` carries a door path whose only unsigned first-parent toucher is that merge, provided the merge's bytes equal its second parent's. A hand-editing merge STOPs. Controls 9/9.
- 67b3f4973, tooling paths. An explicit list of tooling paths is always carried from the carry, with a receipt naming every commit that moved them. Golden paths keep the signed rule. `landing-act transplant` now signs its own provenance commit. Controls 11/11. 7a014344b stays unsigned and is carried as tooling.

## 4. The composition's 31 soak findings — cured at their sources (b19740ab3; record C)

Measured on the 1,000 at 4c39885fc: cert:false-presumption 24 towns / 25 findings, and coh:crisis-cast-sense 7 towns / 8 findings. They were absent on the car branch and at rung 2F, so they are the composition's.

1. **cert:false-presumption, 25 → 0.** Every finding is `npcGenerator :: STRESS_GOALS`, a row declared to exclude 'ruler: lord' (the council goals), admitted at birth and false against the final record's lord. The rung-2 side's goal draw reads the ruler kind from `config._government` (CENSUS-4d R-V). The car's three birth seams (`people/representatives.js` ×2 and `castPowers.js`' mint seam) built their npcConfig without it, so the declaration admitted the row unanswered. CURE: each seam carries `_government` from the power structure it already holds, the same one source. The chair's vacancy hypothesis was measured and is not the cause.
2. **coh:crisis-cast-sense, 8 → 0.** `plotter_governs`: the rung-2 side's `instigatorCandidates` took any-rank members of an instigating house. The car's shape (M-1b) reads a person's house as the first-rank power. CURE (`crisis/crisisCast.js`): a member whose first-rank house holds the seat acts for the seat, and RUNG2-F13 refuses it as an instigator exactly as it refuses that house.

**The display cures.**
- 9fd906c23: the NPC card resolves the place-guarded honorific from the settlement it is shown in, because the soak's render harness holds an empty store. A-11 goes 11 → 0.
- e376ee6a3: 9fd906c23's regression cured (`npcLifecycleControls`). The edit layer reads the live store record again, and only the honorific reads the place.

The 1,000 at the cured tip (MERGE-CAR): cert:* 0, coh:* 0, A-11 0; 702 findings, 0 errors, verdict CLIMB (it was STOP).

## 5. The budgets, the landing fixture and the edge bundles

The dist budgets were re-recorded at the measured figures of the merged tip, every byte attributed by first-parent step (457ce0e38, VETOABLE BY THE OWNER). The figures are fresh `vite build`s of git archives of five trees.

| figure | old ceiling(s) | base 262e8b255 | + integration parent | + car | + interaction | + after the merge | new = tip |
|---|---|---|---|---|---|---|---|
| worker | 1,603,564 (car) / 1,695,569 (MERGE-R2) | 1,579,660 | +115,909 | +23,904 | +16,196 | +212 | **1,735,881** |
| engine chunk | car 696,670 / integration 707,702 measured | 681,803 | +25,899 | +14,866 | −491 | +127 | **722,204** (bound < 722,205) |
| first paint raw | car 1,051,166 / integration 1,062,668 | 1,041,311 | +21,357 | +9,855 | −35 | 0 | **1,072,488** |
| first paint gzip | 338,535 | 332,916 | +5,619 | +3,033 | +88 | −9 | **341,647** |
| first paint Brotli | 284,950 | 279,545 | +5,405 | +2,642 | −195 | +130 | **287,527** |

What each column holds:
- The integration parent's column is MERGE-R2's (the rung-2 landing, W0, the review intake). The car's column is PEOPLE-LAND's.
- The interaction is the two lines composed: the census's declared draws inside the car's hook and tie writers, the ported R3 rule, and the reader's membership port.
- "After the merge" is b19740ab3 plus 9fd906c23. The compressed figures drift by tens of bytes across environments at an equal raw closure.
- No trim was attempted. VERIFY_DIST=1 on the two files: 66/66.

The landing fixture was re-emitted through its door at lf-033 (4c39885fc: town Cnocby, pop 82; `tests/copy` + `landingFixtureFreshness` 170/170; the owner's veto point stands as the car recorded it). The edge-shared bundles were re-emitted at the merged tip (4c39885fc) and again after the cure (e55ea3d12): `engineBundleReplay` + `engineServiceCore` + `landingFixtureFreshness` 10/10. MERGE-R2's banked red list (14 files / 17 tests) went GREEN at the tip. Its last four were re-keyed by identity in 8308f13f8, attributed by archive probes at five trees. A finding there, CONFIRMED: their premise was wrong — W0's merge fc834a6bd moved them, and they were red at both parents.

## 6. The proof at the integration tip (MERGE-CAR-2)

### 6.1 Step 1 — the whole tree once, classified by measurement

The run was `sh scripts/gate-tail.sh npx vitest run --shard=i/3` at 1f74ce3e1, the three shards run one after another; a single unsharded run was cut off by the session's 30-minute background limit. The setup: `npm ci`, and the ledger ref `review-fixes-2026-07-08` created locally. Result: **3,118 files / 37,719 tests — 43 red in 30 files.** Each red file was then run at clean archive worktrees of 373a2947b (the car), 7b3ffb6ee (the integration parent) and 262e8b255 (the base). `node_modules` was shared, after confirming the lockfile is byte-equal at all three.

| file | tests | class | evidence (red at) | owner |
|---|---|---|---|---|
| `densityLaw` | 4 | (a) FPZ M-6 | the car's list (PEOPLE_LAND §6.6) | FPZ |
| `killNpcDoubleImpair` | 3 | (a) FPZ M-6 | idem | FPZ |
| `npc/characterConsumers` | 3 | (a) FPZ M-6 | idem | FPZ |
| `clergyTraitPlane` | 2 | (a) FPZ M-6 | idem | FPZ |
| `worldPulseFactionSeating` | 2 | (a) FPZ M-6 | idem | FPZ |
| `deityStanceLane` | 1 | (a) FPZ M-6 | idem | FPZ |
| `religionLegitimacyFactionKey` | 1 | (a) FPZ M-6 | idem | FPZ |
| `regenNpcEnrichment` arm 1 | 1 | (a) FPZ M-6 | red at 373a2947b, the same arm (asserts the retired `factionAffiliation`) | FPZ |
| `ledgerCitationIntegrity`, `provenanceMap` | 0 | (b) ENVIRONMENT | GREEN with the local ledger ref (10/10, 7/7) | — |
| `dossierPhoneFloorAllViews` | 2 | (c) BASE | the chair's 05:4x ruling: red at 262e8b255 and both parents | GREEN-BASE |
| `phoneChromeFloor.census` | 1 | (c) BASE | idem | GREEN-BASE |
| `architectureFreshness` | 1 | (c) BASE | idem (CURRENT_STATE's migration head 203 vs 204) | GREEN-BASE |
| `tierNounKeptRulings` | 1 | (c) BASE | idem | GREEN-BASE |
| `intentAtlasSoakDistiller` | 1 | (c) BASE | idem | GREEN-BASE |
| `legacyGeneratorQuarantine` | 1 | (c) BASE | idem | GREEN-BASE |
| `recordMerge` | 2 | (c) BASE | idem | GREEN-BASE |
| `mundaneRealmAcceptance` | 1 | (c) BASE | idem | GREEN-BASE |
| `repeatOnceTonightTraditions` soak1k-12 arm | 0 | (c) BASE | **reads GREEN at this tip** (the file 1/2; only soak1k-202 red) | GREEN-BASE (named, not cured here) |
| `repeatOnceTonightTraditions` soak1k-202 | 1 | (c) INT-SIDE | red at 7b3ffb6ee | GREEN-BASE |
| `crisisFactFindings` MIGRATION-DIRECTION soak1k-0/-4204 | 1 | (c) INT-SIDE | red at 7b3ffb6ee | GREEN-BASE |
| `powerStepStressEntries` RED-FIRST "no Departure Committee" | 1 | (c) INT-SIDE | red at 7b3ffb6ee | GREEN-BASE |
| `mergeLadderHeldKeys` A3 26 vs 27 | 1 | (c) INT-SIDE | red at 7b3ffb6ee | GREEN-BASE |
| `npcStructureGoalLookup` | 2 | (d) COMPOSITION | green at 7b3ffb6ee; absent at the car | cured, §6.2 cause 1 |
| `npcStructureDeclared` | 1 | (d) COMPOSITION | idem | cause 1 |
| `npcStructureWantsVoiceable` | collection error ("reading 'short'"), 3 tests unrun | (d) COMPOSITION | idem | cause 1 |
| `regenNpcEnrichment` arm 2 | 1 | (d) COMPOSITION | green at both parents | cause 2 |
| `sentenceOpeningFallbacks` §7 | 1 | (d) COMPOSITION | green at 7b3ffb6ee; absent at the car and the base | cause 3 |
| `factionLabelClose` (a) | 1 | (d) COMPOSITION | green at 7b3ffb6ee; absent at the car | cause 4 |
| `tonightSeatSecret` | 2 | (d) COMPOSITION | idem | cause 5 |
| `tonightConcreteFirst` soak1k-26 | 1 | (d) COMPOSITION | idem | cause 5 |
| `sentenceSlotFallback` soak1k-1248 | 1 | (d) COMPOSITION | idem | cause 5 |
| `regenPreservesUserCanon` secrets | 1 | (d) COMPOSITION | green at the car, the integration parent and the base | cause 6 |
| `readerShapeResolver` "pulse-like pipeline" | 1 | probe artifact (none of the classes) | red ONLY under this seat's `TMPDIR` (a long scratch path: `maxReadTokenLength` 261 > 256 counts the temp path); green with the default `TMPDIR` (99/99) and in step 3's gate | — |

Totals: FPZ 8 files / 17 tests; ENVIRONMENT 2 green; GREEN-BASE's fourteen named 12 files / 14 tests (13 of the 14 arms red; soak1k-12 green here); COMPOSITION 10 files / 11 tests plus one collection error; the artifact 1. That is 17 + 14 + 11 + 1 = 43. MERGE-CAR counted twelve composition tests before e376ee6a3; this measurement is the tip's.

### 6.2 Step 2 — the composition reds cured at their sources (all test-side; no src byte, no golden; NO record D)

Every red traced to one composition rule. A suite written on the integration side kept the v1 card, or a soak seed of the rung-2 corpus, after the car (which governs cards, powers and memberships) re-shaped the card and re-dealt the cast. Each cure re-keys BY IDENTITY with the cause. No test is skipped, and no expectation or anchor is loosened. The one exemption is named in cause 6.

| # | commit | files | cause | before → after |
|---|---|---|---|---|
| 1 | 79a01cf3e | npcStructureGoalLookup, npcStructureDeclared, npcStructureWantsVoiceable | the cards' `factionAffiliation` → `memberships: [{ power, rank: 1, share: 1 }]` (castDerived's idiom), because the rank axis reads the FIRST-RANK membership (PEOPLE-2). WantsVoiceable keyed its table by `structuralRank`, now the card's standing ('head' for both), so it is keyed by the fixture's identity. 96 keys / 76 lines unchanged | 0/8 runnable → 8/8 |
| 2 | deaa2bdb1 | regenNpcEnrichment arm 2 | measured on d3-town: the car has structuralPosition 5; at 7b3ffb6ee CENSUS-4b's calm-only entries are refused under succession_void (0) and the sum held by factionAffiliation alone (10); the tip reads 0 + 0. Each tier now reads a calm settlement, arm 1's CENSUS-1d precedent | arm red → green (arm 1 FPZ) |
| 3 | a9fab4cc7 | sentenceOpeningFallbacks §7 | the minister links by membership; `entityLinksFaction` reads `memberships[].power` since PEOPLE-5B (57b0de61e). JUDGMENT: re-keyed, not banked with FPZ (the file is not on M-6's list; the reader already reads v2) | 22/23 → 23/23 |
| 4 | 7a0137d27 | factionLabelClose (a) | the officer carries the label in a membership; R-AW's cascade renames `memberships[].power` at the composed tip. The arm reds again if the cascade misses it | 3/4 → 4/4 |
| 5 | 1628047bb | tonightSeatSecret, tonightConcreteFirst, sentenceSlotFallback | seed pins re-keyed to the case each pins, measured at the tip. The seam is present at 33 of soak1k-0..239 (50 at 7b3ffb6ee): the first twelve [2, 16, 31, 36, 38, 39, 42, 43, 45, 62, 69, 74], Foundry on 2. The empty seat is soak1k-868 (Slavica Smirnov; 13 empty seats in 0..2499, this exact case at 868 and 1968). The one-NPC thorp under recently_betrayed is soak1k-312 (the first in 0..9999) | 1/3 → 3/3; 9/10 → 10/10; 5/6 → 6/6 |
| 6 | e216b6da0 | regenPreservesUserCanon | a card born secret-less by REVIEW-INTAKE-4's held refusal (the car's generated roster has one, Reinhard Schneider; the tip's reroll one, Ernst Lehmann, 28/29) is skipped, the car's corruptionPass precedent (dc655f712). Non-vacuity is pinned at all-but-one (a second secret-less card reds). JUDGMENT, vetoable | 17/18 → 18/18 |

**No cure moved a golden surface.** Every cure is a test file, and src is byte-identical to e376ee6a3 (`git diff --quiet e376ee6a3 <tip> -- src` exit 0). So **no record D was born**; the `tree` class stays at 112 and the dated roster does not move. **No STOP was raised**: no red needed a design call between two valid compositions.

**At the tip after the cures** (the 30 red files re-run together): **31 red in 20 files = FPZ's 8 / 17 + GREEN-BASE's 12 / 14**. Composition 0; ENVIRONMENT green; `readerShapeResolver` green.

### 6.3 Step 3 — lint

- `npx eslint` on every JS file the merge, MERGE-CAR's commits and the cures touched (`git diff --name-only 7b3ffb6ee <tip>`, A/M, the derived edge bundle excluded): 273 files, **0 errors**, 3 warnings (unused vars: `src/domain/ai/personaSlicer.js` ×2, `src/generators/npcGenerator.js` `defenseFactsOf`).
- `sh scripts/gate-tail.sh npx vitest run tests/lint tests/scripts`: **221 files, 3,222/3,222, exit 0** — no red of any class.

### 6.4 Step 4 — the final 1,000

`node scripts/audit/soak-review.mjs --count 1000 --workers 4` at e216b6da0 (`run.json` tip e216b6da0767917305ed65f1cf8016baa4b56aec): **1,000 settlements, 702 findings, 0 errors, verdict CLIMB**, 300 s.

| kind | this tip | MERGE-CAR's cured tip | rung 2F (per 10,000) |
|---|---|---|---|
| `cert:*` | **0** | 0 | 0 |
| `coh:*` | **0** | 0 | 0 |
| `A-11` (sea-words-landlocked) | **0** | 0 | — |
| `info:battery-would-not-vouch` | 698 | — (702 total) | 6,770 |
| `A-09:behaviour-line-share` (repetition) | 4 (village 3, hamlet 1) | — | 91 |
| total · errors · verdict | **702 · 0 · CLIMB** | 702 · 0 · CLIMB | — |

No kind rises. The generator is unchanged since MERGE-CAR's cured tip: src and the soak harness are byte-identical to e376ee6a3, and the headline reproduces exactly. Repetition: story 0.056 all / 0.131 same-tier; hooks 0.324 / 0.394; 3,296 distinct skeletons, 107 in ≥10% of towns. The medians outside the owner's bands are the car's cast, as recorded by the car (`npcs.#` village 9, town 25, city 59).

The twenty most-repeated frames, by towns out of 1,000:
- 1–3: the War, Rumours and true-telling chrome lines, 1,000 each.
- 4: "the ordinary safety of @ has stopped applying", 564.
- 5: "ordinary life here in prose …", 500.
- 6: "@ reads as a place built to a plan …", 439.
- 7: "walls control entry points …", 383.
- 8–9: "there is no formal enforcement body" and "order is maintained through community social pressure …", 367 each.
- 10: "historically plausible and institutionally functional, but depends on imports …", 345.
- 11–12: "@ controls its own entry points" and "that is what a perimeter buys …", 337 each.
- 13: "small enough that every household knows its purpose", 334.
- 14: "what @ is worth to anybody else …", 328.
- 15–18: the four criminal-hierarchy lines ("a structured criminal hierarchy …", "predictable rules …", "random violence is suppressed …", "the real danger is systematic …"), 306 each.
- 19: "a stranger at @ is directed to @ …", 297.
- 20: "a functioning court and prison …", 293.

### 6.5 The goldens at the tip

`landing-stage.sh suites .` (the door's own registered suites and the freeze walker): **52/52 files, 473/473**; `worldFactRederive` + `goldenViewModel` 11/11. The chain is A → B → C, and no D.

## 7. CONFIRMED vs PLAUSIBLE

**CONFIRMED, by execution at this tip:**
- the whole-tree classification (every red file run at three archive trees);
- each cure red then green from its own run, and the composition set 0 red after;
- src byte-identical to e376ee6a3, so no golden surface moved and no record D;
- lint 0 errors, and `tests/lint` + `tests/scripts` 3,222/3,222;
- the 1,000 (702 / 0 / CLIMB; cert, coh and A-11 all 0);
- the golden suites 52/52;
- `readerShapeResolver`'s red is this seat's TMPDIR alone.

**PLAUSIBLE, not bisected:**
- the seam's rate 50 → 33 per 240 seeds is attributed to the car's cast re-deal (by equality of mechanism);
- Ernst Lehmann's missing secret is attributed to the held refusal on an exhausted pool (by the car's own roster showing the same state);
- MERGE-CAR's own PLAUSIBLE items stand as its commits say (the fork census 560 → 547, the observed-shape −4/−7/−4 interaction, the news re-attribution).

**From MERGE-CAR's commits, not re-run here:** the per-record acts and their receipts, and the budget figures (457ce0e38).

## 8. The tip

The cures and the measurements: **e216b6da0** on `lane/integration-2026-11-07`; this record is the commit after it (docs only). Every step of the brief is done:
- step 1: classified;
- step 2: six causes, all test-side, no record D;
- step 3: lint 0 errors, 3,222/3,222;
- step 4: the 1,000 at 702 / 0 / CLIMB;
- step 5: this record;
- step 6: the hand-back to the chair.

GREEN-BASE (`lane/green-base-2026-11-08`) owns the fourteen, and MERGE-WAVE merges its cures. FPZ owns the M-6 list.
