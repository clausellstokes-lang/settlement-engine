# SECOND-WAVE-CENSUS — the shared patterns behind REVIEW-AGREE-2's thirty towns, measured on 720 births

**Seat.** SECOND-WAVE-CENSUS, a read-only measuring seat, 2026-11-12. I changed nothing under `src/`, `tests/` or `scripts/`. This file is the one thing committed.

**Tree.** `lane/coherence-agree-2026-11-11` at `8866a0ddd` (detached, clean): the tree REVIEW-AGREE-2 read.

**The verdict in short.**
- I measured 21 listed patterns, plus F9 and 2 NEW ones.
- Class A (one fact, two answers): 12 patterns + 2 NEW. Class B (lines that read false or broken): 9 patterns.
- 20 of the 21 listed patterns print on the 720 births.
- One does not: **21 (`@keyframes spin`) is not visible to a reader.** Chromium shows the text is a `<style>` element's content (`display: none`, no box, absent from `innerText`). Only a `textContent` dump sees it.
- **F9 is not reproduced as stated.** The presumed-things walker already reads template heads. What it misses is fragments under three words and words split by a placeholder: 6 templates.
- Highest rates, of the 720:
  - **15** (burials under Healing): 720. This is an owner-ruled design (§708.5, as cited in code).
  - **20** (siege text outside a siege): 689.
  - **17** (non-goods in "Produced locally"): 680.
  - **2** (two store durations): 569.
  - **18** (count ranges on NPC cards): 360. Every town, city and metropolis.
  - **6** (gap against imports): 296.
  - **5a** (hall free beside criminal money): 288.

## How I counted (EXECUTED)

**Births.** These are REVIEW-AGREE-2's corpus, rebuilt exactly as its corpus section says: `birthConfig({ ...DEFAULT_CONFIG, ...dials, settType })`.
- The dials: `random_trade`, `random_culture`, `random_threat`, every random flag on, `_randomizePriorities`, `magicExists`, and `contentProfile: 'grounded'`.
- Each birth calls `generateSettlementPipeline(cfg, null, { seed, customContent: {} })`, after `loadGenerationLawPayloads()`.
- **`r2r-<size>-<i>`**: 6 sizes × 60 = 360 (calm).
- **`r2s-<crisis>-<size>-<i>`**: 15 crises forced × 6 sizes × 4 = 360 (crisis).
- 720 births, 0 errors.
- The thirty reading towns `r2read-<size>-0..4` were born the same way, with the review's ten forced crises. They reproduce the review's towns: r2read-thorp-3 is "Weifengthorp", and its Economics tab matches the review's dump line for line.

**Dossiers.** All 750 were rendered through the real `OutputContainer` in jsdom (vitest, scratch config outside the repository). The walk is `dossierPhoneFloorAllViews`'s:
- every group, every sub-tab;
- every `aria-expanded` disclosure opened;
- single-valued accordions opened in turn.

It is the **owner's view**: not `readOnly`, premium, stamped with `withPublicProse(composePublicProse(town))`. This matters. A first pass rendered the shared page (`readOnly`), and that page hides every DM-only line ("The ruling three", "The hall: Free of the criminals"). I discarded it and re-rendered as the owner, which is what the review describes.

Text was captured one line per block element, `<style>` text tagged `[STYLE]`. A line repeated inside one view is kept once, so the flow-card tests that need every card read the record instead (stated where used). 750 of 750 tests passed.

**Counting.** One script (`count.mjs`, scratch) reads each birth's dump and record together.
- Every rate below is "births of the 720 where both lines print and disagree", by the test named in its row.
- Cells are **calm/crisis** per size. Totals are out of 720 (360 calm, 360 crisis).
- **Calibration against the review's readers.** I ran the same script over the thirty reading towns. It matches the readers on:
  - the food verdict (7 of 30; readers: 7)
  - "small margin" beside imports (4; readers: city-0, metropolis-0, -1, -2)
  - the power balance (13; readers: >12)
  - criminal money (8; readers: >8)
  - gaps (13; readers: >8)
  - worship without a church (8; readers: >8)
  - the stores (24; readers: ≥19)
  - defence ratings (6; readers: >6)
- Where my test is stricter than a reader, the row says so (3 and 5b).

**The two counterfactuals** (pattern 12 and pattern 21) are described in their rows.

## The rates (EXECUTED; every number from `count.mjs` over 720 dumps + records)

