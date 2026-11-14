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

---

# PART 2 — the second seat (W2-A-LEAVES-2, 2026-11-13): the review's findings cured

**Seat:** W2-A-LEAVES-2, from 96d698de7 (REVIEW-W2A NOT CLEAR). Scratch worktree; the main checkout untouched.
**Tip:** `the remote tip read back at the foot of this part (code 8f96276a9; bundles 395cb592f)`. **The law of this seat:** a count falling is not a cure. Each cure below says how many lines it
removed, how many of those were true by a read sample of thirty, and what the page says in their place.

## Commits
| sha | what |
|---|---|
| 04bab40c6 | F1: the gap lines print again; `importsAsPrinted` → `{ arriving, needed }`; row 6 RETIRED BY NAME → P6need |
| 08c9f15bd | F3: the blanket silence withdrawn; each crime line struck only where the town makes it false; leaf `facts/officialsInPay.js`; row 5a RETIRED BY NAME → P5false |
| dce6a1d6c | F3: the tuning inventory refrozen through its ritual (ALLEGIANCE_TUNING gains a dependent; no value) |
| 433147d3e | F2: the Magic tab's supplying houses once, as the roster's, through the display seam; P3source counts a bracket or a doubled house |
| 0297bac21 | F6: the reader arm reads the facts folder but its homes; banks lines by content, each with a reason |
| df008526a | F5: a key-read arm; the nine capture-keyed pools placed at layer 5 by their key's reads |
| 6a3bb189d | F3b: the read of thirty widened the fact (a member of the ruling power; the hall held at `corrupted`/`capture`) |
| 13ba62cdd | the hand-back, current (this file, first written) |
| ef3f04d89 | the page arm's P5false lowered through its door on the 720 (306 → 0) |
| c32f0d099 | the edge-shared bundles rebuilt (engine and aiGrounding sources moved) |
| 8f96276a9 | F3c: the veil — the crime desk reads the veiled cast and rung for the DM only; the ring's note reads nothing hidden |
| 395cb592f | the edge-shared bundles rebuilt again (defenseDisplay.js moved) |


## F1 (HIGH) — the gap lines restored; the false half named and handed on
- **Restored: 445 lines in 296 towns** (every one the first seat removed); **0 added**. Field diff of the gap reader,
  base deb1544eb against this tree, over the 720 records: 945 lines both, **0 towns differ**.
- **Read sample of 30 restored lines** (every 14th, against each town's record; `out/f1sample.txt` method): 30 carry
  the record's gap kind `missing`; none is in the trade imports or produced locally. **27 plainly true; 3 doubtful in a
  reader's sense** (a salt works beside a salt entrepôt chain: r2s-indebted-village-0, r2s-religious_conversion-village-3,
  r2s-slave_revolt-town-0 — salt passes through, the salt works still lacks its desert salt).
- **What the page says now:** "No clay reaches the potter." again — true by the record — and the Imports line still
  prints "Clay" beside it, because `EconomicsTab.jsx` composes its own list (held by the powers lane; its move onto the
  leaf is W2-C-LEAVES's, the chair's ruling). The leaf keeps the two apart: `arriving` (trade) and `needed` (a good the
  town needs and no import names). The gap reader reads `arriving` only.
- **F4 corrected in the record:** the leaf's JSDoc no longer claims to be the one home; it says the tab still composes
  inline and that the move is W2-C-LEAVES's.
- **The census row re-read:** row 6 RETIRED BY NAME (`RETIRED_PAGE_CENSUS_ROWS.P6`, the register's `retired`: master 463,
  integration 296, 296 at retirement, its reason) and replaced by **P6need, "an import printed beside its own unmet
  need": 642 at the base, 642 here** — the Imports line, not the gap, is the fault, and it stays until the tab moves.
  **P6need's precision by a read of 30:** 22 a need printed as an import with nothing bringing it; **8 a need an import
  already meets under another name** ("Luxury goods" beside "Luxury textiles and exotic goods"; "Metals" beside "Iron";
  "Timber (for large vessels)" beside "Shipbuilding timber"). So the row is an upper bound, and **`needed` must not be
  printed as "not met" until that match is made** — a condition on W2-C-LEAVES's move, written in the leaf's JSDoc.

