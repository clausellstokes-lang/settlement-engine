# W2-A-LEAVES — the hand-back

**Lane:** `lane/w2-a-leaves-2026-11-12`, cut from `lane/coherence-agree-2026-11-11` at `deb1544eb`; built in a scratch
worktree; the main checkout untouched. **First hand-back:** `2c6435650` (code `af468a5a8`). **The chair's rulings of 2026-11-12
(rows 2 and 3, the bundles):** code tip `b482225e2`; the whole suite re-run at `2680aa24c` (below).
**Draft shift record:** `W2-A-LEAVES-SHIFT-RECORD-DRAFT.md` beside this file.

## Measure first (charter §0 item 2)
The census re-taken at `deb1544eb` with its own instrument (`census.sh`, the 720 births): every row within one town of
the census's 8866a0ddd column (7a 128 vs 127; 11 410 vs 411; the rest equal). No rate a fifth away; no stop.

## Commits
| sha | what |
|---|---|
| 9b58f3156 | 1: THE LAYER TABLE (`src/domain/facts/factLayers.js`; `tests/lint/factLayers.poolTable.json`) and its walker, register banked |
| 30f3368a0 | 1b: the reader arm skips the page battery's instruments (`src/domain/coherence/`); 3 banked lines fell |
| b84d3ab76 | 2: THE PAGE ARM: `page-census` in the battery, `scripts/census/page-census.mjs`, its register (both columns), the grid walker |
| 04e71109a | 2b: the grid door `page-census.mjs --grid [--shrink]` |
| b98489c50 | 3: the missing leaves |
| 0c91903bc | 5a |
| e6f88e790 | 2c: repair of 2 (the defence-reader walker red at b84d3ab76) |
| c13a3568b | 5b |
| 1a3f89a9f | 3b: repair of 2 and 3 (the ruin-filter walker) |
| da7f699df | 6 |
| 87af7e045 | 2 + 20 (the condition half) |
| 5ed0da2c4 | repair: tuning register, typed prose anchors, an unanchored negative, the wiring stamp |
| af468a5a8 | the page arm's banked counts lowered through its door on the 720 |
| *(2c6435650)* | *the first hand-back* |
| 0325b6175 | row 2 RETIRED BY NAME; the new row `P2siege` (the chair's ruling) |
| 4b8ca499c | the magic traditions' houses one table (`data/magicTraditionHouses.js`), read by the chain step: 0 of 720 records move |
| 51454cc25 | row 3 RETIRED BY NAME; the new row `P3source` |
| 602beb464 | the row 3 cure: the Magic tab names where its magic comes from (`facts/magicSource.js`) |
| 2680aa24c | the edge-shared bundles rebuilt (the engine and aiGrounding sources moved) |
| b482225e2 | the phone floor's Systems/Magic re-keyed by cause (the reliance line, with its source, is long enough to be measured) |

## 1. The layer table and its walker
- **Leaves:** 43 rows (every vocabulary dimension's home, every `factsOf` getter, the class table's other homes, and the 7
  written here), each with its layer and the strata it touches, traced EXACTLY on a sixteen-birth grid (six sizes,
  calm and in crisis). **Pools:** all 856, placed (600 by the map + 1, 21 placed here of which 5 are W; 240 W in all, banked by name).
- **The walker** (`tests/lint/factLayers.walker.test.js`) reds: an unplaced pool or stored field; a leaf whose touches
  differ from its row; and, against the shrink-only register, a leaf that touches its own layer or above (LEAVES), a
  pool whose lines declare or name a fact at its layer or above (POOLS), and a second derivation of a homed fact by a
  name test outside its home, over thirteen fact families (READERS: the defence-reader walker generalised).
- **The banked floor:** leaves **8** (the defence bundle and the three getters through it; crisis and warState through
  the hunger family; crime reading the back-written crime lines; faith touching the cast); pools **6** reads in 5 pools;
  readers **480** lines in 96 files (483 at the first commit; 3 fell with 1b).
- **Where my table differs from the map, and I say so:** lines are on the procedure's scale (the map's pool number + 1:
  its "L1" pool reads the base facts); the leaf arm checks TOUCH, not value (the bundles are its findings); DS-GEN-15 is W
  (the campaign fabric); DS-HK-1 at 5; DS-GEN-10 by chapter.