| # | test (short) | births | calm | crisis | thorp | hamlet | village | town | city | metro |
|---|---|---|---|---|---|---|---|---|---|---|
| 1a | "fed, but only just" + "grows (a little more/more/far more) than it eats" | 57 | 34 | 23 | 10/9 | 15/9 | 8/4 | 1/1 | 0/0 | 0/0 |
| 1b | "feeds itself with a small margin" + record import share ≥ 25% of need | 64 | 34 | 30 | 0/0 | 0/0 | 0/0 | 0/0 | 16/17 | 18/13 |
| 2 | stores months ≠ endurance months at full rations (both print in 720/720) | 569 | 302 | 267 | 29/20 | 35/21 | 58/51 | 60/56 | 60/60 | 60/59 |
| 3 | "No arcane practitioners on the rolls" + (Reliance Relied upon/Integral or Availability common/broad/pervasive) | 190 | 96 | 94 | 22/17 | 15/19 | 26/31 | 23/19 | 3/4 | 7/4 |
| 3′ | of which reliance | 74 | 41 | 33 | 0/0 | 0/0 | 17/14 | 14/11 | 3/4 | 7/4 |
| 3″ | of which availability | 139 | 67 | 72 | 22/17 | 15/19 | 15/22 | 15/14 | 0/0 | 0/0 |
| 4 | "Three powers stand almost level" + record leader − third > 10 (the line prints in 184) | 106 | 63 | 43 | 0/0 | 0/0 | 1/4 | 14/17 | 24/14 | 24/8 |
| 4′ | of which the ruler row prints "Dominant" | 29 | 24 | 5 | 0/0 | 0/0 | 0/0 | 5/1 | 10/2 | 9/2 |
| 5a | "The hall: Free of the criminals" + a DS-POW-6 "capture pressure" sentence (ADVANCING or RECOVERING) | 288 | 109 | 179 | 21/43 | 15/52 | 27/47 | 16/18 | 12/12 | 18/7 |
| 5b | "Criminal structure: Diffuse" or "books record no gang" + a criminal power printed (Power roster row or Defense "Underworld:") | 2 | 0 | 2 | 0/0 | 0/0 | 0/0 | 0/2 | 0/0 | 0/0 |
| 6 | Resources "No X reaches the Y." + X in the printed Imports chips | 296 | 150 | 146 | 0/0 | 9/5 | 21/17 | 25/29 | 44/44 | 51/51 |
| 7a | History "Origin:" names a founder of another kind than "Founded by:" | 127 | 67 | 60 | 11/9 | 6/12 | 8/8 | 13/15 | 15/8 | 14/8 |
| 7b | Overview origin says no wharf + History origin a port, harbour, naval base, maritime hub or shipwright | 27 | 16 | 11 | 2/8 | 9/1 | 5/2 | 0/0 | 0/0 | 0/0 |
| 8 | "has no church of its own" + Faith & Worship flow Running/Operational | 220 | 110 | 110 | 50/50 | 60/60 | 0/0 | 0/0 | 0/0 | 0/0 |
| 8′ | "has no church of its own" + "the religious houses … biggest buyers" pool | 111 | 56 | 55 | 29/23 | 27/32 | 0/0 | 0/0 | 0/0 | 0/0 |
| 9 | Beasts & Monsters graded Critical/Weak over a *settled-country* sentence (a beasts sentence prints in 507) | 149 | 71 | 78 | 20/23 | 20/14 | 13/23 | 18/18 | 0/0 | 0/0 |
| 10 | "hold the gates" + "Unfortified. No perimeter walls." | 17 | 11 | 6 | 0/0 | 0/0 | 0/0 | 11/6 | 0/0 | 0/0 |
| 11 | flow card "From <resource>" whose key is not among the town's nearby resources | 411 | 209 | 202 | 22/20 | 30/31 | 27/18 | 37/34 | 43/49 | 50/50 |
| 11′ | of which the town holds a substitute (`substituteActive`) | 290 | 155 | 135 | 22/20 | 26/27 | 21/13 | 33/28 | 27/26 | 26/21 |
| 11″ | of which no substitute: the resource is simply absent | 121 | 54 | 67 | 0/0 | 4/4 | 6/5 | 4/6 | 16/23 | 24/29 |
| 12 | F4 recount: "Local ore feeds the smithy", no smith/forge/metal house | 68 | 36 | 32 | 17/10 | 9/7 | 7/10 | 3/5 | 0/0 | 0/0 |
| 12 | "Local coal fires the forges", none | 51 | 25 | 26 | 9/6 | 5/9 | 6/7 | 5/2 | 0/2 | 0/0 |
| 12 | "Local quarry provides dressed stone", no quarry/mason/stone house | 80 | 49 | 31 | 10/7 | 4/3 | 11/5 | 13/4 | 9/12 | 2/0 |
| 12 | "managed felling and sawmilling", no sawmill/lumber/timber/carpenter/wood house | 67 | 30 | 37 | 6/12 | 8/9 | 9/8 | 5/6 | 2/2 | 0/0 |
| 12 | "Local ore … not trade-route dependent" + primary import "Iron ore" | 6 | 1 | 5 | 0/0 | 0/0 | 0/0 | 1/2 | 0/3 | 0/0 |
| 13 | "…more slowly and less comfortably and go on." | 172 | 76 | 96 | 22/28 | 19/24 | 14/16 | 13/20 | 7/5 | 1/3 |
| 14 | thorp/hamlet/village + "urban food supply" or "dense populations" | 59 | 32 | 27 | 12/11 | 10/5 | 10/11 | — | — | — |
| 14′ | thorp/hamlet/village + "district(s)" / "whole quarters" (header excluded) | 128 | 60 | 68 | 20/22 | 16/21 | 24/25 | — | — | — |
| 15 | Services "Healing(n)" group holds Burial / interment rows | 720 | 360 | 360 | 60/60 | 60/60 | 60/60 | 60/60 | 60/60 | 60/60 |
| 16a | "The ruling three of X" followed by fewer than three of Head/Second/Third | 331 | 175 | 156 | 57/59 | 23/28 | 10/10 | 28/16 | 27/22 | 30/21 |
| 16b | two "The Powers (n)" headings on one tab with different n | 291 | 147 | 144 | 0/0 | 0/0 | 1/2 | 29/22 | 58/60 | 59/60 |
| 17 | "Produced locally" carries a declared non-good (`NOT_A_GOOD`) or "… access" / "… services" | 680 | 341 | 339 | 46/44 | 56/60 | 60/58 | 59/58 | 60/60 | 60/59 |
| 18a | NPC card house label with a count range ("Mills (2-5) · member of …") | 360 | 180 | 180 | 0/0 | 0/0 | 0/0 | 60/60 | 60/60 | 60/60 |
| 18b | RECORD: a flow card's Via names a catalogue house with a count range (`institutionDisplayName` passes it raw) | 338 | 169 | 169 | 0/0 | 0/0 | 0/0 | 60/60 | 53/52 | 56/57 |
| 18c | RECORD, an upper bound: Via house passes the card's first-word presence test but no roster house carries its stem | 308 | 148 | 160 | 0/0 | 0/0 | 10/13 | 20/28 | 60/60 | 58/59 |
| 19 | "operating on stockpiles only (isolated trade)" | 7 | 4 | 3 | 0/0 | 1/1 | 2/1 | 1/1 | 0/0 | 0/0 |
| 20 | "under siege the outlying fields are lost" (any case), record not besieged | 689 | 353 | 336 | 58/56 | 59/56 | 57/56 | 60/56 | 60/56 | 59/56 |
| 21 | `[STYLE] @keyframes spin` in the Daily Life capture: **visible in 0** (Chromium; row 21) | 720 | 360 | 360 | all | all | all | all | all | all |
| NEW-1 | header "Vulnerable (prosperous but underdefended)" + Systems Health Defense Defensible/Well-defended/Fortress | 6 | 6 | 0 | 0/0 | 0/0 | 0/0 | 4/0 | 2/0 | 0/0 |
| NEW-1′ | header "Ordered (strong military presence)" + Defense Undefended/Lightly defended/Vulnerable | 5 | 4 | 1 | 0/0 | 3/1 | 1/0 | 0/0 | 0/0 | 0/0 |
| NEW-2 | "the people who work magic … among its biggest buyers" pool + "No arcane practitioners on the rolls" | 3 | 2 | 1 | 0/0 | 0/0 | 1/1 | 1/0 | 0/0 | 0/0 |

---

## A — one fact, two answers

### 1. The food card's verdict against the food record

**(a) What a game master sees.**
- *1a, `r2r-thorp-2`* — Economics › Food Security, both under one heading:
  - DS-ECO-9: "Indrapat is fed, but only just. A poor harvest is felt at every table; a good one means a little put by."
  - Two lines above: "Indrapat grows a little more than it eats, with some to put by against a bad year."
- *1b, `r2r-city-0`* — same section:
  - "Goraka feeds itself with a small margin. The counts come out ahead by a little, every season, without much drama."
  - The stat line: "Production: 7,471 lbs/day + 3,355 imported · Need: 10,826 lbs/day" (record import share 31%).

**(b) The two writers.**
- **Verdict:** `economyStateProse.js :: foodSecurityPoolKey`. It keys DS-ECO-9 on `economicState.foodSecurity.label` alone. The SECURE pool (`economy.generated.js`, projected from `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`) holds three "no hunger" variants that claim different things: "a small margin", "eats, nobody raises it", and "only just".
- **Record line:** `EconomicsTab.jsx :: foodSentence`. It reads `fb.surplus / dailyNeed`, the import cover and the residual.
- **Why both fit "Secure":** the label comes from `bandLadders.js :: foodSecurityBandKeyOf` on the *residual* deficit after imports (≤ 5%) and a surplus ≤ 40%. So a 0–40% surplus and a 25–45% import dependence both land in "Secure".
- **The home:** the food record, `foodSecurity.foodRecord` (`foodBalance.js :: deriveFoodRecord`), which carries `grownPct`, `normalImportPct`, `surplusPct` and `growsMoreThanEats`. The label is a coarse band of it.

**(c) The rate.** 1a: 57. 1b: 64. All sizes in the table; 1a is a small-place pattern, 1b a city/metropolis one. Tests are in the table.

**(d) The cure, TEXT-ONLY.** Split the SECURE pool by the food record into three sub-keys, read in `foodSecurityPoolKey`:
- grows more than it eats → "small margin";
- fed only with imports → a new "fed by its carts/ships" sub-pool;
- balance within ±5% → "only just".

Only DS-ECO-9 draws move, and only among SECURE towns.

