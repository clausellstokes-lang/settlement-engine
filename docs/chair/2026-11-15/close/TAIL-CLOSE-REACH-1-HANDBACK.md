# TAIL-CLOSE-REACH-1 — hand-back (the close of 2026-11-15)

Seat: TAIL-CLOSE-REACH-1, a CLOSE seat, the one writer of two instruments' registers tonight.
Branch: `lane/tail-close-reach-2026-11-15`, cut from the joined line `lane/join-2026-11-14` at f30a2469.
Rulings: the chair's WR1 (instrument one) and OR1 (instrument two), record 455; both vetoable by the owner.

## THE OWNER'S PART, IN PLAIN WORDS

**Writers with no reader (instrument one).** The round's lanes, and the round's test worlds reaching new paths, left
34 facts written that no page reads. Eight are plumbing the engine itself reads (listed under way (a)); each now has a
register row naming its reader. The other 26 were banked, once, by the chair's ruling. None of them is shown to a
player or a DM today, and each is owed after the release: a page line that shows it, or its writer retired, by its lane.
What each one is:

- **How many soldiers came home, and how many fell** (`survivors` on a homecoming outcome's record; the war return
  writer, `deploymentReturn.js`). The homecoming sentence already says the number in words (its form: "<n> of <town>'s host
  return to the muster; <m> did not"). The stored count beside it is read by nothing at all.
- **A held captive's ransom record** (`ransoms` on the roads record; the roads kernel, `roadsKernel.js`). The engine
  reads it every tick to carry a captivity forward, and projects the captive onto the NPC's whereabouts as a
  hostage. The ransom record itself (who holds them, the terms) is shown nowhere. The register cannot hold it as
  plumbing: its write is an assignment the instrument cannot see, so it is banked instead (the W6 precedent).
- **22 facts filed under a test world's save id.** The same facts are already banked on other save ids. The round's test
  worlds re-dealt their towns and casts, so the facts came up again under new save ids: a war army's quality, supply
  burden, reinforcement flow, return condition and sizing bias (on test town osr006); an upswing's end tick (osr007); a
  trade good, alchemical goods (osr003); eleven NPCs' weakness and three NPCs' pride on their living-agency records
  (the noble-family and landed-gentry seats and a miller of test towns osr001–osr008, osr013–osr015); and one NPC's id
  as a key of the NPC map (the osr008 miller). The instrument's own reporting rule calls these synthetic save-id
  shapes "not review material". No page reads them under these names. Whether a page shows the underlying facts
  elsewhere is the business of their own identities, which are already judged on their real shapes.

**One correction, said out loud.** The register row `situationDesc on economicState` (the economy's one-line situation
sentence) was struck because the instrument now calls it LIT. I measured the cause: the PDF's culture block
(EXPORTS-B24 · B2, 70047b61) imports one function from the quick-guide file, and the instrument counts whole files.
The function that reads the sentence (`composeMaterialTruth`) is called by **no page**. So the sentence is still unshown.
The strike is the instrument's verdict, not a new page.

**Readers with no writer (instrument two).** No page shows a wrong or empty value because of tonight's findings. All
38 new reads are spare fallbacks behind a key that IS written ("the faction's name, else its `name`"), or reads whose
writer exists where the instrument cannot see it (a data table, the store's config, a merged record). So nothing was
cured and no page line moved. **The instrument cannot be re-frozen tonight:** seven of its banked rows were lost by the
detector while their reads still stand in the PDF's body slices. A re-freeze would record that loss as a repair. Those
seven are the chair's to rule (listed below).

## INSTRUMENT ONE — WRITERS WITH NO READER (`scripts/check-writer-reach.mjs`)

| # | Identity | Site | Writer / reader | Way | Why | Commit |
|---|---|---|---|---|---|---|
| 0 | `situationDesc on economicState` (register row) | `settlementQuickGuide.js :: composeMaterialTruth` | writer `economy/economicState.js`; reader the quick guide, whose file is in the dossier-pdf closure since 70047b61 | (c) struck, clause S | the door: "the identity is now LIT, not DARK. BANK THE WIN — strike the row". File-grained reach; no page calls the reading function (see above) | 27b43242, 0620e7e2 |
| 1 | `criminalPreStress on compound` | `priorityHelpers.js :: getInstFlags` (return object) | reader `defenseGenerator.js:243` (`flags.criminalPreStress`, the Crime part) | (a) row, PLAUSIBLE (recomputed twin) | the crime reading before the stress multiplier, written by COHERENCE-UPKEEP-6 (fe5786c9); a generator reads it | 4eb5ce84 |
| 2–4 | `recallTargetId on metadata` (CONFIRMED) · `on selected` · `on autoApplied` (PLAUSIBLE) | `settlementStrategy.js:1152` | reader `applyWorldPulse.js:928` (stamps the deployment recall) | (a) rows | the simulation reads it | 4eb5ce84 |
| 5–7 | `rivalTriumphBand on warTerminationReads` (CONFIRMED) · `on metadata` · `on pulseHistory` (PLAUSIBLE) | `warTermination.js:930` | reader `warRulingsEvidence.js:51` (`hasRivalTriumph`) | (a) rows | the war rulings plumbing reads it | 4eb5ce84 |
| 8 | `warReturnedSettlementIds on pulseHistory` (CONFIRMED) | `pulseKernel.js:2930` | reader `applyWorldPulse.js:435` (has a besieger gone home this tick) | (a) row | the simulation reads it | 4eb5ce84 |
| 9–11 | `survivors on metadata` · `on selected` · `on autoApplied` | `deploymentReturn.js:440` (`metadata: { …, survivors, fell, … }`) | no reader anywhere | (b) banked | nothing reads it; the homecoming summary prints the count from a local | 6f8c1c53 |
| 12 | `ransoms on roads` | `roadsKernel.js:1139` (`persisted.ransoms = …`) | reader `roadsKernel.js:457` (`priorRoads.ransoms`) | (b) banked | an engine reader exists, but the write is an assignment and clause W ("no measured write spelling") refuses the row; the W6 precedent banks what the clauses cannot see | 6f8c1c53 |
| 13 | `alchemical_goods on osr003` | the corpus's save-id record osr003, rows 391 then, 372 now | none under this shape | (b) banked, save-id re-deal | the same key is already banked on osr004–osr006 | 6f8c1c53 |
| 14–18 | `deployedQuality` · `logisticsBurden` · `reinforcementFlow` · `returnCondition` · `sizingBias` `on osr006` | save-id record osr006, rows 488 then, 522 now (the war army records filed under the town's save id) | name-only reads in the simulation (`warDeployment.js`, `reinforcement.js`), report-only reach | (b) banked, save-id re-deal | the same keys are banked on osr000 | 6f8c1c53 |
| 19 | `endsTick on osr007` | save-id record osr007, rows 413 then, 439 now | name-only read `upswingKernel.js` | (b) banked, save-id re-deal | the same key is banked on osr004/osr005 | 6f8c1c53 |
| 20–22 | `proud on osr004:npc_power_noble_families` · `osr005:…` · `osr007:…` | save-id-scoped NPC agency records, 107 rows now; not judged at the freeze (no identity on them in the frozen reach) | none | (b) banked, floor crossing (re-dealt cast) | 12 sibling `proud` identities on the old cast's ids left as stale in the same door | 6f8c1c53 |
| 23–33 | `weakness on` `osr001/002/003/013/014/015:npc_power_landed_gentry`, `osr004/005/006/007:npc_power_noble_families`, `osr008:npc_mill` | save-id-scoped NPC agency records, 87–107 rows now; not judged at the freeze | none | (b) banked, floor crossing (re-dealt cast) | the precedent is §934.105's rebank of 40 such identities (32001a6b3, c60d08802) | 6f8c1c53 |
| 34 | `osr008:npc_mill on npcs` | the NPC map, rows 26,161 then, 26,828 now; the key is an NPC save id | none | (b) banked, save-id re-deal | the same class as osr009–osr011's mills banked at §934.105 | 6f8c1c53 |

The 36 stale bank members (the old cast's ids, and the `warRulingRead` family on `selected`/`warRulingRead`, no
longer written) were folded out by the same door: cohort 1377 → 1367. The register: 33 → 32 (the strike) → 40 (the
eight rows); the walker's two pinned counts follow with their notes.

**The charter of the one rebank** (verbatim in `rebankHistory`): "§934 the close of 2026-11-15 (the chair's ruling WR1,
record 455): 26 identities the round's lanes wrote that no customer surface reads, by class: 22 on save-id-keyed shapes
the round's corpus re-dealt (7 on the corpus's own save-id records osr003, osr006, osr007; 14 on save-id-scoped NPC
records that crossed the 40-row floor; 1 NPC save id on the npcs map), 3 that nothing reads anywhere (survivors on
metadata, selected, autoApplied), 1 with an engine reader whose write is an assignment the register's clause W cannot
see (ransoms on roads); each is written out in docs/chair/2026-11-15/close/TAIL-CLOSE-REACH-1-HANDBACK.md; owed after
the release: lit by a page line or retired at its writer, by its lane".

**Judgments of this seat (vetoable):** (J1) the rows' charter reads "§934 the chair's ruling WR1 …": clause shape
requires a `§` in every charter, and the chair's text carried none. (J2) `ransoms on roads` went to the bank, not a row,
because the instrument refuses the row (clause W). (J3) the 7 identities on the corpus's own save-id records were banked
as a re-deal, not rowed: the instrument's reporting rule excludes those shapes from review, and §934.105 banked their
siblings the same way.

### Receipt (instrument one)

- `node scripts/check-writer-reach.mjs` (plain): **exit 0**, HOLD line: `WRWALKER HOLD — judged 12661 · LIT 687 ·
  LIT-NAME 10567 · DARK 1407 (reviewable 389) · pending-surface debt: none`.
- `--write`: no shrink remains after the rebank folded the 36 stale members, so `--write` was not run (it would only
  re-stamp the sha).
- `tests/lint/writerReach.walker.test.js` alone: it needs `NODE_OPTIONS=--max-old-space-size=8192`. At the default heap
  its fork dies after 8 tests ("Worker exited unexpectedly"). With the larger heap: **48 of 52 green, 4 red**:
  1. "the frozen corpusMeta EQUALS the observed-shape register corpusMeta": `corpusMeta.originCount must equal OSR's
     frozen value: expected 15016 to be 14835`. This is instrument two's frozen corpus; its re-freeze clears it.
  2. "the frozen shapesDigest EQUALS the in-process digest": `live corpusMeta.originCount still equals OSR's frozen
     value: expected 15016 to be 14835`. Same cause.
  3. "the producers ran and the write population is not empty": `expected 1741 to be 1732` (OSR's frozen
     `shapeCount`). Same cause.
  4. "THE CULTURE CLASS IS STILL LIVE …": `expected [ …(6) ] to deeply equal [ …(4) ]`. Two rows came back:
     `src/domain/summary/settlementQuickGuide.js | settlement <- _config` and `| settlement <- config`. Same file-grain
     cause as row 0: EXPORTS-B24 · B2 (70047b61) put the quick guide's file back in the dossier-pdf closure, so the
     guide's `settlement.culture?.label` (`composeIdentity`, a fallback behind `culturalIdentity.label`) is seen again.
     No page calls `composeIdentity`. The arm says "bank the win, never loosen the assertion". It is not this seat's to
     loosen, and the fix is not a one-line rename at the read. **Named to the chair.**

## INSTRUMENT TWO — READERS WITH NO WRITER (`tests/lint/observedShapeReaders.walker.test.js`)

Measured at c7227254. The door's gate and `--report` arms both stop first at the lawful input-drift notice (7 generated
data paths), so the live inventory was taken through the walker's own composition (raw legacy scan → the four
post-filters → `compare`), run from a script outside the repository: **10 files, 38 new read identities; 14 stale rows**.