- Plants: every arm red in memory (11/11), and two executed against the tree (a 'market' name test; an undeclared cast read).

## 2. The page arm
`src/domain/coherence/pageCensusFindings.js` is the census counter's 25 tests as the battery's `page-census`; its corpus
door renders the census's 720 through the real container as the owner sees it (`--seed-prefix=<p> [--scale=k]` is the
fresh-corpus door, against the bar). Over the census's own base dumps it equals the counter PER SEED on all 25 rows.
The suite walker holds twelve births exactly (14 tests, 54 s). Every row's bar is zero.

| row | master db832c892 | integration 8866a0ddd | base deb1544eb | tip |
|---|---|---|---|---|
| 1a | 0 | 57 | 57 | 57 |
| 1b | 64 | 64 | 64 | 64 |
| 2 RETIRED | 568 | 569 | 569 | 569 when retired |
| **2 (new): a siege figure in the indicative outside a siege** | — | — | 689 | **0** |
| 3 RETIRED | 172 | 190 | 190 | 190 when retired |
| **3 (new): reliance stated with neither a practitioner nor a named source** | — | — | 74 | **0** |
| 4 | 0 | 106 | 106 | 106 |
| **5a** | 0 | 288 | 288 | **0** |
| **5b** | 0 | 2 | 2 | **0** |
| **6** | 463 | 296 | 296 | **0** |
| 7a / 7b | 128 / 0 | 127 / 27 | 128 / 27 | 128 / 27 |
| 8 / 9 / 10 / 11 | 0 / 148 / 18 / 396 | 220 / 149 / 17 / 411 | 220 / 149 / 17 / 410 | unchanged |
| F4 / 13 / 14 | 274 / 173 / 183 | 245 / 172 / 167 | 245 / 172 / 167 | unchanged |
| 16a / 16b / 17 / 18 / 19 | 0 / 0 / 681 / 337 / 5 | 331 / 291 / 680 / 360 / 7 | same | unchanged |
| **20** | 689 | 689 | 689 | **0** |
| NEW-1 / NEW-2 | 10 / 0 | 11 / 3 | 11 / 3 | 11 / 3 |
(master is not a measurement for 5a, 8 and 16a: their page did not exist there. The two new rows carry no census column:
the census did not count them; "base" is the arm's count over the census's own base dumps.)

**Rows 2 and 3, re-defined by the chair's ruling (2026-11-12), never a silent zero.** Each old row is RETIRED BY NAME in
`pageCensusFindings.js :: RETIRED_PAGE_CENSUS_ROWS` and the register's `retired`, with its two columns, its count when
retired, its reason and the row that replaced it; the door prints both. Row 2's reason: two true quantities, by the owner's
design (the Defense line links to the stores row and never restates its figure). Row 3's: it counted the words, not the
explanation (a town whose temples or alchemists supply its magic has no arcane practitioner and is no fault; an envelope
reading "common" states no reliance).

**The census counter, base against tip** (`census.sh` + `compare.mjs`, the census's own instrument): no count rises, no
new row; 5a 288 → 0, 5b 2 → 0, 6 296 → 0, 20 689 → 0; median rows per town 9 → 7.

## 3. The leaves built
presence on a card (`facts/presence.js :: houseHere`, L1, the live roster, never a first word) · the chain's carrier
(`facts/chainCarrier.js`, L2) · beasts readiness against threat (`facts/beastsReadiness.js`, L3) · the leader's lead
(`facts/leaderLead.js`, L3: margins only, no dial) · the powers' lists (`dossier/powerStrata.js :: derivePowerStrata`,
already the one derivation; registered) · the imports as printed (`display/tradeListDisplay.js :: importsAsPrinted`, L4)
· the founder (`facts/founder.js`, L4, its kind by a table of every founder line). The eighth, "a resource is worked
here", is the agreement lane's F4 (LEAVES_OWED keeps its row).

