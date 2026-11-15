# TAIL-CLOSE-REACH-2 — hand-back (the close of 2026-11-15)

Seat: TAIL-CLOSE-REACH-2, a CLOSE seat, the successor of TAIL-CLOSE-REACH-1 on its branch; the one writer of both
instruments' registers tonight. Branch: `lane/tail-close-reach-2026-11-15` (taken at 44a55fb4, as the chair said).
Ruling carried out: the chair's OR2 of 2026-11-15 (record 456), vetoable by the owner. Instrument one (writers with no
reader) was DONE by the predecessor; see `TAIL-CLOSE-REACH-1-HANDBACK.md`, carried unchanged.

## THE OWNER'S PART, IN PLAIN WORDS

**Readers with no writer (instrument two) is re-governed: one new schema rung, number 43, "the close of the round".**
The register now matches the code at the close, and every row that moved says why.

- **Seven reads were retired because they are really gone (or really answered).** Six are reads the round's lanes took
  out of the code; the seventh (`recallTargetId` in the world pulse) still stands, but the test worlds now write that
  field, so it is no longer a read with no writer. Each names the commit that did it.
- **Seven reads the instrument LOST, not cured.** They are still in the PDF's code (`src/pdf/lib/viewModelBodySlices.js`),
  each a spare fallback behind a field that is written, so nothing prints wrong or empty today. The instrument simply
  stopped seeing them: its detector refuses to judge a variable once it could be one of two record types. They are
  written into the rung as **uncured instrument erosion**, never as a repair. Owed after the release: the detector
  taught to follow a value through a helper. What I found about when each was lost:
  - the shadow-economy fallback was lost exactly when the titles lane joined (5d1e3096b);
  - three (available resources, export potential, terrain effects) were lost in one of six joins between 131dfdbb6 and
    2824cad0a; my ten allowed full scans ran out before I could say which one;
  - three more (a chain's name, a resource's house, its processing) were found by my predecessor: two lanes' commits,
    364c2313 (UPKEEP-14) and 282b9582 (EXPORTS-B3).
- **Thirty-five new reads (thirty-nine places in the code) were admitted, each by its cause and its lane.** None prints a
  wrong or empty value on any page: each is a spare fallback behind a field that is written, or a read whose writer
  exists where the instrument cannot see it (a data table in the same file, the builder's own settings, a record under
  another name). Owed after the release: the dead fallbacks struck at their lines. Not in the close, because an old
  saved record may still feed a fallback.
- **No defect was found.** No read prints wrong or empty on a page. Nothing was cured, and no page line moved.

**At the final pass (schema 44, and the writers' register re-stamped, the chair's ruling WR3):**
- One more read the instrument lost, not cured: the engine's "is this house still standing?" test
  (`institutionRoster.js`) reads a ruin stamp that the instrument stopped seeing when a tonight's fix (SR5) started
  using the same test for the defence tab. The read is still in the code and does its job. It is recorded as
  instrument erosion, and its cure is owed after the release with the other seven.
- One dead fallback (the quick guide's culture label) was really removed, by the src close seat.
- **Twenty generated facts are no longer counted as reaching the campaign PDF and the world book.** They never
  printed there. The count came from a tangle in the code: the facts' reader imported the defence tab's display
  file just to borrow one small key lookup, so the whole display file and seven of its helpers counted as "in"
  those two books. The close cut that tangle (T28 and T29): the lookup moved, word for word, into its own small
  file, and that file is still in both books' reach. All twenty facts are still shown on other surfaces (the web
  page, the dossier PDF, Foundry). One more, a service's name, is no longer counted on the web display, and is
  still shown on the PDFs and in Foundry. Thirteen facts gained reach: the names of the charter, the magical
  defence, the mercenaries and the walls now reach the dossier PDF, Foundry and the web display.

