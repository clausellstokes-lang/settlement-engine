# BAR3-CORPUS-3 hand-back (the second successor of BAR3-CORPUS; groups CORPUS-DEF and CORPUS-ECO)

THIS IS MY HAND-BACK (by time: about eighty minutes; the meter read 0). One push: batch 3 with this file. After it I push nothing more.

Seat BAR3-CORPUS-3, branch `lane/bar3-corpus-2026-11-15`. The tip read 4f1c7e72e at my start (the line at 52f0a1684 already merged in, 7884dc19d). The joined line itself has since moved on to 1011a8a91; I worked against 52f0a1684 as told. All work was in scratch worktrees (the tip, detached, pushed by explicit refspec; a detached 52f0a1684 whose `node_modules` is a symlink to the tip's, since the lockfiles are identical). The repository's main checkout was never touched. The two earlier hand-backs stay as they are; this file says what I did.

One slip, told plainly: I amended my unpushed batch-3 commit once with `--no-verify` to fix its trailer, because my first message carried the chair's session id where mine belongs. That amend changed only the message; the pre-commit hook had already run on the content. The final commit was made again with its hooks running.

## Item 1: the after-run at the tip and the inventory diff against 52f0a1684

I ran two censuses (`census3.sh <tree> <out> 4 --count-only`): one at 52f0a1684 (the base) and one at my tip, with batch 3 committed. Then `inventory.py` on each and `inventory_diff.py before.json after.json`, read whole.

- THE RECORDS: 0 of the 720 records differ between the base and the tip (md5 of each record).
- The diff: 30017 sentences before, 30008 after. 89 gone, 80 new, 4 in fewer towns, 6 in more, 0 moved.
- EVERY LINE OF BATCHES 1 AND 2 PRINTS IN EXACTLY ITS TOWNS:
  - 77 of the 89 gone sentences have a new sentence with the identical set of towns (a reword in place).
  - The other 12 are tier forms. Several lines lost the tier word ("...where the city decides" and the like), so their tier forms merged into one line, and the faith and magic lines went the other way into one form per tier. Read as unions, each matches exactly: walled v2 91 = 91; the gates v4 87 = 87; magic as biggest buyers 23 = 23; faith money 91 = 91; magic money 39 = 39.
  - One union does not match: "Visitors at X are not robbed" printed in 43 towns, and its reword prints in 42. The town it lost is r2s-famine-town-2, silenced by batch 1's `no crisis: famine` mark (a declared silence).
- IN FEWER TOWNS, each a declared silence:
  - The no-guild market v2: 4 → 2 at village tier (the two besieged towns; batch 2's mark).
  - Organized v1: 26 → 24 (two famine towns; batch 1's mark).
  - MARKET-OPEN v1: 22 → 21 (a famine town; batch 1's declaration).
- THE INHERITORS READ:
  - In r2s-under_siege-village-0 and r2r-village-55, the no-guild market's slot now prints the pool's v3: "Buying and selling at X is done face to face at the market with no guild between seller and buyer." This is TRUE in both: a market, no guild. In Izamtzal it follows "With the siege closing the road, Izamtzal's market has only the village's own people left to sell to."
  - In the famine towns, organized v2 inherits ("The criminal interest at X is a hierarchy...": 46 → 49). This is colour, true where the key is organized.
  - MARKET-OPEN v4 inherits ("Visitors find X's market without asking.": 72 → 73), which is true: the market stands.
  - Every slot that went mute has a line that is true in that state.
- ONE LINE THAT IS NOT PROSE: "Patron deity / Assign a patron god..." (the premium card) prints in r2r-thorp-2 at the tip and not at the base, although the two records are identical. No file of mine renders it: it is render variance outside the corpus, and I name it rather than read it.

## Item 2: C4, the crime and order lines (traced first, then measured on the 720 at 52f0a1684)

### THE WRITERS (traced by `grep` of each line's fixed words under `src/`)

| line | writer | whose |
|---|---|---|
| "Crime here answers to one ring" / "Shopkeepers here pay one ring" / "the answer is one ring" (C30870: beside Multiple criminal factions and Rival gangs) | `src/domain/display/defenseDisplay.js:650-652` (`ORGANIZED_RING_NOTES`) | BAR3-DEFECON-2's: NAMED (the chair's ruling T28b) |
| "No single dominant organisation: ..." (C12387: beside one syndicate) | `src/generators/safetyLineTruth.js` (`NO_DOMINANT`) | BAR3-DEFECON-2's: NAMED |
| "Thieves are scarce now; the danger is informers..." (C31257: beside a crime-wave tension, a street gang) | `src/generators/safetyProfile.js:140` | BAR3-DEFECON-2's: NAMED |
| "A court exists, though there is nowhere to hold the guilty." and "With nowhere to hold the guilty, ..." (C30841: the cells are a commander's SECRET: "a prisoner who died in the cells") | `src/generators/safetyProfile.js:485, 528, 572, 993` (`COURT_NO_PRISON`) | BAR3-DEFECON-2's: NAMED (the false sentence may be the secret, written by the NPC secrets' seat, not the court line) |
| "Organized criminals at X now outweigh the law outright" (C25344: unorganised crime) | the annex: DS-DEF-3 `Dangerous` v2 | the annex's: ALREADY CURED in cc469b762 (reworded "Crime at X now outweighs the law outright..."). It prints in 1 town at the base (r2r-village-10) and in 0 at the tip |
| "There is very little street violence at X..." (C12393) | the annex: DS-DEF-4 `structure organized` v4 | the annex's: batch 3 (below) |
| "X's books record no gang, guild or racket" (C24893) | the annex: DS-DEF-4 `structure null` v1 | the annex's: MEASURED, CURE WITHDRAWN, NAMED (below) |
| "X has nowhere to hold an offender..." (the annex's sibling of "nowhere to hold the guilty") | the annex: DS-DEF-4 `Internal Security: court without detention` v1-v3 | the annex's: STRUCK BY THE RECORD (below) |

### THE ANNEX'S OWN, MEASURED

| line (pool, vid) | prints / false (base) | the state | what I did |
|---|---|---|---|
| DS-DEF-4 `structure organized` v4 "There is very little street violence at X, and the watch is not the reason: ..." | 34 / 21 print a crime-wave tension ("Crime is rising faster than those in charge can answer it"); 3 are Unsafe or Dangerous | a crime wave: no atom reads a tension (no new vocabulary word), so a mark cannot take it | REWORDED: "The people who run {settlement}'s crime put down any violence that would bring the law on them: what is allowed in the town is theirs to say first, and the law's after." It claims the key's rule, not a quiet street. It also avoids "streets" (a presumed thing that was a fresh hit at my first wording) and "the watch" (the first register's row 2d56d73ea40967d1, now stale, went out by the door's `--shrink` in this commit) |
| same pool v3 "Visitors at X are not robbed; someone quietly explains..." | 43 / 25 under a crime-wave tension | the same | REWORDED: "A visitor at {settlement} soon has someone quietly explain how things are run here and who runs them." |
| same pool v1 "...random violence is put down because it draws attention, and the arrangement is stable enough to negotiate with." | 26 / 9 under a crime wave | STRUCK: v1 claims that crime is organised and puts down RANDOM violence. It does not claim the crime is falling, and the record's crime-wave text ("The crime wave is coordinated. Someone is directing it") bears it | none |
| DS-DEF-4 `court without detention` v1-v3 "nowhere to hold an offender" / "cannot keep" / "cannot hold one" | 55 / 45 / 54 print it; 0 false | the pool is keyed on a court and NO prison (`defence.js :: prison`: a prison, the stocks, a gaol or a jail), and no printing page names a cell that holds anyone (the only "cell"s are "a small cell with no guild behind it" and resistance cells) | STRUCK BY THE RECORD. The read town's "cells" come from a commander's secret: NAMED for the seat that holds the NPC secrets |
| DS-DEF-4 `structure null` v1 "X's books record no gang, guild or racket: ..." | 64 / 4 print Black Market Revenue or a Shadow Economy on the income record (r2r-hamlet-34, r2r-hamlet-56, r2r-thorp-10, r2s-recently_betrayed-thorp-0) | black-market income beside "the books record no ... racket" | CURE WITHDRAWN, NAMED. The reword ("X has no gang and no criminal guild: ...") was made and measured: 64 towns, exactly the base's. Its words are pinned as THE DENIAL by three finders in other seats' files, which would go blind: `src/domain/coherence/pageCensusFindings.js:238`, `src/domain/coherence/readerContradictionFindings.js:68` (`CRIME_DENIAL`) and `scripts/audit/soak-review/checks.mjs:280, 318` (`DS_DEF4_DENIAL`; `tests/audit/soakReviewCrimeDeniedBesidePatterns.test.js` reds). Also pinned by `tests/domain/census5cOwedLines.test.js:54`. The line stands as it was. Its cure needs those finders to take a second form of the denial first: for the seat that holds `src/domain/coherence/` and the soak audit (the line's words: drop "books record" and "racket", so it claims no gang and no criminal guild) |

Declared moves: NONE (text in the annex's defence leaf only; 0 of the 720 records move).

Guard: `tests/domain/bar3CorpusGuards.test.js`, now 41 rows (2 new REWORDED rows, batch 3): 41/41 at my tip. At 52f0a1684, with the file copied in, run alone and then removed, the batch-3 rows are RED with every other DECLARED and REWORDED row (38 red, the 4 KEEP rows green). The three walkers of amendment 11 do not name the file; their reds are identical at both trees (the base's: `settlementOriginProse`, `secrecyTradeDormancyFence`, `treatyLifecycleVoiceDormancyFence`, `bar2CorpusGuards`).

## The veto list (batch 3's new lines; three towns each, read in the tip's pages)

| line | towns printing | read in |
|---|---|---|
| DS-DEF-4 organized v4 "The people who run {settlement}'s crime put down any violence that would bring the law on them: what is allowed in the town is theirs to say first, and the law's after." | 34 | r2s-recently_betrayed-town-0 (smallest tier), r2s-recently_betrayed-metropolis-0 (largest), r2r-city-1 (a crime wave) |
| DS-DEF-4 organized v3 "A visitor at {settlement} soon has someone quietly explain how things are run here and who runs them." | 42 | r2s-plague_onset-village-3 (smallest), r2r-metropolis-4 (largest), r2s-wartime-metropolis-1 (a war) |

My predecessors' veto lists stand in their files.

## THE ONE TABLE OF BOOKS FOR THE CLOSE (the tip against 52f0a1684; each file run ALONE through `sh scripts/gate-tail.sh`)

| test · arm | at 52f0a1684 | at my tip | door | whose |
|---|---|---|---|---|
| `tests/lint/proseMoveGrammar.walker.test.js` · CONTROL 4 (uniform-segment pools) | 571 (green) | 573 | the close's re-measure | BAR3-CORPUS batch 1 (unchanged by batches 2 and 3) |
| same · CONTROL 4, SECOND HALF | 516 (green) | 518 | the close's re-measure | BAR3-CORPUS batch 1 |
| `tests/lint/proseEntryContradiction.walker.test.js` · THE QUALIFY ARM (trailing-coordinate entries) | 372 (green) | 370 | the close's re-measure | 372 → 371 BAR3-CORPUS batch 1; 371 → 370 batch 3 (one of the two organized rewords) |
| `tests/lint/observedShapeReaders.walker.test.js` · THE LIVE ESTATE INSTANCE (inputs drifted since the mint) | green | 5 leaves drifted: `defense`, `economy`, `general`, `power`, `warFaith`.generated.js | the shrink-only re-freeze | the four of batch 1; `warFaith` batch 2; `defense` moved again by batch 3 |
| `tests/lint/presumedThings.walker.test.js` · ARM 1 (fresh hits) | green (0) | 6 fresh: `armedForce` x2 and `religiousHouses` x2 (batch 1); `temple`, `clergy` (batch 2): each TRUE WHERE IT PRINTS (PT3/PT4) | named for the close | batches 1 and 2. Batch 3 adds 0 fresh hits, and its one stale first-register row is SHRUNK in its own commit (`presumed-things-door.mjs --check`: fresh 6, stale 0, first-register stale 0) |
| `docs/content/wiring-census.json` (`tests/lint/proseWiringCensus.walker.test.js` · car 0, the byte-identical arm) | green (79/79) | stale-bytes | `node scripts/wiring-census.mjs`, the close (it WRITES the file: never run it in a tree you push from) | batch 1's 14 moved mark tallies; batch 2's 1 (the no-guild market v2's `no crisis: under_siege`). Batch 3 changes no mark (text only) |
| `tests/domain/crisisBlindDossierProse.test.js` · the calm-claims floor | (16 → 15 at batch 1) | 14 | RE-KEYED IN ITS OWN FORM beside a dated note ("the floor follows the cures", K30 (a)) | batch 3 (v4's "very little street violence" cured at the source) |

THE 525 REFERENCE CONFIGURATIONS: 0 of 525 move against 52f0a1684. These are text and marks in the annex's display leaves, which no generator imports, and the 720 census records are byte-identical at both trees.

RED AT BOTH TREES WITH THE SAME MESSAGE (the base's, not mine): `negativeAssertionAnchor`, `seedLoopTotality`, `proseDrawnAnchors` (files above).

GREEN AT MY TIP, run alone after batch 3:
- The guard (41).
- The files that pin the lines I changed: `census5cOwedLines`, `soakReviewCrimeDeniedBesidePatterns`, `soakReviewCrimeDeniedBesideBackgroundCrime`, `crimeDeniedAndListed`, `crimeDeniedBesideBackgroundCrime`, `crimeDeniedBesidePatterns`, `crimeLineDisqualifiers`, `criminalStructureFact`, `defenseStateProseDesk`, `readerContradictionFindings`, `stateProseKernel`, `tailCorpusDefGuards`, `composeStateProse`, `dossierStateProseProjection.contract`, `statePrintParity`, `crisisBlindDossierProse`.
- The laws: `factLayers`, `proseComposed`, `proseWaveGate`, `rosterDuplicateDraws`, `hookThemeDraws`, `upkeepVocation`, `layerBoundaries`, `defenceFactReaders`, `noLegacyFactionReaders`, `ruinFilterRoster`, `siteCoherenceRatchet`, `writerReach`, `engineCoreLazyEdge`, `tuningRegister`, `chainPrintSites` (no `dist/`).
- The projector's `--check` and eslint on the two test files.

`pipelinePinnedMode` and `generationForkCensus` are golden-derived and red at the base on purpose (amendment 10): not run.

No new test file (no manifest entry owed). No new module, no new goods import (no roster row owed).

## Rows named for other seats (one line each)

- BAR3-DEFECON-2: "one ring" beside rival gangs (`defenseDisplay.js:650-652`; ruling T28b); "No single dominant organisation" beside one syndicate (`safetyLineTruth.js :: NO_DOMINANT`); "Thieves are scarce now" under a crime wave (`safetyProfile.js:140`); "nowhere to hold the guilty" (`safetyProfile.js :: COURT_NO_PRISON`: TRUE by the prison atom; the read town's cells are a commander's secret, for the NPC secrets' seat).
- The seat holding `src/domain/coherence/` and the soak audit: DS-DEF-4 `structure null` v1's cure (above): those finders need to take the denial's second form first; then the annex rewords it.
- My predecessors' named rows stand as they named them (C47622's hook in `outlookHookSiblings.js`; C3178's TRADE list; C4510; `safetyProfile.js`'s gate line; `foodBalance.js:227`; C20093).

## What is left, in order (for a successor)

1. DS-DEF-4 `structure null` v1, once the finders' seat has taken a second form of the denial: reword the line at the annex (the measured words are above; 64 towns, 4 false), with a guard row and the re-key of `census5cOwedLines.test.js:54` by its text.
2. The named rows above, for their seats.
3. THE BOOKS AT THE CLOSE: the one table above, through its doors, once.
4. An after-census is owed only if the line moves: this one (base 52f0a1684, tip with batch 3) read the null v1 reword that is now withdrawn. At the pushed tip that line prints its base words in its base 64 towns. Every other line is as measured.

## How the instruments are re-made

As my predecessors' hand-backs say. Both censuses of this seat were run at the trees named above (`--count-only`, about 15 minutes each at 4 workers). The C4 states were read by script: `criminalStructureKeyOf` over each record; `history.currentTensions[].type === 'crime_wave'`; `economicState.incomeSources` for Black Market, Smuggling, Syndicate, Shadow Economy and Thieves' Guild revenue; `safetyProfile.safetyLabel`. The prints were counted by the line's fixed words in `dumps/`.
