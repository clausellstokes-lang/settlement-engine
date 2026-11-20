# CONFLICT-MEASURE — `powerStructure.recentConflict`, measured and a draft proposed

DEPTH-2's measuring helper, 2026-11-20, brief `docs/chair/2026-11-20/content/depth/briefs/MEASURE-CONFLICT.md` (7fdc73bbb).
Base `105ceb55f`, scratch worktree, nothing pushed, no file under src/ or tests/ on any branch. Probe: two DETACHED commits
`2e50f1228` → `e0ce25807` (the second rewords one draft, below), whole diff from the base in `probe-conflict.patch`.
Every figure comes from a script in this folder, run with its output written to a file. The `.out.txt` files hold those outputs.

**Births.** `birth.mjs <tree> <out.jsonl> 100` uses the same birth and masker as `depth/measure/born.mjs` (seeds `hxd-<size>-0..99`,
600 places). The chair's own script is NOT on origin/lane/chair-2026-11-08: `docs/chair/2026-11-20/seventh/measures/recent-conflict/`
does not exist on that branch at `25ca2f94a`, so the births were made fresh as the brief allows. Each row records the stored
sentence, its masked form, the roster's names, and every vocabulary atom answered on the FINAL record (`factsOf(t)`), at the SITE
(roster and tier, which is what `resolveSibling` reads today) and at the SITE WITH CONFIG (roster, tier and config).

## 1. Which rung each stored sentence came from (`rungs.mjs`, `rungs.before.out.txt`)

Each rung is identified by its own words (twins and the rewriter included). A sentence that no rung says counts as OVERRIDDEN by a primary stress narrative. An `infiltrated` place
prints its baseline, so it counts under its rung.

