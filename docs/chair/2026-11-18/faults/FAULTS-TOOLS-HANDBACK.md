# FAULTS-TOOLS hand-back

Seat FAULTS-TOOLS of the round FAULTS (BRIEF-FAULTS § FAULTS-TOOLS). Base `4288049ba` (`lane/faults-base-2026-11-18`); branch
`lane/faults-tools-2026-11-18`. Commits: `96d1cc5a6` (this file opened), `45af1478f` (item 2), `d489df0a8` (item 1), `df802e1ee` (the guard's
negatives anchored, for two walkers), and the hand-back. Item 3 is a PATCH below (not pushed to the chair's lane).

**THE MISMATCH, AND THE CHAIR'S RULING.** The matcher `proseComposed.walker` uses is not in the tests: it is `claimTokensOf` /
`claimsField` in `src/domain/prose/entryWalker.js`, and my prompt said "NOTHING under `src/`". I told the chair (06:5x UTC) and
went on with items 2 and 3. **THE CHAIR RULED (06:57 UTC): those two functions of that file, and only they, are this seat's,**
under four conditions. Each condition is answered under item 1. No other file under `src/` is touched.

## ITEM 1 · THE MATCHER TAKES A NAME FOR A CLAIM (`d489df0a8`)

**THE CURE, AT ITS CAUSE** (`src/domain/prose/entryWalker.js`, the two functions and two module constants beside them):
- `claimsField`: a **NAME SLOT** is struck from the text before any test. `NAME_SLOTS = ['settlement']`: `{settlement}` is filled
  with the town's proper name wherever the composers fill it (`defenseStateProse.js:719`, `:1020`, `:1140`, `powerStateProse.js:975`,
  `economyStateProse.js:1142`: `properFill(settlement.name)` or the name), never with a reading of the record. (Struck before the word test too: `\bsettlement\b` matched through the braces.)
- `claimTokensOf`: the **HEAD VERB** of a camel-cased leaf is not a claim word. `PREDICATE_VERBS = ['has']`: of every field the
  census names, only `has*` (31 leaves) and `isEntrepot` open on a verb, and `is` was already dropped by the length rule. The
  whole leaf (`hasgranary`) and its own words (`granary`) still claim it.

**MEASURED** (`armA0b` over the shipped corpus exactly as the corpus arm reads it, 3,042 variants, at 4288049ba and at the tip):

| | base | tip |
|---|---|---|
| over-claims | 54 | **19** |
| under-claims | 2,102 | 2,103 |
| implicit negations | 13 | 13 |

**THE 35 OVER-CLAIMS THAT LEFT, ROW BY ROW, every one an artifact (none is a word of the line about the field):**
- **CL25's EIGHT (`OVER_CLAIM_OWED` 9 → 1):** DS-GEN-17 ADMINISTERED v4 `settlement` (as "{settlement}"); v5 `settlement` (as
  "{settlement}"), `readings.inst.hasGranary`, `.hasHospital`, `.hasMagicInst`, `.hasMilitaryInst`, `.hasNavy`, `.hasWatch` (each as "has").