**(e) The guard.** A new page-battery check (`src/domain/coherence/coherenceBattery.js :: READER_CHECKS`), `food-verdict-vs-record`. It reads the Economics surface and the record's `growsMoreThanEats` / `normalImportPct`, and sits beside the existing `food-words` check.
- Corpus arm: the rendered-dossier walk over a seed grid of six sizes, calm and crisis (this census's harness, made a test).
- The agreement guard (`generationCoherence.js`) cannot see it: the sentence is drawn at display time, not born in the record.

**(f) Files.** `src/domain/display/stateProse/economyStateProse.js`; `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` → `src/data/dossierStateProse/economy.generated.js` (re-taken by `scripts/generate-dossier-state-prose.mjs`); `coherenceBattery.js` + one findings file. **No lane in flight touches them.**

### 2. The stores' two durations

**(a) `r2r-thorp-0`.**
- Economics › Food Security: "No granary; two months in household stores."
- Defense › Threat Assessment › Disasters & Famine: "Food endurance: No granary: under siege the outlying fields are lost; with what is still harvested, household stores carry the thorp for about three months at full rations, about eleven months on half."

**(b) The two writers.**
- **Stores:** `tonightSheet.js :: foodStoresWords(record)`, the months in store.
- **Endurance:** `defenseDisplay.js :: foodEnduranceLine`, which reads `defenseFacts.js :: foodEnduranceOf` = stored ÷ (1 − `SIEGE_PRODUCTION_KEPT` × grown share).
- Both read the one number `storesMonths.js :: storesMonthsOf`. The second figure is a siege projection, printed in the indicative as a second answer to "how long do the stores last".
- **The home:** `storesMonthsOf` already holds the true figure. Neither writer is wrong about its own quantity. The page prints two quantities under one question.

**(c) The rate.** 569 of the 720 (both lines print in 720). The test parses both month phrases to numbers and counts inequality. The only births that agree are those where the stretch rounds to the same word, or where the siege line has no full-ration figure ("feeds it at full rations").

**(d) The cure, TEXT-ONLY.**
- The endurance line states the stored figure first, then the siege figure as conditional. For example: "Household stores hold two months; were the thorp besieged, with what is still harvested they would stretch to about three months at full rations…"
- This is one function, read by the Defense tab and the PDF alike.
- Cures pattern 20 in the same sentence.

**(e) The guard.** A page-battery check `stores-twice`. It reads the Economics stores words and the Defense endurance line, and red-flags any second duration that is not marked conditional. Same corpus arm as 1.

**(f) Files.** `src/domain/display/defenseDisplay.js :: foodEnduranceLine` (the PDF reads it too). **Not in flight:** the upkeep lane changes `defenseGenerator.js`, not `defenseDisplay.js`.

### 3. Magic: the Magic tab against Defense's "Arcane Support None"

**(a)**
- *`r2r-village-11`*: Magic tab "Reliance on magic: Relied upon" (also on Foundations), beside Defense › Supporting Capabilities "Arcane Support · None — No arcane practitioners on the rolls. Wards, detection and counterspell are beyond this settlement."
- *`r2r-thorp-4`*: Magic tab "Availability broad", beside the same Defense row.

**(b) The writers.** There are three:
- **Arcane Support:** `defenseDisplay.js :: deriveSupportingCapabilities`, which reads `magicReliance.js :: magicPractitioners` (houses by catalogue, people by role).
- **Reliance:** `magicReliance.js :: deriveMagicReliance`. It reads "relied upon" when `magicDependents` (active chains that need magic, or carry a `magicNote`) is non-empty, **even with no practitioner**. "Integral" needs a practitioner.
- **Availability:** `magicProfile.js` from the world magic dial (`config.magicLevel` / `priorityMagic`: high → "broad"). It never reads the roster.

**The home:** the practitioner census (`magicPractitioners`) for "is anyone here". Reliance and availability answer other questions, the town's dependence and the world's dial, but print as if they contradict the census.

**(c) The rate.** 190 (reliance 74, availability 139; union in the table).
- My test is stricter than the readers' (">15 of 30" vs my 8 of 30): I count only the strong words (relied upon/integral; common/broad/pervasive).

**(d) The cure, TEXT-ONLY.**
- Where the census is empty and dependents are not, Defense's note says where the magic comes from: "No practitioner lives here; the magic the town leans on is bought from outside."
- The Magic tab qualifies "Relied upon" with the same clause.
- Availability gets a "(the world's)" gloss, or is read beside the census.
- A MODEL alternative, that chains needing magic do not run without a practitioner, would move chain statuses, income lines and exports. It belongs to the agreement lane's `computeActiveChains.js`, so I do not recommend it now.

**(e) The guard.** The page battery's existing `magic-absent-prose` check is the sibling. It gains `arcane-none-vs-reliance` (Defense + Magic surfaces). The magic-words walker (`magicWordsFindings.js`) is the record-side twin.

**(f) Files.**
- `defenseDisplay.js :: deriveSupportingCapabilities`, the Magic tab (`MagicTab.jsx` / `dossierViewModel.js :: deriveMagicRelianceView`): not in flight.
- **`src/domain/magicProfile.js` IS in the upkeep lane** (magic made to read prosperity). Leave availability's wording until upkeep lands.

### 4. Power balance: "almost level" beside a ruler far ahead

**(a)**
- *`r2r-town-20`*: Power › The Powers roster, the third power's description: "Three powers stand almost level here, and no one leads; every council vote has to be bargained for." Above it: "Ruler · Arcane Council · Arcane · Dominant".
- *`r2r-village-57`*: the same line over powers 48 / 29 / 23.

**(b) The writer.**
- `src/generators/power/factionStanding.js` (the rank-2 branch). It tests only `gapAbove ≤ 5 && gapBelow ≤ 5`, the third power against its two neighbours, and never against the leader.
- The other answer is the record's own `powerStructure.factions[].power` and the ruler's `powerLabel`.
- **The home:** the faction powers.

**(c) The rate.** The line prints in 184. In 106 the leader is more than 10 ahead of the third. In 29 the ruler row prints "Dominant".

**(d) The cure, TEXT-ONLY.** One condition in the rank-2 branch, also requiring `factions[0].power − power ≤ 10`. The branch draws nothing, so only the faction's `standing`/`desc` string moves, in about 106 births.

**(e) The guard.** The agreement guard (`generationCoherence.js`) gains `standing_vs_powers`: the standing phrase against the record's gaps, on the generation corpus.

**(f) Files.** `src/generators/power/factionStanding.js`. **IN FLIGHT: the powers lane owns the power directory.** Sequence after it.

### 5. Crime, twice

**(a)**
- *5a, `r2r-thorp-1`*, Power tab:
  - "Who really runs this thorp" › "The hall: Free of the criminals. Nobody at the head of Elder Council answers to a criminal house…"
  - Beside it, "Crime and the hall": "Criminal money is reaching the officials of Terrapolis one at a time, because the thorp is poor and its streets are badly watched…"
  - The RECOVERING twin: "The criminals at Riparipa still own a few officials…" (`r2r-hamlet-11`).
- *5b, `r2s-succession_void-town-1`*: Defense › Criminal Architecture prints "Criminal structure: Diffuse criminal presence". The same tab prints "Underworld: Thieves' Guild · Minor", and the Power roster lists a Criminal power.
  - In `r2s-indebted-town-1`, the Diffuse line stands beside "Underworld: Corrupt Council · Significant": the ruler is the criminal power.
  - Reading town r2read-town-0 has the same shape (Thieves' Guild 22, "Fence" and "Street gang" on the roster).

**(b) The writers.**
- **5a:**
  - The hall: `patronage.js :: hallOf`, from `powerStructure.criminalCaptureState`. The one writer is `hallCapture.js :: writeHallCapture`.
  - The desk: `powerStateProse.js :: capturePoolKey`. When the state is `none`, it falls through to the legitimacy breakdown: safety < 0 and prosperity < 0 → "ADVANCING"; both > 0 → "RECOVERING". Both pools assert present corruption ("is reaching", "still own").
  - **The home:** `criminalCaptureState`.
- **5b:**
  - `defenseDisplay.js :: deriveCriminalStructure` reads institution **names** first. "fence", "bandit" or "outlaw" → `diffuse`. "Street gang" is in no ladder word.
  - It consults the power roster's criminal faction (`crimeSignal.js`) only when the name ladder found **nothing**. So a Thieves' Guild power plus a Fence reads "Diffuse… no boss".
  - **The home:** the crime signal (`crimeSignalOf`: seats + estate).

**(c) The rate.**
- 5a: 288, crisis-heavy (179), because crises push safety and prosperity negative.
- 5b: 2 by my test, which requires a *criminal power printed* beside the Diffuse line.
- The readers' ">8 of 30" is looser: they also counted a Street gang institution, and the "no gang" sentence beside gang rumours. On the thirty my test finds 1.

**(d) The cures, TEXT-ONLY.**
- 5a: `capturePoolKey` returns the pressure keys only when the stored state is `equilibrium`. At `none`, a risk-not-fact wording, or silence. This touches a display key and possibly new corpus text.
- 5b: in `deriveCriminalStructure`, the signal's criminal factions outrank the name ladder's `diffuse`. `gang` joins the semi-organized words. A display derivation, nothing born.

**(e) The guard.**
- 5a: a page-battery check `hall-vs-crime-desk` (Power surface).
- 5b: the existing `crime-denied-and-listed` check (`readerContradictionFindings.js`) gains "Diffuse beside an Underworld line or a criminal power". The defence-reader walker (`tests/lint/defenceFactReaders.walker.test.js`) should list `deriveCriminalStructure`'s name ladder as a crime reader.

**(f) Files.** `src/domain/display/stateProse/powerStateProse.js` (5a) and `defenseDisplay.js` (5b). Not in flight. 5a sits on the Power tab, but not in the seat rows or titles the powers lane owns.

### 6. Gaps against imports

**(a) `r2r-hamlet-9`.**
- Resources › Gaps & Opportunities: "No timber reaches the charcoal burner."
- Economics › Trade Profile › Imports chips: "Incense and votive candles · Salt · Mountain timber".
- Also `r2r-village-16`: "No clay reaches the potter." with "Clay" among the Imports.

**(b) The writers.**
- **Gap line:** `validationOnPage.js :: resourceGapLines` → `inputAnswered` → `recordGoods`. It reads `economicState.primaryImports` (+ localProduction, exports, native resources).
- **Imports list:** `EconomicsTab.jsx` prints `primaryImports` **plus** `resourceAnalysis.imports.critical` (the terrain-critical imports), through `tradeListDisplay.js :: displayTradeList`.
- The gap reader does not read the second list.
- **The home:** the printed composition, which lives inline in `EconomicsTab.jsx` and is not yet a named function. No home exists. It should become one.

**(c) The rate.** 296. Absent in thorps, rising with size (metropolis 51/51).

**(d) The cure, TEXT-ONLY.** Lift the printed imports composition into one function (e.g. `tradeListDisplay.js :: importsAsPrinted`) and read it in both the tab and `recordGoods`.

**(e) The guard.** A page-battery check `gap-vs-imports` (Resources + Economics surfaces). Also a unit pin that `recordGoods` and the printed list share their function.

**(f) Files.** `validationOnPage.js`, `EconomicsTab.jsx`, `tradeListDisplay.js`. Not in flight.

### 7. Two or three foundings

**(a)**
- *7a, `r2r-thorp-4`*, History › Founding:
  - "Origin: was founded by a disbanded military unit that liked the ground and stayed"
  - The next row: "Founded by: a single extended family who came and never left".
- *7b, `r2r-thorp-24`*:
  - Overview › Settlement Origin: "It was built on the shore and has never had a wharf."
  - History: "Origin: grew from a fishing village into a maritime hub".

**(b) The writers.**
- `narrativeGenerator.js` (the founding block) draws `reason` (`pick(reasonPool)`) and `foundedBy` (`pick(FOUNDERS_BY_TIER[tier])`) independently.
- The reason pools (`narrativeData.js`, by route; coastal terrain → `port`) contain founder-bearing reasons: "was founded by a disbanded military unit", "was settled by veterans", "was established by a family granted mill rights", "was founded by religious hermits", "a healer… settled here and people followed".
- The port pool asserts a harbour ("maritime hub", "natural harbour", "naval base", "trading port", "shipwright"). Meanwhile `settlementOriginProse.js` writes the no-wharf origin from the world law's port facts.
- **The home:**
  - For the founder: `foundedBy`, the field the History tab labels "Founded by".
  - For the wharf: the world law's port kind, which `settlementOriginProse.js` already reads.

**(c) The rate.**
- 7a: 127. The test is a founder-bearing reason whose founder class (military, religious, healer, merchant, family, noble, other) differs from `foundedBy`'s.
- 7b: 27, small places only.

**(d) The cure, MODEL-light.**
- 7a can be TEXT-ONLY: rewrite the founder-bearing reasons as agentless ("began where a disbanded military unit's camp had stood" → no founder named) at the same indices.
- 7b needs the reason drawn from a wharfless coastal pool when no wharf stands. One `pick` either way, so the draw count is unchanged and only `history.founding.reason` moves.
- **Re-deal risk:** none expected, if the pools keep the one-draw shape. Check: the founding block's later draws (`initialChallenge`, `overcoming`) follow on the same stream, so a pool swap must not change how many draws `pick` takes (it takes one).

**(e) The guard.** The agreement guard gains `founding_one_founder` and `origin_vs_wharf` (record-level: both strings are born). The presumed-things walker covers harbour words if `docks` atoms are declared on the port pool's lines.

**(f) Files.** `src/generators/narrativeGenerator.js`, `src/data/narrativeData.js`. Not in flight.

### 8. Worship without a church (and NEW-2, its magic twin)

**(a) `r2r-thorp-0`.**
- World › Faith: "The thorp has no church of its own; its people walk to the next village's parish church for the rites."
- Economics: "Faith carries real weight in Izamitza's money. What the religious houses take in and spend is a large part of the thorp's business."
- The flow card: "Faith & Worship · Religion & civic · ○ Operational · Via House of worship" (no "(missing)").

**(b) The writers.**
- **Faith line:** `faithReading.js :: faithLinesOf` (`accessOnly`: no church, an "Access to parish church" row).
- **Income sentence:** `economyStateProse.js :: incomeWeightPoolKey`, which keys on `compound.religionInfluence ≥ 60` with no house check. NEW-2 is the same function's magic branch, keyed on `magicInfluence ≥ 60`.
- **Flow card:** `SupplyChainsPanel.jsx :: chainFlowFacts`. Its presence test is the processing house's **first word** as a substring of any roster name. "Parish church" (shown as "House of worship") is "present" because "Access to parish church" contains "parish".
- **The home:** `faithReading`'s church list (`churches`, `accessOnly`). For magic, `magicPractitioners`.

**(c) The rate.**
- Flow: 220. Every thorp and hamlet with access-only faith: thorp 50/50, hamlet 60/60.
- Houses sentence: 111.
- NEW-2: 3.

**(d) The cure, TEXT-ONLY.**
- `incomeWeightPoolKey` requires a house (or a practitioner), else takes an access wording ("the walk to the parish church…").
- `chainFlowFacts` reads an `Access to …` row as access ("Via the next village's parish church").

**(e) The guard.**
- The page battery's existing `faith-denial` check gains "worship economy beside no church".
- A unit pin on `chainFlowFacts` against "Access to …" rows.

**(f) Files.** `economyStateProse.js`; `SupplyChainsPanel.jsx :: chainFlowFacts` (also used by `EconomicsTab.jsx` and the Compendium's `ChainRow`). Not in flight.

### 9. Defence ratings against their own text

**(a) `r2r-thorp-0`.** Defense › Threat Assessment:
- "Beasts & Monsters · Critical".
- Directly under it: "Whoever walks out of Izamitza, in any direction and at any hour, meets nothing that would justify a watch."
- The twin variant (`r2r-thorp-11`): "…keeps no organized defense against the country, and in a heartland this quiet the arrangement is a reasonable one rather than a gap."

**(b) The writers.**
- **Grade:** the readiness score (`defenseProfile`, `defenseGenerator.js`), banded by the shared ladder. It measures *readiness*, not threat.
- **Sentence:** `defenseStateProse.js :: beastsRowPoolKey`, keyed on `measuredMonsterFamily(monsterThreat)` (settled, frontier, plagued) × perimeter × force. A settled town with nothing organized reads as reassurance whatever its readiness grade.
- **The home:** two facts, threat (the config family) and readiness (the score). Neither home holds "is the arrangement reasonable".

**(c) The rate.** 149 of the 507 births where a beasts sentence prints. All are thorps to towns; cities and metropolises always have a force.

**(d) The cure, TEXT-ONLY.**
- The settled-country pools are read only at grade Adequate or better.
- At Weak/Critical in settled country, a new situation, "settled country, nothing organized, graded weak", with authored text. The grade explains itself: "nothing comes, and nothing would stop it if it did".

**(e) The guard.** The page battery's `grade-vs-food` check is the template. Add `grade-vs-beasts-text` (Defense surface).

**(f) Files.** `src/domain/display/stateProse/defenseStateProse.js`; the DS-DEF-2 corpus (`RECEIPT_POOLS_DOSSIER_STATE.md` → `defense.generated.js`). **The grades move under the upkeep lane** (its five defence gates read prosperity, in `defenseGenerator.js`). Sequence after upkeep, and re-measure.

### 10. "Town watch … hold the gates" with no walls

**(a) `r2r-town-5`.**
- Institutions and Defense › Armed Forces: "Town watch — Part-time guards who walk the night and hold the gates."
- Defense, same tab: "Unfortified. No perimeter walls. Defenders cannot control entry points…"

**(b) The writers.**
- `institutionDescDraw.js :: drawInstitutionDesc` draws from `institutionDescVariants.js`. Both Town watch variants ("…hold the gates" / "…gate duty") presume gates, and neither is declared (`needs`).
- The static `institutionVocabulary.js` row says the same.
- The walls fact: `DefenseTab.jsx` from `defenseFacts.js :: defenseFactsOf` (`hasWalls`).
- **The home:** `defenseFactsOf.hasWalls`.

**(c) The rate.** 17, towns only (11/6).

**(d) The cure, TEXT-ONLY in effect.** Declare `needs: ['gate']` on both variants, with a twin ("walk the night and keep the peace"). The draw is a hash pick (`pickVariant`), so only `institutions[].desc` strings move.

**(e) The guard.** The presumed-things walker.
- Its `walls` thing has `gate` only as a declaration *atom*, not among its *words* (`thingsNamedIn('…hold the gates.')` returns `[]`, EXECUTED). So it cannot see this line. Add `gates?` to the walls words.
- Its roots (`src/data`, `src/generators`) miss `src/domain/display/institutionVocabulary.js`. Add that root.

**(f) Files.** `src/data/institutionDescVariants.js`, `src/domain/display/institutionVocabulary.js`, `tests/lint/presumedThings.shared.mjs` (guard). Not in flight.

### 11. A flow card's source names a resource the town lacks

**(a)**
- *`r2r-hamlet-8`*: Economics › Economic Flows › "Salt & Preservation · From Salt flats". The nearby resources are deep harbour, shipbuilding timber, magical node and fishing grounds: no salt flats.
- *`r2r-thorp-31`*: "Grain & Bread · From Grain fields". The town holds a fertile floodplain, a substitute.

**(b) The writers.**
- `SupplyChainsPanel.jsx :: chainFlowFacts` prints `chain.resource`.
- `computeActiveChains.js` writes `resource` as the chain's *catalogue* raw resource even when `resourceActive: false`. It writes `substituteActive: true` when a substitute (floodplain for grain fields) carries the chain.
- **The home:** `config.nearbyResources` and the chain's own `resourceActive` / `substituteActive`. The card ignores both flags.

**(c) The rate.** 411. Test: a chain's `resourceKey` is not among `nearbyResources`, and its resource name prints as a card's "From" line.
- 290 hold a substitute: the card names the catalogue resource, not the substitute that works.
- 121 have neither: the resource is absent outright, mostly cities and metropolises.

**(d) The cure, TEXT-ONLY.** `chainFlowFacts` prints the substitute's name when `substituteActive`, and "bought in" when `resourceActive === false` with no substitute.
- The MODEL alternative is `computeActiveChains.js` writing the substitute into `resource`. It moves the record's chain field, which golden-bearing readers see, and it is the agreement lane's file.

**(e) The guard.** The agreement guard's `resource_truth` check (`generationCoherence.js`) is the record-side home, with a member "a chain's printed resource is held". Plus a unit pin on `chainFlowFacts`.

**(f) Files.** TEXT cure: `SupplyChainsPanel.jsx` (not in flight). MODEL cure: `computeActiveChains.js`, **in flight (agreement lane)**.

### 12. F4: an income line names a working the roster lacks

**(a)**
- *`r2r-thorp-1`*: Economics › Income Sources, "Iron & Metalwork — Local ore feeds the smithy directly. Metalwork income is not trade-route dependent." The roster has no smith, forge or metal house. Resources says the ore is unworked.
- *`r2r-thorp-0`*: "Stone Quarrying — Local quarry provides dressed stone…", with no quarry, mason or stone house.

**(b) The writer.**
- `economicState.js :: generateEconomicState`, the Iron & Metalwork, Timber Trade and Stone Quarrying blocks.
- The gate reads the resource or local production (`hasNearbyResource`, `localProdLower`). The description reads the resource (`liveMaterialFor`, `hasNearbyResource`). **Neither reads the roster**, except the ore-by-goods branch's `hasInstNamed('smith')`.
- **The home for "is it worked here":** the roster, and the chain that works it (`activeChains`).

**(c) The rate, recounted on my 720.**
- ore 68, coal 51, quarry 80, sawmilling 67;
- ore beside an "Iron ore" import: 6 (`r2r-town-53`, `r2s-famine-city-0`, …).

The review's figures were on 1,245 births: 129 / 104 / 355 / 154 / 22.

**The open question.** For each source, the births where it is offered, and whether a chain that works the resource runs:
- **"on own"**: a running chain (running, operational, entrepôt, vulnerable or magically sustained) of the family, whose `resourceKey` is in `nearbyResources` with `resourceActive ≠ false`;
- **"bought in"**: such a chain runs without its own resource;
- **"does not run"**: no such chain runs.

The families are matched by `resourceKey` (iron/coal/precious, forest/timber, stone/quarry) or chain id.

| source | offered | runs on own | runs bought-in | does not run | of "does not run": local production says / export list says |
|---|---|---|---|---|---|
| Iron & Metalwork | 489 | 150 | 92 | **247** | local yes·export no 63 · both 56 · neither 110 · export only 18 |
| Timber Trade | 148 | 88 | 15 | **45** | local yes·export no 31 · both 14 |
| Stone Quarrying | 127 | 73 | 0 | **54** | local yes·export no 41 · neither 10 · both 3 |

In the third case the income line most often stands on a *local production* word (stone, timber, iron, metalwork, coal) with no chain behind it. In 56 + 18 + 14 + 3 births the export list sells the good too ("Coal", "Sacred wood").

**What else would move if the source were withdrawn (EXECUTED counterfactual).**
- *Setup:* a scratch copy of `src` at 8866a0ddd, with each of the three blocks gated on the roster carrying the working (the F4 test's words). 720 re-births, diffed field by field against the baseline.
- *Withdrawn:* in **281 births** (Iron 155, Stone 88, Timber 67), and **no birth without a withdrawal moved.**
- *Moved, of the 281:*
  - **The income list itself (281):** every remaining percentage is renormalized.
  - **`economicComplexity` (6), `primaryImports` (1), `situationDesc` (1).**
  - **The prosperity label (3)**, through `prosperity.js` reading the normalized income: Poor→Struggling, Wealthy→Prosperous, Comfortable→Moderate. From it:
    - `history.founding.overcoming` re-dealt (2): the prosperity-keyed pool. **A label and a history line.**
    - `publicLegitimacy` scores and one faction's power ±1 (`r2r-village-45`).
    - **One person re-dealt**: `r2r-village-44`'s NPC goals and their relationships, 224 changed paths.
  - **`arrivalScene` (4):** `narrative/arrivalScene.js` reads the income sources as trade words for its sense line.
  - **`coherenceNotes` (1):** `narrativeGenerator.js`'s "siege contradicts trade income" note keys on a source containing "trade". "Timber Trade" was its only one.
- *The history readers proper move nothing.* `historyTemplate.js :: buildCurrentTensionTokens` and `history/historyEventStrands.js :: generateTradeNarrative2` read the income list only for "guild", "port" or "dock", which none of the three contains. No history event, no institution roster and no founding reason or founder moved.

**(d) The cure, MODEL.** Offer the line only where the roster works it, or keep it and word it as the trade it is ("ore dug and sold raw"). The first moves the families above: income in 281 births; prosperity in 3, with its cascade into one founding line, legitimacy and one person's goals. The second is TEXT-ONLY on the record string.

**(e) The guard.** The agreement guard gains `income_line_vs_roster` (record-level). The presumed-things walker would need a "smithy / forge / quarry / sawmill" thing to see the literals.

**(f) Files.** `src/generators/economy/economicState.js`. **IN FLIGHT twice:** the agreement lane and the upkeep lane both change it. Sequence after both.

### NEW-1. The governance label's defence word against the Defense verdict

**(a)**
- *`r2r-town-29`*: Overview header "Governed by … · Vulnerable (prosperous but underdefended)", beside Systems Health "Defense · Defensible".
- *`r2r-hamlet-3`*: "Ordered (strong military presence)" beside "Defense · Lightly defended".

**(b) The writers.**
- `src/generators/power/governanceNarrative.js :: deriveBaselineStability` reads `institutionFlags.militaryEffective`.
- Systems Health reads `defenseProfile.readiness.label` (`defenseGenerator.js`).
- **The home:** `defenseProfile.readiness`.

**(c) The rate.** 6 + 5.

**(d) The cure, MODEL-light.** The two defence branches read the readiness label. Only `powerStructure.stability` moves. Its readers were not measured; a lane must census them first.

**(e) The guard.** The agreement guard gains `stability_vs_readiness`.

**(f) Files.** `governanceNarrative.js`. **IN FLIGHT (power directory)**; the readiness side moves under upkeep.

---

## B — lines that read false or broken

### 13. A repeated phrase

**(a)** `r2r-thorp-0`, Magic tab: "The thorp would go on if the arcane went away, more slowly and less comfortably and go on."

**(b) The writer.** DS-DEF-9 pool `magicDependency false`, vid 3, an authored typo in `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` → `defense.generated.js`, printed on the Magic tab. There is no second writer.

**(c) The rate.** 172 (all sizes, both arms).

**(d) The cure, TEXT-ONLY.** "…would go on, more slowly and less comfortably."

**(e) The guard.** The repetition guard (`tests/domain/phraseRepetition.test.js`) gains a within-sentence repeated-clause rule, or the style walker (`tests/lint/styleLaw.walker.test.js`) gains the struck phrase at baseline 0.

**(f) Files.** The corpus doc + regenerated `defense.generated.js`. Not in flight.

### 14. Size words in small places

**(a)**
- `r2r-thorp-0`, Economics › Food Security: "Intensive plots, terraces, raised fields, and tribute redistribution support dense populations."
- `r2r-thorp-16`: "…intensive garden production structure urban food supply."
- 14′, `r2r-thorp-4`, Overview › Tensions and History: "The water came up with almost no warning and remade the lower districts…" (a thorp of a handful of people).

**(b) The writers.**
- **Foodways:** `foodGenerator.js` passes `CULTURE_PROFILES[…].foodways.map(textOf)` into `foodways.js :: composeFoodwaysLine`. `textOf` **strips the declaration**, so "dense populations"' own `needs: ['population: ≥ middling']` is never read. The "urban food supply" line (`cultureProfiles.js`, East-Asian) carries no declaration at all.
- **14′:** `historyTemplate.js :: buildCurrentTensionTokens` / `historyEventStrands.js` pick disaster locations by **route** ("the lower districts", "whole quarters"), never by tier.
- **The home:** `populationBand.js` (small / middling / large).

**(c) The rate.**
- 59 (foodways);
- 128 (district words, with the culture header line excluded; counted by regex, so read as approximate).

**(d) The cure, MODEL-light.**
- Filter the declared foodways rows by facts before the hash pick. Only `foodRecord.foodwaysLine` moves, and the food record is golden-bearing.
- The disaster tokens take a tier-scaled noun ("the low lanes" in a thorp). Only `history` strings move, unless a token choice consumes a draw: check `pick` in `generateTradeNarrative2`'s branches (its bank name draws).

**(e) The guard.** The page battery's existing `tier-noun` check (`tierNounFindings.js`) gains "urban", "dense populations", "district(s)", "quarters" for small places.

**(f) Files.** `foodGenerator.js` (**IN FLIGHT: upkeep lane**), `cultureProfiles.js`, `historyTemplate.js`, `history/historyEventStrands.js`.

### 15. Burials and rites filed under Healing

**(a)** `r2r-thorp-0`, Systems › Services: "Healing (2)" › "Burial — Interment outside the gates…".

**(b) The writer.** `serviceCategoryTables.js :: SERVICE_CATEGORY_MAP` files Burial, Bless, "Full religious coverage" and others under `healing`. **This is a recorded decision** (`healingLedger.js`'s note cites ODQ §708.5: "the whole religious block answers healing"). The heading comes from `servicesDisplay.js` (`healing: 'Healing'`).

**(c) The rate.** 720. Every town has a burial house.

**(d) The cure, TEXT-ONLY, owner-gated.** Re-deciding the domain is the owner's (standard rule 10). A display-only answer is a group heading that names what the bucket holds ("Healing & rites"), or a display sub-group for burial rows. `availableServices.healing` is untouched.

**(e) The guard.** A unit pin on the services display grouping.

**(f) Files.** `src/domain/display/servicesDisplay.js`. Not in flight. **Owner's ruling first.**

### 16. Wrong counts

**(a)**
- *16a, `r2r-thorp-1`*, Power › Who really runs this thorp: "The ruling three of Elder Council" › "Head · Tubertus Cicero, the eldest" and nothing more.
- *16b, `r2r-village-53`*, one tab, two headings: "The Powers (2)" … "The Powers (3)".

**(b) The writers.**
- 16a: `WhoRunsThisTownPanel.jsx`, a fixed title over however many seats the patronage view holds.
- 16b: `power/PowerStrata.jsx :: ThePowers` (`powers.length`, the seat contenders) and the roster section (`roster.length`, every power), with **the same title over two lists**.
- **The home:** each list's own length. Neither title is wrong about its list, but the reader cannot tell the lists apart.

**(c) The rate.** 16a: 331. 16b: 291 (towns and up).

**(d) The cure, TEXT-ONLY.**
- The title counts what it lists ("The head of …", "The two at the head of …").
- One of the two lists is retitled ("Who holds and contests the seat (n)" / "Every power (m)").

**(e) The guard.** A page-battery check `count-words-vs-members`: a number word or "(n)" in a heading against the members it lists.

**(f) Files.** `WhoRunsThisTownPanel.jsx`, `PowerStrata.jsx`. **IN FLIGHT: the powers lane owns the Power tab's seat rows and titles.**

### 17. Non-goods in "Produced locally"

**(a)**
- `r2r-thorp-4`, Economics › Trade Profile: "Produced locally · water · dates · grain · … · Religious services · Education (basic)".
- `r2r-thorp-2`: "… trade access …".

**(b) The writers.**
- `EconomicsTab.jsx` prints `eco.localProduction` raw.
- The export and import lists go through `tradeListDisplay.js :: displayTradeList`, which drops `tradeListDeclarations.js :: NOT_A_GOOD`.
- `localProduction` is filled from resource commodities ("maritime access", "trade access") and chain services.
- **The home:** `NOT_A_GOOD`. It already exists, and one list skips it.

**(c) The rate.** 680.

**(d) The cure, TEXT-ONLY.** Print `localProduction` through the same filter, with `NOT_A_GOOD` gaining the access and service words.
- Changing the record (MODEL) would move the income gates, which read `localProdLower` (pattern 12). Do not.

**(e) The guard.** A unit pin that every printed trade list passes `displayTradeList`, and a page-battery or presumed-things rule for "access" / "services" in a goods list.

**(f) Files.** `EconomicsTab.jsx`, `src/data/tradeListDeclarations.js`. Not in flight.

### 18. Catalogue names printed as if on the roster, with count ranges

**(a)**
- `r2r-town-0`, World › NPCs: "Mills (2-5) · member of Corrupt Council".
- `r2r-town-1`, a flow card: "Taverns & Social Life · Via Taverns (5-20)" and "Bowyer & fletcher · Via Craft guilds (5-15)".
- `r2r-village-4`: "News & Public Information · Via Cartographer's guild", where the roster has a cartographer's workshop.

**(b) The writers.**
- `institutionDisplayName.js :: institutionDisplayName` passes any name its table lacks raw, range and all. It is read by the flow cards and by the NPC card's house label.
- `chainFlowFacts`' first-word presence test passes a house not on the roster: "Multiple court buildings" on any "Multiple …" house; "Adventurers' charter hall" on an "Adventurers' guild".
- **The home:** the roster (`institutions[].name`) and the display-name table.

**(c) The rate.**
- 18a: 360, every town, city and metropolis.
- 18b: 338 (RECORD: a processing house whose display name keeps a range).
- 18c: 308 (RECORD, an upper bound: presence by first word with no roster house carrying the stem; "Multiple court buildings" 120, "Adventurers' charter hall" 216, "Cartographer's guild" 59).
- "Theater", "Arena" and "Courthouse" printed without "(missing)" while absent: **0**. Where they print, a roster house shares the word.

**(d) The cure, TEXT-ONLY.** `institutionDisplayName` strips a trailing count range on fallthrough. `chainFlowFacts` tests presence by the catalogue name (or its display name), not its first word.

**(e) The guard.** A unit pin on `institutionDisplayName` over every catalogue name ("no `(n-m)` survives"), plus the `chainFlowFacts` pin of pattern 8.

**(f) Files.** `institutionDisplayName.js`, `SupplyChainsPanel.jsx`. Not in flight.

### 19. A diagnostic printed as a current tension

**(a)** `r2r-hamlet-34`, Overview › Tensions (also Outlook, History): "1 institution operating on stockpiles only (isolated trade): Citizen militia."

**(b) The writer.** `economy/viability.js` (the trade-dependencies block) turns a `critical` dependency from `economicState.tradeDependencies` into an issue. The militia's dependency is `economicData.js`'s "Citizen militia → iron_deposits, iron for weapons and basic armour". The description is a count-and-list template.

**(c) The rate.** 7.

**(d) The cure, TEXT-ONLY on the record string.** A reader sentence ("The militia's iron comes by trade; cut off, its weapons are what it has"), or the issue withheld for non-material houses. Only `economicViability.issues[].description` moves. The severity is `warning`, so no verdict count moves.

**(e) The guard.** The style walker gains the template's "operating on stockpiles only" at baseline 0.

**(f) Files.** `src/generators/economy/viability.js`. Not in flight.

### 20. Siege text outside a siege

**(a)** `r2r-thorp-0`, Defense: "Food endurance: No granary: under siege the outlying fields are lost; …".

**(b) The writer.** `defenseDisplay.js :: foodEnduranceLine` prints its siege hypothesis in the indicative ("the siege has taken" only when besieged).

**(c) The rate.** 689 (every not-besieged birth with stores).

**(d) The cure, TEXT-ONLY.** The conditional of pattern 2: one sentence, one cure.

**(e) The guard.** The `stores-twice` check of pattern 2, plus the style walker's indicative-siege phrase at baseline 0.

**(f) Files.** `defenseDisplay.js`. Not in flight.

### 21. "@keyframes spin { … }" in the Daily Life capture: SETTLED, not a reader's fault

**Test (EXECUTED in Chromium).**
- I served a scratch Vite page mounting the real `OutputContainer` with the real store for `r2read-town-0` (Vysokono), in the pre-installed Chromium (`/opt/pw-browsers/chromium-1243`, headless).
- I opened World › Daily Life and read `#sf-panel-daily_life`.

**Results.**
- `panel.textContent` contains "@keyframes".
- `panel.innerText` and `document.body.innerText` do **not**.
- The `<style>` element (from `DailyLifeTab.jsx`, a second copy in `OutputContainer.jsx`) has computed `display: none`, zero client rects and a 0×0 size.

**A reader never sees it. Rate visible: 0 of 720.** In all 720 dumps the text appears only because a `textContent` capture reads style elements. No cure. The guard is the capture: the review's text walk should skip `<style>`.

### F9 (one line, EXECUTED)

The presumed-things walker **already reads template heads**.
- `scanSource` tests `isTemplateHead/Middle/Tail`.
- The review's own plant, appended to `safetyProfile.js`, is caught: `{thing: 'militia', text: 'The militia drills on the green '}`.

Read whole instead of by fragment, **6 of the 1,743 templates** in `src/data` + `src/generators` would newly name a thing:
- a thing word in a fragment under the three-word gate, or split by a placeholder;
- `npcData.js` (bank) ×1, `neighbourGenerator.js` (garrison, temple, militia) ×3, `safetyProfile.js` (garrison) ×2.

---

## The fix lanes (at most three), in an order that respects the lanes in flight

**Collision key.**
- The agreement lane changes `computeActiveChains.js`, `supplyChainData.js`, `finishedGoodsDemand.js`, `economicState.js`, `resolveResources.js`, `resourceData.js` and `generationCoherence.js`.
- The powers lane changes `assembleSettlement.js`, the density law's files, `src/generators/power/`, `castPowers.js`, `rulerKin.js`, `factionDynamics.js`, `stressPowerFaces.js`, `rulingStructure.js`, and the Power tab's seat rows and titles.
- The upkeep lane (`git diff --stat 65ce74ce6 origin/lane/coherence-upkeep-2026-11-12 -- src`) changes:
  - `factsOf.js`, `keep.js` (new), `magicProfile.js`, `holderTable.js`;
  - `defenseGenerator.js`, `economicState.js`, `foodGenerator.js`, `safetyProfile.js`;
  - `serviceAvailability.js`, `serviceRollMaterialization.js`, `servicesGenerator.js`;
  - `assembleSettlement.js`, `economyReconcilePass.js`.

### LANE 1 — ONE PAGE, ONE ANSWER (display only; touches no file in flight; may start now)

- **Patterns:** 1, 2 + 20, 3 (Defense note and Magic tab wording only, not `magicProfile.js`), 5a, 5b, 6, 8 + NEW-2, 11 (TEXT cure in `chainFlowFacts`), 13, 17, 18. 15 waits on the owner's ruling. This is about eleven units, over the standard's five-unit cap.
- **Split it in two seats by file:**
  - **1a, the Economics page:** `economyStateProse.js`, `EconomicsTab.jsx`, `SupplyChainsPanel.jsx`, `tradeListDisplay.js`, `tradeListDeclarations.js`, `validationOnPage.js`, `institutionDisplayName.js`. Patterns 1, 6, 8 / NEW-2, 11, 17, 18.
  - **1b, the Defense, Power and Magic desks:** `defenseDisplay.js`, `powerStateProse.js`, the Magic tab view, and the corpus doc → three `*.generated.js`. Patterns 2 / 20, 3, 5a, 5b, 13.
- **Expected moves:** printed strings only. Every cure here is display-side or a pool key, so no generated record byte moves and the generation goldens stay put.
  - DS draws re-deal only inside the re-keyed pools (DS-ECO-9 SECURE, DS-ECO-12 income weight, DS-POW-6 capture, DS-DEF-9's one string).
  - The dossier-text snapshots and the phone-floor per-view baselines move, with the cause stated.
- **Guards it leaves behind:**
  - The page battery (`coherenceBattery.js :: READER_CHECKS`) gains `food-verdict-vs-record`, `stores-twice`, `arcane-none-vs-reliance`, `hall-vs-crime-desk` and `gap-vs-imports`.
  - `crime-denied-and-listed` and `faith-denial` gain their siblings.
  - **A rendered-dossier corpus arm:** this census's walk made a test, owner view, a six-size × calm/crisis seed grid. Without it, no page check is exercised at scale.
  - Unit pins on `chainFlowFacts` (access rows, catalogue-name presence, substitutes), `institutionDisplayName` (no `(n-m)`), and every trade list through `displayTradeList`.
  - The repetition or style walker entry for 13.

### LANE 2 — GENERATED WORDS THAT PRESUME (record strings, MODEL-light; after the agreement and upkeep lanes land)

- **Patterns:** 7a / 7b, 9, 10, 12, 14 / 14′, 19 (+ 11's MODEL form, if the chair prefers it to Lane 1's text).
- **Files:**
  - `narrativeGenerator.js`, `narrativeData.js`, `institutionDescVariants.js`, `institutionVocabulary.js`, `viability.js`, `cultureProfiles.js`, `historyTemplate.js`, `historyEventStrands.js`, `defenseStateProse.js` and the DS-DEF-2 corpus;
  - **plus `economicState.js` and `foodGenerator.js`, both in flight,** and 9's grades, which move under upkeep.
- **Order inside the lane:** 7, 10 and 19 can go as soon as the seat is free (their files are free). 9, 12 and 14 go after upkeep and agreement land, and re-measure first.
- **Expected moves:**
  - `history.founding.reason` (≈ 154 births);
  - `institutions[].desc` for Town watch (17);
  - `foodRecord.foodwaysLine` (≈ 59);
  - history tension and event location words (≈ 128);
  - `economicViability.issues[].description` (7);
  - if 12 withdraws rather than rewords: the income list in ≈ 281 births, the prosperity label in 3, and through it one founding line, legitimacy scores and **one person's goals re-dealt** (`r2r-village-44`).
  - One cause per signed shift: 12 is its own golden-door member.
- **Guards it leaves behind:**
  - The agreement guard (`generationCoherence.js`) gains `founding_one_founder`, `origin_vs_wharf` and `income_line_vs_roster`.
  - The presumed-things walker gains `gates?` among the walls words and the `src/domain/display` root.
  - The page battery's `tier-noun` gains urban, dense and district words for small places.
  - The page battery gains `grade-vs-beasts-text`.
  - The style walker gains 19's template.

### LANE 3 — THE POWER TAB'S COUNTS AND STANDINGS (after the powers lane lands)

- **Patterns:** 4, 16a / 16b, NEW-1.
- **Files:** `factionStanding.js`, `governanceNarrative.js` (power directory), `WhoRunsThisTownPanel.jsx`, `PowerStrata.jsx` (seat rows and titles). All in the powers lane.
- **Expected moves:**
  - the third power's standing string in ≈ 106 births;
  - `powerStructure.stability` in ≈ 11 (its readers were not measured; census them first);
  - Power tab headings (display).
- **Guards it leaves behind:**
  - The agreement guard gains `standing_vs_powers` and `stability_vs_readiness`.
  - The page battery gains `count-words-vs-members`.

## What I could not find, and what I counted by reading

**Rate zero, or as good as zero.**
- **21:** visible 0. The text is never shown.
- **18's named trio** ("Theater", "Arena", "Courthouse" printed as present while absent): 0 by the record test. The class lives on through first-word presence and raw ranges (18b and 18c).
- **5b:** 2 by a test that needs a criminal power printed. The readers' count was looser.
- **F9 as stated:** not reproduced. Heads are read; 6 templates are the true remainder.

**By reading, not by running.**
- Every "(b) writer" and "home" attribution was read in the code at 8866a0ddd. Each was then confirmed on a page by the rate test that names it.
- 15's design ruling was read from `healingLedger.js`'s comment citing ODQ §708.5. I did not open the decision queue.
- The cure sketches and their expected moves are estimates, except 12's counterfactual (EXECUTED).
- 7's "one pick either way, no re-deal" and 14′'s draw question are read, not run.
- NEW-1's `stability` readers were not censused.
- 14′'s district count is a regex over prose, so read it as approximate.

**Where my numbers sit relative to the review's.**
- The review counted 400 A items and 165 B items by five readers over 30 towns.
- My counts are per birth, with one test per row, over 720.
- On the thirty, my tests agree with the readers wherever both counted the same thing (see "How I counted").