## 5. The hand cures
| pattern | before | after | how |
|---|---|---|---|
| 5a | 288 | 0 | the capture lens says nothing at stored state `none` |
| 5b | 2 | 0 | a criminal power outranks the name ladder |
| 6 | 296 | 0 | the gap reader reads `importsAsPrinted` (445 gap lines leave, 0 added) |
| 20 | 689 | 0 | the Food endurance line is a condition outside a siege |
| 2 (new row) | 689 | 0 | the same cure (87af7e045): the siege figure is a condition outside a siege; the old row retired |
| 3 (new row) | 74 | 0 | the reliance line names its source from the leaf `facts/magicSource.js`; with no source, no line (none of the 720 falls silent: all 74 name one) |
Each red first; pins re-keyed by identity with the cause (powerStateProseDesk ×2, dossierLabelCase ×1, foodEnduranceHeldStores ×1).

## The six surfaces (the draft record)
Generator golden master, espionage fence, PDF golden, Herald desk: red at the base with byte-identical output at the
tip: UNMOVED (0 of 720 records move). Preset-lighting witness: green both: UNMOVED. Dossier prose manifest: MOVED by
5a (cells −36, DM-only positions 203 → 167; one more title red on its pin), the merge seat's act. **Re-measured at
`2680aa24c`:** the six suites' failure output is byte-identical to the first hand-back's tip; the rulings' commits move
no surface (the lift moves 0 of 720 records; the row 3 cure is the Magic tab, which no surface reads).

## The gates
Every commit touching `src/`: check-domain-strict exit 0; typecheck:ratchet exit 0 (167, ceiling 167); eslint on the
touched files exit 0. Four pushes before the rulings, one after, each through the lane hook's three gates.

## The whole suite at the tip
**At `2680aa24c`** (after the rulings): **exit 1; 36 files, 46 tests red** (38,731 pass, 254 skipped). Titles compared
one by one with the base's 54:
- **Red at the base and green now (6):** engineBundleReplay ×3, edgeSharedBundleReproducibility ×2,
  aiGroundingBundle.freshness: the bundles rebuilt in one run (`2680aa24c`).
- **Red here and not at the base (3):** dossierProseManifest › "THE MIXED-POOL AUDIENCE ARM" (cause 5a, the merge
  seat's re-pin, as before); dossierPhoneFloorAllViews ×2 (Systems/Magic desktop 4 → 5, mobile chrome 1 → 2: the
  reliance line with its source crosses the walk's 45 characters; chrome by its 700 weight; sub14 and sub12 hold; no
  token moved): re-keyed by cause in `b482225e2`, file green.
- **The other 48 are the base's titles** (the list below), landingFixtureFreshness ×2 among them (fresh derivations
  identical at base and tip: not this lane's).

**At `af468a5a8`** (the first hand-back), `npx vitest run --maxWorkers=2` (the ledger branch fetched first): **exit 1; 38 files, 50 tests red**
(38,720 pass, 252 skipped). Every red file run again at the base `deb1544eb`: 38 files, 49 tests red there, and the
titles compared one by one:
- **49 red at the base, the same 54 failure titles (two are whole-file errors)** (not this lane's): the generator golden master and every byte-identity pin that
  reads it (pipelinePinnedMode ×3, pipelinePinnedChoosers, nameHeldThroughAssembly, rosterFinalUnderHeldRoster,
  powerEconomyFreshness, institutionBudgetPromise, x46NpcBand, hookThemeDraws, generationForkCensus, dmLayerGoldenIsolation,
  worldFactRederive, editWorldFactResources ×2, mergeLadderHeldKeys ×3, editCorpusRatchet ×3), the espionage fence, the
  PDF golden, the Herald desk, the manifest's two drift titles, the built-bundle and fixture hashes (engineBundleReplay ×3,
  edgeSharedBundleReproducibility ×2, aiGroundingBundle.freshness, landingFixtureFreshness ×2: stale at the base; this lane's
  `src/` changes are one more reason to rebuild them at the merge), townCartographyCalibration, undercitySewerDerivation,
  intentAtlasSoakDistiller, statecraftExposureBand, and the thirteen tests/lint files named below (16 titles).
