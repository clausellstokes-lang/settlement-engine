# PLACE-1 MEASURE — `economicState.safetyProfile.safetyDesc` (the Defense tab's safety line)

Measured 2026-11-20 at df3b1f1a8 (the lane's tip; code as at 43ab0f5eb) by a MEASURE builder for PLACE-1, under
`BRIEF-MEASURE-COMMON.md` and `BRIEF-MEASURE-safetyDesc.md`. No file under `src/` or `tests/` was changed.

Every figure below is re-runnable from `docs/chair/2026-11-20/content/place/tools/safetyDesc/` (run each from that directory):

| script | what it makes | output (committed) |
|---|---|---|
| `node --import ./tap-register.mjs measure.mjs <repo> 100 > out/births.jsonl` | the 600 births (the census's birth and mask lines, verbatim), each with the WRITER's call(s) as a read-only tap saw them (`tap-hooks.mjs` rewrites the module in memory to hand out its arguments; it adds no draw) | `out/births.jsonl` is NOT committed (3.7 MB, about 2 minutes to remake) |
| `node analyze.mjs > out/analyze.txt` | sections A and C | `out/analyze.txt` |
| `node --import ./tap-register.mjs project.mjs <repo> 100 > out/project.txt` | section E: the candidate composer (`composer.mjs`, section D row for row) simulated at the writer | `out/project.txt` |
| `render-player.mjs`, `prove-prints.mjs` (commands in section 0) | section 0: the field found on a rendered surface, DM and player view | `out/prove-prints.dm.txt`, `out/prove-prints.player.txt` |

The tap moves no birth: the chair's own figures reproduce exactly on the first 50 a size (thorp 28/50, town 16/50, city
33/50; `out/analyze.txt`, "the chair's figure reproduced").

---

## 0. THE FIELD PRINTS (the chair's rule of 16:25 UTC)

**Yes. Surface: the Systems group › Defense tab, the "Criminal Architecture & Public Order" block, in BOTH the DM (owner) view
and the player view**, the whole stored line and its first sentence alike, on all three places rendered (a Moderate thorp, a
Moderate town, an Unsafe city: one each of the three readings this measure proposes for).

Commands (from the repository root; the places are born fresh by the census's own `configOf`, rendered through the real
`OutputContainer` and walked by the page census's `walkDossier`, every group, sub-tab and disclosure):

    node docs/chair/2026-11-20/content/tools/confinement/run.mjs <repo> <out-dm> render --workers=3 --seeds=r2r-thorp-0,r2r-town-0,r2r-city-0
    node docs/chair/2026-11-20/content/place/tools/safetyDesc/render-player.mjs <repo> <out-player> r2r-thorp-0,r2r-town-0,r2r-city-0
    (cd docs/chair/2026-11-20/content/place/tools/safetyDesc && node prove-prints.mjs <repo> <out-dm>/views > out/prove-prints.dm.txt \
       && node prove-prints.mjs <repo> <out-player>/views > out/prove-prints.player.txt)

`render-player.mjs` is the confinement renderer with one prop changed (`playerView`), nothing else. Results
(`out/prove-prints.dm.txt`, `out/prove-prints.player.txt`):

| place | label | stored line (head) | DM view (22 surfaces walked) | player view (20 walked) |
|---|---|---|---|---|
| r2r-thorp-0 | Moderate | "The neighbours keep an eye on one another, …" | Systems/Defense | Systems/Defense |
| r2r-town-0 | Moderate | "A mix of safer and more exposed areas. The watch covers …" | Systems/Defense | Systems/Defense |
| r2r-city-0 | Unsafe | "Crime is a persistent and visible problem. The garrison is overwhelmed or corrupt. …" | Systems/Defense | Systems/Defense |

No other surface prints it (the printed export holds the path EXCLUDED, section B).

---

## A. THE BRANCHES

**The writer:** `src/generators/safetyProfile.js :: generateSafetyProfile`. It is called by
`src/generators/economy/economicState.js :: generateEconomicState` (the stored call) and again by
`src/generators/servicesGenerator.js :: generateAvailableServices` (whose result is used only for its crime types). In 101 of
the 600 births `src/generators/steps/economyReconcilePass.js` re-derives the economy (`computeEconomyState`), and that later call's
line is the stored one. After the writer, one pass rewrites the field: `src/generators/safetyLineTruth.js :: settleCrimeWaveLines`
(called from `safetyProfile.js :: settleCrimeLinesToSignal`, at `steps/assembleSettlement.js`), which swaps the Safe opening and the
occupation sentence for their crime-wave twins (`CRIME_WAVE_TWINS.safetyDesc`). On the 600 the stored line equals the last writer
call's in 599; the one other is that crime-wave twin (hxd-city-56).

The branches, each with its condition in one sentence (`effectiveSafety` = max(military ÷ criminal, the small place's community
bonus, the court floor)):

| # | branch | condition | its sentences (and declared twins) |
|---|---|---|---|
| 1 | strains | some stress is active (occupied, siege, famine, plague; else any of ten secondary ones) | each stress's line, joined; four resolve through `SAFETY_LINE_SIBLINGS` by `said` → `drawDeclared.js :: resolveSibling` (succession, migration, insurgency, revolt), the siege line's no-force clause is `SIEGE_NO_FORCE_ORDER` |
| 2 | state crime | no strain; the stress flags say the state preys | "… unusually quiet." (twin "The place is …" below a village, through `SAFETY_LINE_SIBLINGS`), the garrison or armed officials, fixed tail |
| 3 | criminal government | no strain; crime is the government | fixed, the guild or organised crime, a garrison note |
| 4 | Very Safe | `effectiveSafety` ≥ 3.5 | "Visitors can walk anywhere …" + the force; walls (`GATES_KEPT_SMUGGLERS_BENEATH`, or the gates line → twin " The walls leave few ways in."), charter hall (twin), monster threat (`MONSTER_THREAT_NO_DRILL`) |
| 5 | Safe | ≥ 2 | "Crime exists but is well-managed." + who keeps order + foothold (`footholdWord`) + court + walls; assembly's crime-wave twin; at render `guardLineUnderTheLaw.js :: safetyLineAsPrinted` re-reads its foothold clause and its militia |
| 6a | Moderate, thorp or hamlet | ≥ 1.2 and the tier is thorp or hamlet | `TINY_MODERATE_LINE` + the wall note |
| 6b | Moderate, village and up | ≥ 1.2 | "A mix of safer and more exposed areas." + {garrison patrols · watch covers · militia volunteers patrol · locals watch over} "the main paths; quieter spots after dark carry genuine risk." + "Residents know which corners to avoid." + the wall note |
| 7 | Unsafe | ≥ 0.6 | "Crime is a persistent and visible problem." + the force (5 ways) + the travellers' advice (its siege twin declares `crisis: siege`) + walls |
| 8 | Dangerous | below 0.6 | "Violence and theft are routine." + the force (5 ways) + self-help (small-place twin) + court + walls |

**Shares by size**, 100 places a size (seeds `hxd-<size>-0..99`; `out/analyze.txt`, "branches by size"):

| branch | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| 6a Moderate, small place | **67** | **64** | 0 | 0 | 0 | 0 |
| 6b Moderate, locals | 0 | 0 | **57** | 0 | 0 | 0 |
| 6b Moderate, militia | 0 | 0 | 9 | 0 | 0 | 0 |
| 6b Moderate, watch | 0 | 0 | 3 | **60** | 0 | 0 |
| 6b Moderate, garrison | 0 | 0 | 0 | 13 | **58** | **67** |
| 7 Unsafe | 0 | 1 | 0 | 0 | **18** (all garrison) | 1 |
| 1 strains (14 kinds) | 30 | 33 | 29 | 27 | 23 | 32 |
| 8 Dangerous | 3 | 2 | 2 | 0 | 0 | 0 |
| 5 Safe | 0 | 0 | 0 | 0 | 1 | 0 |
| 2, 3, 4 | 0 | 0 | 0 | 0 | 0 | 0 |

**The repeated whole line and the repeated first sentence, separately** (masked as the census masks):

| size | whole line, top | first sentence, top | any sentence, top |
|---|---|---|---|
| thorp | 48 "The neighbours keep an eye … soon hears of." | 67 (the same) | 67 |
| hamlet | 48 (the same) | 64 | 64 |
| village | 56 "A mix … Locals watch over … corners to avoid." | 69 "A mix of safer and more exposed areas." | 69 |
| town | 43 "A mix … The watch covers … The walls keep the trouble inside, off the roads beyond." | 73 "A mix …" | 73 ("A mix …" and "Residents know which corners to avoid.") |
| city | 58 "A mix … The garrison patrols … The walls keep …" | 58 "A mix …" | 58 (four sentences at 58 each) |
| metropolis | 66 (the same) | 67 "A mix …" | 67 |

Per sentence-slot (branch 6b's four slots; `out/analyze.txt`, "sentence SLOTS"): the opening holds 58–73 a size; the force slot
57–66 in its one force per size (watch in towns, garrison in cities and metropolises, locals in villages); "Residents know which
corners to avoid." 58–73; the wall note 48 (town), 58 (city), 67 (metropolis), and in the small places 19 (thorp) and 16 (hamlet).
**The branches above the bar are therefore 6a, 6b (every slot), and 7 in the city (18 cities print one whole line).** The strains
spread across fourteen stresses and stay under it (the highest, a metropolis's succession line, 7).

## B. THE READERS

Grep of `safetyDesc` and of each repeated sentence's words over `src/`, `tests/` and `scripts/` (37 files hold the field name).
The brief's first list named `EconomicsTab.jsx` and `dossierStateProse/economy.generated.js`: neither reads this field (both read
`economicDragDesc`).

**(i) Who PRINTS it**

| reader | what it does | if the sentence changes |
|---|---|---|
| `src/components/new/tabs/DefenseTab.jsx` (the Defense tab's "Criminal Architecture & Public Order" block) | prints `deriveSafetyLine(r)` | prints the new sentence; nothing else moves |
| `src/domain/display/defenseDisplay.js :: deriveSafetyLine` | the printed line: a DM's edited line by identity, else `safetyLineAsPrinted` | see (ii) |
| `src/domain/display/stateProse/defenseStateProse.js :: defenseStateProse` (DS-DEF-3) | hands the field back BY IDENTITY (`dmFieldProjection.js :: projectBesideDmField`) and prints a corpus line BESIDE it, keyed by the LABEL, not the words | nothing moves; coupling: the Moderate pool's vid 3 ("Visitors … are told which few streets to avoid") restates today's "Residents know which corners to avoid."; no proposed row restates it more closely |
| `src/components/dossier/proseFieldLabels.js`, `src/domain/userEdits.js`, `src/store/settlementPendingEdits.js`, `src/domain/display/stateProse/dmFieldProjection.js` (`DM_EDITABLE_SETTLEMENT_PROSE_PATHS`, `DM_FIELD_FRAMED_BY_BLOCK['DS-DEF-3']`), `src/domain/display/stateProse/dossierMounts.js` | the field's PATH (edit card label "Safety, as first surveyed", the editable list, the mount's note) | nothing |
| the printed export | none: `tests/pdf/parityContractExemptions.test.js` holds the path EXCLUDED | nothing |

**(ii) Who MATCHES ITS WORDS**

| reader | what it matches | if the sentence changes |
|---|---|---|
| `src/generators/generationCoherence.js :: projectionAgreementFindings` | on `safetyDesc`: `/mercenary compan/` without the mercenary atom; `GATES_NAMED` (`/(?<!no )gates?/`) without `gate`; `WATCH_NAMED` (`/(?<!no )the watch/`) without `watch`; `COURT_SITS` / `COURT_ABSENT` against `court` | every proposed row naming the watch or a gate DECLARES `watch` / `gate`; no row names a court or a mercenary company. Projected: 0 findings on the 600 (`out/project.txt` (4)) |
| `src/domain/display/guardLineUnderTheLaw.js :: safetyLineAsPrinted` (at render) | the Safe line's foothold clause (`FOOTHOLD`), "The militia is present and responsive." (`MILITIA_PRESENT`), the siege clause (`SIEGE_ORDER_FRAME`) | none of these is in branches 6 or 7; no proposed row carries those words, so render changes nothing on them |
| `src/domain/display/defenseDisplay.js :: ringNoteUnderStreetFighting` | `STREETS_FOUGHT_OVER` on the line, only under a crisis label | branches 6 and 7 carry no crisis label; no row carries the words |
| `src/generators/safetyLineTruth.js :: settleCrimeWaveLines` (assembly) | `CRIME_WAVE_TWINS.safetyDesc`: the Safe opening and the occupation sentence | not in 6 or 7. COUPLING with `economicDragDesc`: the same table and the same pass settle both fields; the writer's `tiny` gate is shared; neither text reads the other, and they print on different tabs |
| `tests/helpers/pageLaws/law9.mjs` (rule `9a.watch`) | the "working watch" anchor `/The watch covers the main paths|The watch is present and responsive/` | **MOVES**: today's watch sentence would print in about one watch town in eight; the anchor must read the pool's watch rows (or the rule loses most anchors and its counts shift). `CRIME_KEPT_DOWN` there and `law9w.mjs :: SAFE_LINE` read the Safe and Very Safe lines: unmoved |
| `tests/lint/presumedThings.register.json` (arm 1, file `src/generators/safetyProfile.js`) | rows `"The garrison patrols"`, `"The watch covers"`, `"Militia volunteers patrol"`, `" The walls keep the trouble inside, off the roads beyond."`, `"The garrison is overwhelmed or corrupt."` (after-release: literals that name a thing and declare nothing) | **MOVES**: the literals leave `safetyProfile.js` for declared rows; the rows go stale ("a row nothing matches reds as stale") and are removed in the cure's own commit; the new rows must be found declared by arm 1, not listed |
| `tests/lint/presumptionClasses.register.json` | row `["office","other","The garrison is overwhelmed or corrupt.", …]` | **MOVES** with it (stale) |
| `scripts/mutation-coverage-manifest.json` | the rationale of `safetyModerateSmallPlace.test.js` quotes today's lines | text only; the test it names stays green (below) |

**Test files that pin a literal of the field**, and what happens to each under the proposal (index 0 of every pool is today's
sentence and a falsy seed picks index 0, so every SEEDLESS call prints today's line; measured: 902 of 902 target writer calls
compose today's line with no seed, `out/project.txt` (1)):

| test | pins | under the proposal |
|---|---|---|
| `tests/generators/safetyModerateSmallPlace.test.js` | the tiny line `toBe`, `/^A mix of safer and more exposed areas\. /` | seedless: green |
| `tests/domain/facts/declaredMoves.test.js` | `/militia/i` in the village Moderate line | seedless; every militia row names the militia anyway |
| `tests/generators/narrativeQualityCorpus.test.js` | town/city watch words, the occupation and authoritarian lines | seedless; not branches 6/7 |
| `tests/generators/safetyLineSiblings.test.js` | the succession line and its twin | branch 1: unmoved |
| `tests/generators/safetyForceLines.test.js`, `tests/domain/bar6CrimeOneReading.test.js`, `tests/domain/bar6DefDeskGuards.test.js`, `tests/domain/bar3Defecon2Lines.test.js` | the Safe line ("well-managed", foothold, militia) and the crime-wave twins | branch 5: unmoved |
| `tests/domain/bar3DefeconLines.test.js`, `tests/generators/coherenceAgreeCures.test.js`, `tests/generators/tailDefeconSafetyLines.test.js` | Very Safe's gates and walls twins | branch 4: unmoved |
| `tests/domain/bar7OrderUnderTheLaw.test.js`, `tests/domain/display/noRingNoteUnderStreetFighting.test.js`, `tests/domain/display/ringNoteStreetsSmallPlace.test.js`, `tests/domain/tailDisplayCivic4BatchB.test.js` | siege, revolt and Safe lines, or hand-built lines | unmoved |
| `tests/generators/safetyLinesSayTheRecord.test.js` | seeded births; no "district"/"military command" in a small place, court words only beside a courthouse | runs over seeded births whose Moderate lines change; no proposed row says district, military command or court: expected green (the builder runs it) |
| `tests/generators/projectionAgreement.test.js` | the coherence findings over seeded births | expected green (projected 0 findings); the builder runs it |
| `tests/ui/defenseTabFlow.test.js` | the tab prints the stored line (identity) | green |
| `tests/domain/defenseStateProseDesk.test.js`, `tests/components/workbenchProseEditor.test.jsx`, `tests/store/editProseQueueSpine.test.js`, `tests/pdf/parityContractExemptions.test.js` | the path and hand-written lines | unmoved |

**(iii) Who COMPOSES FROM IT**

| reader | what it does |
|---|---|
| `DefenseTab.jsx` (the crime-pattern list) | `sentencesNotIn(ct.desc, safetyLine)`: drops a crime pattern's sentence the safety line already says. No proposed row is a crime pattern's sentence, so nothing is dropped that is not dropped today |
| `defenseDisplay.js :: ringNoteUnderStreetFighting` | reads the line with the crime patterns (above) |
| `defenseStateProse.js` (DS-DEF-3) | sets the corpus line beside it (above) |

Nothing quotes the field into another stored string.

**A SAVED TOWN KEEPS ITS STORED SENTENCE.** The writer runs only inside a birth (the economy step and the reconcile pass's
re-derive). The load path (`migrateSettlementToLatest`, `normalizeSettlement`) never calls it, and the only render rewrite
(`safetyLineAsPrinted`) touches words no proposed row holds. How the fixtures prove it: `tests/fixtures/legacy-saves/april-2026-v1.json`
and `tests/fixtures/save-museum/02-v2-draft-2026-06.json`, `03-campaign-canon-2026-07.json` store hand-written lines no writer can
produce ("The moor road is walked in daylight only.", "The harbour watch keeps the quays lit after dark."), and
`tests/lib/legacySaves.fixture.test.js` (normalize is idempotent and byte-stable on every migrated save) and
`tests/lib/saveMuseum.test.js` (the forward exhibit passes through `toEqual`) prove the load path writes no prose. **No test pins
that a loaded `safetyDesc` equals the fixture's bytes**: the builder may add that pin (a guard, green on both sides, not a red).

## C. THE FACTS AT HAND

What the writer has in scope: `(config, tier, institutions)`, the roster at the economy step. Measured on the 600, the writer's
roster against the FINAL record (`out/analyze.txt`, "the writer's facts … against the FINAL record's"):

| fact a wording could say | its home | reads the final record? | writer = final on the 600 |
|---|---|---|---|
| walls, palisade (wall kind), gate, watch, militia, garrison, mercenary, court, prison | `src/domain/facts/defence.js :: defenceOf` (over `defense/defenseFacts.js :: defenseFactsOf`, the live roster) | yes (it reads whatever roster it is handed; at the writer the roster is final for these) | **0 disagreements on every atom** |
| the force's houses by name (Town watch, Barracks, Professional city watch, Household levy, Citizen militia …) | `src/domain/facts/orderForce.js :: orderForceOf(record).houses` | yes | 0 |
| the force walks by day (its own text) | `src/domain/facts/forceHours.js :: forceWalksByDayOf` (via `factsOf().forceWalksByDay`) | yes | 0 |
| someone is paid to keep order; a force of any kind | `guardPay.js :: paidWatchOf`; `factsOf().guardPresence` | yes | 0 |
| a market stands | `src/domain/facts/market.js :: marketOf` | yes | 0 |
| the trade route (road, river, crossroads, port, isolated) | `src/domain/facts/terrain.js :: tradeRouteOf` (reads `config.tradeRouteAccess`) | yes | 0, **provided the writer hands its own `config`** (the roster alone answers nothing: 600 of 600 blank) |
| the terrain | `terrain.js :: terrainClassOf` (`config.terrainType`) | yes | 0 with the writer's `config` |
| the tier | `factsOf().tier` | yes | 0 |
| a court sits on the live roster (`court sits`) | `defence.js :: courtHoldersOf` | yes | **33 disagree** (the services that make a hall a court are drawn later) — do not use |
| the crime structure (`crime`) | `criminalStructureKey.js` | yes | **23 disagree** (the powers are drawn later) — do not use |
| a guild (`guild`) | `guild.js :: guildOf` | yes | **24 disagree** — do not use |

What the record holds in the places of the repeated branches (`out/analyze.txt`, "the force houses by name"): thorps no force
(51) or a Household levy (16), palisade in 19; hamlets no force (48) or a Citizen militia (16), palisade or earthworks in 16;
villages no force (57), militia (9), Village watch (3), a market in 16; towns a Town watch (60) or Barracks + Town watch (13),
walls in 48, a market in all 73, the watch walks the night by its own text in all 60 watch-only towns; cities Garrison + Professional
city watch (59), stone walls and gates in all, walks by day in all; metropolises Multiple garrisons + Professional city watch (67),
massive walls in all. The route spreads in every size (road the most, then river, crossroads, port, isolated). A good sold or bought
is NOT a fact of this field: the safety line says who keeps the peace and with what, and the exports and imports were not read.

**The seed at the writer.** `config._seed` is absent there (0 of 1,301 calls). The active stream's seed is reachable,
`getActiveRng()?.seed`, and it is STEP-QUALIFIED: `<seed>::generateEconomy` (600 calls) or `<seed>::economyReconcilePass` (701
calls; the reconcile pass's re-derive and the services call). It is deterministic per birth either way. The same file already keys
on it: `safetyProfile.js :: voiceOf` (`hashKey(\`${seed}::safetyProfile:${poolId}\`)`) and the `STANDARD_PATROL` / `SMUGGLING_HOOKS`
draws (`key: \`${getActiveRng()?.seed ?? ''}::safetyProfile:STANDARD_PATROL\``). Two existing `pickVariant` callers and their key
forms: `src/generators/narrativeGenerator.js` (the small-place tier line: `` `${seed}::settlement-tier-line::${tier}` ``, seed =
`_config._seed`), and `src/domain/summary/settlementQuickGuide.js` (`` `${seed}::culture-scope-line` ``). The proposal's key:
`` `${getActiveRng()?.seed ?? ''}::safetyProfile:safetyDesc:<slot>` ``, falsy seed → index 0.

## D. THE CANDIDATE WORDINGS

House idioms followed: every wording is a declared row `{ text, needs?, excludes? }` (`drawDeclared.js`'s shape, held by
`tests/lint/declaredLineShape.test.js`), atoms only from `factVocabulary.js :: FACT_DIMENSIONS` (every one passes `assertDeclarable`:
78 rows, `out/project.txt`); the selection is `drawDeclared(pool, { draw: (p) => pickVariant(p, key), facts, key, … })`, the full pool
drawn once by hash, a refused winner resolved to the admitted argmax (as `STANDARD_PATROL` resolves its refused frame); index 0 is
TODAY's sentence, declaring only what its branch already guarantees (proseHash.js's CANONICAL-AT-ZERO). The facts are
`factsOf({ institutions, tier, config, stress })` at the writer, every atom used reading 0 disagreements above. Register: each row is
a plain remark of the same length class; a Moderate row stays mixed (safe here, risk after dark there), an Unsafe row stays unsafe;
no row names a trouble the record lacks, a force the record lacks, a street in a thorp or hamlet, a district in a small place, or a
court. The rows are `composer.mjs`, verbatim.

**6a · `TINY_MODERATE` (thorp, hamlet; today `TINY_MODERATE_LINE`)**

| # | wording | needs |
|---|---|---|
| 0 | The neighbours keep an eye on one another, and what trouble there is, everyone soon hears of. | — |
| 1 | Everyone here knows everyone, so what trouble there is is hard to hide. | — |
| 2 | In a place this small, a wrong done is known to all by nightfall. | — |
| 3 | Order here rests with the neighbours: little happens that someone does not see. | — |
| 4 | The households look out for one another, and a quarrel or a theft is soon talked of. | — |
| 5 | Strangers are noticed here, and so is anything that goes missing. | — |
| 6 | People here watch over one another's doors, and word of any trouble travels fast. | — |
| 7 | If real trouble comes, the militia turns out; day to day, the neighbours watch one another. | militia |
| 8 | Few strangers come this far, and the neighbours keep an eye on one another. | route: isolated |
| 9 | A place this size has few secrets, and what trouble there is soon comes out. | — |

**6b · slot 1 `MIXED_OPENING` (today "A mix of safer and more exposed areas.")**

| # | wording | needs |
|---|---|---|
| 0 | A mix of safer and more exposed areas. | — |
| 1 | Some parts of the place are safer than others. | — |
| 2 | Safety here depends on where you are, and when. | — |
| 3 | Most of the place is safe enough, though not all of it. | — |
| 4 | The busy ways are safe enough; the edges less so. | — |
| 5 | Some quarters are safer than others. | tier: ≥ town |
| 6 | The market and the busy streets are safe enough; other parts less so. | market, tier: ≥ village |
| 7 | Order holds in most of the place, but not everywhere. | — |

**6b · slot 2 `MIXED_FORCE`, by the branch's force (the writer's own order: garrison, watch, militia, none)**

| force | # | wording | needs / excludes |
|---|---|---|---|
| garrison | 0 | The garrison patrols the main paths; quieter spots after dark carry genuine risk. | garrison |
| | 1 | The garrison patrols the main streets; the quiet ones after dark carry real risk. | garrison, tier: ≥ village |
| | 2 | Soldiers of the garrison walk the main streets; the back ways are riskier after dark. | garrison, tier: ≥ village |
| | 3 | The garrison keeps the main thoroughfares; away from them, after dark, the risk is real. | garrison |
| | 4 | The garrison and the watch share the main streets; the quiet ones after dark are less safe. | garrison, watch, tier: ≥ village |
| | 5 | The garrison holds the gates and patrols the main streets; quieter spots after dark carry real risk. | garrison, gate, tier: ≥ village |
| | 6 | By day the garrison is seen on every main street; after dark, the quieter spots carry genuine risk. | garrison, force walks by day, tier: ≥ village |
| | 7 | The garrison patrols the market and the main streets; elsewhere, after dark, there is genuine risk. | garrison, market, tier: ≥ village |
| watch | 0 | The watch covers the main paths; quieter spots after dark carry genuine risk. | watch |
| | 1 | The watch covers the main streets; the quiet ones after dark carry real risk. | watch, tier: ≥ village |
| | 2 | The watch keeps to the main streets; the side lanes after dark are another matter. | watch, tier: ≥ village |
| | 3 | Watchmen walk the main streets; away from them, after dark, the risk is real. | watch, tier: ≥ village |
| | 4 | The watch walks the main streets by night; even so, the quieter spots after dark carry genuine risk. | watch, tier: ≥ village / excludes force walks by day |
| | 5 | The watch holds the gates and walks the main streets; quieter spots after dark carry real risk. | watch, gate, tier: ≥ village |
| | 6 | The watch is seen on the main streets by day; quieter spots after dark carry genuine risk. | watch, force walks by day, tier: ≥ village |
| | 7 | The watch keeps an eye on the market and the main streets; quieter spots after dark carry genuine risk. | watch, market, tier: ≥ village |
| militia | 0 | Militia volunteers patrol the main paths; quieter spots after dark carry genuine risk. | militia |
| | 1 | Volunteers of the militia walk the main paths; the quieter spots after dark are riskier. | militia |
| | 2 | The militia keeps an eye on the main paths; away from them, after dark, the risk is real. | militia |
| | 3 | Militia volunteers look out along the main paths; quieter spots after dark carry real risk. | militia |
| none | 0 | Locals watch over the main paths; quieter spots after dark carry genuine risk. | — |
| | 1 | Neighbours look out along the main paths; away from them, after dark, there is real risk. | — |
| | 2 | The people who live along the main paths watch them; quieter spots after dark are less safe. | — |
| | 3 | Locals watch over the main ways themselves; after dark, the quieter spots carry genuine risk. | — |
| | 4 | The villagers keep an eye on the main paths; the quiet spots after dark carry real risk. | tier: village |
| | 5 | Stallholders and neighbours keep an eye on the market and the main paths; quieter spots after dark carry genuine risk. | market |
| | 6 | Locals keep an eye on the road through and the main paths; quieter spots after dark carry real risk. | route: road |
| | 7 | Locals keep an eye on the crossroads and the main paths; quieter spots after dark carry real risk. | route: crossroads |

**6b · slot 3 `MIXED_CORNERS` (today "Residents know which corners to avoid.")**

| # | wording | needs |
|---|---|---|
| 0 | Residents know which corners to avoid. | — |
| 1 | People who live here know where not to go. | — |
| 2 | Locals know which lanes to keep out of. | tier: ≥ village |
| 3 | Those who live here soon learn where not to linger. | — |
| 4 | Most people here know where trouble is likely, and keep clear of it. | — |
| 5 | The people here know their own streets, and which to keep away from. | tier: ≥ village |
| 6 | Residents give the worst corners a wide berth. | — |
| 7 | Anyone who lives here can say which ways are best avoided. | — |

**6a and 6b · the wall note `MODERATE_WALLS` (today " The walls keep the trouble inside, off the roads beyond."; printed where `walls`)**

| # | wording | needs / excludes |
|---|---|---|
| 0 | The walls keep the trouble inside, off the roads beyond. | walls |
| 1 | The palisade keeps out what comes from beyond; what trouble there is starts within. | palisade |
| 2 | Behind the palisade, what trouble there is comes from within. | palisade |
| 3 | The walls see to what comes from outside; what trouble there is starts at home. | walls |
| 4 | The stone walls keep the outside out; the trouble there is starts within. | walls / excludes palisade |
| 5 | The gates are watched, so trouble from outside rarely gets in; what there is starts within. | gate, guardPresence |
| 6 | The walls see to the approaches; the risk that remains is within. | walls |
| 7 | Whoever comes in passes the gates; the trouble that remains is the place's own. | gate |
| 8 | The garrison keeps the walls; within them, the risk is the place's own. | walls, garrison |

**7 · Unsafe with a garrison (the city's 18), four slots**

| slot | # | wording | needs / excludes |
|---|---|---|---|
| `UNSAFE_OPENING` | 0 | Crime is a persistent and visible problem. | — |
| | 1 | Crime here is common, and nobody pretends otherwise. | — |
| | 2 | Crime here is common and out in the open. | — |
| | 3 | Crime here is steady and out in the open. | — |
| `UNSAFE_GARRISON` | 0 | The garrison is overwhelmed or corrupt. | garrison |
| | 1 | The garrison cannot keep up with it, or has stopped trying. | garrison |
| | 2 | The garrison is too stretched, or too easily bought, to stop it. | garrison |
| | 3 | Neither the garrison nor the watch keeps pace with it. | garrison, watch |
| `UNSAFE_ADVICE` | 0 | Travelers are advised to move in groups and keep valuables hidden. | excludes crisis: siege |
| | 1 | Visitors are told to keep together and keep their purses out of sight. | excludes crisis: siege |
| | 2 | Newcomers learn quickly to go about in company and show nothing worth taking. | excludes crisis: siege |
| | 3 | In the market, people keep a hand on their purses and go in company. | market / excludes crisis: siege |
| `UNSAFE_WALLS` | 0 | Walls slow entry but don't solve what happens inside them. | walls |
| | 1 | The walls keep out what comes from beyond, not what is already within. | walls |
| | 2 | The gates are kept, but the trouble is already inside. | gate, guardPresence |

## E. THE PROJECTION

`composer.mjs :: composeSafetyDesc`, simulated at the writer through the tap (the writer's own roster, config and stream seed), on
the same 600 births, masked as the census masks (`out/project.txt`):

| size | whole line, before → after | first sentence | **any sentence (the bar)** | lines changed |
|---|---|---|---|---|
| thorp | 48 → 11 | 67 → 14 | **67 → 14** | 55 |
| hamlet | 48 → 9 | 64 → 9 | **64 → 9** | 59 |
| village | 56 → 8 | 69 → 13 | **69 → 13** | 69 |
| town | 43 → 5 | 73 → 10 | **73 → 12** | 73 |
| city | 58 → 5 | 58 → 9 | **58 → 13** | 76 |
| metropolis | 66 → 7 | 67 → 11 | **67 → 14** | 68 |

Every size is under about 15%. The worst size is the thorp (14); its ten commonest after-sentences:

```
14  The neighbours keep an eye on one another, and what trouble there is, everyone soon hears of.
11  A place this size has few secrets, and what trouble there is soon comes out.
10  Order here rests with the neighbours: little happens that someone does not see.
 8  Strangers are noticed here, and so is anything that goes missing.
 8  Everyone here knows everyone, so what trouble there is is hard to hide.
 6  In a place this small, a wrong done is known to all by nightfall.
 6  The palisade keeps out what comes from beyond; what trouble there is starts within.
 6  People are hungry and stealing to eat.
 6  Whoever controls the food now has the say.
 6  Anyone known to have food hidden away is robbed, or worse.
```

The last three are the famine strain (branch 1), untouched. The metropolis also reaches 14 (today's wall note at index 0: the
walls, the gate, a garrison and a force all hold there, so seven of the nine wall rows are admitted and the hash's spread decides).
What would lower the small places further: the thorp's and hamlet's facts are few (no force in 99 of 131, no market, walks by day
false), so only more rows of the same reading would; the route fact is the one that varies (one row uses `route: isolated`; a
`route: river` or `route: port` row would need a fact of a landing the roster does not name, so none is proposed).

Checks in the same run: a falsy seed composes today's line in 902 of 902 target writer calls; every chosen row is admitted by
the FINAL record (0 refused: the birth self-check's rule, `cert:false-presumption`); the coherence arms' words on the after-lines
find 0 (watch, gate, mercenary, court).

## F. WHERE THE CHANGE WOULD LIVE

- **The new data file:** `src/data/safetyDescLines.js`, the twelve pools of section D as frozen declared rows (the drawDeclared
  shape), index 0 today's sentence. No existing data file is touched.
- **The writer's call lines** (`src/generators/safetyProfile.js :: generateSafetyProfile`): the Moderate branch's one assignment
  (`safetyDesc = tiny ? … : …`) and, in the Unsafe branch, the garrison clause, the advice and the wall note become calls of one
  composer (`drawDeclared` + `pickVariant` per slot, key `` `${getActiveRng()?.seed ?? ''}::safetyProfile:safetyDesc:<slot>` ``),
  facts `factsOf({ institutions, tier, config })` (config is in scope there; it is what answers the route). Today's Moderate and
  Unsafe literals and `TINY_MODERATE_LINE` leave the file. The file's own rule holds: imports and helpers at the END, so no producer
  write above moves. `safetyLineTruth.js`, the economy, `prosperity.js` and every file the common brief reserves are untouched.
- **Fact homes imported:** `domain/facts/factsOf.js` (already imported), `domain/facts/drawDeclared.js :: drawDeclared` (already),
  `kernel/proseHash.js :: pickVariant` (new import), `domain/facts/defence.js :: defenceOf` (already).
- **Registered where the pool census wants it:** an entry per pool in `scripts/lib/table-pools.mjs :: TABLE_POOLS`
  (`module: 'src/data/safetyDescLines.js'`, `drawKind: 'H'`, `drawSite: 'safetyProfile.js :: generateSafetyProfile'`); the presumption
  walkers (`tests/lint/presumedThings.*`, the declaration walkers) go green by each row's `needs`, never by an exemption.
- **Readers that must follow:** `tests/helpers/pageLaws/law9.mjs` rule `9a.watch` (its working-watch anchor reads the pool's watch
  rows); `tests/lint/presumedThings.register.json` (five arm-1 rows of `src/generators/safetyProfile.js` go stale and are removed:
  "The garrison patrols", "The watch covers", "Militia volunteers patrol", " The walls keep the trouble inside, off the roads
  beyond.", "The garrison is overwhelmed or corrupt."); `tests/lint/presumptionClasses.register.json` (the last one's row).
- **The proofs owed:**
  1. the RED-FIRST test: on the census's births (or a pinned subset), no sentence of `safetyDesc` in more than 15 of 100 places a
     size: red today (thorp 67, town 73), green after;
  2. the canonical pin: a seedless call prints today's line in every branch (the existing seedless tests above already hold it;
     `safetyModerateSmallPlace.test.js` is the nearest);
  3. the declaration proof: every row's atoms declarable, and every chosen row admitted by the FINAL record on the corpus
     (this measure's (4): 0 refused);
  4. the confinement run, `node docs/chair/2026-11-20/content/tools/confinement/trees.mjs <before> <after> <workdir>`: 0 non-string
     differences (the composer is draw-free: `pickVariant` and `drawDeclared` take no roll; the label, the crime types and every other
     field are unchanged; only the `safetyDesc` string moves);
  5. the pinned tests that move or must be run: `law9.mjs`'s consumers, the two registers above, and as a check
     `safetyLinesSayTheRecord`, `projectionAgreement`, `safetyModerateSmallPlace`, `declaredMoves`, `narrativeQualityCorpus`,
     `defenseTabFlow` (expected green, section B);
  6. optionally, the saved-town pin (B): a loaded fixture's `safetyDesc` equals its stored bytes.

## G. OPEN QUESTIONS for the chair

1. Key on the active stream's step-qualified seed (`::generateEconomy` / `::economyReconcilePass`, as `voiceOf` already does in
   this file), or strip it to the birth's root seed (`config._seed` is not in scope at the writer)?
2. Is the city's Unsafe line (18 of 100, not a calm or mixed reading) inside this field's cure, as proposed here, or left for a
   later brief?
3. May a row declare `excludes: ['force walks by day']` to say the watch walks "by night" (the atom's false reading, every house
   kept to the night by its own text), or must a night claim wait for an atom of its own?
4. Does `law9.mjs`'s `9a.watch` anchor follow the pool's watch rows (proposed), or keep today's one sentence as its frame?
5. The facts the record holds that no atom answers (`factVocabulary.js` is read-only; the citadel row is NOT in section D, the
   night row is, only through an existing atom's negation; nothing is proposed for a fact the record lacks, such as a river landing):
   - ATOM `force walks by night` : `src/domain/facts/forceHours.js :: nightOnlyText` over `orderForce.js :: orderForceOf(record).houses` (every town watch's own text: "walk the night and hold the gates") : "The watch walks the main streets by night; even so, the quieter spots after dark carry genuine risk." (today proposed through `excludes: ['force walks by day']`, question 3)
   - ATOM `citadel` : `src/domain/institutions/defenseInstitutionBuckets.js :: partitionDefenseInstitutions(...).walls` (the roster's "Citadel" row: 43 of the 59 Moderate cities, 51 of the 67 metropolises) : " The garrison holds the citadel and the walls; within them, the risk is the place's own."
6. Should the wall note be split by kind (palisade rows for the small places, stone rows for the towns) rather than one pool keyed
   by `walls` / `palisade`, given today's index-0 note reads oddly beside a thorp's palisade?