## F3 (MEDIUM) — the blanket silence withdrawn, line by line
- **MEASURED FIRST, and it moved the disqualifier.** At the hall's stored state `none`, **41 of the 585 towns hold an
  official who answers to a criminal house through their office** (65 counting a member of the ruling power who
  answers to one: F3b) (the cast; the DM panel's own "Who answers to whom …
  brings protection and decisions", e.g. r2r-city-0's chief magistrate and castellan), 31 of them beside the organised
  ring. There "bought officials" is TRUE beside "Free of the criminals" (the hall card speaks of the ruling three, and
  its own third line says a criminal house "has to ask, pay or wait like anyone else"). So the chair's example
  disqualifier, the stored state, would have struck true lines; a line about officials is struck by the CAST's fact
  (`facts/officialsInPay.js`, layer 4: by office, or a member of the ruling power; and the hall's rung at `corrupted`/
  `capture`, where the criminals hold the hall — F3b, found by this seat's own read of thirty, below) and a line about
  a grip on the hall by the hall's stored rung. **Call taken; the
  chair may re-rule it** (the stored state alone would remove the 41 towns' true lines).
- **The declarations** (`display/stateProse/crimeLineDisqualifiers.js`, enforced at the draw; the corpus untouched):
  | line | struck where |
  |---|---|
  | DS-POW-6 ADVANCING #1 "Criminal money is reaching the officials … one at a time" | no official in pay |
  | DS-POW-6 ADVANCING #3 "Officials … spending money their posts never paid them" | no official in pay |
  | DS-POW-6 RECOVERING #1 "… losing their grip on the hall" | no agent in the hall (`none`, `adversarial`) |
  | DS-POW-6 RECOVERING #2 "The approach was made … and did not take" | an official in pay |
  | DS-POW-6 RECOVERING #3 "… still own a few officials" | no official in pay |
  | DS-DEF-4 capture equilibrium #1 "… nothing is bought here" | an official in pay |
  | DS-DEF-4 capture none #2 "… the means to reach into the hall and it has not" | an official in pay |
  | DS-DEF-4 capture none #3 "… business with the hall is straight" | an official in pay |
  | the organised ring's note, "bought officials" (each of four vantages) | **F3c: reworded, not struck** — see below |
- **F3c, THE VEIL (found by the whole suite at c32f0d099, the one red title not red at the base, this seat's own):**
  both facts are VEILED — the cast's allegiances and the hall's rung are stripped from the public record — and the
  public page's criminal lens and ring note were decided by them (publicProseVeilInvariance, soak1k-39). Cured: the
  desks read them for the DM's audience only (for any other audience nothing is struck: as at the base); and the
  ring's note, ONE value printed on both pages, may read neither, so its four vantages were reworded to say what is
  true in every town: the ring lives on protection money "and on any official it can buy" (it presumes no buyer; the
  DM's "Who answers to whom" names those it has). All 255 organised rings' notes change by that clause: 87 lose a
  false claim, 168 a true one stated plainly (where an official is in pay, or the hall is held), now said as a
  possibility. **The cast-aware note waits for the public composer (`components/new/publicProseCompose.js`, not this
  lane's) to draw it from the stripped record** (request).
- **The counts on the 720 (base → tip):** base deb1544eb against the tip's pages (census renders, the crime desk's lines on Power and
  Defense), **269 lines out and 282 in, in 265 towns** (the first seat's 5b structure moves included). OUT: 64 + 93
  "officials are taking criminal money" (ADVANCING #1, #3) and 15 "still own a few officials" (RECOVERING #3), all
  where no official answers to a criminal house; 16 "losing their grip on the hall" at a free hall; 81 ring notes
  naming bought officials where none is. IN, in the same places: 157 "Each season it gets easier to buy an
  official" (it presumes no buyer), 26 "The approach was made … and did not take", 2 "still own a few officials"
  (where one is), 97 ring notes without the clause. **At the final tip (395cb592f), after F3c:** the crime desk's lines
  as above (188 out, 185 in, 3 towns silent), and the organised ring's note reworded in all 235 rings the census's
  Defense pages print (the 255 counted on the records, less those the page veils or does not show). **Against the first seat's tip (96d698de7): 285 capture-pressure
  lines restored** beside a free hall (the census's own retired row 5a: 288 base, 0 there, 285 here); the 3 short are
  the case left with no line (requests, item 2). The organised rings that lose the clause: 87 of the 720 (F3b; 148
  before it).
- **Read sample of 30:** **thirty of the 269 removed lines**, each against its town's page and record
  (`out/f3sample2.txt` method, every ninth): **23 false** by the record (an official taking criminal money, or a grip
  on the hall, where the cast holds no official in a criminal's pay and the hall card reads "Free of the criminals");
  **7 doubtful**: a plot hook on the same page says "A guard captain is on the payroll of the criminal network",
  which the cast does not hold; **0 true**. The first read, at df008526a before F3b, found true lines removed (a ring
  at `corrupted`; a ruling-power member in a criminal's pay): F3b cured that. **A finding against this cure, by
  name:** that hook prints in 160 of the 720 towns, 68 of them with no official in pay, and now stands beside a "no one
  was bought" line ("the approach … did not take", "business with the hall is straight") in **12 towns (1 at the
  base)**. The hook is the line the cast does not support; it is generator data, not this lane's: its disqualifier
  ("needs an official in pay") is a request (item 5). Recommendation: the chair rules whether this seat's draw waits
  for the hook's cure.
- **The census row re-read:** row 5a RETIRED BY NAME (it counted the true with the false; 288 at the base) and replaced
  by **P5false, "a crime line the town's facts make false"**: 306 at the base; **0 at the tip**, lowered through the door (ef3f04d89).
- **Not cured here, parked:** at `corrupted` the AGENT pool says "a minor member … not decisions" while the hall card
  says the head answers to the guild (`rvw-town-1`, review §1 C3) — the desk's corrupted → AGENT mapping is a recorded
  design ("Say veto to move it"); 36 + 32 towns' other lines naming a payroll or bribes (plot hooks, the safety
  profile's operation notes) are generated record text, not the crime desk.

## F2 (MEDIUM, origin) — the supplied-by line through the display seam, once
- **Count:** of 289 reliance lines on the 720, **before: 114 with a bracket** (the reviewer's 73 catalogue ranges or
  conditions plus "(high magic)", "(resident)", "(divine, 1st level)"), 10 naming a house twice (the review's
  count), 8 over 280 characters; **after: 0 with a bracket, 0 naming a house twice, 2 over 280** (two
  metropolises naming fifteen houses). 289 lines both; **0 lost**; 180 changed.
- **Read sample of 30 changed lines:** 30 true; each change is a catalogue form replaced by the roster's through
  `institutionDisplayName` with its bracket struck ("Parish churches (50-100+)" → "Houses of worship"; "Dream parlors
  (high magic)" → "Dream parlors"; "Priest (resident)" → "Priest"), or a doubled house dropped. No line removed.
- (F2) **P3source** now counts a source with a bracket or a house named twice: base 74 (no source then), tip 0 (the door
  over the 720); at 96d698de7 the leaf printed a bracket in 114 of its 289 lines.
- One fixture pin named a house its roster lacked ("Multiple monasteries", a chain pattern): re-keyed with the cause.
- Not bounded ("the first few, then and n more"): a cap would be a new dial; 2 lines over 280 characters remain.

## F5 — the key-read arm (pools)
Red first on exactly the nine; then placed at layer 5 by their key's reads (each row's `src` names its old place).
Nothing then violates; the register is unchanged. Plants: a pool put back at 3 reds; a key site that is gone reds.

## F6 — the reader arm
Plants executed against the tree and reverted: a `market` name test in `facts/leaderLead.js` → **red**; the
`DefenseTab.jsx` swap (2 lines before and after) → **red**. Calls taken: a call of the home's own reader
(`hasInstitution(record, 'temple')`) is the home's reading (a private helper over a list of words still counts);
the register's shape migrates with its instrument (480 rows: −1 through the home, +1 the market home's guild test).

## The census counter, base deb1544eb against this tip (the census's own instrument)
At 6a3bb189d and again at the final tip 395cb592f, identical rows (census.sh both trees, 720 renders each, every worker exit 0; compare.mjs): **no count rises,
no new row.** 5a 288 → 285 and 6 296 → 296 by their OLD tests (the true lines print again, as ruled; both rows are
retired in the arm with their replacements); 5b 2 → 0; 20 689 → 0 (BETTER); every other row equal; median rows per
town 9 → 8. GLANCE towns 717 → 717.

## The page arm, through its door
`page-census.mjs --shrink` over the banked 720 at 6a3bb189d (before F3c): **P5false 306 → 0 (lowered)**; P2siege,
P3source, P5b, P20 0; **P6need 642** (banked at its base; its cure is the tab, W2-C-LEAVES's); no row rose; the four
retired rows (P2, P3any, P6, P5a) printed by name with their reasons. The grid's twelve births: unchanged through
every commit (P6need on all twelve). **At the final tip** the arm over the census's own 720 renders (equal to the
door per seed): P5false 0, P3source 0, P2siege 0, P5b 0, P20 0, P6need 642; every other row as banked.

## The six surfaces (the draft record, Part 2)
| surface | base deb1544eb | tip 6a3bb189d+ | this seat |
|---|---|---|---|
| generator golden master (at 6a3bb189d and again at 395cb592f) | red | red, identical output | **UNMOVED** (0 of 720 records move) |
| espionage fence | red | red, identical output | **UNMOVED** |
| dossier prose manifest | red: the 2 drift titles | red: the same 2 titles; 74,801 cells and DM-only positions 203 as at the base (the first seat's 74,765 / 167 undone; its "MIXED-POOL AUDIENCE" title green again) | **MOVED, PLAUSIBLE**: one diagnostic count moves (seedless cells drawing above index 0 after anchoring, 241 → 242), and the crime desk's struck lines change which line some DM cells draw; the drift arm's object is printed truncated and identical, so its per-cell diff is the merge seat's to re-record |
| PDF golden | red (canon values) | red, identical output | **UNMOVED** |
| Herald desk golden | red | red, identical output | **UNMOVED** |
| preset-lighting witness | green | green | **UNMOVED** |

## The gates
Every commit touching `src/` (04bab40c6, 08c9f15bd, 433147d3e): check-domain-strict 0; typecheck:ratchet 0 (167,
ceiling 167); eslint on the touched files 0. tests/lint at each: the base's 11 red files only, after each commit's own
walker repairs (the wiring census re-stamped by its writer; the tuning inventory refrozen by its ritual; my tests'
negatives anchored and seed loops collected). Pushes: four (dce6a1d6c, df008526a, 13ba62cdd, c32f0d099) and the last with this file, each through the hook's three gates.

## The whole suite
**At c32f0d099** (`npx vitest run --maxWorkers=2`, the ledger branch fetched): **exit 1; 36 files, 44 tests red**
(38,745 pass, 254 skipped; 49 red titles, the list in `docs/chair/2026-11-13/probes/W2-A-LEAVES-2/suite-red-titles-at-c32f0d099.txt`).
Classed by file against the lane's reviewed base deb1544eb (the review's §10 list at 96d698de7 and the first part's list):
- **red here and not at the base: ONE, this seat's:** publicProseVeilInvariance › "composePublicProse(owner)
  deep-equals composePublicProse(stripped owner)" (run at the base: 4/4 green; at the tip 1 red). **Cured by F3c
  (8f96276a9): 4/4 green**, with the crime, defence, public-prose and veil suites (the base's 3 reds only).
- **red at the base and green here: the first part's dossierProseManifest "MIXED-POOL AUDIENCE" title** (its pin 203
  reads 203 again: F3 restored the lens); the six bundles' freshness pins stay green (rebuilt).
- **every other red title is the base's own**: the golden master and its byte-identity pins (pipelinePinnedMode ×3,
  pipelinePinnedChoosers, nameHeldThroughAssembly, rosterFinalUnderHeldRoster, powerEconomyFreshness,
  institutionBudgetPromise, x46NpcBand, hookThemeDraws, generationForkCensus, dmLayerGoldenIsolation,
  worldFactRederive, editWorldFactResources ×2, mergeLadderHeldKeys ×3, editCorpusRatchet ×3), the espionage fence,
  the PDF golden, the Herald desk, the manifest's two drift titles, landingFixtureFreshness ×2, townCartographyCalibration,
  undercitySewerDerivation, intentAtlasSoakDistiller, statecraftExposureBand, and the eleven tests/lint files.
**At the final tip 395cb592f the whole suite was NOT finished**: it was started, cut by a container restart, restarted,
and stopped by the chair's stop-and-save (8 tests had run). What was run at 395cb592f: the census (720 renders,
every worker exit 0), the page arm over its dumps, the six surfaces (identical to the base), and after F3c its own
gates: tests/lint (the base's 11 red files only), the defence/criminal/veil/public-prose/phone-floor suites (376
files: the base's 3 reds only: mergeLadderHeldKeys, undercitySewerDerivation, worldFactRederive), the grid walker.

## Requests to the writing lane (W2-WRITE) and the instrument lane (W2-B-DECLARE)
1. **Carry each declaration in `crimeLineDisqualifiers.js` onto its corpus variant** (the table above), then this
   lane's table goes. The two facts need vocabulary atoms (W2-B-DECLARE): "an official in a criminal's pay"
   (`facts/officialsInPay.js`) and "an agent in the hall" (the capture climate).
2. **A case left with no line:** DS-POW-6 RECOVERING where the hall is `none` or `adversarial`, no official is in pay
   and the town has no watch (its one line true there declares a watch): **3 of the 720** towns (the desk is silent).
3. **Cases under three:** DS-POW-6 ADVANCING with no official in pay has ONE line ("Each season it gets easier to buy
   an official"), drawn in 237 of the 720 (it was 81 by the draw); DS-DEF-4 `capture none` with an official in pay has
   one (41 towns at most). The repetition guard has not seen the corpus pools yet (W2-POOLS).
4. W2-WRITE's branch carries the first seat's tip: it should take this tip when it merges.
5. **The plot hook "A guard captain is on the payroll of the criminal network"** (generator data, the data seat's):
   it needs an official in a criminal's pay (`facts/officialsInPay.js`) and prints in 68 towns that hold none.

6. **The veil lane (publicProseCompose.js):** draw the public ring note from the stripped record, so the DM's note can
   name bought officials by the cast again.

## For W2-C-LEAVES
`EconomicsTab.jsx` onto `importsAsPrinted`: `arriving` as Imports, `needed` as "needed, not met" — only after a
need an import meets under another name is matched (8 of 30 read), or that print is the next false line.

## New words for the owner's veto
The organised ring's four vantages, their officials clause reworded (F3c): "… and it lives on protection money and on
any official it can buy." · "… lives on protection money and on whatever official it can pay, …" · "Shopkeepers here
pay one ring for protection, and the ring pays any official who will take its money. …" · "… it lives on protection
money and on any official it can bribe."

## Calls taken without the chair
1. F3's disqualifier for a line about officials is the cast's fact, not the stored state (measured: 41 towns).
2. F3 includes DS-DEF-4's three capture lines that deny a bought official (same fact, the opposite claim).
3. F6's home-call rule, and the register's shape migrated with its instrument.
4. F2's bracket struck in the view, after the display seam (the seam itself keeps counts by its own design, C's file).
6. F3c: the ring's note reworded to a claim true in every town rather than decided by a veiled fact (the alternative,
   a clause decided by the cast, leaks it; the other, the clause kept, keeps 87 false lines and would raise the banked
   P5false).
5. P6need is banked at its base (642): its cure is W2-C-LEAVES's file.


## STOP AND SAVE (the chair, on the owner's word, 2026-11-13 ~10:45Z): the state for a successor who has only this branch
- **DONE:** F1, F2, F3 (+ F3b, F3c), F5, F6 with their commits above; the page arm's register lowered (P5false 0);
  the bundles rebuilt at the last code tip; the census, the arm and the six surfaces at the final tip; this file.
- **IN PROGRESS: the whole suite at the final tip.** Next command, in a worktree of the lane's tip with `npm ci` and
  `git fetch origin review-fixes-2026-07-08:review-fixes-2026-07-08` done:
  `npx vitest run --maxWorkers=2 > suite.log 2>&1` (about 100 minutes); class each red title against
  `probes/W2-A-LEAVES-2/suite-red-titles-at-c32f0d099.txt` (the c32f0d099 run, classed above): expected the same 48 base
  titles, publicProseVeilInvariance now green.
- **NOT STARTED:** the shift record's part 2 is in `W2-A-LEAVES-SHIFT-RECORD-DRAFT.md` (written with this file); the
  hand-back MESSAGE to the chair (sent, if this session could, with the save).
- **The rulings this seat worked to** (the chair's brief, not on the branch): cure the review's findings and nothing
  else; one cause per commit, red first; every count on six sizes and forced crises; F1: the gap lines restored, the
  Imports list to print what trade brings and a need as a need not met, the leaf keeping the two apart, the tab's move
  W2-C-LEAVES's, row 6 re-read as "an import printed beside its own unmet need" beside the old row by name; F3: the
  blanket silence withdrawn, each crime line carrying the disqualifier that makes it false, no corpus line written
  (requests to W2-WRITE); F2: a house through its display leaf, once, no range, no condition, the row counting them;
  F5: the nine pools red or banked by the walker's rule; F6: plant a facts-folder name test and a swapped line; THE
  LAW: a count falling is not a cure — each cure states the lines it removed, how many were true by a read of thirty,
  and what the page now says; the lane's only writer; push only `lane/w2-a-leaves-2026-11-12`; no PR; never
  --no-verify; registers only through their doors; no pin loosened, no test skipped, no baseline banked up.
- **The probes:** `docs/chair/2026-11-13/probes/W2-A-LEAVES-2/` — `gaps.mjs` (the gap reader per seed over a corpus),
  `arm.mjs` (a tree's page arm over census dumps: `node arm.mjs <tree> <dumps> <corpus.ndjson.gz> <out.json>`),
  `f1sample.mjs`, `officials.mjs`, `magic.mjs`/`magic2.mjs` (the reliance line, two trees), `crimeread.mjs` (the crime
  desk's lines base against tip, with the facts), `six.sh <tree> <out-prefix>` (the six golden suites); the two reads
  of thirty; the census comparison at the final tip. Their scratch paths name `out/base`, `out/tip3`: the census's
  `census.sh <tree> <out>` makes those (on lane/second-wave-census-2026-11-12).