- **1 red at the tip only, this lane's and expected:** dossierProseManifest › "THE MIXED-POOL AUDIENCE ARM" (pin 203,
  reads 167), cause 5a; the merge seat re-pins it through the manifest's door (the draft record).
- Red at the base and green at the tip: none.

## Calls taken without the chair
1. The pool table's scale is the procedure's (map + 1).
2. The 21 pools the map could not place, placed by reading source (DS-GEN-15 → W).
3. The reader arm excludes `src/domain/coherence/` (page instruments test printed words by design).
4. The leaf arm checks touch, not value.
5. 5a: an absent capture state reads as before; only `none` is silenced.
6. The leader's-lead leaf states margins and holds no threshold (the tuning register's law: no new dial).
7. The page arm reads the live roster (a birth carries no ruin, so it still equals the counter).
8. The chain carrier leaf is built here (the brief names it; the class table had given it to C): C's card reads it.
9. Row 3's source: every house by name (those that practise, then a dependent chain's houses), the people who practise one
   by name and more than one counted, so no cap is a new dial. A chain that needs magic names the houses its row
   records (already the matched subset; `generalStateProse.js :: craftInstitutionFill` reads them the same way, and the
   tab never imports the generator); a chain magic holds up names the houses of the tradition that wrote its note (a
   closed table, held to every note the substitution step can write).
10. The tradition keyword lists lifted out of `computeActiveChains.js` into `data/magicTraditionHouses.js` so the leaf
    reads the generator's own table, not a second list (0 of 720 records move).
11. All six edge-shared bundles rebuilt in one run (the build-window pin); four change only their timestamp.

## Parked, with my recommendation
- **Item 4 (the four back-writes; splitting `defenseFactsOf` and the crisis hunger family).** `assembleSettlement.js`
  (powers, upkeep), `defenseFacts.js` (agreement, upkeep), `factsOf.js` (upkeep) are held. The walker already banks both
  bundles and the crime lines' back-write; the listing of the lines drawn before each back-write waits with the files.
- **The vocabulary atoms `practitioner`, `capture`, `founder`.** The vocabulary is W2-B-DECLARE's now (the chair's
  message of 20:30); their leaves exist here (`magicPractitioners`, the stored capture climate / `hallCaptureOf`, `founderOf`).
- **Item 4, 16b, NEW-1, 9:** a later seat, after the powers and upkeep lanes merge (the chair's ruling).
- **The landing fixture** (`tests/build/landingFixtureFreshness.test.js`): stale at the base and at the tip, and its fresh
  derivation at seed lf-033 is byte-identical at both, so this lane does not move it; its re-emit re-grounds authored
  narration, not a lane's act.

## Found, not mine
- My own guard misses, each cured in the lane: commits 2 and 3 reddened four walkers outside my files (defence readers,
  ruin filter, tuning register, prose anchors); the push hook runs no suite, so they were found by my own lint-dir runs.
- At the base, 16 tests/lint titles in 13 files are red (institutionTable, newsHeadline, newsVoice, observedShapeReaders,
  proseComposed, proseFamilyContract, proseTasteInterested ×3, proseWaveGate ×3, siteCoherenceRatchet,
  sovereigntyLighting, writerReach): not this lane's.

## New words for the owner's veto
"would be lost", "would carry", "would feed", "would stand in reserve" (the Food endurance line outside a siege);
"· supplied by …" and "N practitioners" (the Magic tab's reliance line).
