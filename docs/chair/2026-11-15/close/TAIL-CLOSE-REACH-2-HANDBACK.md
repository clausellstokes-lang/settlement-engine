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

## WHAT IS LEFT

- The receipt, then the merge of the joined line's tip and both doors' plain arms again; then the FINAL PASS on the
  chair's word.