**Carried from the predecessor (instrument one), unchanged:** 26 facts written that no page reads were banked once by
the chair's ruling WR1. Each is owed after the release: shown by a page line, or its writer retired, by its lane. Eight
are engine plumbing with register rows. One register row was struck by the instrument's own verdict, but the sentence it
names is still shown on no page (see the predecessor's "one correction").

**Two corrections, said out loud.**
1. The predecessor wrote that the defence reads (`on chains` / `on arcane` in `defenseGenerator.js`) came from
   COHERENCE-UPKEEP-6. Measured: their spellings first enter the file at **82c639b44 (COHERENCE-UPKEEP-5)** (`tower` at
   e90c4f97d, also COHERENCE-UPKEEP-5), and the two `_foodSecurity` / `_institutions` reads leave at the same commit.
2. The four `on settlement` rows **do not share one cause**, as the chair expected they might. The predecessor's
   suspect for them, TAIL-EXPORTS-PDF (63c3f2ae / 9afdf5fa / the merges carrying them), is **refuted** for all four:
   the four stand at 16419737a (JOIN-7 · 30, the exports-pdf merge) and the trio still stands at bbbc33b1f (JOIN-8 · 3,
   the exports-pdf merge that touched the file).

## THE RUNG AS MADE (schema 42 → 43)

**Act 1, code** (15ceec7a5): the form of rungs 39 to 42. `BASELINE_SCHEMA` 42 → 43 and
`RETIRED_AGREE_TIER_SEED_BASELINE_SCHEMA` (42); the retired validator `validateSchema42Baseline` re-bound to its literal;
the live `validateSchema43Baseline` bound in the checker; the checker's schema index entry "43 = … re-governed to THE
CLOSE OF THE ROUND OF 2026-11-14/15 (the chair's ruling OR2 of 2026-11-15; the chair's record 456)" and its SCHEMA 43
`_doc` lines. The migration tool: `CLOSE_ROUND_TARGET_SCHEMA = 43` with its rationale, the declared bank (78/52,
unchanged), `CLOSE_ROUND_SCANNER_DELTA_PATHS` (the three bookkeeping paths: no detector source moved in the round), the
policy `schema-42-to-43-close-of-round-v1`, the predecessor row 43 → 42, the predecessor validator, the scanner
transition (reviewable unscanned movement), the live default and allowed target. The instrument's own three test files
pinned to the rung by identity (observedShapeBaseline / Migration / Sentinel): 120 of 120; eslint clean.

**Act 2, the governed ritual on act 1's committed clean tip** (no register row touched by hand):
1. `--scan-only --scan-mode=legacy-leaf --json=<ext>`: 2,212 findings; the bank 78 reads across 15 of 16 declared.
2. `migrate --target-schema=43 --review-template=<ext>`: **Same 1,516 · New 35 · Gone 14 · Increased 0 · Decreased 0**,
   exactly as the predecessor measured. Conservation 2,189 / 1,530 → 2,212 / 1,551. The transition modifies exactly the
   three bookkeeping paths; the unscanned movement is the seven generated execution inputs
   (`src/data/dossierRelations.generated.js`, `src/data/dossierStateProse/{defense,economy,general,power,stressors,warFaith}.generated.js`);
   the corpus moved only its observation key `shapeCount` 1732 → 1741.
3. The review, `docs/chair/2026-11-15/osr-rung43-close-of-round-review.json`: 1,566 decisions accepted with notes
   (1,516 SAME; the 49 moved rows each with ONE cause and its class; the scanner transition). A scratch builder wrote it
   and REFUSES (exit 3, nothing written) unless the summary, the three paths, the seven inputs, the corpus move and every
   moved row's counts are exactly as declared. **Negative control:** `factionName on stressors` tampered 4 → 5 in the
   report: refused exit 3, no review written.
4. `--review --bundle=<ext>`: exit 0, the same summary.
5. `check-observed-shape-readers --write --migrate-schema=43 --migration-review=<bundle>`: "froze 2212 finding(s) /
   1551 identit(ies) across 440 file(s); bank 78 banked read(s) across 52 tagged address(es), and
   tests/lint/observedShapeBank.literal.js agrees".
6. The walker's pins moved with ⭐ notes in the trail's form: the executed corpus's scalar meta (final 410 → 415,
   accumulated 2619 → 2622, unique 411 → 417, regional 73/73 → 71/71; measured, not bisected per cause) and the
   unreviewed-UI filter gap 0/18/47 → 0/16/42 (re-derived and named: the two WorldPulseData.js rows left the cleared set).
   The reads/identities pins and the cohort's size read the register and needed no hand.

