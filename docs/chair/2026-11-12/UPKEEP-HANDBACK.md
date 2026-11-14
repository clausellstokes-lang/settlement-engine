# COHERENCE-UPKEEP: the hand-back (the eleventh seat, UPKEEP-11, 2026-11-14) — IN PROGRESS: steps 1 to 3 DONE (no line measured false; every red named below); step 4 (i) and (ii) DONE

**The lane:** `lane/coherence-upkeep-2026-11-12`. **Base of this seat:** 878fce4a8 (read back from origin before any work). **The brief:** `origin/lane/chair-2026-11-08:docs/chair/2026-11-14/briefs/BRIEF-UPKEEP-11.md` (self-contained: the laws, the four classes of the chair's 04:57 ruling, the final statement's form). **The probes:** `docs/chair/2026-11-14/probes/UPKEEP-11/` (README there). **The births:** the lane's 1,490 born at 878fce4a8 (UPKEEP-9's `birthgz.mjs`).

## The brief and the rulings this seat works to

- **Who asks:** the chair, `session_01ACmDYZrFEVXyZEUg1NDxxC`; the owner in its chat, 2026-11-14: "Continue with the pending work! ... I defer all decisions to you and give you all permissions you may require." Merging the pull request and the deploy stay the owner's; no commit at or below 878fce4a8 is rewritten; no pull request.
- **The work:** (1) what is left of the presumed-things door (the 20 fresh hits not yet classed; the strip); (2) the rest of section 2m's checks (page census, fact layers, observed shapes, writer reach); (3) the packet validator's exit at the final tip; (4) the lane's declarations (the one ladder FOR THE JOIN; the Services and Magic labels LISTED; M1 M2 M3 M5 L2 and C-M1's six births as exposure); (5) the ONE final statement. NO NEW CURE OF A PAGE LINE beyond what the checks ask.
- **The four classes (the chair, 04:57):** (1) a stale row leaves by `--shrink`; (2) the SHAPE CURE where a set ALREADY DECLARES the atom; (3) a line GATED IN CODE, not declared through a draw door: RED AND NAMED for the declaration pass after the join; (4) a line FALSE somewhere: cured now.

## Incidents (this seat)

- cb12a5113 carries a MISTYPED Claude-Session trailer (`session_01ACmDYZtFEVXyZEUg1NDxxC`, neither this seat's session nor the chair's); this seat is `session_01ACmDYZctZPwbz49udr6LtU`. Pushed before it was seen; not rewritten (no force push). Later commits carry the right one.

## What this seat did, in commit order

| Commit | Step | Measure | Moved |
|---|---|---|---|
| cb12a5113 | 1, the presumed-things door CLASSED, by measure on the 1,490 at 878fce4a8 | `--check` exit 1: **fresh 28 · stale 0 · strips fresh 1**; the walker exit 1 (2 failed, 41 passed: arm 1's fresh hits; arm 3's strip) | nothing (no line measured false; nothing cured, declared or banked) |
| (this commit) | 2, the page census's grid lowered through its door (`--grid --shrink`), with step 2's classes, step 3 and step 4 (i) (ii) | the grid: 3 falls (r2r-thorp-0 F4 and P14, r2s-under_siege-thorp-0 F4), no rise; `tests/components/pageCensus.walker.test.jsx` 14/14 after | `page-census.register.json` grid: 3 rows out |

### STEP 1: THE TWENTY-ONE, CLASSED (the brief counted `safetyProfile.js` 9; the door lists 10: defenceWeights 9, safetyProfile 10, threatAssessment 1, viability 1) (each measured with `m11hits.mjs` / `m11ta.mjs` / `m11dw*.mjs`)

**Nothing is false where it prints** (class 4: none). **No shape cure applies** (class 2: none; see the builder gap). The door's counts stand: fresh 28 (the tenth seat's seven plus these twenty-one; none new), stale 0, strips fresh 1; the walker red on its two arms. Each red below is THIS LANE'S, NAMED.

**FOR THE DECLARATION PASS (class 3: gated in code, true wherever printed):**