### (a) The 14 vanished rows

| Row | Site | Way | Why |
|---|---|---|---|
| `display on foodBalance` | `src/foundry/journalPages.js` | lawful shrink | the read is gone from the file |
| `_foodSecurity on config`, `_institutions on config` | `src/generators/defenseGenerator.js` | lawful shrink | the reads are gone (COHERENCE-UPKEEP-6's one crisis table) |
| `chainName on activeChains`, `output on exploitation`, `product on exploitation` | `src/pdf/lib/viewModelBodySlices.js` | lawful shrink | the reads are gone from the file |
| `recallTargetId on metadata` | `src/domain/worldPulse/applyWorldPulse.js:928` | lawful shrink (the guard's text says EROSION; measured otherwise) | the read still stands, but the corpus now WRITES the key on `metadata` (the `metadata` shape carries `recallTargetId`; instrument one's newly written identity). The finding cleared because the read gained a writer, not because the detector lost it |
| `availableResources on settlement` (`s?.availableResources`, :383), `exportPotential on settlement` (:386), `terrainEffects on settlement` (:392), `shadowEconomy on settlement` (:69), `institution on exploitation` (`iss?.institution`, :96), `processing on exploitation` (`c?.processing`, :55), `name on activeChains` (`c?.name`, :35) | `src/pdf/lib/viewModelBodySlices.js` | **STOP: INSTRUMENT EROSION, not banked** | every read still stands, and the `settlement` shape still carries none of the four keys. Why the detector lost them (PLAUSIBLE, not bisected): TAIL-EXPORTS-PDF batch 1 and batch 3 (63c3f2ae, 9afdf5fa, today) now pass the same receivers into new helpers (`chainPrintName(c, s)`, `tradeListsAsPrinted(s)`, `exploitationGroupsShown(s)`, `deriveProsperityPosture(s)`). The receiver now binds more than one shape, and the legacy scan's `objects.length === 1` guard drops the finding. The instrument has no governed way to HOLD an eroded row: schema 39's precedent recorded such a loss, and that is the banking OR1 forbids. **Named to the chair.** |

### (b) The 10 files' 38 new reads

None prints a wrong or empty value; none is cured (no cure is the read's own line); each is named.

| File | Reads | What it prints today | Class |
|---|---|---|---|
| `src/domain/crisis/crisisPage.js:248` | `name on factions` | the faction's name through `governing.faction` (the written key); the `|| governing.name` arm is spare and never wins | dead fallback |
| `src/pdf/sections/Institutions.jsx:59` | `id on institutions` | the derived `entityIdFor('institution', inst)`; institutions carry no `id`, so the `inst.id ||` arm never wins | dead fallback |
| `src/domain/display/magicProvisionShown.js:114` | `resourceKey on resourceConditions` | `row?.key` (written); the `?? row?.resourceKey` arm never wins | dead fallback |
| `src/components/map/WorldPulseData.js:49, :69, :85` | `settlementIds on stressors` (1), `factionName on stressors` (4) | one arm each of a list of alternatives (`settlementId`, `targetSaveId`, `o.factionName || payload.factionName || …`); the written arms print | dead fallbacks |
| `src/domain/display/newsBody.js:441` | `settlementIds on outcome` | `item.affectedSettlementIds` or the outcome's, then `targetSaveId` | dead fallback |
| `src/domain/worldPulse/proposalAdmission.js:137` | `targetId on outcome` | one arm of a list of id candidates (`targetSaveId`, `settlementId`, `saveId` …) | dead fallback |
| `src/domain/worldPulse/warCoalitionEvidence.js:85, :87` | `attackerId on outcome`, `targetId on outcome` | `merged` folds the outcome's `metadata`, which DOES carry both keys | writer exists, the detector binds `merged` to `outcome` |
| `src/generators/defenseGenerator.js:187–190, :322, :370–372, :670–671` | 21 reads `on chains` / `on arcane` (`C.provisioned`, `A.monMax`, `r.chains.garrison` …) | the defence weights table (`C = W.chains`, `A = W.arcane`) and the function's own result object; both written in the same file | writer exists (a data table and a local result), name-prior misbinding, COHERENCE-UPKEEP-6 |
| `src/generators/economy/incomeLineSiblings.js:170` | `chainId on chains`, `status on chains` | `f.chains` are the economy's active chains, whose records carry both keys (`activeChains` shape) | writer exists under another shape name |
| `src/generators/steps/assembleInstitutions.js:1042–1043` | `selectedStresses`, `selectedStressesRandom`, `stressorEdits on config` | the config the builder's store writes; the corpus's configs never set them, so on generated worlds the forced set is the intended stresses alone | writer exists outside the corpus (the store) |

The unreviewed-UI cohort's growth (129 → 131) falls among these UI-scoped reads (WorldPulseData.js, Institutions.jsx).
No `explained-writer` declaration was made: the roster's mechanisms are a closed set and a declaration is a schema rung,
which this seat was not chartered to mint. **Named to the chair, one line each, above.**

### (c) The door, and the receipt

- `--write` was **not run**: it refuses growth (38 reads), and it would bank the seven eroded rows as repairs.
- `tests/lint/observedShapeReaders.walker.test.js` alone (8 GB heap; `/tmp/gate-tail.4580.log`): **41 of 47 green, 6 red**:
  1. "the producers ran and the corpus is not empty": the executed corpus's counts drifted (lawful; a re-freeze absorbs it).
  2. "SHRINK-ONLY …": `expected { violations: 10, stale: 14 } to deeply equal { violations: +0, stale: +0 }`; the table above.
  3. "THE ERASURE GUARD …": the 14 rows above; 7 are erosion (STOP).
  4. "THE LIVE ESTATE INSTANCE: a freshly re-minted baseline has NO drift": `an execution INPUT drifted since the mint — lawful, and the shrink-only re-freeze absorbs it` (7 generated data paths).
  5. "A1/A7 …": `{ reads: 2212, identities: 1551 }` against `{ reads: 2189, identities: 1530 }`.
  6. "the UNREVIEWED-UI cohort …": `identities: 131` against `129`.
  All six clear only with a re-freeze, and the re-freeze waits on the chair's ruling on the seven eroded rows. Instrument
  one's three corpusMeta reds wait on the same re-freeze.
