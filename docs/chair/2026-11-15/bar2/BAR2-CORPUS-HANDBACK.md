# BAR2-CORPUS hand-back (REVIEW-BAR-2's rows of CORPUS-DEF, CORPUS-ECO and DS-ECO-1 C1)

Seat BAR2-CORPUS, 2026-11-15. Base: the joined line `lane/join-2026-11-14` at **f8042b61a** (read back from origin at the start); branch `lane/bar2-corpus-2026-11-15`. One batch (batch 1), one commit. Work in a scratch worktree; nothing merged. **THE MERGE (16:21 UTC, the chair's word): the joined line at dcb069bff merged into this branch as af120bdd4 (no conflict); THE BOOKS (F2) RUN ON THAT MERGED TREE: see "The books at the merged tip" below.**

## The rulings I worked to (the chair's, 2026-11-15; each vetoable by the owner)

- **CP1** every row is a line of a pool printing in a town whose record denies it; cure by a MARK (a read the pool holds) or a TWIN true in that state; never a ceiling raised, never a state left mute.
- **CP2** the prose walkers' books are mine, in the same commit; **amended by the chair's prompt: they wait for the merge word** (the close re-keyed those files today). This commit leaves their figures alone; the table below names what moves.
- **CP3** the rows, each verified on the 720 first (measures below; where the premise was wrong I say so).
- **CP4** every new or reworded line is on the veto list with three towns; the annex and the generated leaves moved together through their door (`npm run gen:dossier-prose`); the wiring census re-derived through its door (`node scripts/wiring-census.mjs`).

## Batch 1: the measure (720 census towns at f8042b61a; "false" = the record denies it)

Instruments: CENSUS-3 `census3.sh` (before: full run; after: `--count-only`), READ-ALL `inventory.py` / `inventory_diff.py`, and my record checks (`verify.py`, `atoms.mjs`: the vocabulary's own `atomHolds` over `factsOf`), kept beside the runs in the seat's scratch directory. The fold rows' own measure is in the inventory diff.

| row | line (pool · vid) | prints / false before | denying fact (the record) | cure | after |
|---|---|---|---|---|---|
| C12533, C23558 | DS-DEF-2 Invasion & War: neither walls nor force v2 "safety rests on nobody wanting it enough to try" | 77 / 38 | `history.historicalEvents` The Siege / The Occupation | REWORDED: "...it is safe for exactly as long as nobody comes." (no past claim; no vocabulary read of a past attack needed, none declared) | gone (77 -> 0) |
| C17168 | DS-DEF-6 Port only v2 "nothing hostile has come through it yet" | 11 / 9 | a past Siege or Occupation | REWORDED: "nothing at the water would stop a hostile ship coming through it" | gone |
| C17087 | DS-DEF-2 full legal chain v3 "a hearing, not a favour" | 83 / 6 | `powerStructure.criminalCaptureState` corrupted / capture | REWORDED: "there is a court to hear it and a cell for whoever it finds against" | gone |
| C8932 | DS-POW-4 Holding v2 "They cannot, and everyone involved knows it." | 87 / 6 | the Military text "a single shift could swap their positions" | REWORDED: "For now they cannot..." | gone |
| C13594 | DS-DEF-2 Economic Survival WEAK v3 "short of money for years" | 74 / 16 | prosperity Moderate or above (the town's purse) | REWORDED to the defence's purse (CP3's reading held) | gone |
| C27208 | DS-DEF-2 court without detention v3 "fines cannot be enforced" | 54 / 7 | safetyLabel Safe / Very Safe | REWORDED: "can fine an offender and cannot hold one, so a fine binds only those who mean to stay" | gone |
| C6914, C27210 + class | DS-DEF-2 STRONG v1, v3, v12; WEAK v1; DS-DEF-11 WALLED-STRAINED v1 (C25170) — the defenders' pay | STRONG v1 78/4, v3 26/1, v12 29/2; WALLED-STRAINED v1 22/1; WEAK v1 15/0 | ONE FACT FOR THE PAY: `economicState.safetyProfile.guardEffectivenessDesc` ("irregular pay" / "underpaid" vs "well paid"); the vocabulary holds no pay atom, so no mark: every pay claim REWORDED out (the lines keep the purse) | all gone |
| C25150 + class | DS-DEF-2 CHAIN: defence short v3, v2 | v3 36/5, v2 27/6 | "well paid, well equipped" | REWORDED to the trades' failure, not the defenders' state (and clear of the presumed-things walker's `armedForce` words) | gone |
| C17097 + class | DS-DEF-3 Moderate v2, v1 | v2 22/11 | `history.currentTensions` crime_wave | REWORDED: v2 "not short, and the next few seasons will decide whether the law or the criminals gain on it"; v1 "neither has the town to itself" | gone |
| C23568 | DS-DEF-3 Moderate v6 "has nobody to keep the peace" | 34 / 9 | "The old families keep the peace" | REWORDED: "pays nobody to keep the peace, and trouble here is settled among its own people" | gone |
| C7002 | DS-DEF-9 magicDependency false v3 | 148 / 0 on the 720; 4 in the bar's towns | premise checked: the reader's town has magic at level low (`magic` true), no practitioner, no reliance | REWORDED to claim no arcane contribution ("would go on as it is...; nothing it lives by waits on a spell") | gone |
| C31855 + class | DS-DEF-12 CAPACITY: enough v1, v2, v3 | v2 5/3, v1 5/3, v3 13/8 | `foodRecord.gapPct` > 0 (the band reads secure or pressured with a gap) | REWORDED: "an ordinary year leaves nothing over" (true with or without a small gap) | gone |
| C8653 | DS-ECO-9 SECURE v3 "is not deep" | 140 / 54 | a granary and six months or more | REWORDED: "would not outlast a run of poor harvests" (the line keeps `stores: < 12`) | gone |
| C4528 | DS-ECO-11 STRATEGIC VALUE v3 "could not keep it" | 125 / 53 | readiness Defensible / Well-Defended / Fortress | REWORDED: "know that is reason enough for someone to come for it" | gone |
| C33095 | DS-ECO-10 POSTURE: established v5 | 82, of which 11 under a famine | the one line of its pool without its siblings' `no crisis: famine` | MARK `no crisis: famine` (the pool's own form); its famine twins v8 / v9 inherit (v9 3 -> 12, v8 7 -> 9). Of the 11, 1 (r2s-famine-hamlet-0) prints "No significant exports": the rest were true, so the mark silences 10 true lines (under twenty) | 82 -> 71 |
| C7740 + class | DS-GEN-13 MARKET-OPEN v2, v1 | v2 80/3, v1 23/1 | wartime: every wartime town of the 720 carries `condition.war_pressure` on trade connectivity | MARK `no crisis: wartime` on both; v3 / v4 speak instead | 80 -> 77, 23 -> 22 |
| C2273 | DS-SUP-3 ONE EXPECTED CATEGORY MISSING v2 | 18 / 3 | a siege | MARK `no crisis: under_siege`; v1 / v3 speak | 18 -> 15 |
| C25594 | DS-GEN-13 craft guilds, no merchant guild v1 | 12 / 5 | a power named Merchant Guilds | REWORDED: "with no merchant guild hall above them" (CP3's form) | gone |
| C14631 | DS-ECO-6 minor shadow v1 | 10 / 3 | a shadow income of 14% or more | REWORDED: "Some of <N>'s trade is done out of sight, and nobody has organised it into anything more." | gone |
| C23226 | DS-ECO-8 MODERATE v3 "supports itself" | 10 / 0 on the 720; 1 bar town (52% imported) | — | REWORDED: "pays its own way" (the line means money: CP3) | gone |
| C23849 (DISPLAY-ECON, DS-ECO-1 C1) | DS-ECO-1 C1 v1–v4: the approach's traffic | v2 50 / 0 on the 720 (every C1 town exports); 1 bar town (bar0-thorp-calm-rand-4: no exports, no imports, Harvest 100%) | REWORDED all four out of the traffic claim (a mark + twin was tried and taken back out: it left the pool mute in two hunger states and raised the projection contract's authoring-bill ceiling 28 -> 30, a law) | gone in the bar town; on the 720 a second after run moved only these lines' words (0 towns fewer or more against the first) |

**THE CHAIR'S PAY FACT (14:15 UTC: `defenseProfile.economicGates.military`), measured on the 720 first:** the gate runs 0.72–1 over the whole corpus; towns whose safety profile prints "irregular pay" / "underpaid" sit at 0.76–1, towns printing "well paid" at 0.88–1; the lines' printing towns: STRONG v1 0.88–1, v12 0.88–1, WALLED-STRAINED v1 0.72–0.88, CHAIN short v3 0.76–1, MODERATE v1 0.88–1. No band of the gate separates the pay the page prints, so a mark by it would leave the same towns contradicted. THE PREMISE DOES NOT HOLD ON THE 720: I followed the record by REWORDING every pay claim out of these pools (no line of mine now claims paid, unpaid or wages), which is true at every value of the gate and needs no new vocabulary word. The safety profile's pay prose against the gate stays BAR2-LABELS's (the chair's message).

**STRUCK (true by the record), one line each:**
- **C27645** (DS-ECO-8 MODERATE v1 "treasury takes in a little more than it pays out"): the stability line's "chronically underfunded" is the embattled region's FORCES (`structuralViolations`: "Fortification and forces are present but chronically underfunded"); the town's purse is Moderate. The record supports the line (58 print, 4 carry the stability word).
- **C23861, C8655** (DS-ECO-9 FOOD SOURCES one source v2, fishing first on depleted grounds): the RECORD names fish first: in 17 of the 68 printing towns `foodRecord.foodSources` is `['fish']` while `resourceAnalysis.resourceConditions` lists the fishing grounds depleted. **NAMED for the food record's seat** (`src/generators/foodGenerator.js` / `foodLand.js`: a lone source that the land record lists depleted), count 17 of 68. The line is left.

**Bar-town check (my 16 bar seeds re-borne at base and tip, `--seeds`):** every row read in its bar town prints at base and is gone at the tip, except the struck and named ones.

**The inventory diff (after vs before, the 720):** sentences 29967 -> 29965; gone 51, new 49, fewer 4, more 6, moved 0. With the C1 rewording (second after run, the tip as committed): 29967 -> 29941; gone 94, new 68, fewer 4, more 6, moved 0; rows GONE 20, fewer 3, unchanged 3. Every gone line's new words inherit exactly its towns; the four FEWER are the four marks above, each by exactly its measure; the six MORE are the marked lines' own siblings (POSTURE v8/v9, MARKET-OPEN v3/v4, SUP-3 v1/v3). The widest twenty inheritors were read where they print: no new false claim found (each is a line of this batch claiming less).

**Declared moves:** none. Text and marks only; the 720 records are **byte-identical** at base and tip (`cmp` of the two `corpus.ndjson.gz`); no generator imports the leaves (display and `pageCensusFindings.js` only), so **0 of the 525 reference configurations move**.

## The veto list (every new or reworded line; three towns: smallest and largest tier, a siege, famine or occupation where it reaches one)

| towns | line (as folded) | read in |
|---|---|---|
| 148 | The <tier> would go on as it is if the arcane went away; nothing it lives by waits on a spell. | r2r-thorp-27, r2s-plague_onset-metropolis-0 |
| 140 | <N> is fed, but what it keeps put by would not outlast a run of poor harvests. | r2s-infiltrated-thorp-3, r2s-infiltrated-city-1, r2r-thorp-27 |
| 125 | The people of <N> know what their ground is worth to others, and know that is reason enough for someone to come for it. | r2s-infiltrated-thorp-3, r2s-monster_pressure-metropolis-3, r2r-thorp-27 |
| 87 | For now they cannot, and everyone involved knows it. | r2r-hamlet-20, r2r-metropolis-33, r2s-occupied-metropolis-3 |
| 83 | Bring a complaint at <N> and there is a court to hear it and a cell for whoever it finds against. | r2s-slave_revolt-town-2, r2s-monster_pressure-metropolis-3, r2s-under_siege-city-0 |
| 78 | <N>'s accounts have money in hand: the <tier> can buy what a bad season needs without going begging. | r2r-town-45, r2s-monster_pressure-metropolis-3 |
| 77 | If anyone came for <N>, nothing about the <tier> would stop them; it is safe for exactly as long as nobody comes. | r2r-thorp-20, r2r-village-34, r2s-famine-thorp-2 |
| 74 | <N>'s defence has been short of money for years, and each lean season leaves less to spend on it when a real crisis comes. | r2s-infiltrated-thorp-3, r2r-town-22, r2s-occupied-hamlet-2 |
| 54 | <N>'s hearings can fine an offender and cannot hold #, so a fine binds only those who mean to stay. | r2r-town-53, r2s-religious_conversion-city-3, r2s-under_siege-town-0 |
| 36 | The workshops that should feed and equip <N>'s defence are failing, and the defence will feel it before long. | r2s-under_siege-town-2, r2r-metropolis-25 |
| 34 | <N> pays nobody to keep the peace, and trouble here is settled among its own people. | r2r-thorp-9, r2r-village-4 |
| 29 | The <tier> went into this trouble with money in hand, and so far the money has held. | r2s-insurgency-town-3, r2s-plague_onset-metropolis-0 |
| 27 | The trades that should supply <N>'s defence are struggling, and its food and gear are the first things at risk. | r2r-town-19, r2s-indebted-metropolis-2, r2r-metropolis-14 |
| 26 | <N> had money laid by before this trouble began, and the trouble is still being paid for from it. | r2s-religious_conversion-town-0, r2s-plague_onset-metropolis-1 |
| 24 | <N> keeps a working balance: the law is present, so is crime, and neither has the <tier> to itself. | r2s-infiltrated-thorp-3, r2r-metropolis-34 |
| 22 | The <tier>'s record of crimes at <N> is not short, and the next few seasons will decide whether the law or the criminals gain on it. | r2r-thorp-7, r2r-metropolis-18 |
| 17 | <N>'s accounts keep its town walls in repair and stretch no further, so the defences stand and too few people man them. | r2s-religious_conversion-town-2, r2s-wartime-town-0 |
| 15 | <N> is always short of money for its defence: there is nothing put by to pay for a long defence, and whoever is called to make # knows it. | r2s-politically_fractured-thorp-2, r2s-famine-town-2, r2s-occupied-thorp-0 |
| 13 | People at <N> make do with what they have; a good year is enough and a bad # is lean. | r2r-thorp-48, r2r-town-9 |
| 12 | A buyer at <N> deals with each craft's own guild, with no merchant guild hall above them. | r2s-occupied-town-2, r2r-metropolis-34 |
| 11 | The port is <N>'s living and its open door, and nothing at the water would stop a hostile ship coming through it. | r2s-mass_migration-town-3, r2r-metropolis-23, r2s-famine-town-2 |
| 10 | Some of <N>'s trade is done out of sight, and nobody has organised it into anything more. | r2s-slave_revolt-thorp-3, r2s-insurgency-town-2, r2r-hamlet-24 |
| 10 | The <tier> pays its own way and has a little in hand. | r2r-hamlet-12, r2r-town-15 |
| 5 | What <N> raises leaves nothing over in an ordinary year, and a bad harvest is felt before spring. | r2r-thorp-23, r2s-occupied-village-0 |
| 5 | No dependable road, river or port reaches <N>, so what the <tier> raises is what it has, and an ordinary year leaves nothing over. | r2s-succession_void-thorp-2, r2r-village-47 |
| 3 | <N>'s accounts keep its citadel in repair and stretch no further, so the defences stand and too few people man them. | r2s-religious_conversion-town-1, r2r-town-9 |
| 2 | <N>'s accounts keep its massive walls and fortifications in repair and stretch no further, so the defences stand and too few people man them. | r2s-indebted-metropolis-3, r2r-metropolis-52 |
| (bar only) | DS-ECO-1 C1 v1 "A {complexity} keeps everyone at {settlement} busy. Nobody here is waiting for work."; v2 "{settlement} lives on a {complexity} and ends each year with money to spare."; v3 "...The town is well off, and the talk is about what to build next."; v4 "{settlement} earns well, but much of what it earns goes to the outside power it owes." | bar0-thorp-calm-rand-4; on the 720 (second after run): C1 v1 31 towns: r2r-thorp-44, r2r-metropolis-57; C1 v2 50 towns: r2r-hamlet-15, r2r-metropolis-19; C1 v3 31 towns: r2r-thorp-33, r2r-metropolis-36; C1 v4 1 towns: r2s-indebted-city-1, r2s-indebted-city-1 |

## Rows named for other seats

- **The food record's seat** (`foodGenerator.js` / `foodLand.js`): fish is the lone food source on depleted fishing grounds, 17 of 68 towns (C23861, C8655).
- **The seat holding `src/domain/display/stateProse/economyStateProse.js`** (DS-ECO-10's posture selector): POSTURE established is chosen under a famine where the page prints "No significant exports" (r2s-famine-hamlet-0, and the bar's bar0-village-famine-rand-3); the famine twins v8/v9 then speak of trades sending goods out. The selector reads exports the exports line does not show.
- **The seat holding the DS-ECO-1 selector (same file)**: C1 "a high rung on a working approach" picked for a thorp whose record has no trade at all and a `{complexity}` of "subsistence living" beside a Prosperous rung (bar0-thorp-calm-rand-4): the record's or the selector's.
- **BAR2-LABELS** (safety files): the defenders' pay lives only as prose in `guardEffectivenessDesc`; a field (or an atom) would let the corpus MARK pay lines rather than reword them out.

## The books my cures move (named; NOT re-taken: CP2's re-keys wait for the merge word)

Run on the cured tree and on a clean base worktree (f8042b61a), the same seven files: `tests/lint/proseComposed.walker.test.js`, `proseEntryContradiction.walker.test.js`, `proseWiringCensus.walker.test.js`, `proseMoveGrammar.walker.test.js`, `tests/domain/composeStateProse.test.js`, `tests/lint/proseCorpusBytes.test.js`, `tests/data/dossierStateProseProjection.contract.test.js`. Base: 15 red; tip: 14 red.

| test · arm | base | tip | door |
|---|---|---|---|
| `proseCorpusBytes.test.js` · RAW is EXACT | green | RED: defense 266746 -> 266732 (shrink), economy 185744 -> 185569 (shrink), general 298496 -> 298564 (+68), power 131321 -> 131329 (+8) | `scripts/.prose-byte-baseline.json` (declared rows for the growths; lower the two shrinks): mine to re-key after the merge (CP2) |
| `proseWiringCensus.walker` · the committed census is byte-identical to a fresh build | RED | green | the census re-derived through its door in this commit (my pools' rows; also `producerIndexFiles` 1379 -> 1380, a src file the line added: not mine) |
| (same file) · THE DRY READ | RED | green | the same re-derivation |

Every other red of those seven files is red at base with the same arm (the close's). The presumed-things register (`tests/lint/presumedThings.widened.register.json`) is SHRUNK through its door (`--shrink`, shrink-only): 8 stale rows, the banked texts of lines this batch reworded (5 `armedForce`, 1 `house: craft guild`, 2 `openTrade`); `--check` fresh 0 / stale 0.

## The books at the merged tip (F2, on af120bdd4; each file run alone through `sh scripts/gate-tail.sh`, to a file)

86 files: every test file naming a file this seat touched (the annex, the wiring census, the four leaves, the presumed register, `dossierStateProse`) and the brief's law suites, with `tests/property/generatorGoldenMaster.test.js`. 74 green at once; 4 helpers (not test files); 8 red, classed below. **No LAW was turned red by my cures.** **0 of the 525 reference configurations move**: the golden master (re-taken by the close at dcb069bff) is green at my merged tip, and no generator reads the leaves.

| test · arm | old -> new | door / form | done |
|---|---|---|---|
| `tests/lint/proseCorpusBytes.test.js` · RAW is EXACT | defense 266746 -> 266732, economy 185744 -> 185569 (lowered); general 298496 -> 298564, power 131321 -> 131329 (two declared rows) | `scripts/.prose-byte-baseline.json` (CP2) | re-keyed, 18/18 |
| `tests/lint/proseMoveGrammar.walker.test.js` · CONTROL 4 (both halves) | repeated opener 138 -> 137, share 0.161 -> 0.160, x800 129 -> 128 | the file's own dated notes (CP2) | re-keyed, 54/54 |
| `tests/lint/proseEntryContradiction.walker.test.js` · THE QUALIFY ARM | trailing-coordinate entries 371 -> 372 | the file's own dated note (CP2) | re-keyed, 29/29 |
| `tests/domain/crisisBlindDossierProse.test.js` · calm claims floor | 17 -> 16 (a calm claim cured at the source) | the floor follows the cures (the chair's K30 (a)) | re-keyed, 5/5 |
| `tests/domain/facts/declarationRegisters.test.js` · a count that fell is re-pinned | `DS-SUP-3::ONE EXPECTED CATEGORY MISSING` undeclared 3 -> 2 | `RETAKE_DECLARATION_REGISTERS=1` (shrink-only register) | re-pinned, 8/8 |
| `tests/lint/observedShapeReaders.walker.test.js` · a freshly re-minted baseline has no drift | the four leaves (execution inputs) | `node scripts/check-observed-shape-readers.mjs --write` (shrink-only re-freeze) | re-frozen, 47/47 |
| `tests/domain/corpusEcoTailGuards.test.js` · DS-ECO-6 v1 KEEP stem | `/^If any of .../` -> `/^Some of ... is done out of sight/` | re-keyed by identity beside a dated note | 136/136 |
| `tests/property/dossierProseManifest.test.js` (3) | — | THE OWNER'S OWN DOOR (the chair's message): left exactly as it is | not mine |

So the books my cures move: **7 stored figures, each re-keyed in its own form; 0 laws.**

## Batch 2 (after the merge): the labels seat's two rows

- **"keep its defenders paid" (DS-DEF-2 STRONG v1) at a funding gate under 1:** among the pay claims batch 1 reworded out; it prints in none of the 720 at the tip (the line now reads "...the town can buy what a bad season needs without going begging"). Nothing more to do.
- **C23849's sibling r2r-thorp-43 (DS-ECO-1 C4 v6), VERIFIED FALSE:** a Poor port thorp whose record carries no exports, no imports and no transit (1 of the 68 towns that print v6; the C4 lines v1 and v2 would be as false there). A TWIN WAS REFUSED BY A LAW: the pool partitions by crisis and market, and an `exports` mark on every calm line leaves it mute in the projection contract's abstract states (measured on C1 in batch 1). CURED BY REWORDING (C4 v1 "{settlement} sits on its {access} and stays poor all the same."; v2 "Little that comes past {settlement} stops there. The town is poor, and its people say so to anyone who asks."; v6 "There is no market at {settlement} to hold whatever its {access} brings, and the town stays poor."), as batch 1 did for C1. The selector grant (CP5, the chair's pointer of 16:58: a third input to `prosperityHeaderPoolKey`, "the approach carries trade") was NOT used: with C1 and C4 claiming no traffic, every line those pools draw is true where nothing passes. LEFT, with the pointer (`origin/lane/bar2-labels-2026-11-15:docs/chair/2026-11-15/bar2/BAR2-LABELS-3-HANDBACK.md`, "Item 2"): C4 v3 ("{settlement}'s {access} is busy", needs a market) would be false in a market town with no trade (0 of the 720).
- **Measure (both runs on the merged tree, 2 workers each: df2225165 without batch 2, and with it):** records byte-identical; sentences 29941 -> 29935; gone 23, new 17, fewer 0, more 0, moved 0: text only, every reworded line inherits exactly its towns (v2 101, v6 68, v1 74).
- **Veto list, batch 2:** C4 v1 (74 towns), v2 (101), v6 (68), smallest thorp to town (C4 is a low rung on a working approach: thorp, hamlet, village and town only).
- **Guard:** `tests/domain/bar2CorpusGuards.test.js` +3 REWORDED rows (39/39 at the tip; the three red on df2225165).
- **Books batch 2 moves:** prose bytes (economy 185569 -> 185528, lowered); the observed-shape baseline re-frozen through `--write` on the committed tree. Re-run alone at the tip and green: the prose walkers (composed, entry contradiction, wiring census, move grammar), composeStateProse, the projection contract, presumed things, crisis-blind, declaration registers, corpusEcoTailGuards, economyStateProseDesk, prose bytes, observed shape.
- **The chair's narrower net (16:59)** found my part (a) already run (86 files), so nothing changed.

## Gates (batch 1)

`typecheck:domain:strict` 1113/1113 OK; `typecheck:ratchet` 167/167 OK; eslint on the touched files 0; presumed-things `--check` exit 0; `page-census.mjs --grid` 0 falls; `wiring-census.mjs --check` 0; `gen:dossier-prose --check` 0. The guard `tests/domain/bar2CorpusGuards.test.js`: 36/36 green at the tip, 33 red at base (its 3 KEEP rows green both sides).

## Guards owed / what is left

- None of my worklists' rows is left open: 26 cured (20 gone, 3 fewer by their measure, C23849 gone in its bar town), 1 struck, 2 named.

## How the instruments are re-made

`git archive` of `docs/chair/2026-11-14/probes/READ-ALL/` (lane/chair-2026-11-08) and `docs/chair/2026-11-14/probes/CENSUS-3/` (lane/census-3-2026-11-14) to a scratch directory; `census3.sh <tree> <out> 4` (before), `--count-only` (after), `--seeds <file of bar0- seeds>` for the bar towns; `inventory.py`, `inventory_diff.py before.json after.json <the two worklists' rows>`.