| file | text | the code gate | atom | printed / false on the 1,490 |
|---|---|---|---|---|
| `src/generators/safetyProfile.js` | "The garrison is present and responsive." | `inst.hasGarrison` (the Safe branch's `lawLine`) | `garrison` | 1 / 0 |
| same | "The watch is present and responsive." | `!inst.hasGarrison && inst.hasWatch` | `watch` | 1 / 0 |
| same | "The militia is present and responsive." | `!garrison && !watch && inst.hasMilitia` | `militia` | 0 / 0 |
| same | "A street gang controls part of the place, extorting local businesses and residents. …" | `inst.hasGangInfra && crimeTypes.length === 0`, and `GANG_HOUSES_OF(…) < 2 \|\| small` | `house: street gang` | 45 / 0 |
| same (`SAFETY_LINE_SIBLINGS`) | "A mercenary company provides enforcement: … not the community." (the twin of both hired-company lines) | `keptGuardLine`: `d.mercenary && !standing`; the twin already carries `['mercenary']` through `declaredSet`'s `shared` | `mercenary` | 0 / 0 |
| same (`SAFETY_LINE_SIBLINGS`) | "Hired swords back the garrison when the purse allows." and its twin "Hired swords back the garrison." | `keptGuardLine`: `contracted && d.garrison`; both members already carry `['garrison']` through `shared` | `garrison` | 3 / 0 and 385 / 0 |
| same (`SAFETY_LINE_SIBLINGS`) | the charter hall's three: "… takes bounty work against threats, as far as the purse runs.", "… coordinates emergency response to threats.", "… takes bounty work against threats, but the coin for bounties runs short." | `keptGuardLine`: `text.startsWith(CHARTER_LEAD)`, the lead written only on the branch `inst.hasCharterHall && !garrison && !watch` | `house: adventurers' charter` | 6 / 0, 0 / 0, 29 / 0 |
| `src/domain/display/threatAssessment.js` | " and a citizen militia to hold it." (`An embattled region, and only ${wallWord} and a citizen militia to hold it.`) | `threat === 'plagued' && hasWalls && hasMilitia` (`defenseFactsOf`), bands WEAK/CRITICAL | `militia` | 98 / 0 (display, through `buildThreatAssessment`) |
| `src/generators/economy/viability.js` | "Traveling hedge wizard" (`SMALL_HEDGE_HOUSES`) | a catalogue name filtered against the tier's catalogue; printed only as the suggestion "Add …" where magic is very high and NO magic house stands | the house is ABSENT by design (a suggestion to add it): the declaration would be `excludes: ['house: hedge wizard']` | 0 / 0 (no 1,490 birth reaches it) |

**THE BUILDER GAP (the rule book's, for the declaration pass; told to the chair with step 1's list):** `presumedThings.shared.mjs :: buildersOf` credits a builder only where its row reads `needs: <a parameter>` or `excludes: <a parameter>` directly; `safetyProfile.js :: declaredSet` writes `needs: Object.freeze([...needs, ...shared])` and `excludes: Object.freeze(needs)`, so it is NO builder to the walker and no member of `SAFETY_LINE_SIBLINGS` is credited, though `keptGuardLine` resolves every one of them through `resolveSibling` (a draw door). The hired-company and hired-swords members already DECLARE their atom (`shared`); they red only because the walker cannot read it. Not re-routed, not re-shaped to suit the matcher: named.

**PRINTED NOWHERE, READ BY NO CODE (said, not kept as printing lines):** `src/data/defenceWeights.js :: DEFENCE_WEIGHT_REASONS`, four strings, six hits: `houseScale` (quarters; house: alchemist), `militia` ("citizens under arms: …", armedForce), `floors` ("unpaid soldiers desert slowly, never at once", armedForce), `crises` ("today's points, with today's relief by faith, druids, …", house: druid; market). No file under `src` reads the table; its one reader is `tests/generators/defenceParts.test.js` ("every row of the table carries a one-line reason, and every reason a row", which pins each as a string of more than eight characters): the table's documentation. They stay (a pin is never loosened; the walker's instrument list is not widened by a lane): red and named; the declaration pass may move the reasons to comments with that pin's owner, or admit the table as an instrument by the chair's ruling.

**PRINTED ON NO SURFACE, READ BY CODE:** `defenceWeights.js :: DEFENCE_WORDS` labels "Masons at work on the defences", "Elders and reeve", "Alchemists preserving the grain". The parts are not stored (`defenseGenerator.js`: "NO `parts` HERE"); `defencePartsOf` has no reader under `src` (the tests, the probes, the eight towns); no component, PDF section or export reads `DEFENCE_WORDS`. WHERE LISTED, measured against the walker's absence reader: elders 271 listed, no reeve in **228** (the part opens on "Household elder" 63, "Informal elder consensus" 97, "Lord's steward" 36, "Village elder" 32); alchemists 535, the walker's alchemist absent in **319** (an "Apothecary district" opens the alchemy tradition); masons 180, the mason absent in **56** (the part opens on the fortification chain's health, not a house). Not a page line, so no cure now; were a page ever to print the list, each would be false there: LEFT FOR AFTER THE JOIN (recommendation: each label names its opener, "Elders" / "Alchemy preserving the grain" / "Fortification work on the defences", as a reworded part label read where it prints). The file's header line "as the record stores them and the Defense tab prints them" is stale for the same reason.

**THE STRIP (a gap of the rule; one message to the chair, sent):** `foodGenerator.js :: cultureFoodwaysOf` = `filterDeclared([...rows], { … }).map((row) => String(lineText(row)))`: the text is taken AFTER the door has read the declarations. `stripSites` exempts a door only in the `pick(R).text` arm (`STRIP_DOORS`); the `.map(unwrap)` arm names the door's own result as a fresh receiver. Not banked, not reworded: red and named.

### STEP 2: THE REST OF SECTION 2m AT THE TIP (cb12a5113; code as 878fce4a8), EACH AGAINST THE LINE'S OWN TIP 976db5b19 (a detached worktree, the same commands)

| guard | at the lane's tip | at the line (976db5b19) | classed |
|---|---|---|---|
| fact layers (`node scripts/fact-layers-door.mjs`) | **exit 1: 3 rises, 14 falls** (refused: shrink-only) | exit 0 | THIS LANE'S, NAMED (below); the falls cannot be shrunk while a rise stands (the door refuses the whole write) |
| observed shapes (`node scripts/check-observed-shape-readers.mjs`) | **exit 1: 2 NEW, 3 STALE**; `--write` on the clean committed tree REFUSED (a new identity), nothing written | exit 0 | THIS LANE'S, NAMED (below) |
| writer reach (`node scripts/check-writer-reach.mjs`) | **exit 1: 35 ✗ (18 DARK and unregistered, 17 STALE bank members)** (DARK 1,414 against the line's 1,413; judged 12,368 against 12,345) | exit 0 | one row THIS LANE'S, the rest EXPOSURE of other lanes' keys (below); `--write` NOT RUN (it would bank the new darks) |
| page census `--grid` (the twelve) | **exit 0: 3 falls** (r2r-thorp-0 F4, r2r-thorp-0 P14, r2s-under_siege-thorp-0 F4) | — | lowered by `--grid --shrink` (see the table of commits) |
| page census, the 720 (`--workers=2`) | **exit 1: ROSE on P4 (96 -> 98) and NEW1 (11 -> 12)**; FELL F4 (202 -> **0**), P14 (167 -> **132**) | at or under its register (P4 96, NEW1 11, F4 202, P14 167) | the two rises EXPOSURE (below); the falls are this lane's cures, owed a `--shrink`, which the door refuses while a row has risen |

**THE FACT LAYERS, the three rises (each a name test of a homed family outside its home, in a file of this lane's; the facts home `facts/institutions.js :: INSTITUTION_KIND_PATTERNS` has no crime or magic kind, so no call of the home's reader can stand in for them, and a new kind is a new word: PARKED with its word):**
- `src/generators/economy/viability.js` (magic), a REWORDED condition (UPKEEP-9, 06818b064): NOW `const hasMagicInst = magicHouses.arcane || magicHouses.teleport || instNames.some((n) => n.includes('alchemist'));` WAS the banked lines `n.includes('alchemist') ||`, `n.includes('arcane') ||`, `n.includes('mage') ||`, `n.includes('wizard') ||` (the four FALLS). The word it would need: a `magic` (or `alchemist`) institution kind.
- `src/generators/priorityHelpers.js` (crime), a REWORDED condition (UPKEEP-9, 7515c2abb, #1082: the gang flag reads the gang houses): NOW `hasGangInfra: hasAny(names, ['street gang','multiple criminal factions']),` WAS `hasGangInfra: hasAny(names, ['street gang','multiple criminal factions','front business']),` (the FALL). The word it would need: a `gang` kind.
- `src/generators/safetyLineTruth.js` (crime), written by this lane after the instrument's base (UPKEEP-8, db13fdb40; the line holds no such file): `n += name.includes('multiple criminal') ? 2 : name.includes('street gang') ? 1 : 0;` (GANG_HOUSES_OF). The same `gang` kind.
- The other ten FALLS are `defenseGenerator.js`'s old `hasInst(…)` lines (faith, healer, crime, magic), gone since the capacity branch moved its readers to `defenseTraditionNamesOf`: owed a `--shrink`, which the door refuses while the rises stand.

**THE OBSERVED SHAPES:** NEW `chainId on chains` and `status on chains`, 1 read each, `src/generators/economy/incomeLineSiblings.js :: trueIncomeDesc` (`impaired`, UPKEEP-8 db13fdb40). THE READ IS LIVE: the `chains` it reads are `economicState.activeChains` (`economicState.js`, `chains: activeChainsList`), and on the 1,490 at 878fce4a8 all **21,599** entries carry `chainId` and `status` (impaired 2,821): the checker binds `.chains` to another producer's shape. A gap of the instrument's shape key, NAMED; not renamed to slip it. STALE: `defenseGenerator.js` `_foodSecurity on config`, `_institutions on config` (this lane's cure removed the reads) and `src/domain/worldPulse/applyWorldPulse.js` `recallTargetId on metadata` (another lane's file; this lane changed no world-pulse file): each owed the governed `--write`, which refuses while the NEW rows stand.

**WRITER REACH:** DARK and unregistered `criminalPreStress on compound`: THIS LANE'S (fe5786c97, UPKEEP-6: the crime reading before the stress multiplier, read by `defenseGenerator.js` and by no counting surface): named for the declaration pass (light it, or a row naming its door through the governed door at the join; not banked here). The other 17 DARK and unregistered keys (`deployedQuality`, `logisticsBurden`, `reinforcementFlow`, `returnCondition`, `sizingBias` on osr006; `endsTick` on osr007; `ransoms on roads`; `recallTargetId` on autoApplied, metadata, selected; `rivalTriumphBand` on metadata, pulseHistory, warTerminationReads; `survivors` on autoApplied, metadata, selected; `warReturnedSettlementIds on pulseHistory`) and the 17 STALE bank members (`authoritySignature`, `booksDirection`, `booksReason`, `causeState`, `momentumBroken`, `rulerLawfulnessBand`, `rulerMoralityBand` on selected and on warRulingRead; `warRulingRead on selected`; `lastTargetedBy`, `lastTargetedTick` on osr000:npc_barracks) are world-pulse keys: this lane changed no world-pulse file (`git diff --name-only 976db5b19 cb12a5113 -- src`), so the worlds the walker runs reach other arms because the births moved. EXPOSURE, NAMED, owned by the world-pulse writers on the line; for the seat that joins the lanes.

**STEP 3, THE PACKET ESTATE:** `node scripts/implementation-packets.mjs validate` at cb12a5113: **exit 0** ("valid: 257 packets (0 READY)").

**STEP 4 (i), THE ONE LADDER, MEASURED (`m11ladder.mjs`, the 1,490 at 878fce4a8; `one-ladder-878fce4a8.txt`), FOR THE JOIN:** `defenseStateProse.js :: posturePoolKey` bands `readiness.score` on the aspects ladder (`scoreBand` 65/40/20); the badge prints `readiness.label`. Cells (badge, pool today, pool ruled by UPKEEP-6's ruling 6): Fortress/STRONG/STRONG 351; Vulnerable/CRITICAL/WEAK **304**; Undefended/CRITICAL/WEAK **295**; Lightly Defended/WEAK/ADEQUATE **140**; Well-Defended/STRONG/STRONG 139; Vulnerable/WEAK/WEAK 104; Defensible/ADEQUATE/ADEQUATE 90; Well-Defended/ADEQUATE/STRONG **50**; Defensible/WEAK/ADEQUATE **17**: **806 of 1,490** births would draw another pool under the ruled ladder (UPKEEP-6 measured 2,023 of 3,756 at 008fc3328). THE CHANGE FOR THE JOIN: `posturePoolKey` reads the badge's band (`readiness.label` through the ruled map) in place of `scoreBand(score)`, in `src/domain/display/stateProse/defenseStateProse.js` (the first leaves lane's file; not touched here).

**STEP 4 (ii), LISTED (ruling 7, kept this release):** the Services tab and the Magic tab read the SHOWN prosperity label: L3 (the Magic tab's "Availability limited" on 568 of the reviewer's 1,200 tip pages, 53 of them paid in full at a Prosperous standing) and C11 (`magicProfile.js :: buyable` reads the stored printed label at render time; the Magic tab moves on 9 of 10 towns as master stored them). For the owner; not cured.

**THE PAGE CENSUS'S TWO RISES, TOWN BY TOWN (the line's 720 against the lane's, each birth's rows; `page-census-720-line-976db5b19.txt` beside `page-census-720-878fce4a8.txt`):** both rows are OLD on the line (banked 96 and 11 there) and their sentences are written in files byte-identical on the lane and on the line (`git diff 976db5b19 HEAD -- factionStanding.js governanceNarrative.js` empty); this lane's moves (the ratings, and the power structures the capacity branch and #1082 re-drew) carry the old false sentence into other towns. EXPOSURE, DECLARED; not cured here (no new cure of a page line).
- **P4** ("Three powers stand almost level here, and no one leads …" beside a leader far ahead; `src/generators/power/factionStanding.js`): NEW in r2r-metropolis-13 (powers 38/18/13/…), r2r-metropolis-53 (33/17/16/…), r2s-recently_betrayed-metropolis-3 (28/15/13/…), r2s-religious_conversion-city-2 (31/18/13/…); GONE from r2r-city-19 and r2s-plague_onset-city-1. Net +2. THE CHANGE FOR THE JOIN: the line is drawn only where the first and third powers stand within the census's own ten points (`f[0] - f[2] <= 10`), in `factionStanding.js` (its holder: the powers lane).
- **NEW1** (the governance label against the Defense verdict; `src/generators/power/governanceNarrative.js`, the label read off `institutionFlags.militaryEffective`, a second ladder beside the readiness this lane derives): NEW in r2r-city-9 ("Vulnerable (prosperous but underdefended)" beside Well-defended), r2r-town-59 ("Ordered (strong military presence)" beside Lightly defended), r2r-village-8 (the same, beside Lightly defended); GONE from r2r-town-29 and r2r-town-47. Net +1. THE CHANGE FOR THE JOIN: the two military labels read the defence verdict's band (`defenseProfile.readiness`), not `militaryEffective`, in `governanceNarrative.js` (the powers lane's file; the one-ladder row's sibling).

---

# COHERENCE-UPKEEP: the hand-back (the tenth seat, UPKEEP-10, 2026-11-14) — HANDED BACK at 05:2x UTC (the count read 324,521 one turn stale at 05:10; the chair's outer limit 05:35): items 1-4 DONE; the banked smith row CURED and shrunk (07e35278d); the packet row DONE (b2ce1adcb); BRIEF-UPKEEP-11 step 1 begun (the 28 fresh hits: seven classed by measure); its steps 1 (rest), 2, 4 and 5 LEFT

**The lane:** `lane/coherence-upkeep-2026-11-12`. **Base of this seat:** 1bdf565ec (read back from origin before any work). **The brief:** `origin/lane/chair-2026-11-08:docs/chair/2026-11-14/briefs/BRIEF-UPKEEP-10.md` (self-contained; it carries the laws and the final statement's form). **The probes:** `docs/chair/2026-11-14/probes/UPKEEP-10/` (README there) beside UPKEEP-9's. **The births:** the lane's 1,490 (UPKEEP-9's `birthgz.mjs`) and CENSUS-2's 720.

## The brief and the rulings this seat works to

- **Who asks:** the chair, `session_01ACmDYZrFEVXyZEUg1NDxxC`; the owner in its chat, 2026-11-14: "Continue with the pending work! ... I defer all decisions to you and give you all permissions you may require." Merging the pull request and the deploy stay the owner's; no commit at or below 1bdf565ec is rewritten; no pull request.
- **The work, in order:** (1) #869 AT DISPLAY (the band is not moved; the page tells the siege's truth; the Substrate tab's row was cured on round three's tabs lane: not rebuilt); (2) the grain line and the coal lines under a siege (the eighth seat's LEFT 1 (a) (b)); (3) one message to the chair, the count; (4) full history, then the plain merge of `lane/integration-2026-11-07` (976db5b19 when written): 12 conflicted files expected, code by hand, two measured pins measured at the merge, four registers each from ONE side then re-derived through its door; (5) every check of the merge book's section 2m; THE ONE ROW BANKED against this lane (`incomeLineSiblings.js`, "smith", the coal line, `after-base: defence`, 3628f37cc) cured and shrunk through its door; (6) the lane's item 4 (declarations: one ladder for one number; the Services and Magic tabs' labels LISTED; the corpus lines M1 M2 M3 M5 L2 and C-M1's six births declared as exposure); (7) the lane's ONE final statement.
- **The count:** after every item, never more than 45 minutes apart: send_later one minute, read `external_metadata.context_usage.used_tokens`; hand back at 400,000. At 04:10 UTC the field read **0** (the brief: say so in one line to the chair; the chair reads the count).

## What this seat did, in commit order

| Commit | Item | Measure | Moved |
|---|---|---|---|
| 3bd14d0b5 | 2(a), THE GRAIN LINE (#ww-339, #ww-1357): `incomeLineSiblings.js :: trueIncomeDesc` gives GRAIN_OWN_FIELDS_LINE no sentence where the food record names grain as the failed source (`grainFailed`, from `economicState.js`) or the final export list sells grain or flour | on the 1,490 at 1bdf565ec the line prints in 182 births, beside a flour/grain export or a failed grain harvest in **144** (Milled flour 139, Grain export 1, failed grain 37, overlapping) -> **0**; the 720: 72 print it, 69 beside a flour export | DECLARED MOVE, the income lines only: 144 values in 144 births, all `.economicState.incomeSources[*].desc` (the line -> ''); the Grain Sales row keeps its label and share |
| 376dfa04a | the lighting census through its door (three new titles) | 34/34 | titles 29,364 -> 29,367; suiteTitles 7,977 -> 7,978 |
| ef9f38e80 | 4, THE MERGE of `lane/integration-2026-11-07` at **976db5b19** (plain; full history, not shallow; base **69b53decd**) | **12 conflicted files, exactly the chair's list** | code: `defenseDisplay.js :: foodEnduranceLine` 3 hunks: both sides made the SAME cure (the line's `actual` = this lane's `would` = !besieged); kept `would`, this lane's UPKEEP-8 months/stretch cure, both comments, and the line's "would stand in reserve" verb (re-pointed to `would`). `dossierViewModel.js` 1 hunk: both foot additions stand. Tests by hand: foodEnduranceHeldStores (the line's comment and asserts, then this lane's besieged arm), heldKeyWriterCensus (both lists). `mutation-coverage-manifest.json`: both sides' entries. Four registers from THE LINE. **THE TWO PINS, MEASURED AT THE MERGE:** fork census A6 / registry `fnv1a32External` **24** (callers: foodways 3, power-economy 6, upkeep 6, ties 7, faction conflicts 2): the lane's pin read 42 but its tip measured 25 (a carried red), bisected on its first parent: 42 -> 24 at 44cddb372 (UPKEEP-5 F2, upkeep 24 -> 6), 24 -> 25 at 0c950f06c (UPKEEP-5 R3, foodways 2 -> 3); the line 17 -> 16 (resolveTieKey 1 -> 0); 25 - 1 = 24. institutionTable **1,837**: the base 69b53decd itself measures 1,843 (red against 1,849), so the line's re-key has no cause since the base; the lane's tip measures 1,837 = the merge. Gates strict 0, ratchet 0, eslint 0 |
| 34963d56d | the wiring census through its door (from the line's side) | `--check` 1 -> 0 | producerIndexFiles 1,345 -> 1,350; relationRows 165 -> 169 (this lane's defenseGenerator `upkeep`/`fundedGate` rows) |
| 4f710aa3e | the tuning inventory through its ritual (from the line's side) | the walker red 2 ("a WIN is unbanked") -> 76/76 | this lane's tables return (DEFENCE_TUNING, KEEP_TUNING, KEEP_SCALE_TUNING); no value moves |
| 2c7123ade | the lighting census through its door (from the line's side) | red -> 34/34 | files 3,274, parked 405, titles 29,533: each the base's plus both sides' own growth (parked 400 +3 +2) |
| 78bbebcd3 | the hand-back at the count (on the chair's 04:24 rate; the chair's later word: go on to 05:35) | — | — |
| 07e35278d | 2m (3), THE ROW BANKED AGAINST THIS LANE (`incomeLineSiblings.js`, "smith", LOCAL_COAL_SOLD_LINE, `after-base: defence`): REWORDED to name no forge: "Coal is dug here and sold on to other towns, so this income stream leans on the trade route." (true by its gate: coal among the exports, no siege); `--check` showed it stale and no fresh hit; `--shrink` removed it with the five other stale rows (economicState.js's four moved originals, defenseGenerator "house: academy"), viability.js's two first-register bank rows and foodGenerator.js's old foodways strip site, each this lane's cure already made; the siege law in incomeLinesSayTheRecord reads the new wording too | presumedThings walker 4 reds -> 2 (the carried fresh arms); stale 0 | DECLARED MOVE, the income lines: 107 values in 107 births of the 1,490, all `incomeSources[*].desc`. NEW READER SENTENCE, read in r2r-thorp-2, r2r-village-6, r2s-recently_betrayed-city-3 (the largest), r2s-famine-town-3, r2s-occupied-hamlet-3 |
| b2ce1adcb | THE PACKET ROW (the chair's 04:45 row; BRIEF-UPKEEP-11 step 3): EM-R0d.requiredSymbols[2] gains its `retiredBy` (§934.105; 82c639b44), that row only | `node scripts/implementation-packets.mjs validate`: EXIT 1 -> **EXIT 0** ("valid: 257 packets (0 READY)") | — |

### Item 1, #869 AT DISPLAY: MEASURED; no printing leaf is this lane's: FOR THE JOIN

- **On the records** (`m869.mjs`, at 1bdf565ec): the 1,490's 273 besieged births band trade connectivity adequate **70**, surplus **5** (strained 177, critical 18, collapsed 3); CENSUS-2's 720: 31 besieged, adequate **7** (r2r-hamlet-0, r2r-village-55, r2s-under_siege-thorp-0, -thorp-1, -town-0, -city-0, -metropolis-3), strained 21, critical 3.
- **On the page** (CENSUS-2 at 1bdf565ec, every rendered view of the 31 besieged towns grepped for "connectiv"): the band prints on ONE view only, **Summary/Foundations** (31 rows, 7 "Adequate"). Its cure is round three's tabs lane's (`lane/r3-tabs-2026-11-13`, `SubstrateTab.jsx :: siegeCrisisWord`, not on the line at 976db5b19): not rebuilt; it arrives at the join.
- **THE OTHER SURFACE, NOT SEEN BY THE CENSUS** (it renders the dossier's views only): the PDF's Campaign State export prints the same grid, `src/pdf/sections/SystemStateSnapshot.jsx :: CausalSubstrate` (only where `causalDetail` is passed), from `deriveCausalState(vm?.active || settlement)`: the same 75 of 273 and 7 of 31. **FOR THE JOIN:** in `CausalSubstrate`'s `rows.map`, the trade row's word reads the siege's own label where a siege is in force, as the screen's cure does (`const word = row.name === 'trade_connectivity' && siegeLabel ? siegeLabel : tokenCase(causalBandWord(row.name, row.band))`, `siegeLabel` the `under_siege` stress's `label`, the tabs lane's `siegeCrisisWord`); **the test that reds until it is made:** render `CausalSubstrate` with `causalDetail` for `r2s-under_siege-thorp-0` (CENSUS-2's shape; "Adequate" at 1bdf565ec) and assert the Trade connectivity row prints the siege's label, not "Adequate". The Tonight sheet, the Foundry journal (`journalPages.js` reads no causal state) and the exports print no causal band (`git grep` of every `deriveCausalState`/`VARIABLE_LABEL`/`causalBandWord` reader outside the engine).

### Item 2(b), THE COAL LINES UNDER A SIEGE: MEASURED AT ZERO; nothing built

- LOCAL_COAL_LINE and LOCAL_COAL_SOLD_LINE under a siege in force: **0** of the 1,490's 273 besieged births and **0** of the 720's 31 (records, `m10income.mjs`); and on the page, the 31 besieged towns' views hold **0** lines matching "leans on the trade route", "fires the forges", "iron is bought in", "sold to the forges" (85 towns print them, none besieged). The chair's two towns at 1bdf565ec: r2s-under_siege-city-2 prints "Iron & Metalwork: Metal is smelted or worked here."; r2r-thorp-45 "Iron & Metalwork" with no sentence (`trueIncomeDesc`, b11a4d72e). Limits: records and the dossier's views; the PDF prints the same income rows.

### New or changed reader sentences (this seat)

- None written. Removed where false: the grain line in 144 births of the 1,490 (read in rww-metropolis-famine-1, rww-city-recently_betrayed-1, rr2s-town-calm-rand-1, rr2s-metropolis-indebted-rand-43: "Grain Sales" prints with its share alone).

### FOR THE JOIN (this seat's rows)

- #869's PDF row (above).

### New or changed reader sentences (this seat, added)

- "Coal is dug here and sold on to other towns, so this income stream leans on the trade route." (07e35278d; read in r2r-thorp-2, r2r-village-6, r2s-recently_betrayed-city-3, r2s-famine-town-3, r2s-occupied-hamlet-3).

## Incidents

- The first commit carried the chair's session in its Claude-Session trailer; amended before any push (3bd14d0b5).
- CENSUS-2 at the tip re-births in the tree it renders: the grain edit landed in that tree while it rendered; the render workers had loaded their modules before the edit (dumps written after it still print the old line), so the tip census is 1bdf565ec's. Later runs use a separate worktree.

## THE CHAIR'S MESSAGES TO THIS SEAT (copied in; the chair's messages are not on the branch)

- **04:15 UTC, A CHANGE OF ORDER FOR EVERY LANE (vetoable by the owner): THE CLOSE COMES FIRST.** Every lane is to be final for the join in the seat it has now; rows not reached are cured AFTER the join, on the joined line, in the order a fresh measure of the joined tree gives. Step 6's measures and the eight towns stay in the statement.
- **04:24 UTC:** step 3 ACCEPTED at f943c9772. The count read by the chair at 04:21: 227,073 (reckon about 6,000 a minute from it; this seat's own field reads stale). Past 340,000 with the statement not made: push, write exactly where the close stands, hand back; a fresh seat finishes it.
- **04:37 UTC, A HAZARD (copy into every hand-back):** a push with NOTHING TO SEND falls into the pre-push hook's WHOLE suite, and `tests/scripts/implementationPackets.test.js` and `implementationSession.test.js` then run git against the REAL repository from a linked worktree (the local branch moved to a fixture commit, `core.bare=true`, a fixture user in the shared config). BEFORE EVERY PUSH: `test -n "$(git rev-list origin/<branch>..<local>)"`, else do not push; never chain a push after a step that can fail. If bitten: stop the hook, restore the config keys and the branch from the snapshot.

## WHERE THE CLOSE STANDS (at 2c7123ade), AND WHAT IS LEFT, LINE BY LINE

**Registers:** the four the brief names are re-derived: wiring (34963d56d), tuning (4f710aa3e), lighting (2c7123ade); `presumedThings.register.json` is THE LINE's (taken at the merge, its form point 49's) and is read only through the door below. `mutation-coverage-manifest.json` hand-merged (both sides).

**THE CHAIR'S RULING ON THE FRESH HITS (04:58 UTC, once for every closing lane; vetoable by the owner; copied in):** (1) a stale row leaves by the door's shrink form; (2) where a set or table ALREADY DECLARES the atom and the text only stands apart (a constant, a moved literal): the SHAPE CURE, the literal into its declaring member, output byte-identical; (3) a line GATED IN CODE (true wherever it prints, by a condition the code tests) but not declared through a draw door, where declaring it is more than a member's `needs`: NOT banked, NOT keyed by hand, NOT reworded to slip the matcher, NOT re-routed now: it stays RED AND NAMED under FOR THE DECLARATION PASS (file, text, the code condition, the atom, any new word); one declaration pass after the join for every lane; (4) a fresh hit on a line FALSE somewhere is cured now. The statement gives each walker's exit and says these reds are the lane's, named. **BRIEF-UPKEEP-11** (`origin/lane/chair-2026-11-08`, 5de04a329) is the successor's brief: its step 1 is what is left of the door, its steps 2, 4 and 5 the rest.

**Step 5 (BRIEF-UPKEEP-11 step 1), the presumed-things door at b2ce1adcb:** `--check` exit 1, **fresh 28 · stale 0 · strips fresh 1 · stale 0**; the walker red on its two fresh arms. CLASSED SO FAR, BY MEASURE (the 1,490 at 07e35278d, each line against the roster or the siege):
- **FOR THE DECLARATION PASS (class 3: true wherever printed, gated in `incomeLineSiblings.js :: trueIncomeDesc`, a switch, not a draw door; `INCOME_STATE_SIBLINGS` is not handed to any door, so the rule book (`presumedThings.shared.mjs`, "THE CARRIERS ARM 1 CREDITS") credits no `needs` there and a SHAPE CURE into its members would NOT answer the walker):** ALCHEMIST_SUPPLEMENTS_LINE (house: alchemist; gate `has(/alchemist/)`; prints 14, false 0); ALCHEMY_UNDER_SIEGE_LINE (siege; gate `f.besieged`; prints 28, false 0; its set `needs: [SIEGE]`); LOCAL_ORE_LINE (smith; gate `has(/smith/)`; 176, 0); WOOL_LOCAL_LINE (house: fuller; gate `has(/weav/) && has(/fuller/)`; 63, 0); MARKET_DAY_LINE (market; its set `needs: ['market']`, `excludes` the siege; 268, 0). Atoms: the house words and `crisis: under_siege`, all in the vocabulary already. THE DECLARATION: route `trueIncomeDesc`'s choice through `resolveSibling` over INCOME_STATE_SIBLINGS (a draw door), or the sets' members as drawn pools.
- **TITHES_RENTS_LINE (temple) and MASONS_LINE (mason): print in 0 of the 1,490**; both are read by code (`trueIncomeDesc` cases) and by the declarations test: kept; class (3) when read on a corpus that prints them.
- **NOT YET CLASSED (the successor's): `src/data/defenceWeights.js` 9** (the capacity table's `why` strings and the labour rows "Masons at work on the defences", "Elders and reeve", "Alchemists preserving the grain": first find whether any page prints them, then measure each against the roster), **`src/generators/safetyProfile.js` 9** (the force and charter lines: measure each against the forces and the roster), `viability.js` "Traveling hedge wizard", `threatAssessment.js` " and a citizen militia to hold it.", and **the strip** (`foodGenerator.js :: filterDeclared([...rows], { facts: () => factsOf(record), poolId: ... })`: the site reads THROUGH the draw door; if the walker still reds on it, that is a gap of the rule: a STOP to the chair with the output, per BRIEF-UPKEEP-11 (d)).
- The measure: `TREE=<tree> node --input-type=module -e` over the 1,490 gz, each line's constant against a roster regex (this seat's one-off; rebuild it from this list).
- NOT RUN: the rest of 2m (page census, fact layers, observed shapes, writer reach): BRIEF-UPKEEP-11 step 2.

**Step 6 (declarations), NOT STARTED:** (i) the posture line's ladder (`defenseStateProse.js :: posturePoolKey`, another lane's) against the badge's band, measured at the tip as UPKEEP-6's `one-ladder.txt` shows, FOR THE JOIN; (ii) the Services and Magic tabs keep the shown label this release (L3, C11): LISTED; (iii) M1 M2 M3 M5 L2 and C-M1's six births declared as exposure at the tip (find each label in the older parts by script).

**Step 7, the final statement, NOT STARTED.** It needs: CENSUS-2 at the base 69b53decd and at the final tip (`--files` the lane's files; this seat's run at 1bdf565ec is in scratch only, not comparable with the final tip); the 720-birth field diff by family (base -> tip); ONE draft shift record (the golden surfaces and every registered surface the suite's red titles pin, `tests/fixtures/.golden-freeze-register.json`); the whole suite once in SIX vitest shards, every red classed against the base's failing set (reds known at the merge: generationForkCensus A5 — and A1, A3e, A4 were red at the lane's tip f943c9772; the merge's own run showed 3 failing in that file: class them); every rating move gathered by script from the parts' tables (eighth, ninth: "What this seat did"; seventh: W1, W3; the capacity branch's cumulative move); #608's one-band-apart count (445 on the 1,490 at 06818b064: re-measure at the tip) with "the word alone everywhere" as the owner's open choice; THE EIGHT TOWNS at the final tip under a new heading in `docs/chair/2026-11-13/UPKEEP-CAPACITY-EIGHT-TOWNS.md`; every new or changed reader sentence of the whole lane with its town (this seat wrote none); FOR THE JOIN gathered whole from every part; the edge bundles last. Leave the fresh reader 1dac1ca25 and the monotonicity claims as its first acts.

**How the instruments are re-made:** as UPKEEP-9's list below; plus this seat's `m869.mjs`, `m10income.mjs`, `g10.mjs` (README here). The scratch worktree needs a REAL `node_modules` (`npm ci`, then `git config --local --unset core.hookspath`); push with `git -c core.hooksPath=.husky/_ push origin <local>:refs/heads/lane/coherence-upkeep-2026-11-12` after the rev-list test above. A CENSUS-2 run re-births in the tree it renders: run it in a tree nobody edits. A pin's caller attribution: a scratch line in A6 printing `seen.hashes` (never committed).

---

# COHERENCE-UPKEEP: the hand-back (the ninth seat, UPKEEP-9, 2026-11-14) — HANDED BACK AT THE COUNT (587,716 tokens at 03:41 UTC): STEP 7 DONE (the capacity merge, its rows, its three reds); C-L7's other two bars; step 2 (a) (b) (c) done; the chair accepted step 7 at 496f5e4a5

**The lane:** `lane/coherence-upkeep-2026-11-12`. **Base of this seat:** 6b5a1c5a9 (the eighth seat's lighting census), read back from origin before any work; the capacity branch read back at 9354d792a FINAL. **The probes:** `docs/chair/2026-11-14/probes/UPKEEP-9/` (README there). **The births:** the eighth seat's 1,490 (`docs/chair/2026-11-13/probes/UPKEEP-8/seeds.all.txt`, its `cfgFor`), born whole by `birthgz.mjs`; and CENSUS-2's 720 (`lane/census-2-2026-11-13`'s `census2.sh`, run from a scratch copy). The eighth seat's part and every earlier one are kept below, unchanged.

## The brief and the rulings this seat works to (the chair's messages are not on the branch)

- **Who asks:** the chair is now the Claude Code session `session_01ACmDYZrFEVXyZEUg1NDxxC` (the program moved account on 2026-11-14 ~00:55 UTC; every earlier session, the old chair `session_01FE9mEws7PXYRYdjQPbSX15` and the eighth seat among them, is ended). The owner, in that chair's chat on 2026-11-14: "Continue with the pending work! ... I defer all decisions to you and give you all permissions you may require." The brief: `origin/lane/chair-2026-11-08:docs/chair/2026-11-14/briefs/BRIEF-UPKEEP-9.md`; BRIEF-UPKEEP-8 binds as written with its changes. Merging the pull request and the deploy stay the owner's. No commit at or below 6b5a1c5a9 is rewritten.
- **The work, in order:** (1) step 7: the plain merge of the capacity branch, then #598 (RULED, record 422: the model may count a town hall as the least kind of court; the page names a court only where a courthouse stands on the roster), #1082's flag, viability.js's rows (the increment's line, round two B's rows), #869 (measure first what reads that band). (2) The rows routed after the eighth seat's brief and its LEFT list: (a) `foodGenerator.js :: generateFoodSecurity` strips the culture lines' declarations; (b) MEASURE ONLY the defence profile's two homes for arcane defence (58 of 720); (c) W5's figure at the tip. (3) One message to the chair and THE COUNT check. (4) Step 8 waits for point 49 (the chair names the integration line's tip).
- **THE CHAIR'S RULINGS ON THE FOUR OPEN QUESTIONS (its message of 2026-11-14 01:30 UTC; each vetoable by the owner):** (1) **#608 STANDS AS BUILT**: the word alone only where figure and word stand two bands apart (the Output chip printed once is the owner's own T2-1 ruling). The statement gives the count of births where figure and word stand ONE band apart, and lists "the word alone everywhere" for the owner's veto as an open choice. (2) **THE INCOME LABELS**: the stored labels stay (no record moves). MEASURE ONLY the towns where "Apothecary & Alchemy" prints on a page with no alchemist's house on the roster; FOR THE JOIN (one display leaf for an income source's printed label, reading the roster). Build nothing. (3) `tonightSheet.js :: foodStoresWords` is round two B's file: sent there; not this lane's. (4) **C-L7, THE OTHER TWO BARS**: one home for a bar's colour is its own band. MEASURE FIRST the births where the military or the internal bar's colour class disagrees with the band printed beside it; if none, say so with the instrument; if any, the same cure as the economic bar, display only, its own commit, after step 7's rows.

- **THE COUNT, CHANGED (the chair's message of 2026-11-14 02:21 UTC):** the mark is 400,000 (not 350,000); the check is AFTER EVERY ITEM (every pushed cure), never more than forty-five minutes apart. At a hand-back this file says WHAT IS LEFT line by line and how the instruments are re-made, so a successor opens only this part.

- **STEP 8'S WORD IS GIVEN (the chair, 2026-11-14 03:08 UTC):** point 49 is on the line, `lane/integration-2026-11-07` = **976db5b19** (read back by the chair at 03:08). When the list reaches step 8: do not wait and do not ask. Merge the line's tip as read back then (a plain merge; say which commit and what conflicted); cure the one row banked against this lane and shrink it out; read the instrument's findings on this lane's lines; then the lane's item 4 and its ONE final statement. FOR THE INSTRUMENT: the merge book's section **2m, "FOR EVERY LANE THAT MERGES THE LINE AFTER POINT 49"** (`docs/INTEGRATION_STYLE_2_2026-11-09.md` on `lane/merge-15-point-49-wip-2026-11-14`, pushed at d893d9289 (03:18): the instrument's walkers and registers, each door's checking and writing command, how a banked row is cured and shrunk; its part (3) names this lane's row: `src/generators/economy/incomeLineSiblings.js`, "smith", the coal line, reason `after-base: defence`). Read it, by script and by range, before the first register touched after the merge.
- **THE SHALLOW-CLONE HAZARD (the chair, 03:15 UTC):** a shallow clone can give a WRONG merge base, not a missing one (the chair's clone at depth 1,600 gave this lane deb1544eb; with full history it is 69b53decd; another lane's merge showed 31 false conflict hunks). BEFORE THE MERGE: `git fetch --depth=2147483647 origin lane/integration-2026-11-07 lane/coherence-upkeep-2026-11-12` (about 250 MB); then `git rev-parse --is-shallow-repository` prints false and `git merge-base --all origin/lane/integration-2026-11-07 HEAD` prints 69b53decd. The chair's in-memory merge of fb403c4ce with 976db5b19: **12 conflicted files**. CODE, resolved by hand at the cause and listed: `src/domain/display/defenseDisplay.js`, `dossierViewModel.js`, `src/domain/generation/generationForkRegistry.js`. THE REST are registers and tests keyed to them (`wiring-census.json`, `mutation-coverage-manifest.json`, the lighting census, the tuning inventory, `presumedThings.register.json`, the heldKeyWriterCensus and institutionTable walkers, generationForkCensus, foodEnduranceHeldStores): each taken from ONE side and re-derived through its own door after the merge, never merged by hand. A conflict outside this list means the base is wrong or the lane moved: look before resolving.

- **#869, RULED (the chair, 03:41 UTC; vetoable by the owner):** THE BAND IS NOT MOVED. A score of the world pulse reads it, and the simulation's ground is not this program's to move (the owner's word of 2026-11-07: nothing of advance time or simulation before FPZ). THE MODEL KEEPS ITS BAND; THE PAGE TELLS THE SIEGE'S TRUTH: where a surface prints trade connectivity as "Adequate" under a siege in force, the cure is at DISPLAY, in the leaf that prints it, never in `causalState.js`. MEASURE FIRST which surfaces still print it at the tip (the Substrate tab's row was cured on round three's tabs lane: do not rebuild it). If the printing leaf is a file this lane holds: a display-only cure, red first, a guard town, its own commit. If another lane's: FOR THE JOIN (file, function, the one-line change, a test that reds until it is made) and leave it. Step 7 and the routed rows were read and accepted at 496f5e4a5.

## What this seat did, in commit order

| Commit | Step | Measure | Moved |
|---|---|---|---|
| c448bb3a0 | 7, THE MERGE of `lane/upkeep-capacity-2026-11-13` at 9354d792a (a plain merge; base 6e61d042a) | **Nothing conflicted.** One path on both sides since the base, `docs/content/wiring-census.json`, merged textually; package files byte-identical | the capacity branch's C0 to C6 (its cumulative move against 8ef42a051 on the 3,756: readiness in 2,939, 542 bands, 481 power structures re-drawn, 7 births gain or lose a power) |
| c0b31f935 | the wiring census re-taken by its door (the textual merge was one producer file short: the capacity branch's new `houseScale.js`) | `--check` 1 -> 0 | producerIndexFiles 1,331 -> 1,332 |
| 33acecd6d | the lighting census re-taken by its door (the capacity branch added two test files without a refreeze) | the walker red -> 34/34 | files 3,245 -> 3,247 |
| 7515c2abb | 7, #1082: the gang flag reads the gang houses (`priorityHelpers.js :: getInstFlags`, the flag's own line) | the street-gang line with no gang house: 6 -> 0 on the 1,490 | DECLARED MOVE: the stored flag in 250 births; the gang row and its "(street gang)" services leave in 6 (the existing background-crime row and word-of-mouth fence take their place in 5) |
| ef13e06cd | the lighting census (the #1082 test file) | 34/34 | files 3,247 -> 3,248 |
| 06818b064 | 7, viability.js's rows (#576 #823 #824 #825, #ww-522, the hedge suggestion; and the magic row's denial) | the machinery rows on the 1,490: 4 births -> 0; "no arcane house" beside a Teleportation circle: 10 of 13 extreme-dial towns -> 0 | DECLARED MOVE: `economicViability` in 4 births of the 1,490 |
| e8e6d98ac | the lighting census (the viability test file) | 34/34 | files 3,248 -> 3,249 |
| 7fb349471 | this hand-back part and the probes | — | — |
| 5590e54fd | C-L7's other two bars (the chair's 01:30 ruling (4)): Invasion & War and Internal Security coloured by the band their rows print (`threatAssessment.js :: bandBarColor`, the economic bar's own colours) | a bar beside another band's word, on the 1,490: military 94, internal 162 -> 0 | display only (the Defense tab's bars and the PDF's `barColor`) |
| fb403c4ce | the lighting census (one test title) | 34/34 | titles 29,361 -> 29,362 |
| f78522bf6 | 7, THE MERGE'S THREE REDS, each at its cause (each red at the capacity tip itself; that branch's census never ran tests/domain): `defenceTraditionNames` re-keyed by identity (its reference takes G3s and G5 by name; its source pin reads `housedOf`, G3); `institutionRename` A1: `defenseProfile.institutions.garrison[].catalogId` declared in `NON_CASCADED_SURFACES` (a catalogue-shape crossing after C2) | 3 rows red -> green | no record |
| 4ff5b11e3 | 2(a), the culture's foodways lines read where chosen (`foodGenerator.js :: cultureFoodwaysOf`, through `filterDeclared`) | "dense populations" false: 59 -> 0 on the 1,490 | DECLARED MOVE: the foodways line and its copy `culturalIdentity.foodways`, 59 births |

### The chair's 01:30 measures (the lane's 1,490 at 06818b064, `chair0130.mjs`)

- **#608, one band apart:** the Economics glance's Output figure (red under 35, amber, green from 60) and the prosperity word (Poor or lower, the middle, Prosperous or higher) stand ONE band apart in **445 births** (two apart: 2, the eighth seat's two, where the word prints alone; the same band: 1,043). FOR THE OWNER'S VETO, an open choice: "the word alone everywhere" (the T2-1 ruling keeps the chip printed once).
- **The income labels:** an income source whose label names alchemy is held by 554 births; **"Apothecary & Alchemy" with no alchemist's house on the roster: 351 births.** FOR THE JOIN: one display leaf for an income source's printed label, reading the roster (the stored labels stay; nothing built).
- **C-L7's other two bars:** built (5590e54fd, above): the military bar disagreed with its band in 94 births (amber beside Weak 41, green beside Adequate 53), the internal bar in 162 (41, 121); 0 after.

### STEP 2(c), W5 (the corpus's; its figure only)

- `w5.py` (rebuilt from the seventh seat's own description of the class: the Defense tab's can-pay corpus row "… can pay its way through it" beside "may not come through this crisis" or `m3.py`'s spending line; the seventh seat's exact doom pattern was not saved, so this is the class as written, not its script): on CENSUS-2's 720 at the merge's renders (no later commit of this seat touches those writers), the can-pay row prints in 62 towns; beside a doom line 2, beside a spending line 5, **either 5** (r2s-famine-metropolis-2, r2s-famine-town-1, r2s-wartime-city-1, r2s-wartime-city-2, r2s-wartime-metropolis-3). NOT COMPARABLE with the seventh seat's 238: that was the reader's 1,200 rv2 births (two hundred forced per crisis); the 720 holds few forced famines and wars. Counted again at the join.

### The governing suites at the merge, classed (`attr.sh`; the lists `fails-<sha>.txt` beside the probes)

- At 33acecd6d (tests/generators lint joins copy pdf domain): **24,589 tests, 52 failing in 39 files** (58 FAIL rows with the file-level ones). Each of the 39 files run again at the lane's own tip 6b5a1c5a9 (55 rows) and at the capacity tip 9354d792a (62 rows): **every one of the merge's 58 rows is red at one parent or the other**; the merge itself made none. Against the lane's tip, three are new, all red at the capacity tip itself, cured at their cause in f78522bf6 (above). The rest are the lane's carried set as the eighth seat classed it at 7403ee457 (`ledgerCitationIntegrity` on the absent local ref, the observed-shape corpus's tier seed and its readers, presumedThings ARM 1's four, `negativeAssertionAnchor`'s `safetyForceLines` 52-53, `famineStoresOneRounding` soak1k-2452, the golden-corpus pins) and the capacity branch's golden-corpus moves (the pin-seam A1/A6 rows, `foodModelSingleWriter` FIX-G1, `generationCertificationCorpus` BY IDENTITY, `generationForkCensus`, `goldenViewModel`): no golden's door is opened by this seat; the final statement measures the surfaces.
- After each commit of this seat, its touched files' governing suites were run and every red compared, body for body, with the commit before: no red is any commit's own.

### #598, MEASURED: no line of this lane's prints a court off a town hall; the flag stands by ruling 422

- At the merge (33acecd6d), on the 1,490: the court flag (`defenseFactsOf.hasCourt`, which takes a town hall) stands with no courthouse in 185 births; the safety profile's sentences name a court in **0** of them (48ad4da91's reading of `hasCourthouse` holds). The economy's Court Fees reads `hasCourthouse` too.
- On CENSUS-2's 720 at the merge (`court598.mjs`): 76 towns hold the flag with no courthouse; 73 print a line naming a court, **none written by this lane**: the Defense tab's "Legal Infrastructure · Court only" / "Courts without detention. Fines and exile only." (62) and "Court + Prison" (14) (`defenseDisplay.js :: deriveSupportingCapabilities`, cured on lane/w2-c-leaves-side at 391b39db0, not on this lane); the defence desk's "…'s court passes sentences it cannot enforce", "Offenders at … are arrested, tried and held, and each case is written into the court's lists", "Bring a complaint at … and it goes to a court" (the corpus, `dossierStateProse/defense.generated.js`); the Overview's "The town keeps its own court and its own gaol." (the corpus, `general.generated.js`); the Services tab's town-hall row "Hears civil pleas in the town court" (18; `src/data/institutionServices.js`, "Dispute adjudication"); three figures of speech ("Commercial disputes resolved outside the courts", "tithes, land, and courts are all ecclesiastical", "(land, courts, levies)"). **FOR THE JOIN**, each with its writer above.
- The flag itself is not changed: by ruling 422 the model may count a town hall as the least kind of court.

### #869, A STOP BY THE BRIEF'S OWN RULE (measured; nothing built)

- `causalState.js :: deriveTradeConnectivity` reads no siege at birth: on the 1,490 at the merge, of the 273 besieged births the trade-connectivity band reads **adequate 70, surplus 5**, strained 177, critical 18, collapsed 3 (`m7.mjs`). The siege reaches it only as a world-pulse condition (`applyConditions(... 'trade_connectivity', { effect: ['restored', 'cut'] })`).
- **A SCORE READS IT**, so the brief's rule makes this a stop: `domain/worldPulse/demographicsRisk.js` (plague transmission, `scores.trade_connectivity / 100`), `domain/worldPulse/causeVocabulary.js` (the chain-starved cause, `bandLowGood(ctx.scores.trade_connectivity)`), `domain/worldPulse/npcLadderGoals.js` (the merchant's and the outsider's goals), the autonomy signals (`domain/autonomy/signalRegistry.js`, via the world snapshot's causal scores), `lib/structuralFingerprint.js`, `domain/regenerationDelta.js` (the ripple), and the display (`SubstrateTab.jsx`, `explanation.js`).
- **Recommendation:** the siege is read at birth as the condition it already is (a cut), in the deriver, as a declared move of the causal state, measured on the world pulse's readers above; or the page alone reads the siege's truth beside the band (a second home: not recommended). The chair rules.

### FOR THE JOIN (this seat's rows; the house-label leaf `institutionDisplayName.js :: institutionHouseLabel` is on lane r2-code-b)

- **The stored siege / stockpile sentence** (`viability.js :: generateEconomicViability`, the trade-dependency branch: `critical.map((d) => institutionDisplayName(d.institution))`): catalogue ranges print ("Taverns (5-20)", "District markets (…)": the range as the catalogue writes it) in **82 births of the 1,490**. The cure is that leaf in that `.map` (records move: `economicViability.issues[].description` and the copy `historyGenerator.js` makes into `history.currentTensions[]`).
- **The resource-chain suggestions** (`viability.js :: deriveResourceChainAnalysis`: `reachable…map(institutionDisplayName)` and `missing.map(institutionDisplayName)` in the descriptions, and the raw `missing.join(' and ')` in `suggestedFixes`): "Merchant guilds (3-8)" in **21 births of the 1,490** (counted in the records). The same leaf at the three call sites.
- **#598's writers** (above): the corpus desk and the general pool, `defenseDisplay.js` (391b39db0 on the side lane), `institutionServices.js`'s town-hall row.
- **STEP 2(b), MEASURED ONLY: the defence profile's two homes for arcane defence** (CENSUS-2's 720 at the merge 33acecd6d, `arcane2.mjs`). (1) `defenseProfile.traditions.hasArcane` (`defenseGenerator.js :: computeDefenseScores`, `t.hasArcane`: magic functions AND the magic dial at or above the tradition's gate, `DEFENCE_TUNING.traditionGates.arcane` = 35, AND the roster's casters, `defenseTraditionNamesOf(...).arcane`); (2) `defenseProfile.institutions.magicDef` (`defenseInstitutionBuckets.js :: partitionDefenseInstitutions`, the bucket's names alone: wizard, mages' guild, mage, academy of magic, golem workforce). Of 203 towns with a magicDef house, **52 disagree** (hasArcane false), and in **all 52 the cause is the dial**: magic functions, the casters stand, the magic dial is under 35 (Wizard's tower 26, Mages' district / Academy of magic 19, Mages' guild 5, Traveling hedge wizard 2). WHICH EACH SURFACE PRINTS: the rating and its parts read (1); the Defense tab's "Arcane defense" force group, the PDF's forces and the Foundry journal read (2), through `defenseDisplay.js :: arcaneDefenseOf` (gated only by `magicWorksAt`): it prints in all 52; the Magic tab's "Military role" reads a third home, `magicProfile.js :: deriveRoles` (the magic level, the arcane power, the practitioners): "absent" in 32 of the 52. BY THE MODEL'S OWN RULE the rated home is (1): below the gate the casters are not retained for defence. THE SMALLEST CURE: `arcaneDefenseOf` reads the tradition (empty where `traditions.hasArcane` is false): display only, 52 of 720 towns; `defenseDisplay.js` is the third leaves lane's file.

## Calls taken (each vetoable)

- **The merge's two registers re-taken by their doors in their own commits** (the wiring census, the lighting census), as the capacity branch did after its own merges.
- **#1082 at the flag**, not at the line: the line already reads the gang houses for its wording (48ad4da91); the flag is the one place the false opening lives, and its only other reader (the merchant army) moves in no birth.
- **viability.js: the priority notes leave** rather than being reworded (each repeated its row's description with the dial's figure). The magic row's house test reads the defence traditions' home (its casters and teleport circle) and keeps the alchemist, so the row says "no arcane house" only where none stands.
- **The isolation note is left out** beside a town that is not viable or under a siege (silence, not a false sentence); the two dependency rows print on no tab, so their wording was only cleared of figures.

## Incidents

- My first probe read the safety profile at `s.safetyProfile` (it lives at `economicState.safetyProfile`) and reported 0 gang and court lines; corrected the same hour, re-run: 6 gang lines, 0 court sentences.
- A shell-backgrounded births run (`&`) died with its shell; re-run as a tracked task.
- At the hand-back, a failed docs edit left nothing to commit and the chained push ran with nothing to send: it exited 1 and sent nothing (origin stayed at 496f5e4a5). Not repeated.
- **A CORRECTION, by name:** 06818b064's body gives "Merchant guilds (15-40)" as the chain suggestions' range; the 21 births print "Merchant guilds (3-8)" (counted in the records after the push). The count stands; the example was wrong. A pushed commit is not rewritten.
- The first #1082 test used `test.each`, which parks the file in the lighting census (the each-family debt only shrinks); rewritten as plain loops before the push, red-first proved again (2 of 3 red with the old line).
- CENSUS-2 at the merge (`c2-merge`) rendered from the merge's src; only its final writer-tracing step ran after this seat's first edit, so its writer attribution is not used: the court lines were traced by `git grep` above.
- `npm ci` wrote `core.hooksPath=.husky/_` into the shared local config (twice: two worktrees): removed at once each time; the lane's pre-push hook is run per push by `git -c core.hooksPath=.husky/_ push …`. Local config compared after every push: unchanged.

## LEFT (in order)

0. **#869 at display (the ruling above), NOT STARTED:** CENSUS-2 at the tip (the copied probe), grep the 720's siege dumps for the trade-connectivity band word; trace the printing leaf; cure if this lane's, else FOR THE JOIN.
1. **The eighth seat's LEFT rows (step 2's "whatever its part lists as left")**, NOT STARTED: (a) the grain line (`economicState.js`: GRAIN_OWN_FIELDS_LINE reads neither a failed grain harvest nor a flour export: #ww-339 rww-metropolis-famine-1, #ww-1357 rww-city-recently_betrayed-1; a condition at the choice; measure on the 1,490, a declared move of the income lines); (b) the coal lines under a siege (LOCAL_COAL_LINE, LOCAL_COAL_SOLD_LINE; `trueIncomeDesc` already silences the sold line under a siege: measure what still prints first, on r2s/r2r shapes, CENSUS-2's 720 holds them); (c) the safety lines' court off a town hall: DONE as a measure (#598 above: 0 of this lane's lines on the 720).
2. **Step 3: ONE message to the chair** (the tip; step 7's counts; what the merge moved), then THE COUNT (mark 400,000; after every item; at most 45 minutes apart).
3. **Step 8, THE WORD GIVEN (976db5b19; the two bullets at the top of this part):** deepen first, read section 2m; merge it plainly; cure the ONE row the merge seat banked against this lane (a literal in `incomeLineSiblings.js`, the merge book's section 2k.5, commit 3628f37cc, reason `after-base`) and shrink it from the presumed-things register through its door; the lane's item 4; THE ONE FINAL STATEMENT (BRIEF-UPKEEP-6's form, as BRIEF-UPKEEP-7 item 5 restates it: CENSUS-2 at base and tip, the field diff by family, the whole suite once in six vitest shards with every red classed against the lane's reviewed base 69b53decd, the 51 golden surfaces in one draft record, the eight towns, every new sentence with its town, the edge bundles last and alone). Leave the fresh reader the walker change 1dac1ca25 and the monotonicity claims as its first acts.

**How the instruments are re-made** (all in `docs/chair/2026-11-14/probes/UPKEEP-9/`, scratch outputs outside the tree):
- A scratch worktree on a local branch at the lane's tip with a REAL `node_modules` (`npm ci` there; then `git config --local --unset core.hookspath` in the shared config, which `npm ci` writes); a second detached worktree for "before" runs (a symlinked `node_modules` is fine there, not for a refreeze).
- The 1,490: `TREE=<tree> node birthgz.mjs docs/chair/2026-11-13/probes/UPKEEP-8/seeds.all.txt <out.gz>` (about 3 minutes); a field diff: `node fdgz.mjs <a.gz> <b.gz> [examples]`; the step's measures: `m7.mjs`, `chair0130.mjs`, `foodways.mjs` over a corpus.
- CENSUS-2's 720 and any v9 reading: `git archive origin/lane/census-2-2026-11-13 docs/chair/2026-11-13/probes/CENSUS-2 | tar -x -C <scratch>`, copy `census2-seedcfg-v9.mjs` over its `seedcfg.mjs`, then `sh <scratch>/…/census2.sh <tree> <out> 2 [--seeds <file>]` (720 towns take about 27 minutes at two workers); `court598.mjs`, `arcane2.mjs` and `w5.py` read its output.
- The merge's reds: `attr.sh <sha>...` re-runs the files of `fails-files.txt` (made from a FAIL list) at each sha in the second worktree.
- The lighting census after any new test file or title: `LIGHTING_CENSUS_REFREEZE=UPKEEP-9 LIGHTING_CENSUS_NOTE=… npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js` on a CLEAN tree, then the plain run green, its own commit. Never `test.each` in a new file (the each-family park debt only shrinks).

---

# COHERENCE-UPKEEP: the hand-back (the eighth seat, UPKEEP-8, 2026-11-13) — STEPS 1 TO 6 DONE; the seat stops here for the chair (2026-11-14)

**The lane:** `lane/coherence-upkeep-2026-11-12`. **Base of this seat:** 995293e81 (the seventh seat's hand-back), read back from origin before any work. **The probes:** `docs/chair/2026-11-13/probes/UPKEEP-8/`. **The births** (`births.mjs`): 1,490 in the app's own shape — the seventh seat's 1,440 (REVIEW-UPKEEP-2 `seeds.all.txt` + `fresh.seeds`, REVIEW-UPKEEP-3 `own.seeds`; `birthConfig({...DEFAULT_CONFIG, settType, selectedStresses, selectedStressesRandom:false})`), the round-three readers' twenty (`rr2s-*`, REVIEW-R2-STAGES `seeds20.txt`, + `_randomizePriorities:true` and the route select) and the increment's thirty (`rww-*`, ROUND-3-CUT/increment `seeds.ww.txt`, + `_randomizePriorities:true`); `seeds.all.txt` beside the probes. The seventh seat's part and every earlier one are kept below, unchanged.

## The brief's rulings, copied in (the chair's message of 2026-11-13 is not on the branch)

- **Who asks:** the chair, session `session_01FE9mEws7PXYRYdjQPbSX15`; the standing delegation re-confirmed 2026-11-13; every decision but the release's merge and deploy is the chair's. No adjacent repair. No commit at or below 995293e81 rewritten.
- **The order:** (1) the income lines, one family (`economicState.js`); (2) F3, the threat rows (`threatAssessment.js`): (a) every test of "a force" reads the lane's one projection (garrison, militia, a household levy, watch, contracted company), then re-measure; (b) a cell still contradicted of fifteen rows or more gets ONE twin saying what the place holds and what its country asks, true under its band, read in three towns; fewer: the sentence left out, the band alone; (3) the safety lines (`safetyProfile.js`); (4) the Food endurance line (one home for the figure); (5) the Outlook (`dossierViewModel.js :: deriveViability`, RULED this lane's): not "keeps order" beside a critical law and order, not "pays its way" where poor and earning less than it spends, not "grows what it eats"/"feeds itself" where it buys food or lists critical imports; (6) #608 (the glance "26/100" beside "Prosperous"; one home for the label) and C-L7. THEN STOP AND TELL THE CHAIR. Steps 7 (the capacity merge; #598, #1082's gang flag, the increment's viability.js line, #869) and 8 (item 4, the final statement) wait for the chair's word.
- **RULED (income):** a line says only what the record holds; it names a trade only where the roster holds a house of it (an apothecary is not an alchemist); under a siege nothing is bought in or sold out by road; an impaired chain is not described as working. Twins APPENDED to `incomeLineSiblings.js` (shared with the third leaves lane). A declared move, its field diff confined to the income family.
- **THE METHOD** (record 386): every line read where it prints (three towns of its cells; a siege, a famine, an occupation among them; the smallest and largest size); a twin carries its siblings' conditions; a line naming a house, role, force or good reads the roster; a line that cannot be made true is not written; every disqualifier cure has its guard town. A cure in generator code is a declared move; no rating moves in steps 1 to 6. No new key in the record; no new vocabulary word; no user-hideable name in a stored composed sentence.
- **DO NOT CHANGE until step 7:** `defenseGenerator.js`, `defenseInstitutionBuckets.js`, `houseScale.js`, `defenceWeights.js`, `priorityHelpers.js` (read only). **NOT MINE:** `defenseStateProse.js`, `DefenseTab.jsx`, `ServicesTab.jsx`, the Economics "Needs X · affects" row, `economicData.js`, `defenseDisplay.js`, the corpus. W5 (238) is the corpus's: counter kept.
- **Later (the chair's messages of 21:27 and 21:51, copied in):** step 3 gains `SAFETY_LINE_SIBLINGS` (a size word in 11 small places) and `COURT_AND_PRISON` (a court or a prison named where the roster holds none; #598's family: cure only what the line itself can read from the roster). For every writer held, filter CENSUS-2.json (lane/census-2-2026-11-13) by its files. BEFORE THE FINAL STATEMENT run `census2.sh` at the tip on this lane's files, read every hit, cure or name it; the statement gives each kind's count at the base and the tip, with its limits (the dossier's views only; it cannot see two lines disagreeing). Step 7 gains `viability.js :: generateEconomicViability` (12 towns of kind (f): a house's name with its count range inside a stored sentence; cure at the writer, the plain name).

- **Later (the chair's messages of 22:36 and 22:42, copied in):** (1) the cut's #213 #276 #546 (sawmilling, no sawmill) confirm in their towns; #93 (Agricultural Rents at 100% in a fishing thorp): measure; cure inside the family's rule if the LINE is the fault; if the MIX is, name it with its count, do not re-deal it. (2) Step 4 gains the increment's rww-village-religious_conversion-1 and rww-village-calm-1, and the round-three tabs lane's #34 #75 #103 #137 #184 #226 #290; `defenseDisplay.js :: foodEnduranceLine` and `monthsInWords` are THIS LANE'S ALONE (the rest of that file the third leaves lane's). RULED: the words contain the figure they stand for; what a siege WOULD do is said only where none is in force, what it HAS done only where one is; an arithmetic the line states adds up from the record's own stored months. (3) For step 7: `viability.js` also holds round two's second code lane's rows (the slider lines #576 #823 #824 #825; "Add a tier-plausible hedge practitioner or alchemical workshop", 21 towns; the stockpile sentence's house named by its catalogue name with a range — the cure is the house's label, whose leaf is on that lane: write the call site under FOR THE JOIN), text in `origin/lane/r2-code-b-2026-11-13:docs/chair/2026-11-13/R2-CODE-B-HANDBACK.md` part 2.

## What this seat did, in commit order (each its own writer, red first, measured on the 1,490)

| Commit | Step | Measure, 995293e81 -> here | Moved |
|---|---|---|---|
| b11a4d72e | 1 the income lines (`economicState.js`; twins APPENDED to `incomeLineSiblings.js`, SHARED with the third leaves lane; `scripts/lib/table-pools.mjs` enrols `INCOME_STATE_SIBLINGS`) | false income lines by the record 2,069 in 1,121 births -> 0 | DECLARED MOVE: `economicState.incomeSources[*].desc` only, 2,078 values in 1,126 births |
| fbc4a0080 | 1 the census's lines in the family (sawmilling; road tolls, gate tolls, port duties, transit, market day, bought timber under a siege) | the family, census classes added: 2,430 in 1,186 -> 0 | the same path only: 2,439 values in 1,191 births in all |
| c924351e6 | 2 F3 (`threatAssessment.js`): (a) the projection's forces, (b) one twin per cell of fifteen | contradicted rows 803 in 613 births (726 by the band alone, the seventh seat's figure reproduced) -> after (a) 523 -> after (b) 0; 53 rows (cells under fifteen) print their band alone | display only |
| 48ad4da91 | 3 the safety lines (`safetyProfile.js` in place; new leaf `safetyLineTruth.js`, the file at its 800-line ceiling; one argument at `steps/assembleSettlement.js :: withGuardPaidFromDefence`) | court named, no courthouse 187 -> 0; "little harm" beside organised crime 211 -> 0; patrol beside a cut-off watch 85 -> 0; military command in a small place 85 -> 0; streets 86 -> 0; districts 18 -> 0; territorial gangs 51 -> 0; #713/#1201 3 -> 0; #1173 3 -> 0; #1080 1 -> 0 | DECLARED MOVE: the safety profile's four sentence fields only (crimeTypes desc 397, guard 251, drag 211, safety 143; 782 births) |
| 7c7f0077e | 4 measured as a stop (withdrawn by the chair's 22:42 ruling, which made the line's two functions this lane's) | — | — |
| 2e25b5ffe, 6e61d042a | 5 the Outlook (`dossierViewModel.js :: deriveViability`); the types fix | "pays its way" beside a low rung 90 -> 0; self-sufficiency beside the printed list's marked imports 171 -> 0; "feeds itself" beside bought food 60 -> 0; "keeps order" beside a critical Law & order 28 -> 0; a good the printed list lacks 168 -> 0; "grain keep arriving" 17 -> 0 | display only; 519 summaries |
| 4513f0237 | 6 #608 (`outputChipBesideWord`, `EconomicsGlance.jsx`, SHARED) and C-L7 (the Economic Survival bar's colour reads its band) | figure and word two bands apart: 2 births (rww-metropolis-infiltrated-1, rr2s-village-monster_pressure-rand-1) -> the word alone | display only |
| 1a7a02927 | 4 the Food endurance line (`defenseDisplay.js :: foodEnduranceLine, monthsInWords`, SHARED) | "a few weeks" for under ten days 101 -> 0; tense against the siege 1,217 -> 0; full months not the stores 913 -> 0; half months not twice the stores 1,123 -> 0 | display only |
| db13fdb40 | the governing suites' reds at 6e61d042a, each at its cause (chainId; the size test off the garrison line; the any-holes typed; the holder table's cited line kept; two argument keys renamed out of the alias draft; the census JSON by its door; two struck phrases; `test.each` to loops; three anchors; three pins re-keyed by identity) | every class above still 0 at this code | the street-gang twin reworded (51 lines) |
| 7403ee457 | the lighting census re-taken through its door (files 3,230 -> 3,244; the walker was red at the base already) | the plain re-run 34/34 green | — |
| 117d7439c | the governing suite's one red at 7403ee457: `tradeListWriters.walker` read the Outlook's `eco.primaryExports : []` (a read) as a writer key; passed as a copy | the walker green; no census row added | display only |
| 18457a827 | #93 BUILT (the chair's 23:48 ruling), a DECLARED MOVE of the income family: `incomeLineSiblings.js :: houseOfWorkLine` (appended), one call line in `economicState.js` | a small place's rents as its only line beside a house of work: 26 -> 0 | `economicState.incomeSources` only, 26 births (rents 100 -> 87, one row) |
| (next) | the lighting census re-taken through its door at 18457a827 (files 3,244 -> 3,245: the #93 test file) | the plain re-run green | — |

The new sentences, each with the towns it was read in, are in each commit's body and in `probes/UPKEEP-8/*-samples.txt`; they are listed for the owner's veto below.

## The governing suites, classed (tests/generators tests/lint tests/joins tests/copy tests/pdf tests/domain)

At 995293e81: 51 failing rows in 38 files. At 7403ee457: 24,556 tests, 50 failing. Classed against the base row by row (file-level failures by their file): NEW and this seat's: ONE, `tradeListWriters.walker` (cured at 117d7439c). Load only: `stressSummaryName` (a timeout in the full run; green alone). Red identically at the base and not this seat's: `ledgerCitationIntegrity` (it reads the LOCAL branch `refs/heads/review-fixes-2026-07-08`, which this container does not hold; the remote ref stands), the observed-shape corpus's tier seed (`osr-tier-14 minted no tier candidate in 12 intervals`, red at the base in plain node too; it fails `observedShapeReaders`, `writerReach`, `newsHeadlineContract`, `newsVoiceContract`, `proseFamilyContract`), presumedThings ARM 1's four hits, `negativeAssertionAnchor`'s `safetyForceLines` lines 52-53, `famineStoresOneRounding` soak1k-2452, `dossierRelations.generated` stale; the rest as the base. Gone since the base: three (the wiring census and lighting census through their doors, and the holder table's dry read). After 18457a827 the touched walkers and tests were re-run alone (tradeListWriters, presumedThings, chainPrintSites, styleLaw, proseWiringCensus, negativeAssertionAnchor, the income, outlook and #93 tests): only the carried rows red. The whole suite was NOT re-run after 117d7439c and 18457a827: the successor's first gate.

## Calls taken (each vetoable)

- **Income labels kept:** the source labels ("Apothecary & Alchemy", "Iron & Metalwork") are keyed by the history, the arrival scene and the treasury; changing them would move records beyond the income family, so only the sentences move. A label that names alchemy beside an apothecary is therefore left: named for the chair.
- **Silence where nothing true is held:** an income row with no true sentence prints its source and share alone (Iron & Metalwork 213, Stone Quarrying 211, Fish 127, Grain 41, and every road, gate, port and transit line under a siege). River tolls and the daily and district market lines under a siege are left (traffic and trade inside the place, not buying or selling by road).
- **F3's gap shapes:** where (a) left walls and a watch with no sentence (245 rows), the shape's one plain twin prints under every band (its cells over fifteen); the 53 rows of smaller cells print their band alone.
- **#608:** the chip prints the word alone only where figure and word stand two bands apart, because the owner's T2-1 ruling (`tests/ui/economicsTabFlow.test.js`) keeps the Output chip printed once; the chair rules whether the word should stand alone everywhere.
- **C-L7:** the Economic Survival bar only; the military and internal bars keep their own 60/35 cuts (not in the ruling).
- **The courthouse:** a court is named only where the defence home's narrower `hasCourthouse` stands; a town hall counted as a court by the flag names no court (the flag is #598's, step 7).

## Named, not cured (each with its writer)

- **#93's roster and resources (NAMED for the seat after the merges, the chair's 23:48 ruling):** a house of work with no ground or good of its own in the record: of the 26 towns #93's line now prints in, 13 woodcutter's camps hold no managed forest or shipbuilding timber, the 6 fishing houses hold no fish among their goods, the hunter's lodge (rv2-calm-hamlet-25) no hunting ground. The roster's or the resources' fault, not the line's. The 27th town of the first count (rv3-infiltrated-village-2) holds a Fishmonger, a seller, not a house of work: no line. **Another lane's:** the Fishing community's own description ("... are the whole of the economy") prints beside the rents and the new line (rr2s-thorp-calm-port-1, rv2-succession_void-thorp-3; rv2-famine-thorp-13 prints its other variant, "inseparable from the water").
- **#1248:** does not reproduce at this tip (rr2s-metropolis-wartime-rand-1 holds an Alchemist quarter; the original is true there and is the test's anchor).
- **The Economics stores row** (`tonightSheet.js :: foodStoresWords`, not this lane's): "a few weeks in the larder" for under ten days, 101 births; its holder should read the endurance line's span words.
- **The Outlook's dependency rows:** where `viability.js`'s rows name goods the printed import list lacks, the Outlook now names none (step 7's file holds the rows).
- **presumedThings ARM 1:** four hits red identically at 995293e81 (`defenceWeights.js` 1; `safetyProfile.js` "The garrison/watch/militia is present and responsive." 3); not this seat's.
- **W5:** the can-pay corpus row beside a doom line, 238 at 0ab206f77 (the corpus's; the counter is the seventh seat's, `m3*.py`); counted again at the join.

## #93, BUILT (the chair's ruling of 23:48: a DECLARED MOVE of the income family)

Where Agricultural Rents is a thorp's, hamlet's or village's ONLY income line and a house of work stands on the roster, one "Local Trades" line is added at the branches' own weight (10, before the shares are normalised): `incomeLineSiblings.js :: houseOfWorkLine` (appended), one call line in `economicState.js` at the Stage 3 marker. The first such house on the roster speaks; the sentence is worded from the TRADE, never the house's stored name; it claims the work only (no ground, no export catch, no route); under a siege the row prints its label and share alone. Field diff on the 1,490 against 7403ee457: 26 births, `economicState.incomeSources` only (the rents' share 100 -> 87, one row added); nothing else moves. Guards: a thorp whose rents are not alone (rv2-calm-thorp-10), a thorp with no house of work (rv2-calm-thorp-5), a town (rv2-calm-town-0). Test: `tests/generators/houseOfWorkEarns.test.js`, red at the base.

## EVERY NEW OR CHANGED READER SENTENCE OF THIS SEAT, with its towns (the owner vetoes by exception)

The towns of each are in its commit body and in `probes/UPKEEP-8/inc-samples.txt`, `f3-samples.txt`, `safe-samples.txt`, `outlook-counts.txt`, `endurance-counts.txt`.
1. Income (b11a4d72e, fbc4a0080): "Remedies and simple preparations, made and sold here: a modest trade." · "Remedies and preparations are made here, but few, while the herbs and reagents they need run short." · "Alchemical preparations and curative potions, sold only to the people inside while the siege keeps outside customers away." · "Metal is smelted or worked here." · "Local flocks provide raw wool, and cloth is woven or finished here." · "Cloth is woven or finished here." · "Little cloth is made here while the cloth trade is short of what it needs." · "Catch landed here and sold fresh or preserved." · "Fish is sold here, fresh or preserved." · "Mandatory tithes, and rents from land the faith owns." · "Local forest provides sustainable timber revenue; managed felling keeps production consistent." · "Local forest provides timber revenue." · and NO SENTENCE where nothing true is held (the row prints its source and share).
2. Threat rows (c924351e6): the ten twins of the commit body ("Quiet country, and nothing organised is kept against it." · "Quiet country, and little is kept against it." · "An embattled region, and only a palisade (walls) and a citizen militia to hold it." · "Active frontier with a militia (a garrison) but no perimeter, and too little to meet what the country sends." · "Active frontier, with walls (a palisade) and a watch to meet what comes." · "Walls, and a watch to keep them." / "A palisade, and a watch to keep it." · "A palisade (Walls) and armed townsfolk who know how to hold it (them)." · "A palisade (Walls) and nobody organised to man it (them): enough to turn away a raid, not a determined attack." · "Armed citizens who know their ground, and no walls: too few to turn back any force that comes in earnest." · "No walls or garrison, but enough here to turn away raiders; nothing that could hold off an army.") and the band alone (53 rows).
3. Safety (48ad4da91, db13fdb40): "Those holding the place keep order, and more harshly as the food runs down. …" · "Armed rebels are active, and nobody is sure whose side a neighbour is on." · "The rebels are loose and armed. People keep to their homes, and nobody goes out after dark." · "No stable governing authority; whoever holds sway decides what rules apply, and that changes." · "More people have arrived than there are roofs or work for, and newcomers and old residents quarrel over what there is." · "Armed fighting between the rebels and those set against them. People keep to their homes." · "Stolen and improvised weapons circulating among the rebels. Some are being smuggled in from outside." · "A street gang controls part of the place, extorting local businesses and residents. Its violence comes and goes, mostly over its territory." · "Some goods change hands here without a licence or a duty paid." · "Theft of food, livestock, and stored goods by people with too little. Enforcement struggles to distinguish survival crime from organised theft." · "<guilds> keep their own <companies> beside the <force>: real protection exists, but only for those with the right associations." · "Some of the <force> take bribes from whoever has coin." · "The <force> is chronically underpaid and poorly equipped. …" · "The <force> keeps what rounds it can while the supplies it needs are cut off." · "There is no watch. When a quarrel turns violent, …" · the shortened plague, conversion and magical-crime lines (the merchants, the priests, "alchemical" left out where the roster holds none); a court clause left out where no courthouse stands.
4. Outlook (2e25b5ffe): "VIABLE: <town> gets through the year, buying in what its own land and trades do not provide." · "only while grain keeps arriving and the routes that bring it stay open".
5. Food endurance (1a7a02927): "a day or two" · "a few days" · "a week or two"; "under siege the outlying fields would be lost" · "would carry" · "what is still harvested would stretch them further" / "stretches them further"; the months stated are the stores and twice them.
6. #93's label and sentences (NEW WORDS, each with its towns, the smallest tier first): "Local Trades" (26 towns: rr2s-thorp-calm-port-1, rv2-wartime-thorp-5, rv2-calm-village-3) · "What the fishers land is sold here." (6: rr2s-thorp-calm-port-1, rv2-famine-thorp-13, rv2-calm-hamlet-35) · "The wood the woodcutters cut is sold here." (16: rv2-wartime-thorp-5, rv4-famine-thorp-0, rv2-calm-village-5) · "What the miners dig is sold here." (2 only: rv2-wartime-hamlet-13, rv2-calm-village-3) · "The game and hides the hunters bring in are sold here." (1 only: rv2-calm-hamlet-25) · "The stone the quarrymen cut is sold here." (1 only: rv3-recently_betrayed-village-1). Fewer than three towns exist for the last three in the 1,490; each is also read by its unit case in the test.
7. Removed where false: the Economics glance's Output chip where figure and word stand two bands apart (2 births).

## LEFT (for the ninth seat; each NOT STARTED unless marked)

- **The chair's rows added after the brief:** the two endurance rows (rww-village-religious_conversion-1, rww-village-calm-1) and the tabs lane's seven (#34 #75 #103 #137 #184 #226 #290): DONE in 1a7a02927 (the classes above at 0). #93: DONE (18457a827). #213 #276 #546: confirmed in their towns (fbc4a0080). **NOT STARTED:**
  - **The grain line** (the chair, 00:20): `economicState.js` chooses GRAIN_OWN_FIELDS_LINE ("... none is left to sell") wherever the grain line stands and the food record offers no surplus; it reads neither a FAILED grain harvest nor a FLOUR EXPORT: #ww-339 (rww-metropolis-famine-1: the failed source is grain, Milled flour exported), #ww-1357 (rww-city-recently_betrayed-1: Milled flour exported). A condition at the choice (no twin, that lane says: judge it). Measure on the 1,490, a declared move confined to the income lines.
  - **The coal lines under a siege** (the chair, 00:20): LOCAL_COAL_LINE (r2s-under_siege-city-2) and LOCAL_COAL_SOLD_LINE (three towns, r2r-thorp-45 among them) say "leans on the trade route", "bought in", "sold to the forges of other towns"; the Iron and Metalwork branch picks them on a coal deposit and a forge house and reads no siege. The family's rule at that site. NOTE: `trueIncomeDesc` already silences LOCAL_COAL_SOLD_LINE under a siege (b11a4d72e, #501); measure what still prints first (those seeds are r2s/r2r shapes, not in the 1,490).
  - **The safety lines' "court" off a town hall** (the chair, 00:23; from `origin/lane/w2-c-leaves-side-2026-11-13:docs/chair/2026-11-13/W2-C-LEAVES-SIDE-HANDBACK.md`): `defenseFacts.js :: hasCourt` takes "town hall"; 37 of that lane's 720 then print "go before the court" / "A court exists, though there is nowhere to hold the guilty". RULED: the page names a court only where a courthouse stands; where only a town hall stands, the town hall or the council, or nothing. Step 3 here reads `hasCourthouse` (48ad4da91: court named with no courthouse 187 -> 0 on the 1,490): re-measure on that lane's 720 first; it may be done.
  - **MEASURE ONLY: the defence profile's two homes for arcane defence** (the chair, 00:23): `defenseProfile.institutions.magicDef` holds "Mages' district", "Academy of magic" (the Defense tab's "Arcane defense" group) while `traditions.hasArcane` is false in 58 of the 720; the Magic tab then says "Military role: absent". Five lines to the chair: how hasArcane is derived and why false there (practitioners among the people? the capacity build's alchemist change? at this tip and at the capacity tip 9354d792a); which is right by the model's own rule; the smallest cure and what it moves on the births.
- **Steps 7 and 8 wait for the chair's word** (the capacity merge; #598, #1082's gang flag, the increment's viability.js line #ww-522, #869 measure first; viability.js kind (f), 12 towns; round two's second code lane's rows (#576 #823 #824 #825, the hedge-practitioner suggestion, the stockpile call site under FOR THE JOIN); item 4; then census2.sh at the tip on this lane's files, every hit read, each kind's count at base and tip; the ONE final statement).
- **Parked for the chair, together:** #608's "word alone" everywhere (T2-1); the income labels that name alchemy beside an apothecary; tonightSheet.js's "a few weeks in the larder" for days (its holder's); the military and internal bars' own cuts (C-L7 was the economic bar only).
- **Shared files named:** `incomeLineSiblings.js` (appended only), `defenseDisplay.js` (`foodEnduranceLine`, `monthsInWords` only), `EconomicsGlance.jsx` (the chip's line only), `steps/assembleSettlement.js` (one argument).
- **For the successor's tools:** the probes in `docs/chair/2026-11-13/probes/UPKEEP-8/` (`births.mjs` TREE=<tree> <seeds> <out> full; `fielddiff.mjs` a b [examples]); the 1,490 in `seeds.all.txt`. The census's refreeze refuses a dirty tree, and a worktree whose `node_modules` is a symlink counts as dirty: refreeze in a worktree with a real `node_modules` directory.

## Incidents

- The first governing-suite run read the working tree while step 2 was being edited, so its result was not trusted: it was stopped, and every suite since runs from the clean worktree `/home/user/up8run` at a pushed commit. A broader process kill was refused by the permission check; nothing was routed round it (only my own runs were affected; the base run finished cleanly).
- Three targeted runs gave up waiting for the gate behind an exclusive suite (their own exit 3, nothing ran); each was re-run after.
- `npm ci` wrote `core.hooksPath=.husky/_` into the shared local config: removed at once, and the lane's pre-push hook run per push with `git -c core.hooksPath=.husky/_ push …` (no stored config). Refs and local config compared after every suite and push: only `refs/heads/up8` moves.

---

# COHERENCE-UPKEEP: the hand-back (the seventh seat, COHERENCE-UPKEEP-7, 2026-11-13) — HANDED BACK BY FILE AT THE CONTEXT GUARD, WITHOUT THE FINAL STATEMENT (held by the chair's order)

**The lane:** `lane/coherence-upkeep-2026-11-12`. **Base of this seat:** 0a07f98c7 (the sixth seat's hand-back), read back from origin before any work. **The lane's reviewed base:** 69b53decd. **The probes:** `docs/chair/2026-11-13/probes/UPKEEP-7/`. The sixth seat's record and every earlier one are kept below, unchanged.

## The brief's rulings, copied in (the chair's message of 2026-11-13 is not on the branch)

- **Who asks:** the chair, session `session_01FE9mEws7PXYRYdjQPbSX15`; the owner re-confirmed the standing delegation on 2026-11-13 and has left every decision but the release's merge and deploy to the chair. No adjacent repair. An independent reader reads the lane at 0a07f98c7: no commit at or below it is rewritten; its findings come as rulings.
- **1. The pay sentence beside the hunger line (the third read's 1b-M3).** RULED: where the two prosperity words differ, the sentence that says what the town can pay says that the money was laid by before the crisis: ONE clause, the crisis named through the same home as the two-label sentence, claiming only what the model holds (the defenders stay paid from what was laid by). No second explanation, nothing of how it was worked out. Count the reader's class to zero on its own seeds; new words on the list.
- **2. Count once, the second half.** RULED: a house that stands under two named parts keeps the part of its own kind: the alchemist shop and the alchemist quarter are alchemists and leave arcane. A DECLARED MOVE of the rating: measure it again, build it, state the move, change no weight (the tuning is ruled at the closing acts), and prove the review's count-once test (drop each house alone: no house moves two parts) at zero.
- **3. The cold list's lines in this lane's files** (REVIEW-W2A-3, `debt/final.json`, status "untouched"): the safety profile's 6 high and 5 medium, the economy generator's 3 high and 20 medium, the dossier view model's 3 medium; the high ones first. For each: the false sentence gone AND what prints in its place true, read in its town; a count falling is not a cure. A line whose true writer is in a file another lane has changed beyond its base is a stop for that row: name it and go on.
- **4. What the sixth seat left named:** the one ladder (ruling 6: bring its measure current; do not touch the defence display, another lane's); services and the Magic tab keep the shown label this release (listed, not built); the corpus lines of the first read declared as exposure at the final tip.
- **5. The final statement, once, at the lane's final tip:** the census counter (the lane's base against the tip); each rating move declared with its count and bands; all 51 registered golden surfaces declared moved or unmoved by measure in ONE draft record (the view-model snapshot is red at the base and unsigned: say so); the whole suite, every red classed; the eight example towns from built code in `docs/chair/2026-11-13/UPKEEP-EIGHT-TOWNS.md`, plain words, ratings and no machinery; every new or changed sentence listed with the town it was read in; the edge bundles as the last commit, alone.
- **RULED, read to these:** the page shows the ratings, never the machinery (no part, point, sum, share, weight, limit or slider name on any surface, export, prompt or journal). Every sentence that says what a town can pay reads ONE home, the economic survival row's band. The parts are computed by one function and never stored. Every number lives in the tuning table; no tuning value moves without the chair's ruling. No named condition of a house is built. No new key in the settlement record; no new word in the vocabulary file (park a row that needs one). A name a user can hide by hand is never written into a stored, composed sentence.
- **How:** a scratch worktree, plain pushes to this lane only, after every item and before any long run; the three gates at every `src/` commit through `scripts/gate-tail.sh`; the tuning inventory by its own ritual; pins re-keyed by identity with the cause; no baseline banked, no skip; a register only through its own door. Refs and local config snapshotted around every suite and push. NEVER: another branch, `--no-verify`, a force push, an empty push, a pull request, master, a golden's door, a deploy, a hosted database.

## 1 — the money laid by before the crisis (0ab206f77)

- **The home:** `prosperityInCrisis.js :: laidByBeforeCrisis` ("laid by before the famine"), the same reading as the two-label sentence (one private `crisisApartOf`), so it prints exactly where that sentence prints and names the same crises.
- **The sentence:** `threatAssessment.js :: buildThreatAssessment`, the Economic Survival money line (the PDF row; the tab's expanded row), at its two can-pay rungs, which still read the Economic Survival band.
- **Measured** on the reader's own 1,200 rv2 births, every surface (its `render3.mjs`), at 0a07f98c7 and at 0ab206f77, class by `probes/UPKEEP-7/m3.py` (the reader's literal class) and `m3b.py` (the class after the cure: a can-pay line that does not say it was laid by): **181 -> 59.** The PDF money line: **181 -> 0.** 328 births change; every change is the PDF money line gaining the clause; no other line on any surface moves.
- **A STOP FOR ONE ROW, the 59 left** (`m3-left-0ab206f77.json`): all are the Defense tab's corpus row, DS-DEF-2 Economic Survival STRONG, "Trouble at {settlement} has not turned into a collapse, because the town can pay its way through it." Its writer is the corpus pool (`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`, `src/data/dossierStateProse/defense.generated.js`), changed by lane/w2-write-2026-11-13 and lane/w2-fix-data-2026-11-13 beyond their merge base; its composer `defenseStateProse.js` is changed by lane/w2-a-leaves, lane/w2-c-leaves and lane/merge-12. **Recommendation:** the corpus lane gives that row a twin under "prosperity in crisis" (the two words differ) that carries the same clause ("… because the money laid by before the famine pays its way through it"), reading the same home.
- **New words, for the owner's veto:** ", laid by before the <crisis>" inside the two can-pay money lines: "Money enough to ride out a long crisis, laid by before the famine: emergency measures can be paid for, and the garrison kept paid while it lasts." (read in rv2-famine-city-0) · "Money enough for a short crisis, laid by before the siege; a long siege would start eating the reserves within months." (read in the rv2 sieges). Several crises: "laid by before the famine and the siege".

## The chair's later rulings, copied in (messages of 2026-11-13; not on the branch)

- **17:58, ITEM 2b (after item 2):** the realm register never says "at peace" of a town whose own pages say it is fighting. (1) Where the map speaks (besieged, besieging) the map's word stands. (2) Where the map is silent, the clause reads the town's own crisis through the two-label sentence's public home: a siege "under siege"; a war and no siege "at war" (ONE new word, for the owner's veto); an occupation, insurgency, revolt or raids and neither of those: the clause LEFT OUT ("A poor town.") and the table's own mark for no value; any other crisis, or none, "at peace". (3) One deriver feeds the sentence and the table column; derived at render; nothing stored. (4) The two-label sentence stays off the row. MEASURE on births of all fifteen crises, each in a campaign with no war and one whose map besieges the town; a guard test that reds on "at peace" beside a fighting crisis. D(ii) of the third read STAYS LEFT for after the release (named in the final statement).
- **18:25, THE OWNER'S CAPACITY WORD** ("tier or size/capacity should also be calculated for defense. A single alchemist should not have the same influence as an alchemist district"): measured by a separate seat (UPKEEP-CAPACITY, its own branch); built as ONE declared move and brought onto this lane BEFORE the final statement. **Item 5 is HELD** until the chair says the capacity move is on the lane or to go without it. Change no weight in anticipation.
- **The fourth read's rulings (REVIEW-UPKEEP-0a07f98c7; W1 to W5), the order now W1, W3, W4, then items 1, 2b, 3, 4:**
  - **W1. READING A WITHDRAWN (the chair's own error):** the magic presence reads the WHOLE roster again, by a new commit; the re-keyed pin back by identity. ACCEPTANCE: every birth of the reader's 1,440 equal to its profile at c72917251, field for field; the four classes back. The count-once test RE-FOUNDED on the design's law: no house feeds ONE score through two parts (zero), and every house in two roles listed with its parts and the scores each feeds.
  - **W2. ITEM 2 WITHDRAWN:** build none of it. What an alchemist's house gives defence is ruled once, with the capacity measure, every page naming the house read first.
  - **W3. THE UNPAID WILL (E-M1):** pay reaches the will only through the hold; cure the hired branch; the test's corpus must MEET it; 11 to 0 by the reader's willpay.mjs. C-M1's six births declared as exposure town by town in the final statement; the corpus untouched.
  - **W4. THE PDF's "Score avg" row leaves;** the readiness strip prints the rating's word; the five scores' own figures stay. DefenseSecurity.jsx is this lane's; a writer elsewhere is named and left.
  - **W5. ITEM 1's acceptance case is the reader's Inverford (rv2-famine-city-0):** read its four lines together after the clause; if they still contradict, do not widen: list the class with each line's writer for the chair.
  - **The lows** (C-L1 to C-L7, E-L1, W-L1): listed in the hand-back with their writers.

## W2 — item 2 withdrawn: nothing of it committed

The build was made and measured before the ruling arrived and was never committed: it is saved as `probes/UPKEEP-7/item2-withdrawn.patch`, with its measure (`alch-measure7.txt`: the sixth seat's figures reproduced exactly at 0ab206f77; 633 of 633 holders' built scores equal to the measured move). Not on the lane.

## W1 — reading A withdrawn (2133873fe)

- **The cure:** the presence over the whole roster (`defenseGenerator.js :: computeDefenseScores`); the home's `DEFENSE_NAMED_MAGIC_HOUSES` and `magicPresenceRosterOf` leave (the home is byte-identical to its state before 13782cf82); the pin back by identity (`defenseEconomicGate.test.js`, "a healthy settlement is not taxed by the health gate").
- **ACCEPTANCE, EXECUTED:** the whole stored record of each of the reader's 1,440 births (rv2 1,200 + rv3 210 + rv4 30; its `hashscan.mjs`) equals its record at c72917251: **1,440 of 1,440.** So every rating, score and power draw returns. The four C-H1 classes return with the record (the display code differs from c72917251 only by 0ab206f77's money-line clause); not re-rendered.
- **THE RE-FOUNDED TEST** (`tests/generators/magicCountOnce.test.js`; probe `once8.mjs`): the computed parts carry `feeds` (the scores each feeds; computed, never stored). THE LAW at zero: **0 of 330** on the reader's births (`once8.reader.ndjson`), 0 on the test's 96. Red first: a wizard's tower or a mages' guild dropped alone moves the magic part (2 of 3 red at 0a07f98c7). Houses in two roles, listed: wizard's tower, mages' guild, hedge wizard (arcane + magic); alchemist shop and quarter (arcane, alchemists, magic); apothecary district (alchemists + magic); elder grove council, druid circle (druids + magic); divine healer (hospital + magic).
- **FOUND, NOT CURED (for the chair): the law fails off the app's default dials.** On 240 births with every dial random (`once8.fresh.ndjson`, `once7-<size>-<i>`): **60** births hold a house that moves two parts feeding one score. Classes: "Access to parish church" opens both the small place's parish part and the clergy part, both feeding internal (22); "Monastery or friary" opens clergy and the hospital, both feeding monster (11); a church, grove or tower moving arcane, clergy and druids together on monster (the rest; PLAUSIBLY the traditions' shared monster cap, R2, re-apportioning when one tradition's house goes: read from the code, not traced). None is a magic house's double role. **Recommendation:** the chair rules whether the parish/clergy and monastery/hospital pairs are one role or two; the cap's re-apportionment is count once's own rule and should be excluded from the measure by name.


- **Later message (18:45), ITEM 3'S NEW LIST:** the round-three cut (`lane/round-3-cut-2026-11-13`, ROUND-3-CUT-2026-11-13.md sections 2, 6, 6b and ROUND-3-CUT.json) replaces the round-two list for this lane's files: `safetyProfile.js` (16) and `economy/economicState.js` (13), 6 high and 23 medium; `dossierViewModel.js` (4 medium); `domain/defense/defenseFacts.js` (6); the PDF forces' "REQ" and "FORCED" badges in `DefenseSecurity.jsx` (RULED: the generator's provenance, they leave the PDF). NOT this lane's: `EconomicsTab.jsx`, `DefenseTab.jsx`. The Economics "Needs X · affects" row: only what it says falsely, never its shape.
- **Later message (18:51), F1 to F3, after W4 and BEFORE items 1 and 2b:** F1 "no force" read in the wrong place: `defenseInstitutionBuckets.js :: standingDefenseForces` gains the watch and a contracted company (a town has no force only with no garrison, militia, watch or contracted company), from the partition's own tables; the selector (`defenseStateProse.js`) untouched; ACCEPTANCE classes A and B at zero by `classes3.py`, twenty towns read, the defence profile equal field for field. F2 the Foundry journal never prints a raw category key as a power (`pdf/lib/viewModel.js :: npcsSlice`). F3 the PDF's band sentence drawn within the band the row prints (`threatAssessment.js`); measure first; a band with no true sentence is a stop with three towns.

## W3 — the will unpaid on the hired branch (befa936dc)

- **The cure:** the hired branch's rate is `D.none + D.hiredExtra`, unpaid (`defenseGenerator.js :: computeDefenseScores`); the hired parts stay paid.
- **Red first:** `defenceParts.test.js`, "the martial will is not paid on the hired branch either (W3)": the reader's rv2 births in the app's shape, each ANCHORED to the branch (nothing built or standing, a hired part, paid short, no hold, no crisis).
- **Measured** (the reader's `willpay.mjs`, classed by `probes/UPKEEP-7/willcls.py`; `hashscan.mjs`; its 1,440): **11 -> 0.** DECLARED MOVE against 2133873fe: 22 records, the military score on 22; readiness up on 18 (none down, max +2); **2 up a band**, Vulnerable -> Lightly Defended: rv2-calm-hamlet-33 and rv2-calm-village-38 (23 -> 24), where the power structure moves with the band.
- **C-M1, declared as exposure at the final statement** (the six births of the fourth read, town by town; the corpus untouched).


- **Later message (19:05), #608:** the Economics prosperity glance prints "26/100" beside "Prosperous" (the third leaves lane's stop, its hand-back part 2): the glance's call in `EconomicsTab.jsx` was changed by this lane (d8986c04c), so the cure is this lane's, the glance's own lines only, the file named as shared. RULED: the figure and the word beside it read ONE home; where the word is the standing label and the figure the crisis's, the page says which is which through the two-label sentence's home, or prints the word alone. Measure the class first.
- **Later message (19:10):** the capacity move is built on `lane/upkeep-capacity-2026-11-13` and reaches this lane by a MERGE the chair orders; build none of it. F1 next and pushed; after it, `defenseInstitutionBuckets.js` is not changed again without saying so. THE LAW OF THE COUNT, final: ONE JOB IS COUNTED ONCE; a house opens two parts only where they are two jobs, each such house named in the test (the magic houses, the village's parish church, the monastery); the capacity seat makes one test of this lane's and its own; leave this lane's count test as it stands. Files the capacity build takes, LEFT ALONE from now: `src/data/defenceWeights.js`, `src/generators/defenseGenerator.js`, the flags in `priorityHelpers.js` that open a defence part, the catalogue's ladders. ORDER: F1, W4, F2, F3, item 1, item 2b, the round-three lines, #608, item 4; the final statement held until the capacity branch is merged.
- **Later message (19:28), THE CENSUS HAZARD:** `census.sh` exits 0 when its counter fails (the pipe's exit): after every census run, check the counter's own exit and that `counts.txt` holds the rows expected; say so in the final statement.

## W4 — the PDF's "Score avg" leaves (a5d202135)

- `src/pdf/sections/DefenseSecurity.jsx :: DefenseSecurity`: the stat leaves the readiness strip (a comment keeps its line, so the prose-numerics register's addresses below it hold); `scoreTone` leaves with it. The view model keeps `defense.scoreAvg` (the parity row and the view-model snapshot read it; no surface prints it).
- Red first: `tests/pdf/defenseReadinessWord.test.jsx` (six births; the rating's word anchored).

## Item 1's own reds, cured (1abd3bbf4)

- Found by this seat's suites at W4: 0ab206f77 made two architecture guards red that are green at 0a07f98c7: the import-cycle set (`layerBoundaries.test.js`) and the engine-core-to-lazy edge (`engineCoreLazyEdge.test.js`).
- The cure: `src/domain/crisis/crisisNoun.js`, a zero-import leaf holding CRISIS_NOUN byte for byte (crisisHooks.js re-exports it); `vite.config.js :: FIRSTPAINT2_LAZY_DOMAIN` pins `prosperityInCrisis.js` and `crisisNoun.js` with their reasons.
- **Measured by a fresh build + verify:dist here and at 0a07f98c7:** the same set of verify:dist reds at both (the line's carried ceilings); first paint 1,126,131 -> 1,125,833 B raw (-298), gzip 358,720 -> 358,636, Brotli 301,083 -> 300,785; the engine chunk +19 B (red at both). An intermediate build with the leaf unpinned measured engine-core +130 B.

## F1 — STOPPED, measured (the chair told in one line at 1abd3bbf4)

- **The ruling's premise does not hold:** `standingDefenseForces` is already total over every bucket (walls, garrison, militia, watch, mercenary, charter, magicDef). On the reader's own seeds, all **113** class-A births and all **26** class-B births have `watch.present === true` in the projection (`probes/UPKEEP-7/f1why.mjs`: A = walls+watch 63, walls+watch+charter 50; B = watch 25, watch+charter 1; EXECUTED). The cut's `defenceClasses` entry "(walls, garrison, militia only)" describes the selector, not the projection.
- **The line that decides "no force"** is `src/domain/display/stateProse/defenseStateProse.js :: defenseThreatProse`, its three locals (`walls`, `garrison`, `militia`) handed to `invasionRowPoolKey` and `beastsRowPoolKey`; the file is held by lane/w2-a-leaves, lane/w2-c-leaves and lane/merge-12. **Recommendation:** its holder reads "a force" as garrison, militia, watch or contracted company from the same projection; no new list of names. `defenseInstitutionBuckets.js` is NOT changed by this seat.

## F2 — the journal never prints a category key (af48c3ab2)

- `src/pdf/lib/viewModel.js`, the NPC rows: `factionLabel` reads the first-rank power or the stated faction only; a person in no power prints no "Member of" line and an empty people-table cell.
- Red first: `tests/pdf/journalMemberOfPower.test.js` (24 births): 91 raw keys at 0a07f98c7, 0 now. Measured before on the reader's 1,200 (0ab206f77): "Member of: criminal" 59, "magic" 45, "other" 40, and raw keys in the people table on 764 births.

## F3 — STOPPED BY ITS OWN RULE, measured (`probes/UPKEEP-7/f3.mjs`, `f3cls.py`, `f3-classes-af48c3ab2.txt`)

- On the reader's 1,440 at af48c3ab2: **726 rows in 605 births** print a Beasts or Invasion sentence under a band its own words contradict (each sentence's true bands read from its words, listed in `f3cls.py`).
- `threatAssessment.js :: buildThreatAssessment` holds ONE sentence per threat family and forces; under the band a row prints, no other existing sentence is true of the same forces. So, as ruled, a stop on each band, three towns each (the file holds all 25 cells). The largest:
  - Beasts CRITICAL, "Quiet country and no organised defence, which is all the country asks." — 233 (rv2-calm-thorp-3, -5, -9);
  - Beasts CRITICAL, "Palisade and citizen militia provide a viable but demanding posture" — 96 (rv2-calm-thorp-1, -6, -13);
  - Invasion ADEQUATE / STRONG, "Walls present but no organized military force to man them…" — 86 / 54 (rv2-calm-town-0, -6, -15 / rv2-calm-town-1, -2, -3);
  - Beasts ADEQUATE / STRONG, "Wild country all round and nobody organised to meet it…" — 44 / 16 (rv2-calm-town-7, -15, -16 / rv2-calm-town-1, -3, -4);
  - Invasion STRONG, "A palisade and armed townsfolk…" — 28 (rv2-calm-hamlet-1, -12, -27);
  - Beasts WEAK / CRITICAL, "Safe heartland with minimal creature activity. Existing defenses are appropriate." — 26 / 15 (rv2-calm-town-0, -10, -13 / rv2-calm-thorp-4, -10, rv2-calm-hamlet-17).
- **Recommendation:** each row's sentences gain band-true twins over the same forces (new words, for the owner), or the row prints the band word alone where no sentence is true; and the rows' facts read the watch (the F1 class again: "no organized military force" beside a watch).

## W5 — Inverford (rv2-famine-city-0), read together after the clause: STILL CONTRADICTS; not widened

- Defense tab: "No one can earn a normal living while the famine lasts, and every coin goes on food." (`src/data/stressTypes.js`, the famine's `viabilityNote`) · "The longer the hunger lasts at Inverford, … The city may not come through this crisis, and what it spends on defence now only buys time." (the corpus, `src/data/dossierStateProse/defense.generated.js` / `RECEIPT_POOLS_DOSSIER_STATE.md`) · "Trouble at Inverford has not turned into a collapse, because the city can pay its way through it." (the corpus, DS-DEF-2 Economic Survival STRONG).
- PDF: "Money enough to ride out a long crisis, laid by before the famine: …" (this lane's, `threatAssessment.js`): it now says where the money comes from; it still stands beside the corpus's "may not come through this crisis".
- **The class, counted** on the reader's 1,200 rv2 renders at 0ab206f77: the Defense tab's can-pay corpus row beside a doom line 112, beside a crisis spending line 181, either **238**. Every writer but the PDF line is the corpus's or the crisis data table's; for the chair to rule for the corpus.


## 2b — the register's war clause (3ac6abd4c)

- `heraldRegister.js :: warClauseOf` reads the town's own crisis where the map is silent (through `facts/crisisKind.js`); the table prints `EMPTY_VALUE` for no clause and sorts it last; the realm charts gain "at war". **Measured** (`probes/UPKEEP-7/reg7.mjs`, `regcls.py`; 15 crises × 4 sizes × 5, a campaign with no war and one whose map besieges the town, 600 rows): **120 -> 0**; the besieged campaign "under siege" throughout, before and after. Red first: `tests/ui/heraldWarClause.test.js`.
- One row of each class read: "A struggling village, under siege." · "A struggling village, at war." · "A poor village." (occupation) · "A struggling village, at peace." (famine). A Herald desk golden was not run (the merge seat's door); the final statement measures the surfaces.

## Item 3 — the round-three cut's lines in this lane's files, LINE BY LINE (the list: `lane/round-3-cut-2026-11-13` at 892904c1d, ROUND-3-CUT.json, filtered by writer file; the reader's twenty towns re-born in its own shape at this tip by `probes/UPKEEP-7/rr2s.mjs`)

| # | rank | town | writer | STATE |
|---|---|---|---|---|
| 640 | MED | rr2s-town-indebted-port-1 | safetyProfile.js, the hired-company branch | **CURED** (18aeee4b5): the branch needs no watch; the town now reads "You will see the town watch on the rounds most hours of the day; …" beside its Town watch |
| 104 | MED | rr2s-thorp-calm-port-1 | safetyProfile.js, the Safe line | **CURED** (18aeee4b5): "Neighbours notice trouble and deal with it themselves." beside the tab's "Nobody here is paid to keep order." (NEW WORDS, for the owner's veto) |
| 911, 357 | HIGH, MED | rr2s-city-under_siege+famine-rand-1, rr2s-town-calm-rand-1 | economicState.js, the grain-surplus income line | **DOES NOT PRINT AT THIS LANE'S TIP** (the towns re-born here carry no "Surplus from local harvest" line: COHERENCE-AGREE-3's F7 twin is on this lane) |
| 1274, 1389, 718, 817, 1174 | HIGH ×2, MED ×3 | metropolis-wartime, metropolis-plague-port, city-calm, city-famine, metropolis-calm | **STOP**: the "…" is made by `src/components/new/tabs/DefenseTab.jsx` (`truncateAtWord(desc, 200)` on the crime-type rows), the chair's "a new seat's" file; safetyProfile's Smuggling sentence is whole. Recommendation: the tab cuts at a sentence's end, or not at all |
| 1082 | MED | rr2s-city-occupied-rand-1 | the same truncation; and "Territorial gangs" from `getInstFlags`'s `hasGangInfra` (priorityHelpers.js) beside no gang house | **STOP** (the tab's truncation; the flag's home is priorityHelpers.js, left to the capacity build by the chair's order) |
| 163, 427, 497, 891 | HIGH ×4 | hamlet-under_siege, town-under_siege ×2, city-under_siege+famine | the Services tab's row: "Needs X" run into "Supply route severed…" and "· covers A, B" | **STOP, the row's shape** (`src/components/new/tabs/ServicesTab.jsx` composes it; the chair: this lane changes only what a row says falsely, never its shape). economicState.js's own sentence ("Supply route severed. Operating at minimal capacity or shut down.") is true under a siege |
| 919, 1043 | MED | city-under_siege+famine, city-occupied | the Economics "Needs X · affects: …" row | **STOP, the row's shape** (EconomicsTab.jsx, the third leaves lane's for round three). #919's "magical licensing" names a service with no house: the dependency table's `svcs` (left, not reached) |
| 1152 | MED | metropolis-calm | the dependency row names the luxury chain's needs for the bowyer | **LEFT, not reached** (`TRADE_DEPENDENCY_NEEDS` keyed by the house's name; read the table's bowyer row) |
| 439, 1248 | HIGH, MED | town-under_siege, metropolis-wartime | economicState.js :: the magic income ("A thriving alchemical trade … draws customers from surrounding settlements.") | **LEFT, not reached**: `hasAlch` reads an apothecary as an alchemist, and the siege is not read. Recommendation: twins in `incomeLineSiblings.js` (the GRAIN pattern) by the roster's own alchemist house and by the crisis that closes the roads |
| 145, 277, 438, 621, 910 | MED | hamlet-calm, village-famine, town-under_siege, town-indebted-port, city-under_siege+famine | economicState.js :: income lines (Iron & Metalwork with no smith and no iron import; Stone Quarrying with no quarry house; grain bought in under a siege; Fish & Maritime with no fishing house) | **LEFT, not reached** (the same twin pattern, each read from the roster's house and the crisis) |
| 43, 86, 114, 146, 233, 296 | MED | the small places | the Food endurance line's months against `storageMonths` (the cut names defenseFacts.js) | **LEFT, not reached** |
| 228, 253, 326, 379 | MED | hamlet-plague, village-calm-port, village-monster, town-calm | dossierViewModel.js :: deriveViability (the Outlook's "keeps order and pays its way", "grows what it eats", "feeds itself") | **STOP for each row**: the file is changed beyond its base by lane/w2-a-leaves, lane/w2-c-leaves, lane/w2-fix-data, lane/w2-write and lane/merge-12 |
| 598 | MED | town-plague | "A court exists" from `inst.hasCourtSystem` (priorityHelpers.js) with no courthouse | **STOP** (the flag opens the court part: the capacity build's file by the chair's order) |
| 375, 459, 713, 1201, 1080, 1173, 1377 | MED | town-calm, town-under_siege, city-calm, metropolis-calm, city-occupied, metropolis-calm, metropolis-plague-port | safetyProfile.js: a court "with limited prison"; standard patrol beside an impaired watch; "exists on paper" read off `militaryEffective` beside a Defensible city; "largely a formality" (the merchant-army flag) beside a professional watch; "Hunger-driven theft" in a secure calm metropolis (`settleCrimeLinesToSignal`); "does little harm" beside a ruling syndicate | **LEFT, not reached** |
| the PDF's "REQ"/"FORCED" | — | every PDF with a required or forced force | DefenseSecurity.jsx | **CURED** (827b217d2): the badges leave the PDF; red first in `tests/pdf/defenseReadinessWord.test.jsx` |

- #439/#1248 and the income lines, #1152, the food endurance lines and seven safety lines are **LEFT, not reached** at the context guard: the next seat starts there (the HIGH #439 first). `economicState.js` must be read whole first (881 lines).
- The reds this item's suites met, classed against 0a07f98c7: tests/generators 19 red at both (the base's carried set); one new red, `projectionAgreement.test.js` F3's company member, re-keyed by identity in 18aeee4b5 with its cause.

## #608 and item 4 — NOT STARTED (the next seat's)

- **#608** (the Economics prosperity glance "26/100" beside "Prosperous"): not measured.
- **Item 4:** the one-ladder measure brought current; services and the Magic tab listed (L3, C11, kept by ruling 7); the first read's corpus lines (M1, M2, M3, M5, L2) and the fourth read's C-M1 six births declared as exposure, town by town, at the final tip.

## THE LOWS (the fourth read's), with their writers

| Low | Writer | State |
|---|---|---|
| C-L1 an event beside a lasting crisis reads "while they last" | `prosperityInCrisis.js :: prosperityInCrisisLine` (this lane) | left: the D(ii) family, ruled for after the release |
| C-L2 a crisis that lowers nothing is named | the same | left, ruled (D(ii)) |
| C-L3 the journal's raw category keys | `pdf/lib/viewModel.js` | **cured, F2** |
| C-L4 the AI grounding's grammar ("Religious Authorities's mark", "Recent changes: Recent changes:", a repeated clause, "wandering off: bread is short") | `src/domain/aiGrounding.js` and its rumour lines | not this lane's |
| C-L5 the Economic Survival row with no sentence | the corpus's DS-DEF-2 economic pool through `defenseStateProse.js :: economicRowPoolKey` (wr; wa) | not this lane's |
| C-L6 a band beside another band's sentence | `threatAssessment.js :: buildThreatAssessment` | **F3, stopped by its rule** (above) |
| C-L7 the PDF's Economic Survival colour on 60/35 against the band's 65/40 (PLAUSIBLE, the reader's) | `threatAssessment.js`, `econColor` (this lane) | left, not reached |
| E-L1 the Druid Circle not on the eight-house list | — | moot: reading A withdrawn (W1); the Druid Circle's two roles are listed in the count test |
| W-L1 a crisis's severity band moves with the will | the crisis condition's severity reads the defence rating | explained; named |

## EVERY NEW OR CHANGED READER SENTENCE OF THIS SEAT, with the town it was read in (the owner vetoes by exception)

1. ", laid by before the <crisis>" inside the two can-pay money lines (the PDF's Economic Survival row; the tab's expanded row): "Money enough to ride out a long crisis, laid by before the famine: emergency measures can be paid for, and the garrison kept paid while it lasts." (rv2-famine-city-0); "Money enough for a short crisis, laid by before the siege; a long siege would start eating the reserves within months." (the rv2 sieges).
2. The register's "at war" (reg7-wartime-village-0: "A struggling village, at war."), the register line with no clause (reg7-occupied-village-0: "A poor village."), and the realm chart's "at war" segment.
3. "Neighbours notice trouble and deal with it themselves." (rr2s-thorp-calm-port-1, the Safe line).
4. Changed in WHERE it prints: the watch's own guard line in place of "A mercenary company provides enforcement…" where a watch stands (rr2s-town-indebted-port-1).
5. Removed: the PDF's "Score avg" stat; the PDF forces' "REQ" and "FORCED" badges; the journal's "Member of: <category key>" rows and table cells.

## LEFT, AND THE FINAL STATEMENT

- **The final statement is HELD** (the chair's order) until the capacity branch is merged into the lane; it is not begun. When made: the census with the hazard checked (the counter's own exit and a non-empty `counts.txt`); the rating moves of this seat declared: W1 (1,440 records back to c72917251's), W3 (22 records, 18 up, 2 up a band); the 51 golden surfaces; the whole suite classed (the reds met so far are above); the eight towns; the sentences above; the edge bundles last.
- **Parked for the chair, together:** F1's line (the selector, `defenseStateProse.js`); F3's 25 cells; W5's class (238); the count law off the default dials (60 of 240, the parish/clergy and monastery/hospital pairs, now ruled as two jobs to be named by the capacity seat's test); the item 3 stops above.
- Files this seat changed that the capacity seat also takes: `src/generators/defenseGenerator.js` (W1, W3; before the chair's order of 19:10) — nothing since. `defenseInstitutionBuckets.js`: W1 only (byte-identical to its state before 13782cf82).

## Incidents

- A shell `cd … && (…) &` put a `cd` in the background, so three gate commands once ran in the main checkout (`/home/user/settlement-engine`) instead of the scratch tree: they read only (typecheck, eslint) and failed there; the refs and local config were compared after: unchanged. Re-run in the scratch tree, green.
- This seat's own `npm run build` left `dist/` in the scratch tree, which `chainPrintSites.walker` walks: deleted; green.
- Refs and local config compared after every push and suite: only `refs/heads/up7` moves.


---

# COHERENCE-UPKEEP: the hand-back (the sixth seat, COHERENCE-UPKEEP-6, 2026-11-13) — HANDED BACK BY FILE, WITHOUT THE FINAL STATEMENT (the chair's ruling of 15:04: the seventh seat makes it once)

**The lane:** `lane/coherence-upkeep-2026-11-12`. **Base of this seat:** ce3bceda9 (the fifth seat's last commit). **The lane's reviewed base:** 69b53decd. **The probes:** `docs/chair/2026-11-13/probes/UPKEEP-6/` (`births6.mjs` births the fifth seat's 3,036 and this seat's own 720 `fresh6-*`, which no seat tuned on, or named keys; `an6.py` reads two dumps). The fifth seat's record and every earlier one are kept below, unchanged.

## The brief's rulings, copied in (the chair's message of 2026-11-13 is not on the branch)

- **Who asks:** the chair, session `session_01FE9mEws7PXYRYdjQPbSX15`, on a new account; the owner re-confirmed the standing delegation on 2026-11-13 ("all judgement and all permissions are yours, and you may create child sessions") and told the chair to start this seat. No adjacent repair.
- **A, what the derived form left:** re-measure F3 (`foodRecord.storesHeld`) on the review's six births and unseen famines; F7 and F4 under pay at the standing label; the census's low line (row 2's entrants, classed).
- **RULED on the fifth seat's calls:** (1) the band is read from the score AS THE PAGE SHOWS IT, so a number and its band can never disagree on a page: where a surface prints a rounded figure the band must agree with the printed figure on every birth, cured at one home if not; (3) services and the Magic tab keep reading the SHOWN label in this release.
- **B, the kind of wall** (decided by the chair on the owner's deferral): the walls part scaled by the wall's kind, read from the roster's defence home (47581b61b); stone at today's full value, so no stone-walled birth moves (prove it); a palisade 0.6 and an earthwork 0.4 to start, as rows of DEFENCE_TUNING for the owner's veto. Measure first: every roster name that sets walls, with its count by size, what a citadel or a keep is on the roster, then the births that change band, listed. The tuning inventory moves through its own ritual.
- **C, war drains** (the same decision): wartime enters the crisis table as one more row through the same machinery; it takes from what sustains a town (the stores, the purse, the market) and leaves who stands and what is built alone; 15 economic points to start (about three points of a rating), the weight in the table for the owner's veto; its cost measured on unseen births before it is built. It re-homes onto the parts an effect the product had by a hidden route.
- **D, the named conditions (the loaded dice): NOT BUILT** and no frame prepared, until the owner answers (the chair sends it if it comes).
- **E, the final statement, once, at the final tip:** the census against the base counts; the whole suite (`npx vitest run --maxWorkers=2`, to a file), every red classed against 69b53decd and the fifth seat's list (the golden master red as expected; no golden's door); the draft record's six golden surfaces by measure; the eight example towns from the built code as `docs/chair/2026-11-13/UPKEEP-EIGHT-TOWNS.md` (for the owner and the record; no page shows a part); LAST and alone, the edge bundles.
- **The laws:** defence holds no fact of its own (strip-and-recompute green at every commit); the parts sum exactly to the rating on every birth; one direction; count once; every number in DEFENCE_TUNING; a saved town's stored profile is read as it is (tested on a record as the deployed client stored it); every claim on births not tuned on; a count falling is not a cure; SHOW THE RATINGS, NOT THE MACHINERY (no part's points, sum, pay share, weight, limit, slider name or explanation on any page, PDF or export; every reader-surface string added or changed is listed; the guard's reader-surface arm stays green).
- **How:** scratch worktree, plain pushes to this lane only; the three gates at every `src/` commit through `scripts/gate-tail.sh`; pins re-keyed by identity with the cause; no baseline banked, no skip, no `--tighten`; refs and local config snapshotted around every suite and push. NEVER: `--no-verify`, a force push, an empty push, another branch, a pull request, master, a golden's door, a deploy, production credentials.
- **Messages:** to the chair only for a stop that blocks everything, ONE short message when A is pushed (its tip), and the hand-back (150 words, the tip read back from origin, executed told from plausible).

## A — what the derived form left

| Item | Commit | What |
|---|---|---|
| Call 1, the band | de371fc40 | readiness stored in the whole points the page prints; a record-only LIMIT line carries the rounding |
| F4 | cd7242c00 | a siege with no famine names the siege, not the hunger |
| F7 | 05b8ee712 | the charter hall's two true readings |
| F3 | none (measured) | the held granary restored where the standing share keeps six months |
| Row 2 | none (classed) | 78 entrants, all exposure |

**Call 1, the band (RULED: the band is read from the score as the page shows it).**
- *Every surface that prints the figure:* the causal contributor sentence "Defense readiness score: N." (whole points, `Math.round`) and the record itself (the JSON export). No tab, PDF section or Foundry page prints `readiness.score`; every other surface prints the label.
- *Measured at ce3bceda9:* the printed figure's band disagreed with the label on **113 of 3,036 and 18 of 720** fresh6 births.
- *The cure, at one home (the producer):* the score is the exact sum rounded once to whole points; a record-only LIMIT line (`DEFENCE_WORDS.rounding`) carries the difference, so every part keeps its own measure and the tenths still sum exactly.
- *After:* 0 and 0. Band moves against ce3bceda9: **107 of 3,036 and 18 of 720, every one up one band**, each a sum within half a point below a cut (the V3 build report's 107). Red first: 107 of 120 in `defenceParts.test.js`. Reader-surface strings: none.

**F4 (the hunger line in a siege).** At ce3bceda9 the hunger line printed with no famine in **177 births** (sieges, food band deficit or import-dependent, up to 9 months stored). Cure: each crisis line is one per kind (the hunger line on the famine, its twin a siege line; the siege line on the siege, its twin the purse line). After: 177 → 0, the siege line with no siege 0. The guard text changes in exactly those 177; no other field moves. Three pins re-keyed by identity (the cause in the file).

**F7 (the hired lines under standing-label pay).** Measured at the tip:
- the hired company's pair (paid / short) is reached by **0 of 3,756** births, because every company born stands beside a watch. **Kept** (my call, it only declares): both lines are true wherever they print (a custom or edited roster), and they are the model for the cure;
- hired swords beside a garrison: two readings reached (Comfortable and below 520; Prosperous and above 184), each against the label the page shows;
- the charter hall's purse line was **one reading** for every label from Struggling to Comfortable (46 births).
- The guard lines read the label the page SHOWS (R3: the page states no pay against a label it does not show). Defence's own pay reads the standing label, in the record only.
- Cure: the charter hall's short line on `prosperity: ≤ poor`, its twin the purse line. After: the short line in 30 births (Poor 16, Struggling 14), the purse line at Moderate (10) and Comfortable (6). No other field moves. Two pins re-keyed by identity.

**F3 (the held granary), measured; no cure.**
- **The review's six births:** all six now hold the granary as at the base: agree-city-58, agree-force-famine-town-4, -city-1, -city-5 (the 660's recipe), cold-famine-town-1, cold-famine-city-1.
- **Every famine birth, base 69b53decd against ce3bceda9:** held→held 190 and 38; not held→not held 295 and 98. Held→not held: **5 of 490** (u5) and **2 of 138** (fresh6). Not held→held: 0.
- **Those seven:** cold-famine-town-24, -town-58, cold-famine-city-79, fresh5-famine-town-6, fresh5-famine-city-9, fresh6-famine-city-5, -city-12. In each, the stores laid by at the standing share (Poor, Moderate or Comfortable) fall below the six-month window (5.5–5.8 → 4.7–5.4 months).
- **Classed as the ruled design** (one measure for stores, the leaf): the page states the months it holds, and the held clause reads the same months. Nothing to cure.

**Row 2 of the census ("two store durations"), classed.** At ce3bceda9 against the base counts (`probes/UPKEEP-5/census/69b53decd.*`, the same 720): 571 → 544; **78 enter, 105 leave.** Each was born at both trees:
- all 183 are small places with no granary (thorp, hamlet, village);
- in each, the stores' months moved by the standing share (e.g. 1.5 → 1.4 months), crossing a word boundary between two writers that round different quantities (the stores line: the household stores; the endurance line: the stores plus what is still harvested).
- **Every entrant is EXPOSURE** (the lane moved the input; neither writer changed). None is origin.
- The census's only other move: row 4, 106 → 109 (5 in, 2 out), not this lane's reading. Every other row is identical.

**Strings added on a reader's surface by A** (the Defense tab's guard assessment), for the owner's veto:
1. "A hired company is on the books, paid from what the siege leaves; it comes when called and leaves when the coin does."
2. "Hired swords back the garrison, paid from what the siege leaves."
3. "The adventurers' charter hall takes bounty work against threats, paid from what the siege leaves."
4. "The adventurers' charter hall takes bounty work against threats, but the coin for bounties runs short."
None names a part, a point, a share or a rule (the guard's reader-surface arm is green).

## THE REVIEW'S RULINGS (REVIEW-UPKEEP-2 at 73b1304de, NOT CLEAR; the chair's message of 2026-11-13 12:3x, copied in)

The chair, verbatim in substance (each vetoable; in order; each its own commit, red first, measured):
1. ONE LABEL SPEAKS FOR PAY, AND THE PAGE SAYS BOTH (H1, H2). (a) Wherever the shown prosperity label prints and the standing label differs, that surface says both in the world's words: one plain sentence, what the place is in ordinary years and what the crisis has made of it; no word of pay, score, "standing" or "label"; list every surface (pages, PDF, Foundry, exports); new words to the owner's veto list. (b) Every sentence about paying for defence reads the standing label through keep.js :: keepOfRecord: the guard lines (F7) and the PDF's line in threatAssessment.js. "Hired swords" only where a contracted force is on the roster (M4); "hunger" only in a famine (F4). (c) Then read thirty capped towns and list any line still claiming present ease against its page, with its town; a corpus-document line is named for the corpus lane.
2. THE PARTS ARE NOT STORED (§3): one exported function computes them from the record; the stored profile keeps its old shape; stop if anything at runtime needs stored parts. The walker's fifth arm reds on a stored or serialised part (plant v-prime); its second arm on getActiveRng() and createPRNG(seed)() (plant ii). PUSH after item 2 and send the tip in one line.
3. EVERY EFFECT OF A CRISIS ON A DEFENCE SCORE IS A ROW OF THE ONE CRISIS TABLE (C6): the Crime part reads crime before the stress multiplier; what famine and siege take from order through it becomes explicit rows at the measured size, so no famine or siege rating moves; wartime gets no such row.
4. COUNT ONCE (C5) is law, but MEASURE BEFORE BUILDING and send the table (each magic house, the parts it feeds and by how much; what is left of magic and of each tradition if it keeps only its named part; the movement on unseen births under both readings). The chair rules from the table.
5. THE MARTIAL WILL IS NOT A PAID PART (C7): base configuration, held to the armed bodies; pay reaches it only through that limit. Confirm the reviewer's plausible reading by execution first.
6. ONE LADDER FOR ONE NUMBER (§4): the posture line reads the badge's band through one home (Fortress and Well-Defended the strong pool; Defensible and Lightly Defended the adequate; below, the weak), no new words; read ten towns of each cell that changes pool. A home in another lane's file: name it and leave it.
7. KEPT: services and the Magic tab read the shown label in this release; L3 and C11 listed for the owner, not cured.
8. EXPOSURE, DECLARED, NOT EDITED: M1, M2, M3, M5, L2 are corpus lines; declare each rise town by town in the draft record under the charter's four conditions.
Then A (done), B, C and E. Read notifications after every commit; hand back by file at the context guard.

**Later ruling (13:1x), on the reader's CLEAR of A, B, C (REVIEW-UPKEEP-9fccbd8ed at 7e94454a3):** the earthwork's 0.4 is reached by no birth; its row leaves DEFENCE_TUNING until the roster names an earthwork of its own; prove no rating moves; the inventory through its ritual. After ruling 3, before ruling 4.

### What is built (in commit order)

| Commit | Ruling | What, and its measure (3,036 + 720 fresh6 unless named) |
|---|---|---|
| 0c0e8f99f | 1(b) | guard purse lines read the standing label (keep.js :: standingLabelOf); the crisis lines (hunger, and F4's siege twins) RETIRED: their reason was the capped label. Short-purse or crisis guard line beside "money enough": 652 -> 0; hunger/siege guard lines 346 -> 0. (Its money-line half is cured below.) |
| 9a9f7c10e | 2 | parts not stored; defenseGenerator.js :: defencePartsOf computes them; the export carries none; recordRegister's parts row leaves; walker arms ii and v' planted. Nothing at runtime read stored parts. |
| 798a5719a | — | inventory refreeze |
| fe5786c97 | 3 | crime read before the stress multiplier (priorityHelpers :: criminalPreStress); each crisis's crime a table row at today's size (ten rows; wartime none). Calm, famine, siege, other crises: 0 of 3,205 move. Wartime: 476 of 551 up, mean 0.56 (max 2); 11 up a band. |
| ddaa03935 | — | inventory refreeze |
| d8986c04c | 1(a) | built by a builder subagent (its commit 2d031acac, picked -x): src/domain/display/prosperityInCrisis.js :: prosperityInCrisisLine, "<Standing> before the <crisis>; <Shown> while it lasts." on the Overview tag, the Economics glance, the Summary tab and its copied text, the Tonight table view, the PDF cover, Overview and Economics, both Foundry rows, the realm register line. Left without it (reasons in its commit): the gazetteer cell, the gallery chips, the PDF/Foundry headlines (their page prints it), the desk prose. 1,676 of 3,036 births differ; a calm birth's surfaces byte-identical. |
| 5f2a702bc | 1(b) cure | the money line's reader typed (one domain any-hole) |
| 65cb03ef1 | — | inventory refreeze |
| d585d51f5 | 13:1x | the earthwork row leaves; an earthwork reads as a palisade in both homes. Births byte-identical. |
| 89641364f | — | inventory refreeze |
| d398faebe | 1(b) cure | the PDF money line reads its row's own score again: keyed to the label it contradicted its own badge and the screen's row (found by 1(c)) |
| c893b4998 | — | inventory refreeze |

**NEW WORDS for the owner's veto (1(a)):** "<Standing> before the <noun>; <Shown> while it lasts." · "<Standing> before the <a> and the <b>; <Shown> while they last." · the fallback noun "the crisis". The nouns are the estate's own (crisis/crisisHooks.js :: CRISIS_NOUN). A's four new strings (the three siege lines, the charter short line): the three siege lines are RETIRED by 1(b); the charter short line stands.

**1(c), the thirty capped towns** (`probes/UPKEEP-6/read30/READ30.md`; a read-only seat, at 65cb03ef1, every claim executed): money or ease lines CORPUS 26 (+19 "trade as usual" lines on besieged pages), CODE 70, TRUE ON READING 168.
- CODE lines, by home, for the chair (none is in a file this lane holds but threatAssessment.js, now cured): `economicState.js :: generateEconomicState` "A thriving alchemical trade..." in 12 famine or siege towns; `rulingStructure.js :: generatePowerStructure` "Well-funded city watch..." (6 towns); `stressNarrative.js :: RENDERERS.wartime` "...doing well out of it" (7 wartime towns); `narrativeData.js :: STRESS_DESCS.wartime` "...prosperous in a way that feels wrong" (2); `historyData.js` "...wealth it once carried drained away" (1); `dossierViewModel.js :: deriveViability` "keeps order and pays its way" in a debt crisis (supplementary, 1). The PDF money line's nine pre-1(b) "money enough to ride out a long crisis" beside "It may not survive" (viability) stand on its score, as at the base.
- CORPUS, named for the corpus lane: DS-DEF-2 Economic Survival STRONG ("has not turned into a collapse" 7, "arrangements intact" 2, "money in hand" 2), DS-DEF-2 CHAIN defence supplied 8, CHAIN food trades working 2, DS-DEF-2 Invasion & War walls and garrison "raiders stay away" on besieged pages 3, DS-DEF-11 WALLED-QUIET 1; trade lines DS-GEN-13 and DS-ECO-1 C4 (19).
- Made false by 1(a): Treshaw's corpus "short of money for years" (DS-DEF-2 WEAK) and Dharmapura's "Trade collapse" tension, each beside "Prosperous before the famine"; and 1(a) sharpens the two wartime narrative lines above.

**Ruling 4, measured (`probes/UPKEEP-6/magic-count-once.md`), then READING A BUILT by the chair's ruling E (below):** 1,559 of 3,756 births hold one of the eight houses. Reading A (each keeps its named part, leaves magic): 895 move, mean -1.4 (max -6), 103 down a band, none up; the magic part's mean 11.7 -> 10.3. Reading B (keeps magic, leaves its named part): 1,037 move, mean -2.7 (max -26), 212 down a band. Per house in the file. Sent to the chair; it rules.

**Ruling 5, BUILT (008fc3328):** the reviewer's plausible C7 confirmed by execution first (with no hold and no crisis, pay alone cut the will at Moderate 16 of 36, Poor 26 of 70, Struggling 4 of 9). The will is added unpaid where something is built or standing; R13 holds it to the paid armed bodies. Comfortable and above: 0 of 2,099 move; Moderate, Poor, Struggling: 639 up, mean 0.5 to 1.0 (max 3); 35 up a band.

**Ruling 6, MEASURED, NOT BUILT — NAMED AND LEFT (`probes/UPKEEP-6/one-ladder.txt`):** the posture line's home is `src/domain/display/stateProse/defenseStateProse.js :: posturePoolKey` (it bands readiness.score on the aspects' ladder, `defenseScoreBands.js :: scoreBand`, 65/40/20). The file is HELD by the first leaves lane (lane/w2-a-leaves-2026-11-12, two commits on it since 69b53decd: 08c9f15bd, 8f96276a9), so per the ruling it is named and left. Measured at 008fc3328 (3,756): the ruled mapping changes pool in 1,993 births. Cells: Vulnerable critical -> weak 703; Lightly Defended weak -> adequate 558; Undefended critical -> weak 423; Well-Defended adequate -> strong 274; Defensible (38-39) weak -> adequate 35. Ten towns of each cell are in the file. **Read against the pools' own words** (DS-DEF-1): Well-Defended -> strong, Defensible -> adequate and Vulnerable -> weak read TRUER; Lightly Defended -> adequate ("covered against what it is likely to face") and Undefended -> weak (it loses "all but undefended" for "could deal with a brawl or a thief") read LESS true. **PARKED, my recommendation for the chair:** one ladder, all four pools kept and no new words: Fortress and Well-Defended strong; Defensible adequate; Lightly Defended and Vulnerable weak; Undefended critical; built by the holder of the file.

**Ruling 7, KEPT:** services and the Magic tab read the shown label. Listed for the owner, not cured: L3 (the Magic tab's "Availability limited" on 568 of the reviewer's 1,200 tip pages, 53 of them paid in full at a Prosperous standing) and C11 (the Magic tab moves on 9 of 10 towns as master stored them: `magicProfile.js :: buyable` reads the stored printed label at render time).

**Ruling 8, AT THE FINAL TIP (with E):** M1, M2, M3, M5 and L2 are declared town by town in the draft record under record 287's four conditions (the row old on the line; a named later lane owes the cure, the corpus lane; the rise confined to towns whose fact this lane changed; declared). The base is the reviewer's `classes.base.json` at 69b53decd (its 1,200 rv2 births); the tip side is rendered at the final tip by the reviewer's own `render.mjs`, `scan.mjs`, `classes.py`, after ruling 4's answer, since it moves ratings.

M4 (hired swords with none hired), by execution: the three named births each hold a "Free company hall", which the defence home counts as a hired company (defenseFacts.js :: defenseFactsOf, FREE_COMPANY_RE) and whose catalogue line reads "garrison contracts, and short-term military hire". True as printed; nothing cured.

## THE THIRD READ'S RULINGS (REVIEW-UPKEEP-2 at 65cb03ef1; the chair's message of 2026-11-13 15:04, copied in)

A through E, each its own commit, red first, pushed as made:
- **A.** One home for pay on every surface: the Economic Survival band.
- **B.** "Hired swords" only where a company is contracted.
- **C.** The two-label sentence leaves the realm register. List the map-vs-town war disagreement; do not cure it.
- **D.** The sentence's own home: (i) event crises read "<Shown> since."; (ii) name only the crises that lower the word, from the prosperity writer's table, or leave it and say so; (iii) on the PDF cover the sentence sits with its word.
- **E.** Ruling 4 READING A, built now as a declared move; no weight changed. Then MEASURE ONLY: the alchemist shop and the alchemist quarter keeping alchemists and leaving arcane.
- Then hand back by file, without the final statement: the seventh seat makes the lane's final statement once.

| Commit | Ruling | What, and its measure |
|---|---|---|
| b79970bec | A | `defenseScoreBands.js :: economicSurvivalBandOf`; the PDF money line (`threatAssessment.js :: moneyRungOf`) and the guard's purse clauses (`safetyProfile.js :: purseWordOfBand`) read the band. The guard line is written after the defence profile (`assembleSettlement.js :: withGuardPaidFromDefence`). On the reader's 1,200: tab against PDF 83 -> 0; a short purse beside can-pay (J) -> 0; labels differ with no two-label line (L1) -> 0. Test: `tests/generators/payOneHome.test.js`. |
| 22a8a956b | B | the swords clause needs the defence home's mercenary bucket. My corpus 34 -> 0, the reader's 7 -> 0; with a contracted company 843 -> 843. |
| 6c8501fcc | C | the register row is again what it was before 1(a). **LISTED, NOT CURED:** in a campaign whose map has no war, 40 of 40 forced-wartime births read "at peace" on the register (`heraldRegister.js :: warClauseOf` reads the map, the town reads its own crisis). |
| c72917251 | D | (i) "since" when every crisis named is an event (betrayal, conversion); (iii) "Prosperity: <sentence>" on the PDF cover, Overview and Economics (`prosperityInCrisis.js :: prosperityInCrisisLed`). **(ii) LEFT, and why:** the prosperity writer lowers the label through an if-chain, not a table; naming only the crises that lowered it would need a second copy of that chain. Every active crisis is still named (the third read's 1a-L3 stands). |
| 13782cf82 | E | READING A: the eight houses leave the magic presence's roster (`defenseInstitutionBuckets.js :: DEFENSE_NAMED_MAGIC_HOUSES`, `magicPresenceRosterOf`); each keeps its named part. `probes/UPKEEP-6/magic-reading-A-built.txt`: 899 of 3,756 move, all down (mean -2.43 over movers, min -6); 104 down a band (Fortress -> Well-Defended 63, Well-Defended -> Defensible 37, Defensible -> Lightly Defended 3, Lightly Defended -> Vulnerable 1); fresh6 154 move, 15 down a band. The Economic Survival score rises in 88 (inferred through the SUSTAINS hold, not traced), so the money line goes one rung up in 8 births. Test: `tests/generators/magicCountOnce.test.js` (30 of 96 red before). Re-keyed by identity: `defenseEconomicGate.test.js` "a healthy settlement is not taxed" (the presence it compares is the presence roster's). Suites generators, lint, pdf, domain/display against c72917251: no other new red (35 red at both). |

**E, MEASURE ONLY (for the next seat): the alchemist shop and the alchemist quarter keep alchemists and leave arcane.** `probes/UPKEEP-6/alch-measure.txt` (alch6.mjs + alch-measure.patch on a scratch copy of 13782cf82; 3,756 births). Arcane closes in 85 of the 361 holders it was open for; alchemists kept in 633 of 633. Readiness moves in 81, all down (mean -8.5 over movers, min -23); 43 down a band. The shop carries it: 59 of 108 move (mean -10.3), 37 down a band, including 18 Defensible -> Lightly Defended, 6 Lightly Defended -> Vulnerable and 2 Defensible -> Vulnerable. The quarter: 22 of 525 move (mean -3.6), 6 down a band. fresh6: 13 move, 8 down a band. Nothing built; the chair rules.

**Red at base, not this seat's to sign:** `tests/pdf/goldenViewModel.test.js` (defense.scoreAvg 43 -> 37, headcounts 44 -> 43 and 36 -> 35); red at ec3084650 and at c72917251 alike.

## EVERY NEW OR CHANGED READER SENTENCE, FOR THE OWNER'S VETO (the whole seat)
1. "The adventurers' charter hall takes bounty work against threats, but the coin for bounties runs short." (A, F7; the Defense tab's guard assessment). Stands.
2. "<Standing> before the <crisis>; <Shown> while it lasts." and "<Standing> before the <a> and the <b>; <Shown> while they last.", with the fallback noun "the crisis" (1(a)). The Overview, the Economics glance, the Summary tab, the table view, the PDF and the Foundry. NOT on the realm register (C).
3. "<Standing> before the <crisis>; <Shown> since." when every crisis named is an event (D(i)).
4. "Prosperity: <sentence 2 or 3>" on the PDF cover, Overview and Economics (D(iii)).
5. Changed in WHERE they print, not in words:
   - the PDF money line and the guard's purse clauses (now on the Economic Survival band, A);
   - "Hired swords back the garrison" (contracted companies only, B).
6. RETIRED: the three siege guard lines (A, F4) and the hunger guard line in the guard assessment (1(b)).

## LEFT FOR THE SEVENTH SEAT (not started here)
- The lane's final statement, once: the census, the whole suite, the goldens, the eight towns doc, the edge bundles last.
- Ruling 8 at the final tip: declare M1, M2, M3, M5 and L2 town by town. 1b-M3 (the purse beside the people's hunger, 202 births) belongs to it.
- Ruling 4's second half: whatever the chair rules on the alchemist measure above.
- Ruling 7: kept; L3 and C11 listed for the owner.
- The cold-list lines (1(c)'s CODE lines, by home, above).
- Ruling 6: the one ladder for the posture line, for the holder of `defenseStateProse.js`.

## Incidents
- A `tests/lint` run I started in the live worktree overlapped my next edits, so its result is discarded. My stop of it by PID was refused by the permission layer, so it ran to its end. `tests/lint` is re-run in clean, detached measurement worktrees (`/home/user/wt6-m` at 05b8ee712, `/home/user/wt6-b` at ce3bceda9).
- lint-staged backs the index up in `git stash` at each commit and drops it again. The refs and local config were compared after every commit and suite: only `refs/heads/u6-local` and the fetched remote refs differ. `npm ci` set `core.hooksPath=.husky/_` (the lane hook), as expected.

---

# COHERENCE-UPKEEP: the hand-back (the fifth seat, COHERENCE-UPKEEP-5, 2026-11-13) — HANDED BACK BY FILE AT THE CONTEXT GUARD

**The lane:** `lane/coherence-upkeep-2026-11-12`. **Tip:** read it back from the remote; it is the commit that adds this part. **Base for every measure:** the agreement lane's tip `69b53decd`. The fourth seat's record and every earlier one are kept below, unchanged.

**What the owner reads:** `docs/chair/2026-11-13/UPKEEP-DEFENCE-PARTS.md`. It holds stage one (the formula classed term by term; V1 and V2), the ADDENDUM (R10: V3, SOURCE and KIND, the weight table, one direction, count once, the eight towns) and the SECOND ADDENDUM (R13, R14, R12 measured). It carries one CORRECTION, by name: cold-town-142 and fresh5-town-37 each HAVE a town watch.

## Named commits, in order

| Commit | What |
|---|---|
| 37b607270 | Merge AGREE's tip 69b53decd (the generated files on AGREE's side, re-taken after) |
| 15fa0c569 | Lighting census re-taken after the merge |
| 70c6ef6c6 | Stage one: defence as the sum of its parts (measured, nothing built) |
| e1b2f9c1f | Addendum R10: V3 measured |
| 44cddb372 | **F2**: a house's own service is never scaled (red first; 367 rows restored in 166 of 320 unseen births, 0 removed; the institution table pin 1,834 → 1,837 by its cause) |
| 2d88c66c4 | **F5**: no "back the garrison" after the merchant-army lead (red first; 10 false sentences removed on 880 unseen births, 0 true lost) |
| 412dc2129 | Second addendum: R13, R14, R12 measured |
| 0c950f06c | R3: the STANDING label (`economicState.prosperityStanding`), written by prosperity's writer with its one draw replayed. The stores and defence's pay read it, through `keep.js :: keepOfRecord`. The printed label is unchanged on 3,036 of 3,036. |
| e90c4f97d | The traditions' and the small place's name tests move to the roster's defence home `domain/institutions/defenseInstitutionBuckets.js` (byte-identical, 960 of 960) |
| 82c639b44 | **V3 + R13 + R14.** Readiness = the exact sum of `defenseProfile.parts` (tenths); every number in `src/data/defenceWeights.js :: DEFENCE_TUNING`; the parts are in the RECORD, never on the page |
| 2e9d701e3 | Tuning inventory refrozen through its ritual |
| 47581b61b | R17's home: the roster's defence home answers the wall's kind (stone / palisade / earthwork); nothing reads it |
| f3489418c | Limit 1 listed once |
| 623fdc0c4 | Five pins re-keyed by identity with their causes (defenseEconomicGate ×4, defenseWordsFindings palisade) |
| 496554ab0 | Negative anchors |
| **73b1304de** | **R2 in the product: the hired-only rule against the place's REAL V3 military with a watch in its stead. V3'S NAMED COMMIT: the defence code is final here.** |
| c12593989 | V3's build report: `docs/chair/2026-11-13/UPKEEP-V3-BUILD.md` (receipts, gates, pins moved, reds not cured, incidents) |
| 4a179bcc9 | Follow-on brief (technical state) and the two read-only censuses |
| a97e315ac | Lighting census re-taken |

**V3's receipts, measured on the 3,036 unseen births:**
- the parts sum EXACTLY to the score on 3,036 of 3,036;
- the score agrees with the probe's reference on 3,023 of 3,036. The 13 that differ are hired-only places, moved by the real R2 counterfactual, with no band moved;
- the band agrees on 2,929 of 3,036 (see call 1);
- the proof of "derived" (strip the defence profile, recompute, compare) holds on 432 of 432, and 120 of 120 in `tests/generators/defenceParts.test.js`;
- the guard is `tests/lint/defenceDerived.walker.test.js`: five arms, each planted red, including the reader-surface arm of record 328;
- strings V3 adds or changes on a reader's surface: **none** (the Defense tab is unchanged; a render test shows it).

## Calls taken by this seat (each vetoable)

1. **The band reads the tenths score** (`readinessBandOf(score)`), so the badge never disagrees with its number. The probe banded `round(total)`; 107 births sit less than 0.5 below a cut.
2. **R2's counterfactual is the real V3 place with a watch**, not the probe's shortcut. It keeps the owner's pin green (agree-village-45).
3. **Services and magic still read the SHOWN label**; only defence and the stores read the standing one. That leaves two readers of "what a place can keep up" in a crisis: a ruling for the chair.

## NOT DONE: the follow-on seat's (said here, not dropped)

- **F7 and F4** (the hired and crisis lines under standing-label pay). **The census's low line** (row 2's entrants, classed).
- **F3 is built but not measured:** the stores now scale at the standing label, which should restore the held granary in famine towns. Re-measure `foodRecord.storesHeld` on the review's six births (agree-city-58, agree-force-famine-town-4, -city-1, -city-5; cold-famine-town-1, cold-famine-city-1) and on unseen famines.
- **The census at the final tip.** The base is taken: `probes/UPKEEP-5/census/69b53decd.counts.*`. The tip is not.
- **The whole suite at the final tip.** The V3 builder's red classes are in `UPKEEP-V3-BUILD.md` §"Reds not cured". generatorGoldenMaster is red; no golden's door was run. The draft record's six golden surfaces by measure are not updated.
- **The edge bundles, last and alone** (`npm run build:edge-shared`): not re-emitted. They are STALE against `src/` at this tip.
- The second layer (R12 with record 324, R16, R17's weights) and prosperity (f): briefed by the chair. The technical state is in `docs/chair/2026-11-13/UPKEEP-6-BRIEF.md`.

## IN PROGRESS: nothing
The tree is clean at the tip, and no work is half-done. Every measure taken is written in `UPKEEP-DEFENCE-PARTS.md` or `UPKEEP-V3-BUILD.md`, except the BASE census counts, which are saved but not compared (`probes/UPKEEP-5/census/69b53decd.*`). The next commands, in order:
1. Re-measure F3 (`foodRecord.storesHeld`) at the tip.
2. `sh <census.sh from lane/second-wave-census-2026-11-12> <tip tree> <out> 2`, then `node compare.mjs` against the base counts.
3. `git fetch origin review-fixes-2026-07-08:review-fixes-2026-07-08`, then `npx vitest run --maxWorkers=2 --reporter=json` once, and class every red.
4. The draft record's six golden surfaces, by measure.
5. LAST and alone: `npm run build:edge-shared`.

## EVERY RULING THIS SEAT BUILT TO (copied in; the chair's messages are not on the branch)

**The owner's words, verbatim:**
- "prosperity should also scale the rest inlcuding healing, magic, etc. everything is based on what can be stockpiled, refilled, rebuilt, etc."
- "if a village or town doesn't have an active guard but can hire mercenaries or adventurers if they have the cash, then that means something rather than not having a guard at all"
- (2026-11-13) "I want defensibility to be derived from all of the supporting contributions that prosperity sets teh scale too in some. all of those add up to a score that shows how defensible a place is, rather than we set a place as defensible and then make everything match to that rating"
- "prosperity yes"
- "just do the additions with the limits you have set. i agree with them"
- "each of the defense contributions themselves also must be derived appropriately from institutions, power, economy, etc. essentially all of defense is a derived."
- (randomness, R12) "with the derivisions, i would still like some element of randomness … the set teh floor and cieling rather than a final number. so the same configurations or base elements can still have subtle differences"
- (the page) "no don't show the ratings. don't show the machinery. didn't we have that rule?", then "sorry show the ratings but not the machinery"; and on record, "I agree keep the machinery's out of the prose."

**Withdrawn:** the chair's one-band law, and any cap, floor or clamp on the total set first to fit a rating.

**Record 317: V2 is the form.** Readiness is the exact sum of named contributions, with two limits:
- what sustains a force counts for no more than the force;
- walls with no one to man them count in part.

Prosperity scales once each part that must be paid, fed, refilled or rebuilt. A crisis acts once on the parts it touches. There is no multiplier on the whole.

**Record 318: DEFENCE HOLDS NO FACT OF ITS OWN.**
- Every part is a function of facts homed outside defence (the roster, the powers, the economy's leaves, terrain, history, the crisis), read through its home, never by a name test or a second derivation. Defence owns only WEIGHTS, in one table through the tuning register's door, each with a reason.
- Every term gets a SOURCE and a KIND (DERIVED / DRAWN / STORED-ONLY / WEIGHT; record 320 adds CONFIG).
- A draw describing a house belongs to that house's record; a draw that only varies the score is removed. A STORED-ONLY value gets its source, or goes.
- ONE DIRECTION: nothing a part reads may read defence. A loop is a STOP.
- COUNT ONCE.
- THE PROOF: strip defence, recompute, equal.
- THE GUARD: a walker that reds on a stored defence value, a die, a name test, or a number outside the table.
- The words: each band change explained by a named part and its fact. This last point was AMENDED by record 328.

**Record 320.**
- R1: each of the five scores is the sum of its parts, held to 0..100 (more than enough is reserve). Readiness is their mean plus size minus threat, 0..100. The limits act first, fullness last.
- R2: the traditions count at most 35 against monsters; a hired-only place never reads above the same place with a watch.
- R3: pay reads the STANDING label (before the crisis), stored once by prosperity's writer. Old saves read the label they have. A crisis acts through its own points; the famine's stores are eaten once, at their writer.
- R4: wartime takes from no part in V3. Superseded for the follow-on by R16.
- R5: magic is paid from the one label, at 0.45 + 0.55 × funded.
- R6: the purse is 4 points × bought; the economy dial's term goes.
- R7: only an armed body (garrison, militia, watch, hired company, chartered adventurers, armed households, wardens) mans walls.
- R8: limit 1 stands. Count the walled or wealthy births with no armed body (measured: 0).
- R9: the military dial is CONFIG, the slider, gated by what is built or standing ("Martial will" in code, never on the page).
- R10: the addendum before any build.
- R11: prosperity (f) last.

**Record 321, R12: CONDITIONS.** Derivation sets a part's FLOOR and CEILING; a CONDITION of the body or work (below, ordinary or above) sets where it stands.
- It is drawn once at birth on its own registered fork, stored on the house's record, read through one leaf, and shown by name.
- It is never a roll on a total.
- The parts are the armed bodies, the walls, and the armed households of small places.
- The facts close a condition: unmended walls, unpaid bodies, a crisis in force.
- Ordinary prints nothing. An old save reads ordinary. It is never re-rolled by an edit or regeneration.
- It is built AFTER V3's named commit.
- AMENDED by record 324: the facts LOAD the condition's odds. The chair holds the detail.

**Record 322.**
- R13: Martial will counts for no more than the armed bodies that carry it, after pay and crises. The 0.06 rules stay.
- R14: the neighbour factor stays inside the will, read from its home (`priorityHelpers.js :: neighbourMilitaryFactorOf`).
- R15: the score and the words read no powerStructure field.

**Record 323.**
- R16: WAR DRAINS. Wartime takes 15 economic points from what SUSTAINS (the stores, purse and market), as a crisis row. Not built.
- R17: THE KIND OF WALL COUNTS. Stone 1, palisade 0.6, earthwork 0.4 as starting weights, read from the roster's defence home. Measure first. Only the home is built.
- R18: who rules adds no number in calm times.

**Record 328: THE PAGE SHOWS THE RATINGS AND NEVER THE MACHINERY.** Never on a page, the PDF or an export:
- points, sums, shares of pay, weights, floors;
- limit, reserve or full(ness) in the model's sense;
- a slider or dial by any name;
- any sentence explaining how the rating was worked out.

Only plain facts of the town may print, and later a condition in plain words. There is NO per-part line on the Defense tab: the parts live in the record, the probes and the tests.
- KEPT wordings (none built yet): "Comfortable before the famine; Struggling while it lasts." · "Walls with no one to man them."
- STRUCK: "paid as a Comfortable town" · "{aspect}: more than enough, and the rest held in reserve." · "Its stores and its magic can carry no more than its watch can use." · "Martial will" as a page label.

The guard has a reader-surface arm (built, planted red).

**Stage two (this seat's brief):**
- F2: a house's own service is never scaled. DONE.
- F3: the stores have ONE measure, the leaf; the scaling, the hall's line and every count of crossings read it. Built via R3; NOT measured.
- F7: the hired line reads the label, with two true readings reachable and counted, or the line removed with its reason. NOT done.
- The low lines:
  - F4, the hunger line in a siege: NOT done;
  - F5, after the merchant army: DONE;
  - the 95 row-2 entrants, classed: NOT done.

## WHERE THE PROBES ARE
`docs/chair/2026-11-13/probes/UPKEEP-5/README.md`:
- `births.mjs <tree> <out> <shard> <shards> parts` births the 3,036. Variant V4 is V3 as built; V4C is R12 as first proposed. On a tree without `prosperityStanding`, `git apply measure-lines.patch` first.
- `rederive.mjs` is the proof of derived.
- `an3.py <scratch> V4` and `an5.py <scratch>` read `<scratch>/out/{meas,base}.<shard>.ndjson`.
- The census tool is on `lane/second-wave-census-2026-11-12` (`docs/chair/2026-11-12/probes/SECOND-WAVE-CENSUS/`).

## Incidents

- In this seat's own scratch worktree, a `git stash` and pop of one file, restored at once.
- The V3 builder truncated three stale files in the shared scratch `out/` folder.
- The V3 builder used one `pkill -f "vitest run"`, which could have reached a parallel vitest. Nothing of this seat's was running then, and other seats' were not checked.

---

# COHERENCE-UPKEEP: the hand-back (the fourth seat, COHERENCE-UPKEEP-4, 2026-11-13)

**The lane:** `lane/coherence-upkeep-2026-11-12`. The tip is the commit that adds the edge bundles (the last commit, alone); read it back from the remote. **An independent reviewer reads the whole lane next.** The third seat's record and the first two seats' are kept below this section, unchanged.

**Base for every measure below: AGREE's final tip `faa20bc6c` itself** (the agreement lane without this lane). **Tip:** `6f95af557`; the lane's `src/` is final there, and every later commit is docs, one test-free census file, or the bundles. **Corpora:** the 660 (the 360 `agree-<tier>-<i>`, 60 thorps, 60 hamlets, 180 forced births of famine, war and siege), the golden master's 525, and the espionage fence's 360. **The harness** (it births the corpora in both trees and takes every figure) is `docs/chair/2026-11-13/probes/UPKEEP-4/` (`dump.mjs`, `measures.mjs`, `fielddiff.py`, with a README). The field diff is `UPKEEP-FIELD-DIFF.json`; the draft record is `docs/chair/2026-11-11/UPKEEP-shift-record.DRAFT.json`.

## ⚠ FOR THE REVIEWER: condition (d) was RESTATED BY THE CHAIR at this seat's stop

Read it as a ruling, not as silence. **The stop (2026-11-13):** agree-city-38's criminal capture moved none → equilibrium, toward danger, while its readiness ROSE 45 → 56. That breaks (d) as the third seat held it.

**The chair's ruling:** declare it, and go on. (d) now reads: a flag toward danger where readiness did not fall is accepted ONLY when it is traced, town by town, to a change of council membership that the lane's own declared chain causes, and in at most 3 of the 660. A fourth such town, or one that cannot be traced, is a STOP.

**At this tip: 1 town (agree-city-38). The trace:**
1. The gates go to the identity at Comfortable (0.84/0.88/0.86/0.78/0.82 → 1).
2. Readiness 45 → 56 (Defensible → Well-Defended).
3. Legitimacy 58 → 65 (Tolerated → Approved).
4. The council's power 28 → 31.
5. The roster swaps Religious Authorities (10) for Merchant Guilds (9).
6. npc_merchant_guilds_15_40 takes the Merchant Guilds' rank 1 and leaves the council's rank 2.
7. castPowers re-ranks the council: npc_city_granaries, who carries a covert retainer to "Multiple criminal factions", takes rank 3.
8. `hallCapture.js :: hallCaptureOf`'s agent rung reads equilibrium.

**No person is re-dealt, shown by diff:** the 42 cards' ids, names and personalities are equal, and the granaries' allegiance is the same object at the base and at the tip.

## What this seat did, in commit order

| Commit | What |
|---|---|
| 5e10fd07f | **Merge AGREE's final tip faa20bc6c.** Under `src/`, both sides touched two files since AGREE's line merge: `economicState.js` (both composed: the two end-of-file imports, `keep.js` and `chainYield.js`) and `holderTable.js` (no conflict). The census5b test composed: AGREE's narrowed `twinAnswersOnItsKey`, asked by the lane's `malformedRows`, with an original's crisis disjunction carried as one atom on its needs side. The mutation manifest keeps both sides' rows. The wiring census was re-taken by its writer. The lighting census and the bundles take AGREE's side (re-taken below, and last). |
| 00fc0d9ce | **P6** (red first at the merge): `garrison` on the garrison purse set and its crisis set; `mercenary` on the two hired-only purse sets (the mercenary lead is their twin) and the hired-only crisis set. `declaredSet` / `crisisSet` take `shared` atoms that both lines need. `MERCENARY_LEAD` is read off its set. No line moves (the guard-line births: 139 on the 660 and 96 golden, the third seat's figures). |
| fbdae5389 | **P1:** the gate fixtures re-keyed by identity to the label. Struggling against Prosperous over the same buildings, and the climb 10/30/50/80 as Struggling/Poor/Moderate/Comfortable, profiled as the pipeline profiles. The palisade pin moves to defense-hamlet-13 (Struggling, its one defence "Palisade or earthworks"); defense-thorp-3 is Comfortable now. Green 33/33. **The plant** (`keepOf` → identity) reds 10. |
| 6f95af557 | The lighting census through its door (files 3219 → 3221, titles 29225 → 29245). |
| 462ad5d3b | The draft record and the field diff re-taken; the harness committed as a probe. |
| c950cc823 | The page count: the census counter at both trees (below). |

**L1 at every `src/` commit:** domain-strict 1113 = ceiling; typecheck ratchet 167 = ceiling; eslint clean on the touched files. **The push gates** (c950cc823): ratchet 167 = 167, strict 1113 = 1113, lint 0 errors (37 warnings), all exit 0.

## Calls taken without the chair (they only declare or name)

1. **The census5b composition** at the merge: the lane's crisis lines are keyed on one crisis atom, so `malformedRows` hands AGREE's narrowed rule the original's crisis disjunction as one atom on its needs side.
2. **P6's reach:** `mercenary` is also declared on the hired-only crisis set, so the short purse line declares the company in both sets it stands in. `MERCENARY_LEAD` is read off its declared set instead of spelled again. Without that, the constant stayed an undeclared literal.
3. **P1's reach:** the green fixtures that drive a gate through the economy are re-keyed too: the two climbs, the floors, the thorp and the hamlet. At the identity they passed with no gate biting, so they no longer held their claim.
4. **Two people-paths, new to the declared list, declared in the record:**
   - `npcs[].allegiance`. On the 660, a covert allegiance's `power` moves for 25 cards and its `handler` for 33, in the 5 roster-changed births. 0 allegiances are gained or lost, and 0 houses, vectors or vias move. Both are draw-free functions of the roster by design (`allegiance.js :: allegiancePowerFor`, `assignHandlers`). Golden and fence: index order only.
   - `factions[].modifiers`, index order only.
5. **A slip, reported:** in the scratch worktree I ran `git stash` once by mistake. It held my own two uncommitted P5 edits. I popped it at once, and the stash list is empty, as it was before. Nothing else was touched.

## Parked (each would bank a baseline upward or touch a ruled door)

| # | Item | Recommendation |
|---|---|---|
| P5 | It cannot land as ruled. The door (`npm run gen:dossier-prose`: 169 pairs, 0 joining rows) and the four places green the contract test only after one more pin (the one-endpoint row count 10 → 11, by identity: `econOutput|economicGates.military` became `fundedGate|…` and `upkeep|…`). The regenerated file then reds two pins outside the ruling. **`proseComposed.walker.test.js:215`** pins the leaf's count, 165: a fifth place, with the same cause. **`proseCorpusBytes.test.js` RAW:** the leaf grows 28249 → 28926 raw bytes, and that ratchet's door appends a declared row and moves the number up. That is a baseline banked upward, which is barred to the lane. The built patch is `docs/chair/2026-11-13/probes/UPKEEP-4/P5-built.patch`. | The chair rules the byte row (+677 bytes, cause 07ebe8bdc: the gates' new inputs). Then P5 lands in one commit: the door, six places, and that row. |
| pool | `ledger:NPC_STRUCTURE.magic__contested__dominant` is stale on the composed tree. AGREE banked it through `--bank-new` (a62d984e1) when its re-deal first drew the pool; the composed corpus does not draw it. Its only removal door is `--tighten`. | Name it for the merge point beside `SAFETY_LINE_SIBLINGS`. |

## The measures (base faa20bc6c, tip 6f95af557)

**Readiness, the one-band law (HARD):** **0** places more than one band from base, on the 660 and on the golden 525.
- Labels moved: the 660 131 (the 360 84, thorps and hamlets 9, forced 38); golden 63.
- By stress and distance: {"360|random|-1": 25, "360|random|+1": 59, "small|random|-1": 7, "small|random|+1": 2, "forced|famine|-1": 18, "forced|famine|+1": 1, "forced|wartime|-1": 6, "forced|wartime|+1": 5, "forced|under_siege|-1": 5, "forced|under_siege|+1": 3}.
- Golden: −1 61, +1 2.

**The top two bands on the 360:**
- **Entries 24, against the line of 25.** Exits 5.
- Well-Defended+Fortress 37.8% → 43.1% (+5.3). Declared under the restated line; the entering and exiting towns are listed in the draft.

**Prosperity, food band, safety label:** 0 moves on both corpora.

**Services:**
- **0 rows added. 0 institutions newly empty:** 1218 at both, of a roster of 23548 on the 660.
- Rows removed: 981 on the 660 (313 births), 336 golden.
- **Healing by band, the 660:**
  - Struggling 1034 → 927 (−10.3%)
  - Poor 468 → 428 (−8.5%)
  - Moderate 472 → 439 (−7.0%)
  - Comfortable 747 → 729 (−2.4%)
  - Prosperous 709 → 709
  - Wealthy 274 → 274
- **Healing by band, golden:**
  - Struggling 156 → 120 (−23.1%, under the STOP at 25)
  - Poor 647 → 574 (−11.3%)
  - Moderate 203 → 190 (−6.4%)
  - Comfortable and Prosperous unmoved
- **Criminal rows: none rises** on either corpus (the 660: 371 → 368, 160 → 157, 197 → 195, 451 → 450, 304 → 304, 99 → 99).

**Magic:** every band moves one step down, all in Struggling or Poor places.
- The 660: 328 bands. Poor|broad→common 27, Poor|common→moderate 7, Poor|limited→rare 25, Poor|moderate→limited 46, Poor|pervasive→broad 6; Struggling|broad→common 49, Struggling|common→moderate 17, Struggling|limited→rare 47, Struggling|moderate→limited 81, Struggling|pervasive→broad 23.
- Golden: 250 bands. Poor|moderate→limited 179, Poor|common→moderate 11, Struggling|moderate→limited 60.

**Stores:**
- Months fall in 477 births of the 660 and 328 golden; **rise 0**.
- **The 660's crossings: 57, 0 toward more.**
  - By direction: seasonal→minimal 35, strategic→buffer 19, buffer→seasonal 3.
  - By cohort and stress: 360 21, small 3, famine 9, wartime 5, siege 19.
  - By tier: village 26, city 18, town 7, hamlet 4, thorp 1, metropolis 1.
- Golden: 60 crossings, 0 toward more.
- The famine births are listed in the draft; each keeps its food band.

**The hired counterfactual:** 9 hired-only places, **every one at or under its watch**. Hired vs watch:

| Place | Label | Hired | Watch |
|---|---|---|---|
| agree-village-28 | Struggling | 13 | 15 |
| agree-village-30 | Comfortable | 30 | 30 |
| agree-village-40 | Poor | 23 | 28 |
| agree-village-43 | Poor | 51 | 51 |
| agree-village-45 | Poor | 76 | 76 |
| agree-hamlet-5 | Poor | 29 | 32 |
| agree-hamlet-8 | Moderate | 28 | 29 |
| agree-hamlet-38 | Moderate | 34 | 34 |
| agree-force-wartime-village-7 | Struggling | 23 | 26 |

**The page:** under famine or siege on the 660, 31 births print a crisis line and 0 a purse line. Golden: 23 food-capped births keep the purse line (the third seat's 19, with AGREE's final base re-dealing five forest metropolises in and one out; the same rule, keys in the draft).

## The legitimacy chain, conditions (a) to (g)

- **(a)** The field diff, base → tip:
  - Golden 507 of 525 (145 paths).
  - The 660: 594 (232 paths).
  - The fence: 346 of 360 (198 paths).
  - Every path is in a declared family.
- **(b)** Declared with counts in the draft:
  - Legitimacy score: golden 63, the 660 115.
  - Defence term: 63 / 129.
  - Multipliers: 11 / 29.
  - Labels and flags, with their directions.
  - Governance fractured: 0 / 4, each where readiness fell.
  - Faction power: 11 / 29.
  - Roster changed: 0 / 9.
  - Relationships: 11 / 16.
  - The people: goals 85 cards in 11 births / 572 cards in 19 births, every one where a power moved; memberships 0 / 182 cards in exactly the 9 roster-changed births; allegiance as above.
  - Relationship prose: 11 / 20.
  - Condition severity: 46 / 42.
  - Stores held: 0 / 4.
- **(c) The sign:** 0 exceptions (63 golden moves, 115 on the 660).
- **(d)**
  - Who governs: **0**.
  - A danger flag where readiness did not fall: **0**.
  - The largest flag move: isTolerated **16** (line 33).
  - Stability: **0**.
  - **Capture: 5 on the 660, 0 golden.**
    - agree-city-82, agree-city-87 and agree-metropolis-27 move away from danger.
    - agree-force-wartime-metropolis-7 moves toward danger where readiness fell.
    - **agree-city-38 moves toward danger where readiness rose: RULED (above), 1 of the restated 3.**
- **(e) NO PERSON RE-DEALT:** by person id on all three corpora, 0 people added, removed or renamed and 0 personality changes.
- **(f) The receipt:** evidence moves in 4 births of the 660 (agree-city-38, -40, -43, agree-force-wartime-city-4); **0 status changes**.
- **(g)** String roots: one line each in the draft.

**Read by other lanes:**
- `castPowers.js` reads the criminal power's points (moved in 14 of the 660, 11 golden) and the roster (9 of the 660, 0 golden).
- `representatives.js` reads `factions[0]` (by name: 4 of the 660, 0 golden) and the prosperity label (0).

## The page count (the census counter; `docs/chair/2026-11-13/probes/UPKEEP-4/census/`)

`census.sh` was run at faa20bc6c and at 6f95af557 (720 dossiers each), then `compare.mjs`. **No new row.** Three rows rise. **Each is EXPOSURE:**
- the row is old;
- the class table names a later cure for it (row 4: `factionStanding.js`; row 9: `defenseStateProse.js :: beastsRowPoolKey`; NEW-1: `governanceNarrative.js :: deriveBaselineStability`, "after the powers and upkeep lanes merge");
- every entering town is one whose fact this lane changed.

| Row | Base → tip | Entering towns, and the fact the lane moved |
|---|---|---|
| 4 "almost level" vs leader far ahead | 106 → 108 | r2r-town-36 (powers 47/31/22 → 51/26/23), r2r-metropolis-53 (31/18/17 → 33/17/16), r2s-religious_conversion-city-2 (24/18/12 → 28/16/12). r2r-city-26 leaves. |
| 9 Critical over reassuring text | 148 → 149 | r2s-famine-city-0 (monster 43 → 38; readiness Defensible → Lightly Defended) |
| NEW-1 governance vs Defense | 11 → 12 | r2r-village-8 (readiness Defensible → Lightly Defended, 40 → 34) |

Every other row is equal or lower: row 2 571 → 540; row 15 720 → 717.

## The six golden surfaces (each by measure; no door run)

| Surface | Base → tip |
|---|---|
| Generator golden master | 507 of 525 rows move |
| Espionage fence | 346 of 360 move; driven hash 366d5c20 → 7b5e14b0 (banked 38a52b05) |
| Dossier prose manifest | the DRIFT arm 990 → 1024 rows; four-seed total cells 73491 → 73201; mixed-pool 177 = 177 |
| Herald desk | contentSha 02d3fa8e → 919f46cb (banked 0fa1f3ca) |
| PDF golden | `defense.scoreAvg` 41 → 42 (banked 43) |
| Preset-lighting witness | UNMOVED: green at both |

## The repetition guard

`node scripts/census/pool-dominance.mjs` (read-only), 908 pools:
- 0 over;
- 0 unregistered;
- **1 stale** (`NPC_STRUCTURE.magic__contested__dominant`, parked above);
- **1 loose** (`SAFETY_LINE_SIBLINGS` 0.8919 over its measure 0.7281: the merge seat lowers it at the merge point, as ruled).

No `--tighten` was run.

## Rows named for the merge seat

- **P2** `famineStoresOneRounding` (2). Cause: ruling 6. The third seat's values: 6 → 4 months, 12 → 9.
- **P3** `captureBirthScale`. The floor is re-measured on the merged tree; a reading under 360 there is a STOP.
- **P4** `mundaneRealmAcceptance`: services 121/124 → 116/119, ruling 4.
- **The goldens** (above).
- **`generationForkCensus`** A1, A3e, A4: red at the base with identical disagreements (AGREE's).
- **`poolDominance`**: the loose row and the stale row.

## The whole suite

Run once at c950cc823 (the lane before the bundles), 03:20–04:43 UTC, with `npx vitest run --maxWorkers=2 --reporter=json`. Results: 39,032 tests; 38,710 passed, 70 failed, 252 skipped. That makes **75 failing rows**: the 70 failed tests plus 5 files that fail at load (the news pair, proseFamilyContract, observedShapeReaders and writerReach). The class of every row is in `docs/chair/2026-11-13/probes/UPKEEP-4/FAILSET.txt`. The 11 files whose reds are new since the third seat's set were re-run at the base faa20bc6c with the same command.

| Class | Rows | What |
|---|---|---|
| A. Bundles stale against `src/` | 11 | engineBundleReplay ×4, engineServiceCore, engineServiceStoreParity ×3, aiGroundingBundle freshness, edgeSharedBundleReproducibility ×2. Cured by the last commit (below). |
| B. Red at the base faa20bc6c, re-run there | 20 | See the list below. Every message is identical at base and tip, except two figures the lane moves: the DRIFT arm (990 → 1024 rows) and editCorpusRatchet A8 (the witnessed sets [20, 32] → [22, 36], pinned at [20, 36]). |
| C. The lane's, green at the base | 2 | poolDominance's stale row and loose row (see the repetition guard). The removal door for both is `--tighten`, which is the chair's door, so neither was run. Named for the merge seat. |
| D. In the third seat's tip set, classed there | 42 | See the list below. |
| Unclassed | **0** | |

**Class B, the 20 rows:**
- mergeLadderHeldKeys A2, A3, A5, A6;
- recordMerge A6;
- foodModelSingleWriter;
- generationCertificationCorpus;
- generationForkCensus A1, A3e, A4;
- newsHeadlineContract, newsVoiceContract and proseFamilyContract, all three failing at load: AGREE's "line's known set", and proseFamilyContract's load failure is the osr-tier-14 seed;
- dossierProseManifest ×3;
- editCorpusRatchet A4, A6, A7, A8.

**Class D, the 42 rows:**
- the goldens: gm, fence, herald, PDF;
- P2 famineStoresOneRounding ×2, P3 captureBirthScale, P4 mundaneRealmAcceptance;
- P5 dossierStateProseProjection ×2;
- the phone floors ×2;
- pipelinePinnedChoosers A6 and townCartographyCalibration W8: the merge seat's;
- the pin-seam and golden-isolation rows;
- osr-tier-14: observedShapeReaders and writerReach;
- the taste towns ×6;
- siteCoherence C1;
- institutionTable;
- landingFixtureFreshness ×2;
- the other rows red at both in the third seat's set.

**Gone since the third seat (14):**
- P1, cured in fbdae5389: defenseEconomicGate ×8 and defenseWordsFindings;
- presumedThings ARM 1;
- sovereigntyLightingContract, cured in 6f95af557;
- proseComposed A13, proseWaveGate (d) "differ in exactly one way" and statecraftExposureBand: green after the AGREE merge.

## Left

- The edge bundles, the last commit, alone (`npm run build:edge-shared`).

---


# COHERENCE-UPKEEP: the hand-back (the third seat, COHERENCE-UPKEEP-3, 2026-11-12)

**The lane:** `lane/coherence-upkeep-2026-11-12`, base `65ce74ce6`. The tip is the commit that adds this text; read it back from the remote. **An independent reviewer reads the whole lane next.** The first two seats' record is kept below this section, unchanged.

**Base for every measure below:** AGREE's reviewed tip `8866a0ddd` merged with the integration line `3575cf061`, WITHOUT the lane: a scratch tree whose `src/` differs from the tip on exactly the lane's files. **Corpora:** the 660 (the 360 `agree-<tier>-<i>`, 60 thorps, 60 hamlets, 180 forced births of famine, war and siege) and the golden master's 525. The field diff is `UPKEEP-FIELD-DIFF.json`; the draft record is `docs/chair/2026-11-11/UPKEEP-shift-record.DRAFT.json`.

## Calls taken without the chair (the chair's standing rule of 2026-11-12, class (a))

1. **The record after the bundles.** The edge bundles were re-emitted once, alone (828348ba8). The commits after it touch only tests and docs, so the bundles' bytes stay true of the tip (they read `src/` alone).
2. **Two habitat walkers cured in the lane's own pins** (042227874): anchored negatives, and no bare seed loop. The pins assert what they did.
3. **Two typed register rows** (61c8d452e): `keepOf` in the held-key census's DISCOVERY_EXEMPT, and `keep.js` in the prosperity-ladder EXEMPT table. Each carries its reason, and no pin moved.
4. **The observed-shape walker** is classed as equal-failing: it cannot build its corpus at the base either.

## Parked (class (b): each would change a pin, a ruled design's fixture or a declaration rule; sent together with the hand-back)

| # | Item | Recommendation |
|---|---|---|
| P1 | `defenseEconomicGate.test.js` (8) and `defenseWordsFindings.test.js` "a palisade never pays…": fixtures that drive the economy's OUTPUT. The gates read the label now (ruling 3, B; identity at Comfortable and above), so their gates no longer bite (`fundingNote` null; scores equal). | Re-key each fixture by identity to the label (Struggling against Prosperous over the same buildings). Each pin keeps its claim; a seat of this lane does it red-first. |
| P2 | `famineStoresOneRounding.test.js` (2): the soak1k famine granaries read 4 months (6 at base), and the control 9 (12). The cause is ruling 6 (stores at the label's share). | Re-key to the kept months with the cause; the "one rounding" claim is untouched. |
| P3 | `captureBirthScale.test.js`: criminal cities at equilibrium or worse read 369, below the floor 372. The legitimacy chain is declared; the move is away from danger. | Re-measure the floor at the merged tree (a floor is a composed-tree fact, as the ceiling ruling says), by the merge seat. |
| P4 | `mundaneRealmAcceptance.test.js`: the recorded twin census, services 121/124 -> 116/119 (ruling 4). | Re-record the header line and the MG-4 block with the cause. |
| P5 | `dossierStateProseProjection.contract.test.js` (2): `src/data/dossierRelations.generated.js` is stale, and the relations count is 165 -> 169 (the gates' new inputs, 07ebe8bdc: `fundedGate` and `upkeep` replace `econOutput`). | Run its door (`npm run gen:dossier-prose`: 169 pairs, 0 joining rows, measured) and restate the count 165 -> 169 at its four places in the contract test, in one commit. |
| P6 | `presumedThings.walker.test.js` ARM 1 (AGREE's walker, new to the lane at the merge): four lines name the garrison or the hired company without declaring it (the garrison purse line, its twin, its crisis line, and the mercenary lead). | Declaring `garrison` / `mercenary` on an original makes its twin exclude a thing the twin still names, against CENSUS-5b's complement rule. Either the complement rule admits atoms an original and its twin share, or the four take declared rows. This is the chair's rule to make. |

## What this seat did, in commit order

| Commit | What |
|---|---|
| 64c370246 | Merge AGREE's reviewed tip 8866a0ddd: holderTable takes AGREE's symbol cites; economicState composes both sides; the mutation manifest keeps both sides' rows; the wiring census re-taken by its writer. |
| b4e38c922 | Merge the line 3575cf061 (points 44, 45, the hook's lane rule): generated sides only; the edge bundles stay at the line's side until the last commit. |
| 370d18804 | The lighting census refrozen through its door. |
| afadc389e | The tuning inventory refrozen through its door (KEEP_TUNING, Struggling funded 0.3). |
| 02eac6c96 / b4cba2ece | Item 2, red first then cured: under famine or siege the hired purse lines give way to crisis lines ("... paid from what the hunger leaves"), declared on `crisis: famine, under_siege`, each twin the purse line. |
| 944d2d28f / a486e24ec | CENSUS-5b's sibling-set check: a band atom is lawful where a rung of its own ladder admits it (red on the lane since 11662262e, named by no seat until now); the chair's planted controls, a mutant reds both. |
| be4eb0b44 | Two holder-table rows re-cited by symbol (`defenseGenerator.js :: computeDefenseScores`); red since the lane's defence commits. |
| aa5a30899 / a0e404d95 | The fork census re-keyed by identity: A5's second repeated seed `food.cropFortune` [fork,fork] and A6 17 -> 18 (the stores' second call: foodways); A6 18 -> 42 (the services' keep roll, 24 calls on the probe row). |
| 0aec19e77 / 636de2017 | The draft shift record and the field diff; the people family closed on the chair's ruling (A) on (e). |

The pushes ran the hook's three gates (the wrappers are installed in the scratch worktree). **L1 at every `src/` commit:** domain-strict 1113 = ceiling, typecheck ratchet 167 = ceiling (AGREE's inherited errors are gone after the merge), eslint clean on the touched files.

## The measures (the 660 unless named)

- **Readiness, the one-band law:** 0 places more than one band from base, on the 660 and the golden. By stress and distance: {"360|random|-1": 22, "360|random|+1": 56, "forced|famine|-1": 15, "forced|under_siege|-1": 6, "forced|under_siege|+1": 2, "forced|wartime|-1": 6, "forced|wartime|+1": 5, "small|random|-1": 7, "small|random|+1": 2}.
- **The 360:** 78 labels move (56 up, 22 down). Well-Defended+Fortress 36.7% -> 41.9% (+5.3). **Entries** into the top two bands: 23 at the old tip 8a5899204, 23 at the tip (the chair's line: 25). **Exits** 6 and 4. The share past five points is two of the lane's own falls that vanished under AGREE's cures: agree-town-29 and agree-city-26, each Well-Defended at base, Defensible at the old tip, Well-Defended at the tip. Ruled: declared, not a stop.
- **Prosperity, food band, safety label:** 0 moves on both corpora.
- **Services:** rows added 0; institutions newly empty 0 (of a roster of 23560); rows removed 978 in 311 births.
- **Healing by band:** Struggling 1026 -> 918 (-10.5%); Poor 471 -> 431 (-8.5%); Moderate 466 -> 435 (-6.7%); Comfortable 751 -> 734 (-2.3%); Prosperous 706 -> 706 (+0.0%); Wealthy 270 -> 270 (+0.0%).
- **Criminal rows by band (none rises):** Struggling 370 -> 367; Poor 159 -> 156; Moderate 201 -> 199; Comfortable 455 -> 454; Prosperous 299 -> 299; Wealthy 97 -> 97.
- **Magic:** 328 bands, each one step down, all Struggling or Poor: Poor|broad->common 27; Poor|common->moderate 7; Poor|limited->rare 25; Poor|moderate->limited 47; Poor|pervasive->broad 6; Struggling|broad->common 49; Struggling|common->moderate 17; Struggling|limited->rare 46; Struggling|moderate->limited 81; Struggling|pervasive->broad 23.
- **Stores:** months fall in 478 births, rise in 0. Storage-note crossings 57, toward more 0: by direction {"strategic->buffer": 19, "buffer->seasonal": 3, "seasonal->minimal": 35}; by cohort and stress {"forced|famine": 9, "small|random": 3, "forced|under_siege": 19, "forced|wartime": 5, "360|random": 21}; by tier {"town": 7, "village": 26, "metropolis": 1, "hamlet": 4, "thorp": 1, "city": 18}. Golden: 60 crossings, 0 toward more. The forced famine births are listed whole in the measure file; every one keeps its food band.
- **The hired counterfactual:** 9 hired-only places, every one at or under its watch: agree-village-28 (Struggling) 13 vs watch 15; agree-village-30 (Comfortable) 30 vs watch 30; agree-village-40 (Poor) 23 vs watch 28; agree-village-43 (Poor) 51 vs watch 51; agree-village-45 (Poor) 76 vs watch 76; agree-hamlet-5 (Poor) 29 vs watch 32; agree-hamlet-8 (Moderate) 28 vs watch 29; agree-hamlet-38 (Moderate) 34 vs watch 34; agree-force-wartime-village-7 (Struggling) 23 vs watch 26.
- **The page:** under famine or siege 31 births print a crisis line and 0 a purse line. The 19 golden births capped by their food record alone keep the purse line (the chair: their standing, not a crisis); keys in the draft.

## The legitimacy chain (the chair's conditions (a) to (g))

- **(a)** The field diff re-taken at the 0.3 ladder: golden 496 of 525 move (166 paths); the 660, 594 (266 paths); every path in a declared family (0 undeclared).
- **(b)** Declared in the draft with counts on both corpora: legitimacy score 70 / 108, defence term 70 / 119, multipliers 19 / 28, flags, governance fractured 0 / 5, faction power 19 / 28, roster 0 / 6, relationships 19 / 27, the people, relationship prose 19 / 19, condition severity 42 / 42, stores held 0 / 4.
- **(c) The sign:** 0 exceptions.
- **(d) Stops:** who governs 0; a danger flag where readiness did not fall 0; a flag in more than 33 of the 660: none (largest 16); stability 0; capture 3, two away from danger with readiness rising, one toward danger with readiness falling.
- **(e) People:** the chair's ruling (A), restated. **The lane re-deals no person:** 0 people added, removed or renamed, and 0 personality changes, in 1,185 births. Goals, ties and memberships follow power by design, in the births where power moved and no other. **The stop that stands:** a person added, removed, renamed or given another personality, or a change of who governs, anywhere.
- **(f) The receipt:** text moves in 3 births; 0 status changes.
- **(g) String roots:** one line each in the draft.

**Read by other lanes:**
- `castPowers.js` reads the criminal power's points (moved in 12 of the 660, 19 golden) and the power roster (6 of the 660).
- `representatives.js` reads `factions[0]` (moved in 4 of the 660, 0 golden) and the prosperity label (0 moves).

## The six golden surfaces (each by measure; the draft has the rows)

| Surface | Verdict | Rows moved |
|---|---|---|
| Generator golden master | MOVED | 496 of 525 |
| Espionage fence | MOVED | 346 of 360 |
| Dossier prose manifest | MOVED | 684 of 1,050 |
| Herald desk | MOVED | 444 -> 447 items (52 added, 49 removed, 80 changed) |
| PDF golden | MOVED | `defense.scoreAvg` 40 -> 41 |
| Preset-lighting witness | UNMOVED | green at base and tip |

The five red suites are red at the base too (AGREE's unsigned rows), and each reads differently at the tip.

## Found, not mine

- **goals.js: the two vantages share one stream.** On a card's own fork (`people-goals::<card id>`), a draw the short vantage skips or adds re-deals the long vantage for no reason of its own: 87 long goals in 15 births moved only so (example: agree-town-143, npc_cooper, 7 -> 6 draws on its fork). A sub-fork per vantage would cure it and would re-deal every card's long goal once: its own measured cause in another lane's file. The same question stands for the ties' forks (158 cards draw a different count where power moved). The chair: the next wave's charter takes it.
- **The observed-shape walker** (`tests/lint/observedShapeReaders.walker.test.js`) cannot build its corpus at the base or at the tip ("the tier-coverage seed osr-tier-14 minted no tier candidate in 12 intervals"): equal-failing, not the lane's. The first seat's note on the pulse's 62 vs 74 events cannot be re-read until it builds.
- **The repetition guard:** `ledger:safetyProfile:SAFETY_LINE_SIBLINGS`, ceiling 0.8919. The measure falls 0.880 -> 0.7258 (banked corpus) and 0.871 -> 0.7264 (confirm corpus); the pool grows from 14 to 21 sets (28 to 42 lines) by 11662262e and b4cba2ece. Ruled by the chair: no `--tighten` on the lane; the merge seat lowers that one row at the merge point.

## The equal-failing set and the whole suite

**The whole suite at the final code tip 828348ba8** (`npx vitest run --maxWorkers=2`, JSON reporter, ledger ref fetched, a detached scratch worktree): 3,218 files, 38,985 tests, **70 failed**, 38,661 passed, 254 skipped; 72 failing titles counting the two file-level errors. **The base** (the seven directories, the same way): 25,096 tests, 42 failed (44 titles). The full list, classed, is `UPKEEP-FAILSET-828348ba8.txt` beside this file.

**THE LAST STATEMENT, the whole suite ONCE at the final code-and-test tip 5b647aa9c** (`--maxWorkers=3`, JSON reporter): 38,985 tests, **64 failed**, 38,667 passed, 254 skipped; 66 failing titles (60 in the seven directories). That is exactly the set below, less the six titles cured in 042227874 and 61c8d452e; nothing new. The list is `UPKEEP-FAILSET-FINAL.txt`. Every remaining red is either the line's known set or AGREE's (the 44 red at base too), the merge seat's (named), or parked P1-P6.

- **Red at base and at the tip (44 titles, the seven directories): the line's known set and AGREE's unsigned golden rows.** Not this lane's. Among them: the five golden surfaces, the pinned-choosers / pinned-mode / held-roster null-change arms that read the golden corpus, the observed-shape and writer-reach walkers (their corpus cannot build), editCorpusRatchet, landingFixtureFreshness, the taste-interested fixtures.
- **Red at base, green at the tip:** none.
- **Red at the tip, green at base (22 in the seven directories, 5 outside): the lane's.** Each is classed below.

| Red | Class |
|---|---|
| `negativeAssertionAnchor` (2): upkeepHired.test.js lines 271, 286 | MINE, cured in 042227874 |
| `seedLoopTotality` (2): upkeepHired.test.js line 66 (bab22ea8a) | MINE, cured in 042227874 |
| `presumedThings` ARM 1: four page-line literals name "garrison" / the mercenary lead without declaring it | PARKED P6 |
| `heldKeyWriterCensus` A3: `keepOf` newly called in the assembly step | MINE, cured in 61c8d452e |
| `prosperityRank` "no private prosperity ladder": keep.js | MINE, cured in 61c8d452e |
| `dossierStateProseProjection` (2): dossierRelations.generated.js stale; relations 165 -> 169 (the gates' new inputs, 07ebe8bdc) | PARKED P5 |
| `defenseEconomicGate` (8) and `defenseWordsFindings` (1): pins on the gates keyed on the economy's OUTPUT; the gates read the label now (ruling 3, B), so the fixtures' gates no longer bite (`fundingNote` null) | PARKED P1 |
| `famineStoresOneRounding` (2): soak1k famine granaries 6 -> 4 months, 12 -> 9 (ruling 6) | PARKED P2 |
| `captureBirthScale`: criminal cities at equilibrium+ 369 below the floor 372 (the legitimacy chain, declared) | PARKED P3 |
| `mundaneRealmAcceptance`: the recorded twin census, services 121/124 -> 116/119 (ruling 4) | PARKED P4 |
| `pipelinePinnedChoosers` A6 (37 -> 40), `townCartographyCalibration` W2, W8 | THE MERGE SEAT'S: they re-measure generated output against frozen records |
| `dossierPhoneFloorAllViews` (2) | THE MERGE SEAT'S: the named class 1 (per-view counts), the page lines and services move what the views print |
| `poolDominance` "no ceiling sits loose" | Its own class (the chair's ruling): lowered at the merge point |

## Left

- Merge AGREE's final tip when the chair names it, then re-take the measures and the field diff.
- The edge bundles, last and alone (`npm run build:edge-shared`).

---

# The first two seats' record (kept as written)

# COHERENCE-UPKEEP: the hand-back (item 4, built)

Lane `lane/coherence-upkeep-2026-11-12`, cut from AGREE's final tip `65ce74ce6`. Built by COHERENCE-AGREE-2 to the chair's ruling of 2026-11-12 on item 4, and the chair's ruling (A) on the services STOP. The proposal it builds is `docs/chair/2026-11-11/UPKEEP-PROPOSAL.md` (on the AGREE lane).

**AN INDEPENDENT REVIEWER READS THE WHOLE LANE NEXT**, from base `65ce74ce6` to the tip, before the merge seat takes it.

## The owner's words, and the one home

> "prosperity should also scale the rest including healing, magic, etc. everything is based on what can be stockpiled, refilled, rebuilt, etc."

**The home is the prosperity label.** `src/domain/facts/keep.js` holds it:
- `KEEP_TUNING`: one table keyed by label, with two named columns. `bought` is the share of what is bought outright. `funded` is the funding of wages and works.
- `KEEP_SCALE_TUNING`: the floors for the bought families (services 0.7, stores 0.7) and magic's line (`magicBelow` 0.6).
- One reader, `keepOf(prosperity)`, plus `fundedGate` and `boughtShare`.
- The `keep` getter in `factsOf`, beside the prosperity fact.

Both tables are registered DRAFT in `tests/lint/.tuning-register.json`; the values are the owner's to sign. No vocabulary atom was added: the page lines use the existing `prosperity` band atom, because `keep.bought ≥ 0.6` is exactly `prosperity: ≥ moderate`.

**Nothing feeds back.** Prosperity reads no score, availability or months, and is written before every reader of the home. **Prosperity moves in 0 of the 360 births at every commit.**

## The corpus

The 360 births on seeds `agree-<tier>-<i>` (60 villages, 160 towns, 100 cities, 40 metropolises), every browser dial random, `grounded`: the AGREE lane's corpus. Every before and after below is on these seeds.

## The guard (d7d7f7787, red first)

1. **The home**, as above.
2. **The upkeep-reader walker**: `tests/lint/upkeepReaders.walker.test.js` with `upkeepReaders.register.json`.
   - **What it counts:** every read of the economy's OUTPUT used to gate upkeep. In the upkeep writers it counts every read. Elsewhere it counts a gate's shape, over the whole statement.
   - **The register:** shrink-only, and two-way (every live read is a row, every row is a live read). It also checks that `KEEP_TUNING` is named only in its home.
   - **Size:** 10 rows at the base, 4 at the tip. Six gate rows retired in 07ebe8bdc. The commercial demand roll's row is HELD under ruling (A), its reason saying exactly what it reads. The other three rows are the defence economic score's capacity term (`economic += econOutput × 0.2`), which is not an upkeep gate, and the two hand-offs that carry the output to it.
3. **The counterfactual** (`tests/generators/upkeepHired.test.js`), pinned on the pure score: **for every place with hired force and no standing force, its military score is not above the same place's score with a watch in the hired force's stead.** It was red at the base on all 5 hired-only corpus villages; for agree-village-45 the score was 97 against a watch's 93. The same file pins each family red first, as its own describe.

## The families: commit, before → after on the 360

| Family | Pin (red) | Cure | Before → after |
|---|---|---|---|
| Hired force (ruling 2) | d7d7f7787 | 0b5dc10b5 | The company, the charter hall and the contract chain are worth `keep.bought`, added after the wage gate. A hired-only place takes the slider term at its share, and its military is capped at a watch in its stead. **10 readiness labels move (6 up, 4 down).** 0 of 158 places without a hired force move. agree-village-45 goes 97 → 91 (its watch is 93) and Defensible → Lightly Defended; agree-village-40 37 → 26; agree-city-17 (Wealthy) is unchanged. |
| The five gates (ruling 3, B) | e55b52675 | 07ebe8bdc | `fundedGate(floor, keep)`: floors kept, identity at Comfortable and above. **86 labels move in this family (53 up, 33 down).** |
| Services (ruling 4, (A)) | 948c274af | c19e96e23 | See below. |
| Magic (ruling 5) | 4895854ad | e2ebb6447 | **99 availability bands, every one a single step down, all in Struggling (42 places) or Poor (57) places**: moderate→limited 32, broad→common 24, limited→rare 22, pervasive→broad 12, common→moderate 9. The world's magic level is never pervasive in these; a pervasive world is pinned unmoved. The profile is derived for display, so no draw moves. |
| Stores (ruling 6) | d1be3be10 | 05ec9b601 | See below. |
| The page (ruling 7) | acb2fd22d | 11662262e | See below. |

The scale table (`KEEP_SCALE_TUNING`, `boughtShare`) landed alone, with no reader, in 357f15758, and magic's line joined it in e2ebb6447.

### Readiness: the STOP, measured lane-wide

From `65ce74ce6` to the tip, **93 readiness labels move (54 up, 39 down)**. By direction:

| Before → after | Count |
|---|---|
| Defensible → Well-Defended | 22 |
| Well-Defended → Fortress | 17 |
| Defensible → Lightly Defended | 12 |
| Lightly Defended → Vulnerable | 12 |
| Lightly Defended → Defensible | 8 |
| Vulnerable → Undefended | 7 |
| Well-Defended → Defensible | 7 |
| Vulnerable → Lightly Defended | 5 |
| Undefended → Vulnerable | 1 |
| Defensible → Vulnerable | 1 |
| Defensible → Fortress | 1 |

By prosperity: Comfortable 25, Moderate 18, Poor 18, Struggling 16, Prosperous 16, Wealthy 0.

**Well-Defended plus Fortress went 36.7% → 41.1%, +4.4 points of the corpus**, inside the STOP at 5. It peaked at +4.7 after the gates; the stores then lowered it 0.3. 93 labels is inside the STOP at 120.

Safety and food labels move 0, and prosperity 0, at every commit.

### Services (ruling (A) on the STOP)

**The STOP, and how it was resolved.** As first built, the services step's seeded stream moved and 44 standing institutions were emptied, so I stopped. The chair ruled (A).

**How it is built under (A).** The commercial demand roll still reads the output, for its threshold and for whether it draws, exactly as before this lane. What a place can keep up is applied after that roll: healing, lodging, food, equipment, transport and the commercial services keep `boughtShare('services', keep)` of their rows. That decision is a draw-free roll keyed on the seed, the institution and the service, and a standing institution keeps at least one row.

The chair's five conditions, measured on the 360 (base = the tip before services, tip = with them):
1. **The walker row** says that the roll reads the output for both its threshold and whether it draws, and why it is held.
2. **Rows added: 0.** Rows removed: 439, in 175 settlements. Institutions with no rows: **565 at the base, the same 565 at the tip, so 0 newly empty**, out of a roster of 15,976. Pinned (`services are kept as far as the place can pay`: the Struggling read's rows are a subset of the full read's).
3. **Healing** by band: Struggling 183 → 161 (−12.0%), Poor 287 → 257 (−10.5%), Moderate 298 → 279 (−6.4%), Comfortable 617 → 600 (−2.8%), Prosperous and Wealthy 0. All inside the STOP at 25%.
4. **Criminal rows** by band, base → tip: Struggling 56 → 56, Poor 94 → 92, Moderate 130 → 130, Comfortable 417 → 416, Prosperous 297 → 297, Wealthy 97 → 97. None rises.
5. **The debt** (a proposal for after the release; not built and not measured). A single read would take the commercial roll's threshold from the home while holding its draw pattern. The roll would still draw where `output/50 < 1`, but compare against a home value, so that no draw moves. That needs one owner value: the home's equivalent of today's 0–2 demand scale for a commercial service. It would move rows only in the towns where the label and the output disagree: the 97 listed in `UPKEEP-ECONOMICS-PAGE-97.md`, and only for their commercial services with a roll probability below 1. Until then, the commercial roll and the home's share both apply, in that order.

### Stores (ruling 6)

**How it is built.** The full granary keeps `boughtShare('stores', keep)` of its months, at the stores' writer, on a second call after prosperity. The writer's one draw is a pure label-keyed fork, so the second call draws the same crop fortune. The first call, the one prosperity reads, lays by in full, and prosperity reads no months. The months, the food record's months, the storage note and the resilience all follow the kept months.

**What moved:**
- **Months** fall in 225 places: Comfortable 74, Poor 57, Moderate 54, Struggling 40.
- **Food bands: 0 moves. Prosperity labels: 0 moves.** The STOP holds.
- **Storage notes crossing a threshold: 22.** Seasonal buffer → minimal storage 14; strategic reserve → buffer 7; buffer → seasonal buffer 1.
- **Defence:** the economic score falls in 202 places and the disaster score in 183. 6 readiness labels fall one step: agree-village-50, agree-town-41, -65, -73, -76, agree-city-52.

**The famine towns, line by line** (all Struggling; the food band holds in each):

| Town | Months | Storage note |
|---|---|---|
| agree-village-8 | 0.1 → 0.1 | minimal, unchanged |
| agree-village-39 | 1 → 1 | minimal, unchanged |
| agree-town-66 | 3.1 → 1.9 | seasonal buffer → minimal storage |
| agree-town-99 | 4 → 2.8 | "4 months buffer" → seasonal buffer |
| agree-city-58 | 7 → 5.4 | buffer → buffer |
| agree-metropolis-5 | 11.8 → 9.1 | strategic reserve → strategic reserve |

### The page (ruling 7)

There are four lines, declared in `SAFETY_LINE_SIBLINGS` by the `prosperity` atom, each with today's line as its twin, all in the field that exists (`guardEffectivenessDesc`). The safety profile is written before prosperity, because prosperity reads its black-market figure, so the lines resolve after prosperity, draw-free (`safetyProfile.js :: keptGuardLine`).

| Line | Needs | Where it prints | On the 360 |
|---|---|---|---|
| "There is no standing guard; a hired company is paid to keep the peace, and gives what it is paid for." | `prosperity: ≥ moderate` | A hired company and no standing guard | 0 (no corpus town has one); pinned on a planted roster |
| "A hired company is on the books, but the coin to keep it runs short; it comes when called and leaves when the coin does." | `prosperity: ≤ poor` | The same | 0; pinned |
| "Hired swords back the garrison when the purse allows." | `prosperity: ≤ comfortable` | A hired company beside a garrison | 36 (Struggling 1, Poor 6, Moderate 10, Comfortable 19); its twin "Hired swords back the garrison." 48 (Prosperous 39, Wealthy 9) |
| "The adventurers' charter hall takes bounty work against threats, as far as the purse runs." | `prosperity: ≤ comfortable` | A charter hall with no garrison and no watch | 4 (Poor 3, Comfortable 1) |

The proposal put the charter line "beside the monster row (`deriveSupportingCapabilities`)". **That function has no monster row**, so the line went into the charter hall's own guard sentence, which is the monster sentence that exists.

**The 97 towns where label and output disagree.** What the Economics page prints in each is in `docs/chair/2026-11-12/UPKEEP-ECONOMICS-PAGE-97.md`. Every sentence follows the label (DS-ECO-1 and the rung are keyed on the prosperity rank), so **no sentence is a class member, and none was cured**. What disagrees is the header chip "Output N/100", which is a number and not a sentence:
- 43 Comfortable or Prosperous towns print it red.
- 7 Poor or Struggling towns print it green.

That chip is the owner's UI ruling (T2-1), so it is reported and was not changed.

## Found, and not this lane's

- **agree-village-45's 97 is not the hired slider term.** Measured by the counterfactual: its palisade is a work, and a work already earns the full slider term, so a watch in the charter hall's stead scores 93. The gap was the charter hall's +10 against a watch's +7. Under the rule, the cap at the watch holds it at 91. The slider term for a hired-only place with no works (`0.06 + 0.29 × bought` against a standing force's 0.35) is built, but no corpus place takes it.
- **The Output chip** (above).

## EQUAL-FAILING-SET

See the section appended below.

## What was banked

- **Registers:** two DRAFT tuning rows (`KEEP_TUNING`, `KEEP_SCALE_TUNING`), and the upkeep-reader register (10 rows at its first commit, 4 at the tip, one of them held by ruling (A)).
- **Re-takes:** the tuning inventory and the wiring census, each re-taken by its own writer (named below).
- **Nothing else:** no test was skipped and no pin was loosened.

## L2, the wider corpus (the chair's review laws of 2026-11-12): a STOP, sent and held

The wider corpus is the 360, plus 60 thorps and 60 hamlets (`agree-thorp-i`, `agree-hamlet-i`), plus 180 forced births (`agree-force-<famine|wartime|under_siege>-<tier>-<i>`, six tiers × 10). The base is `65ce74ce6` and the tip is this lane, both measured as archives.

**Readiness, against the STOP at 5 points of the corpus:**
- The 360: +4.4 (36.7% → 41.1%), 93 labels.
- Thorps and hamlets: 12 labels, the share unchanged.
- **Forced: 53 of 180 labels move (48 down), and Well-Defended+Fortress goes 16.7% → 8.9% (−7.8, OVER).** By stress: famine 8 → 1, siege 5 → 0, wartime 17 → 15. Of the 53 movers, 44 are Struggling: a famine or siege caps prosperity at Struggling, so `funded` = 0 and every gate stands at its floor.
- All 660: +0.3, 158 labels.

**Stores:** printed storage thresholds crossing: 58 on the 660 (the 360 22, thorps and hamlets 3, forced 33). Food bands 0 and prosperity 0 everywhere, including all 77 famine births.

**Holding on the wider corpus:**
- The hired counterfactual: 9 hired-only places (6 villages, 3 hamlets), every one at or under its watch.
- Services: 0 rows added, 0 institutions newly empty.
- Safety, food and prosperity: 0 moves.

**L1, the type gates:**
- The domain strict check reads exactly the one inherited error (`src/domain/defense/defenseFacts.js`, AGREE's).
- The typecheck ratchet: this lane's one error (`safetyProfile.js`) is cured in b95ba62e0; what remains is AGREE's first seat's (`generationCoherence.js` +3, `resourceGenerator.js` +15).
- Eslint is clean on every file the lane touched.

**STOP sent to the chair with three options for the gates (lift Struggling's `funded`, exempt stress-capped labels, or accept) and the stores choice.** The lane is held until the ruling.

**Still running when this was written:** the base-against-tip field diff over the golden 525 and the 660, and the equal-failing-set suites.