### (1) The 7 lawful shrinks (class R), each with its cause

| Row | Site | Cause (measured: the read's spelling count in its file) |
|---|---|---|
| `display on foodBalance` (2 reads) | `src/foundry/journalPages.js` | gone: 2 → 0 at e31da7379, SURFACES-3 · 2 r3 (lane/join-surfaces-2026-11-14) |
| `_foodSecurity on config`, `_institutions on config` | `src/generators/defenseGenerator.js` | gone: 1 → 0 at 82c639b44, COHERENCE-UPKEEP-5 (lane/coherence-upkeep-2026-11-12) |
| `chainName on activeChains` | `src/pdf/lib/viewModelBodySlices.js` | gone: 1 → 0 at 364c2313d, UPKEEP-14 (j) (lane/coherence-upkeep-2026-11-12) |
| `output on exploitation`, `product on exploitation` | `src/pdf/lib/viewModelBodySlices.js` | gone: 1 → 0 at 282b95825, EXPORTS-B3 (lane/exports-b3-2026-11-14) |
| `recallTargetId on metadata` (2 reads) | `src/domain/worldPulse/applyWorldPulse.js:928` | WITNESSED, not eroded: the read stands; the corpus now writes the key on `metadata` (`settlementStrategy.js:1152`, a writer older than the round, newly reached by the re-dealt corpus; instrument one's rows at 4eb5ce84) |

### (2) The 7 eroded rows (class E, UNCURED INSTRUMENT EROSION), each named

None is class (a) (measured against `CLASS_A_PROTECTED_IDENTITIES`, 20 identities). All in `src/pdf/lib/viewModelBodySlices.js`.

| Key on shape | Site | Cause |
|---|---|---|
| `shadowEconomy on settlement` | :69 `s?.shadowEconomy` | **BISECTED, CONFIRMED:** present at 16419737a (JOIN-7 · 30), lost at **5d1e3096b** (JOIN-7 · 31, merge lane/tail-titles-2026-11-15 at b30c1b7aa) |
| `availableResources on settlement` | :383 `s?.availableResources` | **cause not bisected within the close: lost between 131dfdbb6 (JOIN-8 · 4, good) and 2824cad0a (JOIN-8 · 11, bad)**; the six merges 66f44805c tail-titles, 74c2ff310 tail-corpus-def, 1b095cd0a tail-crisis, bc7ce511a tail-defecon-c, 412938baf tail-display-civic, 2824cad0a tail-history |
| `exportPotential on settlement` | :386 `s?.exportPotential` | the same bound (the three share one state at every point scanned) |
| `terrainEffects on settlement` | :392 `s?.terrainEffects` | the same bound |
| `name on activeChains` | :35 `c?.name` | lost at 364c2313d, UPKEEP-14 (the predecessor's file-only bisect); absent at every full-tree point scanned here |
| `institution on exploitation` | :96 `iss?.institution` | lost at 282b95825, EXPORTS-B3 (the predecessor's file-only bisect); absent at every full-tree point |
| `processing on exploitation` | :55 `c?.processing` | lost at 282b95825, EXPORTS-B3 (as above) |

**The bisect, as run.** Over the joined line's first-parent points from the freeze's merge (64fe60ead) to f30a2469,
docs-only points dropped: 160 candidates. The good end is the freeze f5622ab8 itself (the register is its receipt).
Ten full-tree scans (`--scan-only --scan-mode=legacy-leaf`, each against its own tree) in all; columns are the four
`on settlement` rows (availableResources, exportPotential, terrainEffects, shadowEconomy):

```
tip 44a55fb4 ----   idx 79 9eb084705 YYYY   idx 119 2824cad0a ----   idx 99 794a00cc5 YYYY   idx 109 5d1e3096b YYY-
idx 107 31a6f72eb YYYY   idx 108 16419737a YYYY   idx 111 6b16a02d5 YYY-   idx 112 bbbc33b1f YYY-   idx 113 131dfdbb6 YYY-
```

The split at idx 109 ended the shared-cause test; the last five scans were spent on adjacent pairs at the likeliest
merges (by what each touched). The rung's own ritual scan and the `--write` are the procedure's, not the bisect's.

### (3) The 35 new identities (39 reads), admitted by cause (class I, ADMITTED WITH ATTRIBUTION)

| File (lines) | Identities | Class (cause) | Lane |
|---|---|---|---|
| `src/components/map/WorldPulseData.js` (:49, :69, :85) | `factionName on stressors` ×4, `settlementIds on stressors` ×1 | dead fallback (one arm of a list of alternatives) | the read predates the round; it arrived through the round's re-dealt corpus (not bisected) |
| `src/domain/display/newsBody.js:441` | `settlementIds on outcome` | dead fallback | the same (re-dealt corpus) |
| `src/domain/worldPulse/proposalAdmission.js:137` | `targetId on outcome` | dead fallback | the same (re-dealt corpus) |
| `src/domain/worldPulse/warCoalitionEvidence.js:85, :87` | `attackerId on outcome`, `targetId on outcome` | the writer exists; the detector binds `merged` (which folds the outcome's `metadata`) to `outcome` | the same (re-dealt corpus) |
| `src/domain/crisis/crisisPage.js:248` | `name on factions` | dead fallback (`|| governing.name` behind `governing.faction`) | TAIL-CRISIS batch 4, K12 (d667b50e7, lane/tail-crisis-2026-11-14) |
| `src/domain/display/magicProvisionShown.js:114` | `resourceKey on resourceConditions` | dead fallback (`?? row?.resourceKey` behind `row?.key`) | TAIL-DISPLAY-ECON-3 · 3 (53e295e5a, lane/tail-display-econ-2026-11-14) |
| `src/pdf/sections/Institutions.jsx:59` | `id on institutions` | dead fallback (`inst.id ||`; institutions carry no `id`) | TAIL-EXPORTS-PDF-2 batch 2 (44d3088b4, lane/tail-exports-pdf-2026-11-14) |
| `src/generators/defenseGenerator.js` | 21 identities `on chains` / `on arcane` (22 reads) | the writer exists in the same file (the weights table and the function's own result), a name-prior misbinding | COHERENCE-UPKEEP-5 (82c639b44; `tower` e90c4f97d; lane/coherence-upkeep-2026-11-12) |
| `src/generators/economy/incomeLineSiblings.js:170` | `chainId on chains`, `status on chains` | the writer exists under another shape name (`activeChains`) | UPKEEP-8 (db13fdb40, b11a4d72e; lane/coherence-upkeep-2026-11-12) |
| `src/generators/steps/assembleInstitutions.js:1042–1043` | `selectedStresses`, `selectedStressesRandom`, `stressorEdits on config` | the writer exists outside the corpus (the builder's store) | W2-FIX-DATA-3 (146ad0eab, lane/w2-fix-data-2026-11-13) |

**A read that prints wrong or empty on a page: none found** (the predecessor measured none; each row above names the
written key that prints). No read was removed from `src/`.

**Judgments of this seat (vetoable):**
- (J1) The instrument's own three test files (observedShapeBaseline / Migration / Sentinel) were pinned to the rung, as
  every rung's act 1 has done: they are instrument two's own tests, not another guard's.
- (J2) The 7 lawful shrinks are labelled class R; `recallTargetId` is R by WITNESS (the read gained a writer), the
  rung-42 vocabulary.
- (J3) The four corpus-arrived NEW rows (WorldPulseData, newsBody, proposalAdmission, warCoalitionEvidence) name their
  lane honestly as "not bisected": the ten scans went to the erosion rows, as the ruling ordered.

## RECEIPTS

Both walkers ALONE at the act-2 tree, each run to a file, each with `NODE_OPTIONS=--max-old-space-size=8192` (the
writer walker's worker dies out of memory under Node's default heap, as the predecessor measured; the repository's own
cure is lane/tail-close-heap-2026-11-15's, and no test configuration was changed here):

- `sh scripts/gate-tail.sh npx vitest run tests/lint/observedShapeReaders.walker.test.js`: **47 of 47**, exit 0.
- `sh scripts/gate-tail.sh npx vitest run tests/lint/writerReach.walker.test.js`: **51 of 52**, exit 1. The one red is
  the culture-class arm (ruling WR2), as expected: "THE CULTURE CLASS IS STILL LIVE …": `expected [ …(6) ] to deeply
  equal [ …(4) ]`, the two extra rows `src/domain/summary/settlementQuickGuide.js | settlement <- _config` and
  `| settlement <- config`. Its cure is the src close seat's (lane/tail-close-src-2026-11-15), to be confirmed at the
  FINAL PASS. Instrument one's three corpusMeta reds the predecessor named are GREEN: the re-freeze cleared them.
- The instrument's own three test files at act 1: 120 of 120.

## THE JOINED TIP MERGED (241668ccc)

`lane/join-2026-11-14` at 061db1367 merged into this branch (a merge commit; clean, no conflict; it brings 16
first-parent points, among them `vite.config.js` +22 lines, the heap seat's, untouched here). Both doors' plain arms at
the merged tree, each to a file, 8 GB heap:
- `node scripts/check-observed-shape-readers.mjs`: exit 0, "observed-shape readers: 2212 finding(s), exactly matching
  the frozen inventory"; the bank 78 across 15 of 16; the unreviewed-UI cohort 49 files / 131 identities / 195 reads.
- `node scripts/check-writer-reach.mjs`: exit 0, `WRWALKER HOLD — judged 12661 · LIT 687 · LIT-NAME 10567 · DARK 1407
  (reviewable 389) · pending-surface debt: none` (the same figures as the predecessor's receipt).
- So the later landings brought no new dark identity (WR1 not needed; the growth door NOT used a second time) and no
  moved reader row (OR2 not needed again).

## THE FINAL PASS (the chair's word: "FINAL PASS at f76fe38fd")

`lane/join-2026-11-14` at f76fe38fd merged at d9b01004c (a merge commit, clean). Both doors' plain arms at the merged tree:
- the writers' door: exit 0, `WRWALKER HOLD — judged 12661 · LIT 691 · LIT-NAME 10563 · DARK 1407 (reviewable 389)`;
  DARK unchanged, four identities rose from LIT-NAME to LIT; no new dark identity (no WR1 row, the growth door NOT used).
- the readers' door: exit 1, two STALE rows: `culture on settlement` (settlementQuickGuide.js) and `_worldPulseInactive on
  institutions` (institutionRoster.js).

**THE SECOND SMALL RUNG, schema 44, "the close's final pass"**: OR2's law requires it, because one of the two rows is
erosion. A plain shrink-only `--write` would bank it as a repair.
- `culture on settlement`: class R, a lawful shrink. The read is gone, struck at its root by TAIL-CLOSE-SRC-4 · WR2
  (d8b08402f).
- `_worldPulseInactive on institutions` (:40, `isLiveInstitution`): class E, **UNCURED INSTRUMENT EROSION**, recorded
  as such. The read stands and the file is unchanged. TAIL-CLOSE-SRC-5 · SR5 (b) (9cade66ce) passes the defence
  buckets' entries to `isLiveInstitution`, so its parameter binds a second shape. **CONFIRMED** by a scratch control
  (the merged tip with only that call undone, a local commit never pushed): the row scans back.
- Act 1 a845c2c84: the form of rung 43; the instrument's own tests 120/120; eslint clean. Act 2: scan; migrate
  **Same 1549 · New 0 · Gone 2**; the three bookkeeping paths; no unscanned movement; the corpus unmoved; the review
  `docs/chair/2026-11-15/osr-rung44-final-pass-review.json` (1,552 decisions; refusing builder; negative control
  refused exit 3); bundle; `--write --migrate-schema=44`: "froze 2210 finding(s) / 1549 identit(ies) across 439
  file(s); bank 78 / 52". No walker pin moved.

**Receipts at the rung-44 tree, each walker alone:**
- `observedShapeReaders.walker` (8 GB heap): **47 of 47**.
- `writerReach.walker`, **UNDER THE DEFAULT HEAP** (2,096 MB, `NODE_OPTIONS` unset; the heap cure e798161fd is on the
  line): **all 52 ran**, no out-of-memory; **51 of 52**. The culture arm is GREEN (WR2 landed). The one red is "the
  surfaceReach grammar round-trips": `institution on availableServices is missing from the frozen surfaceReach`, frozen
  `web-transitive=N`, measured `web-transitive=R`.

**HELD FOR THE CHAIR: the writers' register re-stamp.** The door's own `--write` (cohort 1367 → 1367, nothing folded,
nothing grown) would clear that red. It re-stamps **31 identities' reach, not one**: **13 rises** (`institution on
availableServices` web-transitive; `name on charter`, `on magicDef`, `on mercenary`, `on walls` each to dossier-pdf, foundry and
web-display) and **41 falls**. In the falls, **20 identities lose campaign-pdf AND world-book reach** (the campaign-pdf
closure 166 → 159 files, world-book 181 → 174), and `name on availableServices` loses web-display:
`inst on compound`, `desc on crimeTypes`, `economicGates on defenseProfile`, `compound on economicState`,
`magicOffset`/`stockpile on foodSecurity`, `hasChurch`/`hasCourtSystem`/`hasGranary`/`hasHospital`/`hasNavy`/`hasPort`/`hasPrison on inst`,
`crimeTypes`/`guardEffectivenessDesc`/`safetyDesc on safetyProfile`, `disaster on scores`,
`structuralViolations on settlement`, `blockadeBypass`/`blockaded on stockpile`. Every one is still LIT through another
surface. The cause of the closure cut is not measured here. A fall is not "a figure that ROSE", so the re-stamp waits on
the chair's word. The re-stamped file is kept in the scratch tree. This hand-back is updated when the re-stamp lands.

**RULED WR3 (the chair, 2026-11-15 ~11:23): "the falls are banked only with their cause shown".** Measured:
- **(1) The files.** Each closure lost the same EIGHT files and gained ONE (`src/domain/facts/criminalStructureKey.js`),
  net −7. All eight hung from one edge, `factsOf.js → defenseDisplay.js`. It was removed by **T28** (82dc208be, "the
  criminal structure's key as the crime fact's leaf"). The commit's own subject says "STOPPED: not for landing"; its two
  stop conditions were cured by **T29-1..3** (6320a6ac5, 722e9961c, 1adf270af, cb17872ed), and the lane joined the line
  at 416be57d1 (JOIN-11 point 4, lane/close-layer-cycle-attempt-2026-11-15). That is the close's declared last layer
  cycle. The eight files and the edge that brought each in: `display/defenseDisplay.js` ← factsOf.js (the cut edge);
  `display/threatAssessment.js` ← defenseDisplay; `display/defenseScoreBands.js` ← defenseDisplay, threatAssessment;
  `display/clergyHouse.js` ← threatAssessment; `display/prosperityInCrisis.js` ← threatAssessment;
  `magicReliance.js` ← defenseDisplay; `arcaneInstitutionIdentity.js` ← magicReliance; `summary/storesSpanWords.js`
  ← defenseDisplay (all under `src/domain/`).
- **(2) The kind.** Every one is a domain or display helper that the campaign PDF and the world book never render
  from. None is under `src/pdf/` or the world book's own modules. The surfaces used one function through the tangle,
  the criminal structure's key ladder (`deriveCriminalStructure(record)?.key`), and it moved verbatim to
  `criminalStructureKey.js`, which is still in both closures.
- **(3) Banked.** The door's own `--write` on the clean tree: cohort 1367 → 1367, nothing folded, nothing grown. It is
  byte-identical to the held re-stamp but for its sha. The commit message gives the cause file by file.

**THE FINAL RECEIPTS** (each walker alone, to a file, at the re-stamped tree):
- `tests/lint/writerReach.walker.test.js`, **under the default heap** (`NODE_OPTIONS` unset, 2,096 MB): **52 of 52**,
  exit 0. All 52 ran, with no out-of-memory.
- `tests/lint/observedShapeReaders.walker.test.js` (8 GB heap): **47 of 47**, exit 0.

## WHAT IS LEFT

- Nothing of this seat's. The chair lands the tip.