- **THE BASE'S SHARE, 27 rows** (in `OVER_CLAIM_BASE` 45, not in OWED): DS-GEN-17 `settlement` (as "{settlement}") on ADMINISTERED
  v1, v2, v3, GARRISONED v1, v2, LETTERED v1, v2, PROVISIONED v1, v2, v3, BARE v1, v2 (12); DS-GEN-17 LETTERED v2 ("…the town has
  decided it can afford them.") `readings.inst.hasCourtSystem`, `.hasGranary`, `.hasHospital`, `.hasMagicInst`, `.hasMilitaryInst`,
  `.hasNavy`, `.hasPrison`, `.hasWatch` (each as "has", 8); DS-WAR-2 `readings.settlementId` (as "{settlement}") on "the treaty
  runs out within the year" v1, v3, "the town is the LOSER side" v1, v3, "the town is the VICTOR side" v1, v2 (6); and one of CL14's
  three, DS-GEN-17 ADMINISTERED v5 `readings.inst.hasPrison` (as "has": the matcher found the verb, never "gaol"; it sat in the
  ceiling's slack) (1).
- **THE 19 THAT STAND** (the matcher still finds them, so they stay): DS-GEN-17 ADMINISTERED v1, v4, v5 `hasCourtSystem` (as "court"),
  PROVISIONED v1, v2 `hasGranary` (as "granary"); DS-ECO-1 C3 v3, C4 v1, v3, v6 `access` (as "{access}"); DS-ECO-3 ADEQUATE v0, v3
  `flowDrift.tradeDependent` (as "trade"); DS-ECO-10 POSTURE none v1, limited v1, vulnerable v1 `exportPosture`; DS-GEN-5 river v7
  `tradeRouteAccess` (as "trades"); DS-GEN-8 charterPending v1 `row.charterPending`; DS-POW-7 DORMANT v1 `structuralLens.rulingPower`
  (as "powers"); DS-CND-1 PROVENANCE v2 `sourceEventType` (as "event"); DS-DEF-11 UNWALLED-SMALL v6 `monsterThreat` (as "threat").
  THE ONE OWED THAT STAYS is A0B1's (DS-ECO-1, the `{access}` slot, a reading, not a name).

**`OVER_CLAIM_OWED` 9 → 1** (the one pinned number lowered). **`OVER_CLAIM_BASE` STAYS 45**: my prompt names OWED as the one
number I lower, so the ceiling (46) holds 27 of slack over the measured 19 until the close takes BASE 45 → 18 ("when it lands, the
base falls with it", CL25). **A STORED FIGURE FOR THE CLOSE: `OVER_CLAIM_BASE` 45 → 18.**

**`UNDER_CLAIM_OWED` STAYS 815**; ONE ROW MOVED IN (2,102 → 2,103): DS-GEN-13 WAREHOUSES v5 `readings.inst.hasWarehouse` ("Since
the siege began, nothing new has come in to be stored at {settlement}, and nothing stored there can be sent on."): only the bare
verb "has" had claimed it; the line names no warehouse. The tally was already over its ceiling at the base (2,102 > 2,097: the
close's red, same assertion at base and tip).

**THE ONE OLDER PIN THE CURE MAKES UNTRUE, RE-KEYED BY IDENTITY:** `proseComposed.walker.test.js`, "claimTokensOf splits a dotted,
camel-cased path…": `claimsField('{settlement} keeps its own rolls.', 'settlement')` was pinned `'{settlement}'` (the artifact
itself). Now `''`, with a slot that names a field's leaf (`{granary}`) and the bare word "settlement" pinned beside it as positives.

**THE CHAIR'S CONDITIONS:**
- **(a) NO PRODUCT PATH.** `grep` for importers of `entryWalker`, `composedWalker` (the re-exporter), and of the modules that import
  them (`grammarWalker`, `passageShapes`, `entryGround`): outside `src/domain/prose/` only `scripts/` (`prose-wave-gate.mjs`,
  `generate-dossier-state-prose.mjs`, `prose-shape-report.mjs`) and `tests/`. The generator of the corpus imports `contentWords`
  alone, which the cure does not touch. THE BUILD: one `npm run build` at the base and one at the tip, then `VERIFY_DIST=1 npx vitest run tests/build` (603 tests) at each:
  IDENTICAL BY MESSAGE, 12 red at both, the same bytes and the same chunk hashes (`engine-core-7wTzIihN.js` at both). THE FOUR SIZE
  CEILINGS read at both: the engine chunk 906,842 B (ceiling 881,331); the first-paint closure raw 1,168,138 (1,139,072), gzip
  371,842 (362,621), Brotli 312,201 (304,224); also the worker bundle 2,536,023 (2,356,121). All the close's; none moved by me.
- **(b) EVERY OTHER READER UNMOVED but the artifacts:** `scripts/prose-wave-gate.mjs --arm A`, each of the six sections, base and tip,
  its packet JSON compared leaf by leaf with paths normalized: IDENTICAL but `walk.msPerUnit` / `walk.exhaustiveMs` (the clock).
  ARM Q (the walker's own measure, the test's code run with its prints kept): base "786 withheld -> 765 … (21 licensed)", tip the
  same; "trailing coordinate: 377 of 3042" both; the entry-walker census (3,908 entries; 355 with a FAIL; 1,637 withheld; 1,398
  not-executable; the five arms' counts) identical. (Arm Q never reaches a name slot: a segment with any `{slot}` is licensed first.)
- **(c)** above: OWED falls by the cure, row by row; no row the matcher still finds is deleted; UNDER_CLAIM_OWED 815, the one row named.
- **(d) THE PLANTED OVER-CLAIMS ARE FOUND** (`tests/generators/faultsTools.test.js`, item 1, four arms): a whole word ("settlement"),
  a slot naming a field's leaf (`{granary}`), a predicate field's own word ("watch" for `hasWatch`), a camel-cased leaf's word
  ("economic" for `economicGates`) are each found by `armA0b` as over-claims; a clean line (`{settlement} has walls.`) finds none;
  on the shipped corpus CL25's eight are gone while the court claim of the same two lines stands (non-vacuity). Red 4/4 at the
  base, green at the tip.

## ITEM 2 · THE VALIDATOR THAT CANNOT OPEN (`45af1478f`)

**WHY IT COULD NOT OPEN:** it treated every `.json` of `docs/census/declarations/` as one of its own row ledgers. Since 2c1428102
that directory also holds CENSUS-2's 70 pool-shaped ledgers (`pools[]`), CENSUS-3b's 45 row ledgers and 5 summaries; it read
`argv[2] + 'ARRIVAL_MEMORIES.json'` and threw (with no argument, `undefinedARRIVAL_MEMORIES.json`, ENOENT).

**THE REPAIR** (`scripts/census/census4-validate-ledger.mjs`): it reads only CENSUS-4's own ledgers (a row-shaped file whose pool the
extract emits, or whose name is a CENSUS-4 table's: the same set `census4Ledger.walker`'s `OWN` reads) and NAMES every other file by
family; with no argument it runs `census4-extract-pools.mjs` into a temporary directory itself; its atoms are checked against the
live vocabulary (`factVocabulary.js :: parseAtom`, `CRISIS_VALUES`; the phase-A copy it was born with was superseded on 2026-11-05),
a pool keyed by a crisis word keeping it on the key; two checks are new (an extract pool with no ledger; a ledger with no pool);
findings are counted by pool and kind, `CENSUS4_ALL=1` prints every one; it exits 1 when one stands.

**WHAT IT READS AT THE BASE'S TREE** (the tree is the base's: my tip changes no ledger and no pool): 29 ledgers, 3,319 lines, 329
declaring, 10 colour pools; NOT READ: 70 CENSUS-2 pool-shaped, 45 CENSUS-3b row-shaped, 5 summaries. **BAD 1,721, NAMED FOR THE
CHAIR, NONE CURED:**
- **THE LEDGER WAS NEVER RE-TAKEN AS THE POOLS GREW** (rows: ledger vs extract; the row compare is positional, so one insertion
  mismatches every row after it): crisisCast.CAST_ABSENCES 14 vs 15 (11 rows), CAST_REASONS 42 vs 47 (35), STAKE_REASONS 12 vs 34
  (22); institutionDescVariants 664 vs 666 (440); institutionServices 978 vs 990 (14); npcData.NPC_FACTION_GOALS 108 vs 118 (118),
  NPC_FACTION_LOYALTY 80 vs 230 (229), NPC_WANTS 56 vs 59 (59), NPC_PLOT_HOOKS_DATA (1 row); npcGenerator.STRESS_GOAL_OVERRIDES 22 vs
  25 (21); npcStructure.T 288 vs 312 (288); stressInstitutionEffects 190 vs 466 (464).
- **THE EXTRACT'S OWN REACH HAS DRIFTED** (the ledger holds more than the extract now finds): npcGenerator.STRESS_GOALS ledger 80 vs
  extract 6 (`STRESS_GOALS` moved inside a function, `npcGenerator.js:361`, and its siege row now calls `foodStoreWord`);
  npcGenerator.CRIME_LEVEL_OTHER_NPC ledger 8 vs extract 1 (the inline `pickRandom2([` the extract parses). `census4-extract-pools.mjs`
  is not on my row: NAMED.
- **`pool.declaring` STALE** (the stored count vs the rows' own): institutionDescVariants 65 vs 74; institutionServices 49 vs 72;
  npcData.STRESS_ECONOMIC_EFFECTS 30 vs 50; stressInstitutionEffects 38 vs 40.
- No atom finding: every row atom parses in the live vocabulary (as `census4Ledger.walker` already holds).

**WHETHER A GATE SHOULD RUN IT (my view, one line):** not until CENSUS-4's ledger is re-taken (1,721 findings are a re-take, not a
gate's work); then yes, as one more arm of `census4Ledger.walker` asking `BAD 0`, since it is the only check that the ledger still
covers every line the extract reads.

**GUARD** (`tests/generators/faultsTools.test.js`, item 2, four arms): it opens with no argument and reaches its verdict (exit 1
exactly when a finding stands); it names the files it does not read and reads a CENSUS-4 ledger, not a CENSUS-2 one; a planted
text drift is found where planted and only there; a removed pool and an uncovered pool are each found; each with its negative.
Red 4/4 at the base (ENOENT), green at the tip.

## ITEM 3 · THE PROBE'S WAIT (A PATCH, not pushed)

**THE CAUSE:** `DeityAssignmentPanel` is a `React.lazy` part (`dossierLazyTabs.js:37`) under `<Suspense fallback={null}>`
(`OutputContainer.jsx:725`): until its chunk resolves it prints nothing, so `settle` saw the panel's text still and snapped
before it arrived.

**THE MENDING:** the probe wraps every `lazy()` the tree makes (a `vi.mock('react')` that hands back React with only `lazy`
wrapped), so each lazy import is tracked while pending; `settle` first waits until no lazy part is pending (at most 30 s, then it
fails loudly), then asks for stillness; a lazy part asked for during the stillness starts the count again. It covers
OutputContainer's module-local lazies too, not only the registry's.

**PROOF:**
- 20 renders of `bar0-thorp-calm-rand-45` and 20 of `r2r-thorp-2` (`census3.sh … 2 --seeds <the two> --count-only` at the base
  tree, each render while this seat's base `tests/lint` and probes loaded the machine): **20 of 20 byte-equal for each town**
  (md5 `06bbbbe949b7…` and `57af0d8b827c…`), "Patron deity" present in all 40.
- **NEGATIVE CONTROL, PLANTED:** every lazy chunk made 600 ms late. The UNPATCHED probe then loses the panel in BOTH towns (the diff
  against the patched dump is exactly the two lines "Patron deity" / "Assign a patron god … Available at launch to author and assign
  deities.", nothing else); the PATCHED probe with the same delay prints byte for byte its clean dump.

**THE PATCH** (`git diff` against `lane/chair-2026-11-08 :: docs/chair/2026-11-16/probes/PAGE-COPY/render.census3.jsx`):

```diff
diff --git a/docs/chair/2026-11-16/probes/PAGE-COPY/render.census3.jsx b/docs/chair/2026-11-16/probes/PAGE-COPY/render.census3.jsx
index 35796a6..144088b 100644
--- a/docs/chair/2026-11-16/probes/PAGE-COPY/render.census3.jsx
+++ b/docs/chair/2026-11-16/probes/PAGE-COPY/render.census3.jsx
@@ -18,6 +18,19 @@ import { afterEach, test, vi, expect } from 'vitest';
 import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react';
 import fs from 'node:fs';
 const mocks = vi.hoisted(() => ({ store: {} }));
+// MENDED 2026-11-18 (FAULTS-TOOLS item 3; the close's sweep, seed bar0-thorp-calm-rand-45): THE PROBE WAITS FOR EVERY LAZY PART.
+// A `React.lazy` part under `<Suspense fallback={null}>` (the Power tab's DeityAssignmentPanel, dossierLazyTabs.js) prints
+// NOTHING until its chunk resolves, so the page looks still while it is not yet whole, and under load the chunk resolved
+// after the stillness window closed (one dump lost "Patron deity"). Every `lazy()` the tree makes is wrapped here so its
+// import is tracked while it is pending; `settle` waits until none is, then asks for stillness. Nothing else of React changes.
+const lazyWait = vi.hoisted(() => ({ pending: new Set() }));
+vi.mock('react', async (importOriginal) => {
+  const R = await importOriginal();
+  const lazy = (factory) => R.lazy(() => { const p = Promise.resolve(factory()); lazyWait.pending.add(p);
+    const done = () => { lazyWait.pending.delete(p); }; p.then(done, done); return p; });
+  const base = R.default ?? R;
+  return { ...R, lazy, default: { ...base, lazy } };
+});
 vi.mock('__TREE__/src/store/index.js', () => {
   const useStore = (selector) => selector(mocks.store);
   useStore.subscribe = () => () => {}; useStore.getState = () => mocks.store; return { useStore };
@@ -84,7 +97,10 @@ function lines(root){
 // and not in the next run's at the same tree. Before every snapshot the panel's text must hold still for four polls of 25 ms
 // (at most three seconds), so two runs of one tree give the same dump.
 const tick=(ms)=>new Promise((r)=>setTimeout(r,ms));
-async function settle(panel){ let last=-1, same=0; for(let i=0;i<120;i++){ await act(async()=>{ await tick(25); }); const n=(panel.textContent||'').length; if(n===last){ if(++same>=4) return; } else { same=0; last=n; } } }
+// MENDED 2026-11-18 (FAULTS-TOOLS item 3): first every lazy part the page has asked for has arrived (at most thirty seconds),
+// then the stillness; a lazy part asked for during the stillness (an effect's late render) starts the count again.
+async function lazyArrived(){ for(let i=0;i<1200 && lazyWait.pending.size;i++){ await act(async()=>{ await Promise.race([Promise.allSettled([...lazyWait.pending]), tick(25)]); }); } if(lazyWait.pending.size) throw new Error(`census3: ${lazyWait.pending.size} lazy part(s) still pending after 30 s`); }
+async function settle(panel){ let last=-1, same=0; for(let i=0;i<120;i++){ if(lazyWait.pending.size){ await lazyArrived(); same=0; } await act(async()=>{ await tick(25); }); const n=(panel.textContent||'').length; if(n===last && !lazyWait.pending.size){ if(++same>=4) return; } else { same=0; last=n; } } }
 async function openAll(panel, snap){
   const disc=()=>[...panel.querySelectorAll('[aria-expanded]')].filter(e=>!e.hasAttribute('aria-haspopup'));
   await settle(panel);
```

## NAMED ONLY (the detectors' debts; built none)

- `runJ`'s roots' word list narrower than the trade catalogue: `tests/helpers/pageLaws/law11Supply.mjs:58` (`MATERIALS`, read by
  `rootsOf` at `:188`) keys `livestock` and `hides` apart (and their grounds at `:63-64`), where the catalogue sells them as one good.
- `runJ` reads 11d's predicate from the tree it runs in: `law11Supply.mjs:356` calls the tree's own
  `houseInputAtHand.js :: warIronHookOutsideWar(rec)`, so a hook the tree misreads is misread by the detector too.
- `14a.descCopy.generic` counts two true descriptions that are byte-equal: `tests/helpers/pageLaws/law14K.mjs:46-55` reports every
  description two powers share; a description general to the category is true of both and is not a copy.

## RULES, POPULATIONS, DECLARED MOVES

- **The thirty, the 150, the 720: NOT RENDERED** (the section: "R4's populations do not apply to you"). Nothing of my tip reaches a
  page or a record: no product module imports the matcher (condition (a)), the validator and the guard are tools and tests, and the
  probe's patch is not pushed. No runner's rule can rise or fall by this work.
- **Declared moves: NONE. 0 of 525** reference configurations move: no generator, no data, no product module is touched.
- **Stored figures my work moves (for the close):** `proseComposed.walker` `OVER_CLAIM_OWED` 9 → 1 (mine, by the cure);
  `OVER_CLAIM_BASE` 45 → 18 measured (the close's to take); A0b under-claims 2,102 → 2,103 (one row, named; `UNDER_CLAIM_OWED` 815
  untouched); `mutationCoverageManifest`'s TOTALITY list gains `tests/generators/faultsTools.test.js` (below).

## THE NET

Each gate alone through `sh scripts/gate-tail.sh`, at the base (a scratch worktree at 4288049ba) and at the tip `d489df0a8`
(the full `tests/lint`), the anchor fix `df802e1ee` re-run on the three files it touches.

| gate | base | tip |
|---|---|---|
| `npm run typecheck:domain:strict` | ✓ 1113, ceiling 1113 | ✓ 1113, ceiling 1113 |
| `npm run typecheck:ratchet` | OK 167, ceiling 167 | OK 167, ceiling 167 |
| `npx eslint` (my four code files) | — | clean |
| `tests/architecture` | 21 files, 347 passed | 21 files, 347 passed |
| `tests/joins` | 34 files, 425 passed | 34 files, 425 passed |
| ALL of `tests/lint` (781 files, 3,226 tests) | 41 failed | 44 at `d489df0a8`; **41 after `df802e1ee`** (the 41 of the base with three messages changed, below) |
| `proseComposed.walker` alone | 2 red | 2 red, same assertions |
| my guard `tests/generators/faultsTools.test.js` | 8 of 8 red | 8 of 8 green |

**`tests/lint` COMPARED BY MESSAGE** (test name and the first 900 characters, paths normalized). The same at base and tip: factLayers
(2), ledgerCitationIntegrity (no `review-fixes-2026-07-08` ref here), noLegacyFactionReaders, observedShapeReaders (4),
poolDominance (3), presumedThings (2), presumptionClasses (2), proseComposed's corpus guard (3042 vs 3033), proseCorpusBytes,
proseEntryContradiction (3510 vs 3501, 2802 vs 2794), proseFamilyContract, proseMoveGrammar (2), proseWaveGate, proseWiringCensus
(3), ruinFilterRoster, siteCoherenceRatchet, tuningRegister, wiringCensusDeclared, writerReach (9). DIFFERENT, each mine and named:
- `proseComposed.walker` A0b: "expected 2102 to be ≤ 2097" → "2103 ≤ 2097" (the one under-claim, item 1).
- `mutationCoverageManifest` TOTALITY: the list of invariant files without an entry (the five bar8 guards at the base) gains
  `tests/generators/faultsTools.test.js`. `scripts/mutation-coverage-manifest.json` is not on my row: NAMED.
- `sovereigntyLightingContract.walker` "the estate's file count moved": 3690 → 3691 against the stored 3641 (my guard file). A
  STORED FIGURE, the close's: **the estate's file count 3690 at the base, 3691 at my tip.**
- `negativeAssertionAnchor.walker` (2 arms) and `proseDrawnAnchors.walker` (1): red at `d489df0a8` on my guard (three bare
  negatives, one quoted corpus line); **cured by `df802e1ee`**: the three files green together at the tip.

**`proseComposed.walker.test.js` alone, by message:** base and tip red on the same two arms (the corpus guard 3042 vs 3033; A0b's
under-claims 2102 / 2103 over 2097); the over-claim arm passes at both (54 ≤ 54; 19 ≤ 46).

**THE OLDER TESTS** (every file that names `claimsField`, `claimTokensOf`, `OVER_CLAIM_*`, `UNDER_CLAIM_OWED`, `entryWalker`,
`composedWalker` or `census4-validate-ledger`, by import or text, and the fixture's importer; with `mutationCoverageManifest` and
`census4Ledger.walker`), each ALONE at base and tip, by name and message: `dossierStateProseProjection.contract` 4 red = 4 red
(the wiring census STALE, the corpus 3042 vs 3033); `proseComposed` 2 = 2 (the under-claim's figure, above); `proseEntryContradiction`
2 = 2; `proseMoveGrammar` 2 = 2; `prosePassageShapes` green = green; `proseWaveGate` 1 = 1; `proseWiringCensus` 3 = 3;
`presumedThings.walker` 2 = 2; `presumptionClasses.walker` 2 = 2; `mutationCoverageManifest` 1 = 1 (one more file, above);
`census4Ledger.walker` green = green. No test names `census4-validate-ledger.mjs`. `scripts/mutation-sweep.sh`'s one plant in
`entryWalker.js` (line 1083, `} else if (!col.closed) {`) targets text the cure does not touch.

## LEFT, BY NAME

- `scripts/mutation-coverage-manifest.json`: my guard file joins the TOTALITY arm's list of invariant files with no entry, as the
  five bar8 guards already stand at the base (not on my row: NAMED).
- `scripts/census/census4-extract-pools.mjs`: its reach of STRESS_GOALS and CRIME_LEVEL_OTHER_NPC (item 2, above).
- CENSUS-4's ledger re-take (item 2's 1,721).
- Code clean-up, not raised: none.