| rung (`deriveBaselineConflict`'s condition) | thorp | hamlet | village | town | city | metro |
|---|---|---|---|---|---|---|
| `default: noGrazingQuarrel \|\| grazing` (GRAZING) | **60** | **49** | **46** | 0 | 0 | 0 |
| `hasMarketInstitution` (FIELD ROTATION) | 0 | 2 | 15 | 0 | 0 | 0 |
| `(hasCivicInstitution \|\| hasUrbanCommerceInstitution) && hasLiveMarket` (LEVIES) | 0 | 0 | 0 | **60** | **57** | **57** |
| `monsterThreat === 'plagued'` | 10 | 16 | 10 | 10 | 0 | 0 |
| `institutionFlags.militaryEffective > 68 && !seatIsMilitary` | 0 | 0 | 0 | 3 | 20 | 12 |
| every other rung (stateCrime … economyOutput > 68) | 0 | 0 | 0 | 0 | 0 | 0 |
| OVERRIDDEN by a primary stress narrative | 30 | 33 | 29 | 27 | 23 | 31 |
| **top share of one masked sentence** | **52** grazing (thorp twin) | **49** grazing | **44** grazing | **58** levies | **52** levies | **52** levies |

All eleven upper rungs print nothing in these 600 places. On the default DEFAULT_CONFIG births the ladder is three rungs and the stress.
The chair's 50-place figures fall inside these (thorp 27/50, town 31/50).

**A fact the brief does not state:** the stored levies sentence is never the ladder's own line. In 174 of 174 places
`factionDynamics.js :: boycottReadsRelation` (called by `rulingStructure.js :: generatePowerStructure`) replaces its last two sentences:
"<the power> has been debating market levies for three months. The merchants have argued against every one of them, and nothing has
been settled yet." The text "stopped attending the sessions" is printed nowhere in the 600.

## 2. Every reader of `recentConflict` (by `path :: symbol`)

The census is grep over src/, scripts/ and tests/ for `recentConflict`, plus the lines' own words ("grazing rights", "market levies", "field
rotation", "stopped attending"). There are **31 readers**. Here "breaks" means a test or lint that went red when run against the probe, or a
display that is computed at render time and that the stored-record diff in §4 cannot see.

| # | reader (`path :: symbol`) | what it reads | prints / matches | a new sentence breaks or needs |
|---|---|---|---|---|
| 1 | `src/components/new/SummaryTab.jsx` (summary paragraph, ~l.39–45) | the field, verbatim | prints (it appends `'.'` after a sentence that already ends in one, so ".." was seen in the code but not measured) | nothing |
| 2 | `src/components/new/SummaryTab.jsx` (Power & Conflict box, l.256) | the field | prints (Summary tab) | nothing |
| 3 | `src/domain/display/governanceAccount.js :: governanceAccountOf` (step 5, the vignette) | the field | prints as the event sentence or the fallback | nothing (new text prints) |
| 4 | `src/components/new/powerDeskRead.js :: governanceAccountRead` | #3 | prints the governance paragraph (Power tab) | nothing |
| 5 | `src/pdf/sections/PowerStructure.jsx` | #3 | prints (PDF) | nothing |
| 6 | `src/generators/narrativeGenerator.js :: generatePressureSentence` | the field, as its fallback | composes `pressureSentence` (moved: 6 golden, 37 census) | nothing, it is a composed string |
| 7 | `src/domain/summary/tonightSheet.js` (`opening`) | `pressureSentence` | prints (the calm place's session sheet) | nothing, it moves with #6 |
| 8 | `src/domain/summary/settlementQuickGuide.js`, `OverviewTab.jsx`, `QuickInspector.jsx`, `pdf/sections/Overview.jsx`, `foundry/journalPages.js`, `utils/generateWorldBook.js`, `utils/generateCampaignPDF.js` | `pressureSentence` | prints | nothing |
| 9 | `src/pdf/lib/viewModel.js` (`recentConflict:` l.533) | the field | carried (no reader in src/pdf by that name) | nothing |
| 10 | `src/generators/historyGenerator.js :: buildHistoryContext` | the field | carried into ctx (no reader of it found) | nothing |
| 11 | `src/components/new/tabs/RelationshipsTab.jsx` (`conflictsElsewhere`) | presence only | no | nothing (never empty after) |
| 12 | `src/domain/display/stateProse/powerStateProse.js :: stabilityLensPoolKey` (+ `data/dossierStateProse/power.generated.js`, `data/proseNorms.generated.js`, `tests/lint/factLayers.poolTable.json` "DS-POW-2::recentConflict present") | presence only | lens key | nothing |
| 13 | `src/generators/factionDynamics.js :: boycottReadsRelation` | the levies line's exact second and third sentences (`BOYCOTT`) | rewrites them | the drafts pass through untouched; only `l1` keeps the rewrite |
| 14 | `src/generators/power/governanceNarrative.js :: rewriteFactionPhrasing` | `the council`, `council meetings`, `the watch`, `the garrison`, `grain merchants`, `the healers` | rewrites | **a draft must not say "the council meetings"**: the probe's first granary draft printed "the City The City Council's meetings" (fixed in e0ce25807). `l6` "The council wants" and `l5` "the watch" rewrite cleanly |
| 15 | `src/data/powerSiblings.js :: BASELINE_CONFLICT_SIBLINGS` | today's grazing text as a key (the thorp twin) | resolves | `g1` keeps today's text byte for byte, so the twin still fires |
| 16 | `src/data/powerSiblings.js :: noGrazingQuarrelOf` (via `rulingStructure.js`) | the place's grounds | replaces the grazing line | the probe applies it only when `g1` is picked |
| 17 | `src/domain/factionRename.js` (`rewriteProse` on `powerStructure.recentConflict`) | power names inside the prose | rewrites | nothing |
| 18 | `src/domain/rulingPower.js :: transferRulingPower` | none: it overwrites the field | writes | nothing |
| 19 | `src/domain/display/guardLineUnderTheLaw.js :: familiesHeldOf` | `FAMILIES_NAMED` (`famil…\|noble…\|clan…\|elder…`) over JSON that includes the field | **matches words** | **may move a display string**: the grazing line's "families" is gone in up to 56 of 600 (hamlet 18, village 33, city 5; `families.out.txt`; an upper bound because the factions, conflicts and tensions are not in these rows), so the guard line's "oldest families" twin can now fire there. This is computed at render time and was not measured |
| 20 | `tests/helpers/pageLaws/lowFamiliesI.mjs` (`low.hook-party`) | the same words, same JSON | matches words | can raise a new "old families" finding in the same places |
| 21 | `tests/helpers/pageLaws/law15K.mjs` (`15b.grazing`) | "dispute over grazing rights" | matches words | fewer instances, no new finding |
| 22 | `src/domain/simulationSpine.js` | deliberately NOT read (comment l.551) | no | nothing |
| 23 | `scripts/audit/soak-review/checks.mjs` (`said('record:powerStructure.recentConflict')`) | migration-direction words | matches words | nothing (no draft says arrive or leave) |
| 24 | `src/domain/prose/holderTable.js` (`recentConflict` row) and `scripts/.writer-reach-baseline.json` | cites the writer by symbol | registers | nothing |
| 25 | `tests/lint/presumedThings.walker.test.js` (registers `presumedThings*.register.json`) | the source literals | lint | **RED on the probe**: the tavern draft is flagged as `house: tavern` undeclared even though it declares `institution: tavern`. The atom the walker expects needs reading |
| 26 | `tests/lint/presumptionClasses.walker.test.js` (`presumptionClasses.register.json`) | the source literals | lint | **RED on the probe**: `l5` (office "watch") and the field-rotation copy in powerSiblings.js (resource), plus the probe's one-line wiring (a stale row, `governanceNarrative.js office b20c525896500e37`). A build must declare what these classes ask for and keep the literal where its row is |
| 27 | `tests/generators/power/conflictLadderReadsRoster.test.js` | LEVIES / LEVIES_SETTLED / grazing on named seeds | quotes | **RED** (2 tests: the seeds now pick another line) |
| 28 | `tests/generators/bar3PowersLines.test.js` (C27440, r2r-town-2/-20) | the boycott sentence | quotes | **RED** (2) |
| 29 | `tests/generators/power/tailPowers3Conflict.test.js` (r2r-city-6) | "…Council has been debating market levies" | quotes | **RED** (1) |
| 30 | `tests/generators/bar8Powers.test.js` (15b, "the places that graze keep it") | the grazing words | quotes | **RED** (1) |
| 31 | `tests/property/generatorGoldenMaster.test.js` | the whole birth | golden | not run: it moves by construction (§4: 278 golden strings) |

The following quote the line or read the field and stay GREEN on the probe: `tests/generators/governanceNarrative.test.js`, which calls
`buildGovernanceLabels` with no active rng, so the probe keeps index 0 by construction, the same rule as `safetyProfile.js :: voiceOf`; and
`tests/generators/power/tailPowers4Batch1.test.js`. `tests/property/espionageDormancyFence.test.js` was already red at the base (the
control, `tests.base.out.txt`: 1 failed of 142 at 105ceb55f, against 10 failed on the probe, `tests.probe.out.txt`, every GIT_* variable unset).
Other files quote the words as literal input and do not read the field: `simulationSpine.test.js`, `namesInSentences.walker.test.js`,
`vocabularyPageFindings.test.js` and `relationshipsEmptyTensions.test.js`.

## 3. The facts a quarrel can stand on, by size (`atoms.mjs`, `atoms.before.out.txt`)

Each cell is the share of the 100 places, read at the SITE WITH CONFIG. Where the final record differs by more than 5, it is shown as `site|final`, and `?` means unanswered at the site.

| atom | thorp | hamlet | village | town | city | metro |
|---|---|---|---|---|---|---|
| institution: mill | 0 | 0 | 100 | 100 | 100 | 100 |
| institution: granary | 0 | 0 | 0 | 100 | 100 | 100 |
| institution: tavern | 0 | 34 | 36 | 100 | 100 | 100 |
| institution: smith | 0 | 17 | 25 | 45 | 86 | 97 |
| institution: docks | 0 | 0 | 0 | 26 | 44 | 40 |
| temple / sacredHouse | 21 | 16 | 100 | 100 | 100 | 100 |
| walls (palisade below town) | 26 | 25 | 16 | 64 | 100 | 100 |
| gate | 0 | 0 | 0 | 64 | 100 | 100 |
| watch | 0 | 0 | 4 | 100 | 100 | 100 |
| militia | 21 | 27 | 17 | 0 | 0 | 0 |
| court | 0 | 0 | 0 | 100 | 100 | 100 |
| market | 0 | 5 | 26 | 100 | 100 | 100 |
| guild | 0 | 0 | 0\|21 | 100 | 100 | 100 |
| river · coast · navigable | 25·14·39 | 19·17·36 | 29·16·45 | 20·14·34 | 29·21·50 | 30·15·45 |
| route: road · crossroads · isolated | 40·13·14 | 32·19·17 | 34·16·15 | 57·16·0 | 34·20·0 | 52·8·0 |
| trade at work: dairy | 35 | 27 | 21 | 0 | 0 | 0 |
| own plots | 100\|85 | 100\|88 | 0 | 0 | 0 | 0 |
| food surplus, imports, exports, iron at hand, stores | site 0 or `?`: the site has no food or trade record | | | | | |
| *(names only; not vocabulary)* "Water source" / "Multiple water sources" | 100 | 100 | 100 | 100 | 0 | 0 |
| *(names only)* "Access to external mill" | 100 | 100 | 0 | 0 | 0 | 0 |
| *(names only)* "Common grazing land" | 0 | 100 | 100 | 0 | 0 | 0 |
| *(names only)* bridge / ford · ferry | 0·0 | 0·0 | 4·30 | 21·22 | 59·26 | 86·29 |

Shares within each branch are in `atoms.before.out.txt`, which has the same table for the GRAZING+FIELD places and for the LEVIES places.
**The site's facts today are the roster's names and the tier only**: terrain, route and water go unanswered there. The probe adds the
`config` that `buildGovernanceLabels` already receives (`factsOf({ institutions, tier, config })`). `own plots`, `food surplus`,
`imports` and `iron at hand` read differently at the site than on the final record, so no draft needs them (the birth self-check
re-asserts against the final record).

### The 16 DRAFTS (`drafts.mjs`; the probe's `QUARREL_POOLS`)

These are drafts for the integrator to read. Index 0 of each pool is today's line. The keyed pick is the argmax of
`hashKey(seed::governanceNarrative:<POOL>::<id>)` over the lines whose needs hold. The seed is the active stream's, read without a
roll (`voiceOf`'s idiom). With no seed, index 0 is kept. `drawDeclared` notes each pick in the ledger.

**GRAZING pool.** It serves the field-rotation rung and the default rung. "elig." is the number of that branch's places (thorp 60, hamlet 51, village 61) where the line's needs hold.

| id | draft | needs | elig. t/h/v |
|---|---|---|---|
| g1 | *today's* "A dispute over grazing rights and water access has run for two seasons, and the families on each side no longer speak to one another." (the thorp twin and the no-grazing twin are unchanged) | — | 60/51/61 |
| g2 | *today's* "A dispute over field rotation and grazing rights has divided the village for most of this season." | `tier: village` (today it also printed in 2 hamlets) | 0/0/61 |
| g3 | The miller wants a bigger share of each sack for the grinding, and the households who bring their grain say the old share was fair. | `institution: mill` | 0/0/61 |
| g4 | The households along the road cannot agree who should fill the ruts outside their doors, so the work keeps being put off. | `route: road` | 25/16/22 |
| g5 | The households nearest the river and those further off disagree over who may draw water first in the dry weeks. | `river` | 18/7/18 |
| g6 | Two households both claim the same stretch of shore, and neither will give way. | `coast` | 8/8/8 |
| g7 | Two households graze their cows on the same patch of grass, and each says the other's beasts take more than their share. | `trade at work: dairy` | 19/12/15 |
| g8 | With the nearest market days away, the households argue over whose turn it is to make the long trip. | `route: isolated` | 9/9/10 |

**LEVIES pool.** "elig." counts town 60, city 57 and metro 57.

| id | draft | needs | elig. t/c/m |
|---|---|---|---|
| l1 | *today's* "The council has been debating market levies for three months. The merchants have stopped attending the sessions. Both sides are now acting as if the other has already lost." (boycott rewrite kept) | `market` | 60/57/57 |
| l2 | The millers have raised the charge for grinding, and the households who bring their grain say the old charge was fair. | `institution: mill` | 60/57/57 |
| l3 | How much grain the granary should hold back for the winter has been argued all season, and nothing is agreed. | `institution: granary` | 60/57/57 |
| l4 | Who should pay to mend the walls has been argued since spring, and every street says the next one should pay more. | `walls` | 37/57/57 |
| l5 | Everyone agrees the watch must be paid, but no one agrees how much each household should give. | `watch` | 60/57/57 |
| l6 | The council wants the taverns closed earlier, and the tavern keepers say an earlier hour would ruin them. | `institution: tavern` | 60/57/57 |
| l7 | The smiths start their hammering before dawn, and the households beside the forges want them moved further out. | `institution: smith` | 27/50/55 |
| l8 | The dock dues were raised at the start of the season, and the boat owners have complained of it ever since. | `institution: docks` | 16/22/24 |

### Top share by size: before, projected and measured

"Projected" is from `project.out.txt` (keyed by the birth seed). "Measured" is from the probe's own 600 births (`measured.out.txt`). Each figure is the top share of any one masked sentence among all 100 places of the size.

| size | before | projected | **measured (probe)** | the top sentence after |
|---|---|---|---|---|
| thorp | 52 | 24 | **21** | grazing (thorp twin) |
| hamlet | 49 | 33 | **32** | grazing |
| village | 44 | 13 | **18** | field rotation (17 grazing) |
| town | 58 | 12 | **11** | granary (l3) |
| city | 52 | 19 | **19** | "The military commanders are pushing…" (militaryEffective rung; outside both branches. Levies is 10 at most) |
| metropolis | 52 | 11 | **11** | millers (l2) / walls (l4) |

**The ~15% target is NOT met in thorps (21) or hamlets (32) using only today's vocabulary.** The facts that EVERY thorp and hamlet
holds are "Water source", "Access to external mill" and (in hamlets) "Common grazing land". The roster names all three, but none has a
vocabulary atom: `institution: mill` excludes an access row. Two further lines on those two facts, read by name in the hypothetical
`project-newvocab.mjs`, would give thorp 16, hamlet 16 and village 12. That requires new vocabulary, which is on the owner's veto list.
The city's 19 belongs to another rung that the brief does not cover.

## 4. What moves (the probe through the two-tree tool and `nonstring.mjs`)

Command: `trees.mjs 105ceb55f e0ce25807 <scratch>/trees --words=none`, run from the scratch worktree with the tool copied from
origin/lane/names-3-2026-11-20 (`trees.out.txt`). Then `depth/measure/nonstring.mjs born-105ceb55f born-e0ce25807` (`nonstring.out.txt`).

| corpus | documents | identical | non-string differences | differing strings |
|---|---|---|---|---|
| golden 525 | 525 | 253 | **0** | 278: `powerStructure.recentConflict` 272, `pressureSentence` 6 |
| census 720 | 720 | 646 | **0** | 111: `powerStructure.recentConflict` 74, `pressureSentence` 37 |

`nonstring.mjs` prints **0 lines**: no number, key, length or type moved. In the stored record, the only things that moved are
`recentConflict` and `pressureSentence`, which is composed from it (#6). No roll was added: the pick reads the stream's seed and does not draw.
**Moves the tool cannot see**, because they are computed at render time: the governance paragraph (#3–5), the session sheet's opening (#7)
and the Summary tab (#1–2) print the new words, which is intended. The guard line's families twin (#19) is the one display string NOT composed from
`recentConflict` that can move: up to 56 places lose the word "families" that its matcher reads. It was not measured. `run.mjs … render` would show it.

## Things that contradict the brief

1. The chair's recent-conflict script is absent from origin/lane/chair-2026-11-08, so the births were made fresh with born.mjs's birth and masker.
2. The stored levies sentence is always the boycott REWRITE, never the ladder's own words (§1).
3. The site reads only the roster and the tier. Terrain, route and water need `config` passed in, which the probe does.
4. The 15% target cannot be reached for thorps and hamlets with existing atoms (§3). The city stays at 19 because of the military rung.
5. `rewriteFactionPhrasing` garbles "the council meetings". The draft avoids it, but the trap stays for any future line.
