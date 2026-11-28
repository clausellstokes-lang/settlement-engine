# TAIL-CLOSE-DOORS-2 · hand-back (the doors' seat of the close, final pass)

Branch `lane/tail-close-doors-2026-11-15`, from 84a9f46d7 (TAIL-CLOSE-DOORS-1's tip). ONE merge commit of the joined line
`lane/join-2026-11-14` at **f76fe38fd** (read back from origin: the line's tip at the fetch, 11:04 UTC): **3f31a7b59**, no
conflict. Scratch tree `/home/user/doors2`: a plain clone with its own `.git` and its own `npm ci` (package files
byte-identical to the line). Every run went to a file under `/home/user/doors2-logs/`. No page line cured, no test written.

STATUS: **HANDED BACK AT THE COUNT MARK (the chair's word, 12:04 UTC), STOPPED AT PART 2's DRIFT CHECK.** A successor takes it from
this tip without redoing anything: see **WHAT IS LEFT, IN ORDER** at the foot.

## PART 1 · THE DOORS AT THE FINAL TREE

| # | door | exact command | what it wrote | commit | result |
|---|---|---|---|---|---|
| 1 | edge bundles | `npm run build:edge-shared` | 10 files in `supabase/functions/_shared/` (aiCharter, aiGrounding, aiOutputSchema js + meta; analyticsEvents meta; engineBundle js + meta; intentAtlas meta), from inputs on the line | 224ef8d27 | exit 0. Receipt, each alone: aiCharterBundle.freshness 19/19, aiGroundingBundle.freshness 20/20, aiOutputSchemaBundle.freshness 23/23, edgeSharedBundleReproducibility 29/29, engineBundleReplay 5 + 2 skipped (by design: the class-b goldens), engineServiceCore 1/1, engineServiceStoreParity 4/4 |
| 2 | wiring census | `node scripts/wiring-census.mjs`; then `--check` and `npm run gen:dossier-prose -- --check` | `docs/content/wiring-census.json`: producerIndexFiles 1379 -> 1380 (856 pools, 169 relation rows, 7 stamped files unchanged) | 7ac6ad0b1 | all exit 0. `wiringCensusDeclared.walker` **8/9: RED, not this door's**: its channel arm finds `CONDITION_FACT_SIBLINGS` (exported by `src/domain/worldPulse/heraldDeeds.js`, 805452e8f, the trade-fact cure) absent from `scripts/lib/table-pools.mjs` (`DECLARATION_CHANNELS` / `NOT_TABLE_CHANNELS`): a code cure, named to the chair |
| 3 | page census | `node scripts/census/page-census.mjs --shrink --out=<dir>` (720 births, 4 workers); `node scripts/census/page-census.mjs --grid --shrink` | **nothing** | none | both exit 0: "the banked corpus reads at or under the register" (every banked count equals its reading: no fall, no rise); grid "0 fall(s)". `pageCensus.walker` 14/14 |
| 4a | pool dominance, plain | `node scripts/census/pool-dominance.mjs` | nothing | none | exit 1: "0 over, 0 unregistered, 0 stale, 1 loose, 2 notes" |
| 4b | pool dominance, new rows | `--bank-new` | **nothing** ("0 new rows banked") | none | exit 0 |
| 4c | pool dominance, THE CHAIR'S PD2 | `node scripts/census/pool-dominance.mjs --tighten`, ONCE | `scripts/census/pool-dominance.register.json`: 19 top1 and 1 top5 ceilings lowered to the higher of the two corpora's readings (the loose `institutionServices:Fish market.Wholesale trade` 1 -> 0.9686 among them); 14 rows' line counts raised; 0 rows dropped (none no longer drawn), 0 added, 0 raised, 0 reasons changed | 0714ca487 | exit 0 ("948 pools written"). **The eleven PD1/PD3 rows: not one moved** (their ceilings already sit at their measure; `--tighten` takes `min(ceiling, higher reading)` and so cannot lower a ceiling below a measure: no contradiction arose). Verify (plain): "0 over, 0 unregistered, 0 stale, 0 loose, 2 notes" (the two notes on one corpus only). `poolDominance.walker` 17/17 |
| 5 | phone floors | `npx vitest run tests/components/phoneChromeFloor.census.test.js`, `tests/components/dossierPhoneFloorAllViews.test.jsx` | **nothing** (both green: no row moved) | none | 9/9, 2/2 |
| 6a | prose byte ratchet (PB1) | `npx vitest run tests/lint/proseCorpusBytes.test.js`; every leaf's bytes read against its row | **nothing**: every leaf's raw bytes EQUAL the predecessor's declared rows (defense 266746, economy 185744, general 298496, power 131321, stressors 147835, warFaith 180300; the rest unmoved): no leaf moved, no row appended | none | 18/18 |
| 6b | prose numerics | `npx vitest run tests/lint/proseNumerics.test.js` | **nothing** | none | 29/29 (no debt fell, none rose) |
| 7 | landing fixture | `node scripts/generate-landing-fixture.mjs --check` (exit 1, STALE), then `--seed lf-033 --emit` | `src/components/home/landingFixture.js`: ONE line, the weeks' advance trade line: "its market stalls stand half empty" -> "its traders have little to sell" (the close's declared move, 805452e8f) | 77b95c265 | landingFixtureFreshness 3/3, landingNarrationGrounding 4/4 |
| 2b | wiring census, THE CHAIR'S WC1 | `CONDITION_FACT_SIBLINGS` ruled out by name in `scripts/lib/table-pools.mjs :: NOT_TABLE_CHANNELS` (keyed by the condition's KIND `trade`, its texts functions of the town's name, the herald's condition deeds no enrolled table: the form of `HISTORY_DESC_SIBLINGS`; not a text-keyed `DECLARATION_CHANNELS` row; the choice said to the chair, stands, vetoable); then `node scripts/wiring-census.mjs`, `--check`, `npm run gen:dossier-prose -- --check` | the one row; the census wrote nothing new | e08876601 | all exit 0; `wiringCensusDeclared.walker` **9/9** |
| 8 | tuning inventory, lighting census | NOT RUN: held to the very last, after Part 2 (Parts 1b and 2 re-write test files, and `vendorPdfLazy`'s titles carry its budgets): the successor's, by TAIL-CLOSE-DOORS-1's rows 8a/8b commands | | | pending |

### The cross-check around the doors (three registers other seats keep)

| register | first reading (after the merge, before any door) | after the last door |
|---|---|---|
| `node scripts/presumed-things-door.mjs --check` | exit 1: "fresh 4 · stale 2 · first-register stale 0 · banked 4688 · strips fresh 0 stale 0 banked 107" (stale: `landingFixture.js` war; `priorityHelpers.js` house: criminal faction) | after door 7 and WC1 (not yet after the refreezes): exit 1, "**fresh 3** · stale 2 · ..." (the same two stale): **A FIGURE MOVED, fresh 4 -> 3**: door 7's re-emitted fixture no longer prints "market stalls"; told to the chair (the presumed seat's) |
| `node scripts/check-writer-reach.mjs` | exit 0: "WRWALKER HOLD — judged 12661 · LIT 691 · LIT-NAME 10563 · DARK 1407 (reviewable 389) · pending-surface debt: none" | the same, exit 0 (unmoved) |
| `node scripts/check-observed-shape-readers.mjs` | exit 1: 2 STALE ROWs (`institutionRoster.js` "_worldPulseInactive on institutions"; `settlementQuickGuide.js` "culture on settlement") | the same 2, exit 1 (unmoved) |

The successor runs the three once more after the refreezes (the last doors) and compares with the FIRST reading.

## PART 1b · THE TWO SIZE BUDGETS (re-recorded under the owner's word of 07:50 UTC, the chair's decision A; vetoable)

`npm run build` at the final tree (exit 0), read by `tests/build/vendorPdfLazy.test.js`'s own arms under `VERIFY_DIST=1`.
Commit **dfd45489c** (one commit; each figure beside a note in the file's re-record form; the ARCH car 2 pin of the three
literals moved with them).

| budget | old | new | difference | cause |
|---|---|---|---|---|
| first paint, raw (the entry's static closure) | 1,121,260 | **1,130,209** (measured) | +8,949 | the round's generator and data growth reaching the first paint, net of the trim of sixteen riders (e44d42aaf, on the line) |
| first paint, gzip companion | 357,225 | **360,052** (measured) | +2,827 | the same |
| first paint, Brotli companion | 299,985 | **302,161** (measured) | +2,176 | the same |
| the engine chunk's ceiling (strict bound) | 726,454 | **867,093** (measured 867,092 + 1) | +140,639 | the round's generator and data growth (the size measure read 865,589 at its earlier tree) |

Receipt: `VERIFY_DIST=1 npx vitest run tests/build/vendorPdfLazy.test.js` **55/55 GREEN** (before the re-record: 4 red, the
three closure arms and the engine ceiling); plain run 41 passed, 14 skipped (the dist-gated arms). Not bisected by merge point
at this pass.

## PART 2 · THE OWNER'S DOOR — STOPPED AT THE GOLDEN MASTER'S DRIFT CHECK (nothing re-taken)

**Method (the chair's, 12:04 UTC: a sample, paths only).** The golden master's last record is fce41f2b7 (STYLE-2-MERGE record 47,
2026-11-13); that tree reproduces its own manifest exactly (525 of 525 hashes). All 525 configurations were born at
fce41f2b7 and at the final tree and field-diffed (array indices collapsed): **525 of 525 move, 341 field paths**. The
chair's twelve keys (two of each tier; the town's frontier and plagued rows for the crises):
[`probes/TAIL-CLOSE-DOORS-2/gm-sample12-paths.txt`](../probes/TAIL-CLOSE-DOORS-2/gm-sample12-paths.txt) (232 paths in
their union). Each moved FAMILY was then located by the first-parent commit that moved it (the line's 397 first-parent
commits since fce41f2b7, 27 keys, a per-family hash at each point:
[`gm-attrib.txt`](../probes/TAIL-CLOSE-DOORS-2/gm-attrib.txt); the scripts beside it). The families against the brief's
list: [`gm-families-12.tsv`](../probes/TAIL-CLOSE-DOORS-2/gm-families-12.tsv) (ON/OFF, the paths, the commits).

**ON THE LIST (36 families, every one a declared move of the brief or of the hand-backs it names):** stress/stressors
summary, cast, crisisHook; institutions[].desc; relationships[].tension, proseVariant, description; npcs[].plotHooks,
presentation, secret, structuralPosition, title, goal; history.* (founding reason/founder/stressNote, historicalEvents,
currentTensions, siegeNarrative, eventsTimeline, legacyAnnotations); powerStructure.factions, factionRelationships;
economicState.safetyProfile, localProduction, foodSecurity, incomeSources, economicComplexity, primaryExports; arrivalScene;
availableServices.*; defenseProfile.scores; activeConditions; settlementReason; pressureSentence; resourceAnalysis.gaps,
exports, strategicValue; economicViability.issues, plotHooks.

**OFF THE LIST (62 families) — THE STOP.** No field of the brief names them; every one traces to a landing of the round:

| families (12-key union) | first moved at (first-parent) | the landing |
|---|---|---|
| **the NPC roster itself**: npcs[] length, name, id, gender, physical, personality, category, importance, influence, institution, memberships, power, role, structuralRank, activeConstraint, settlementCondition; relationships[] from/to/id/npc1Name/npc2Name/roles/type/typeName/archetypeKey/strength; prominentRelationship.*; conflicts[].* (desc, issue, parties, plotHooks, stakes); powerStructure.conflicts; generationCoherenceReceipt.judgments | **bea2a1298** (then 474c5f966, cf3a0352b, 718985525, 5d1e3096b ...) | JOIN-1 · 4, lane/powers-follow-up-2026-11-13 at 3909655c3 (JOIN-1's hand-back: class B "registered golden surfaces declared moved"; "powers' minted lords"): **272 of 525 towns re-draw their people** (e.g. `city|arabic|coastal|port|civilized|golden-master-v3`, `metropolis|arabic|coastal|port|civilized|golden-master-v3`, `town|arabic|coastal|port|civilized|golden-master-v3`) |
| culturalIdentity.foodways, architecturalDetail; economicState.activeChains, tradeDependencies; defenseProfile.institutions | 8f222ff87 (and e9601b6b3) | JOIN-1 · 5 lane/w2-fix-data-2026-11-13; JOIN-5 · 2 the same lane |
| defenseProfile.readiness, economicGates; economicState.compound, prosperityStanding; powerStructure.publicLegitimacy; simulationTrace.causes | 33b12cbef, 65dc92af9, b61143029 | JOIN-1 · 9 lane/coherence-upkeep-2026-11-12 (the defence lane); JOIN-4 · 2 upkeep-monotone (the defence rating's rebuild); JOIN-4 · 3 coherence-upkeep (the income rows) |
| institutions[].tags; resourceAnalysis.exploitation | e7e1c2e8c | JOIN-4 · 5 lane/w2-fix-data-2026-11-13 |
| economicState.institutionalServices; resourceAnalysis.availableResources; economicViability.metrics | becdc010c, 3e482b329, 26c3dc456 | JOIN-7 · 8 / JOIN-8 · 19 tail-defecon-c; JOIN-9 · 14 tail-defecon |
| powerStructure.recentConflict | 475506bf7 | JOIN-8 · 25 tail-powers |

These look like the round's own landings' moves (JOIN-1's and JOIN-4's hand-backs class the golden as declared moved by
those lanes), but the brief's list does not name their fields, and by the brief ("A FIELD THAT NO DECLARED MOVE NAMES IS A
REGRESSION, NOT A REFRESH: STOP") and the chair's 12:04 word ("it stops you until it is named by a declared move or told to
me") **nothing of Part 2 was re-taken**: the golden master, its isolation twin, editWorldFactResources A2/A6/row 21 and
every pin that reads the golden wait on the chair's naming. Told to the chair in one line.

**Read for the successor (no re-take done):** the five generator pins: `pipelinePinnedMode`, `pipelinePinnedChoosers`,
`nameHeldThroughAssembly`, `rosterFinalUnderHeldRoster` read `tests/fixtures/generator-golden-master.json` (they follow the
golden master); `upkeepVocation` does not. Every golden write goes through `tests/helpers/goldenRecordDoor.js`: a signed
record under `docs/shift-records/` named by `GOLDEN_SHIFT_SIGNED` (fields ownerWords, ownerDate, odqRow "§...", cause, seat,
surfaces[{surface, action 're-record', predictedRows, proofForm}]), a clean tree, a deliberate throw on success, the commit
trailer `Owner-Signed: §934.105`; a new record file moves `sourceCitationIntegrity.walker`'s tree count (180) by one.

## PART 3 · THE RECEIPT

Not run (the successor's, after Part 2 and the refreezes).

## WHAT IS LEFT, IN ORDER (for the successor, from this tip)

1. The chair's naming of the 62 off-list families above (or its instruction); then Part 2 as the brief gives it: one signed
   shift record; the golden master first (`GOLDEN_SHIFT_SIGNED=<record> UPDATE_GOLDEN=1 npx vitest run
   tests/property/generatorGoldenMaster.test.js`, predictedRows 525), its isolation twin and editWorldFactResources row 21
   with it; then the driven corpus, the PDF snapshot and the desk hash, the pins and counts of section 5, the prose pins
   (ii), JOIN-9/10/11's pins (iii); `worldFactRederive` green after the golden (iv).
2. LAST, on a clean tree: the tuning refreeze then the lighting refreeze (TAIL-CLOSE-DOORS-1 rows 8a/8b).
3. The three cross-check registers again, against the first reading above.
4. Part 3, the receipt.

**JOIN-9/10/11's list for the close, items that are not a pin or a count (named, not touched):** the declarations
`docs/census/declarations/*.json` "re-derived once at the close" (institutionDescVariants, npcData.STRESS_ECONOMIC_EFFECTS,
POLITICAL_FLAVOR, PRESSURE_SENTENCES, SPATIAL_TEXT, INSTITUTION_SERVICES, ARRIVAL_SCENES, STRESS_DESCS,
stressInstitutionEffects, npcData.NPC_CRIMINAL_SECRETS); `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` "measured at the
close"; the files "read at the close" (foodBalance.js, economicState.js, institutionServices.js, journalPages.js,
DefenseSecurity.jsx, governanceAccount.js; the test files merged clean though both sides moved them); the carried reds
(coherenceAgreeCures, w2FixData6Rows, journalMarksCrisisRows, tailDisplayCivic3V1, canonicalRowsDeclared,
vocabularyPageFindings, r3c9ReaderLinesTrue, factLayers, defenceFactReaders).

## FOR THE OWNER, IN PLAIN WORDS

Refreshed at this pass: the generated edge bundles, the wiring census's one figure, the pool-variety ceilings (lowered to
today's measure, none raised), the landing page's sample town (one line: "its traders have little to sell" where no market
stands), and the two size budgets (first paint 1,121,260 -> 1,130,209 bytes; the engine chunk's ceiling 726,454 -> 867,093),
each vetoable: a veto of a change reverts that change and these figures are refreshed again. **The stored reference
snapshots (the golden master and its family) were NOT refreshed**: the measured drift includes whole groups of fields,
most of all the town's cast of people re-drawn in 272 of the 525 sample towns, that the list of declared changes does not
name; they wait on the chair's word.
