# BAR3-LABELS hand-back (2026-11-15)

Seat BAR3-LABELS, groups DISPLAY-CIVIC, DISPLAY-ECON, DEFECON. Base: the joined line at 59185b62a (read back from
origin: 59185b62a5c4). Branch `lane/bar3-labels-2026-11-15`. Worked in a scratch worktree (detached at the base, pushed by
explicit refspec), with a second detached tree at 59185b62a for the books.

## The rulings I worked to
- BRIEF-BAR2 (the method) with BRIEF-BAR3's amendments 1 to 9, and my section's directions L1 to L5, each measured first.
- LB1 (the last round's ruling): the magic words read one home, `domain/display/magicProvisionShown.js`; a role row
  prints "absent" only where the record holds nothing of the role. I read its converse as L1 asks ("make the word say
  what the record holds"): where the record holds nothing of the military or the medical role, the row says "absent".
- X8's form (`rulingAuthorityShown.js`): a Foundations row is capped in its own scale, no new word.

## Batch 1: the magic words and the Foundations labels (L1, L2), display only

Measured on the census's 720 at 59185b62a by script over `corpus.ndjson.gz`, with the tree's own functions:

| row(s) | the state that makes the line false | towns false at base (measure) | cure |
|---|---|---|---|
| C36557 C37313 "Military role: occasional" | no house of magic among the defences and no defence tradition (`magicRoleHeld('military')` false); the band came from the world's dial alone | 359 (occasional 354, common 5) | `magicRoleBandShown`: "Military role: absent" |
| C13260 C27624 "Medical role: common" | no healing chain that needs magic and no healing note printed (`magicRoleHeld('medical')` false); "common" came from a healing house of any kind | 441 (common 179, occasional 226, integral 36) | `magicRoleBandShown`: "Medical role: absent" |
| C18609 C36799 C4414 "Reliance on magic: Integral" | below the top band, the only thing held up by magic is the town's own magic trade (spellcasting, enchanting, alchemy, all counted as separate dependents) | 38 (beyond the 12 LB1 already lowered) | `relianceDepth`: the magic trade counts once; "Relied upon" |
| C12975 C53812 "Healing capacity: Adequate" | the defence's Medical Readiness reads None ("No healer is kept here") | 55 | `foundationBandShown`: at most "Strained" |
| C15810 C21298 "Law & order: Surplus" (and Adequate) | the crime-wave tension stands ("Crime is rising faster than those in charge can answer it") | 121 (surplus 44, adequate 77) | at most "Strained" |
| (same rows) "Criminal opportunity: Contained" | the crime-wave tension | 34 | at most "Elevated" (the ladder's word for strained) |
| C39624 "Labor capacity: Adequate" | a crisis whose own summary says conscription has taken the working hands | 3 (the readers' town among the 150 read towns) | at most "Strained" |

The readers' towns, born alone at the base (150 seeds of `seeds.bar3.txt` and `seeds.wide.txt`): every row above is
cured in the town it was read in (hamlet-calm-rand-7, -10; town-calm-rand-7; village-famine-rand-7, -8;
metropolis-calm-rand-6, -7, -8; city-wartime-rand-14, -15; city-under_siege+famine-rand-12).

Files: `src/domain/display/magicProvisionShown.js` (`relianceDepth`, `magicRoleBandShown`),
`src/domain/display/foundationBandShown.js` (new leaf: `crimeWaveStands`, `conscriptionTookHands`, `noHealingKept`,
`foundationBandShown`), `src/components/new/tabs/MagicTab.jsx` (every role row reads `magicRoleBandShown`),
`src/components/new/tabs/SubstrateTab.jsx` (the four rows read `foundationBandShown`). The record is not touched.
Guard: `tests/components/bar3LabelWords.test.jsx`: 19 NOT pairs (each red at 59185b62a; shown by running the file in
the base tree), 6 KEEP pairs (green).

## Rows struck (true by the record)
- C9827 "↳1 member" (city-wartime-rand-7): the Trade Compact holds five members on the record and its row prints five;
  the "1 member" row is The Order of the Watch's, which holds one (the packet's order put it under the wrong name).
  Over the 720 every power's count equals its memberships (497 of 497 rows).
- C10849 C30321 "Relied upon" (city-wartime-rand-8, town-occupied-rand-7): the one dependent is the running chain
  "Divine & Magical Healing", a chain the generator's own gate says needs magic: the town relies on it.
- C47462 C48087 C47726 "Lord Marshal" for a woman: an office's title is the office's (`data/officeTitles.js`;
  `data/holderTitleForms.js`'s header; the owner's pin M-1b).

## Rows named for other seats
- C35020 "Dairyman" for a woman: `src/data/faceHonorifics.js` ("the dairy farmer": ["Dairyman", …]) has no holder-sex
  form: BAR3-PEOPLE (the honorific pool wants the holder's form, as `holderTitleForms.js` gives the face's).
- C7806 C7914 "Flaw: corrupt" beside "Temperament: incorruptible / honest": the card prints two record fields drawn
  apart: BAR3-PEOPLE (the personality draw).
- C6485 "profits: no power gains" beside the crisis text's thriving families: `src/domain/crisis/crisisCast.js`
  (`noGains`): BAR3-PLACES (CRISIS).

## Every new or changed line (the veto list)
- "Military role: absent" where the record holds nothing of the military role: r2r-thorp-0 (thorp),
  r2r-metropolis-40 (metropolis), r2s-under_siege-thorp-1 (a siege).
- "Medical role: absent" where it holds nothing of the medical role: r2r-thorp-4 (thorp), r2r-metropolis-1
  (metropolis), r2s-under_siege-town-0 (a siege).
- "Reliance on magic: Relied upon" for "Integral" (one magic trade): r2r-city-11 (city: the smallest size it reaches),
  r2r-metropolis-3 (metropolis), r2s-wartime-city-2 (a war).
- "Healing capacity: Strained" for "Adequate": r2r-thorp-4 (thorp), r2r-hamlet-1 (hamlet), r2s-under_siege-hamlet-0
  (a siege).
- "Law & order: Strained" for "Surplus"/"Adequate": r2r-town-15 (town), r2r-metropolis-1 (metropolis),
  r2s-occupied-city-1 (an occupation).
- "Criminal opportunity: Elevated" for "Contained": r2r-thorp-1 (thorp), r2r-metropolis-1 (metropolis), r2r-city-2.
- "Labor capacity: Strained" for "Adequate": r2s-wartime-city-0 (city), r2r-metropolis-4 (metropolis),
  r2s-wartime-metropolis-1 (a war).

## The inventory diff (batch 1)
Two census runs of the 720 (base 59185b62a; my tree), `inventory_diff.py` read whole: gone 0, new 0, moved 0; in fewer
towns 12, in more towns 8, each EXACTLY its measure before:

| sentence | before -> after | measure |
|---|---|---|
| Military role: occasional | 524 -> 170 | 354 |
| Military role: common | 11 -> 6 | 5 |
| Medical role: occasional | 238 -> 12 | 226 |
| Medical role: common | 243 -> 64 | 179 |
| Medical role: integral | 55 -> 19 | 36 |
| Reliance on magic: Integral (and the Overview's badge "Integral") | 181 -> 143 | 38 |
| Healing capacity Adequate | 373 -> 318 | 55 |
| Law & order Adequate / Surplus | 168 -> 91 / 88 -> 44 | 77 / 44 |
| Criminal opportunity Contained | 195 -> 161 | 34 |
| Labor capacity Adequate | 397 -> 394 | 3 |

No other sentence prints in fewer towns. THE INHERITORS, all eight, are the capped words themselves (Medical role:
absent +441, Military role: absent +359, Law & order Strained +121, Healing capacity Strained +55, Relied upon +38 (both
homes), Criminal opportunity Elevated +34, Labor capacity Strained +3): each read where it prints by the same measure
(the record holds nothing of the role; the crime wave; Medical Readiness None; the one magic trade; conscription).
Worklist rows: 11 fewer; C36799 ("Reliance on magic", the label) unchanged by design: its word is the "Integral" row.

## THE BOOKS
Run ALONE at my tip, each through `sh scripts/gate-tail.sh` (`runall.sh`): the 32 test files that pin a symbol I
changed (`relianceReadingShown`, `magicRoleBandShown`, `economicRoleBandShown`, `relianceDepth`, `foundationBandShown`,
`magicDependentsShown`, `deriveMagicRelianceView`, `MagicTab`, `SubstrateTab`) and the twenty law suites of BRIEF-BAR2
F2 and amendment 2 (52 files). RED AT MY TIP, each run alone at 59185b62a too, the same arms red there: THE BASE'S:
- `tests/architecture/engineCoreLazyEdge.test.js`: `src/domain/facts/ironAtHand.js -> src/domain/facts/crisisKind.js`
  (BAR3-PLACES's file; the chair's line at 52f0a1684 excises it).
- `tests/generators/generationForkCensus.test.js` A1 and `tests/generators/pipelinePinnedMode.test.js` A1 A2 A5: the
  golden-derived files, red at the base on purpose.
- `tests/lint/presumedThings.walker.test.js` (the fresh 3 and stale 3 of `src/data/powerSiblings.js`,
  `power/claimStanding.js`, `power/rulingStructure.js`), `tests/lint/proseWiringCensus.walker.test.js` (the committed
  register stale at the base) and `tests/lint/writerReach.walker.test.js` (`narrative on factionRelationships`,
  `importPct on foodSecurity`, 1406 against 1407): the registers the chair's line at 52f0a1684 re-takes.
Everything else green at 59185b62a.

AFTER THE CHAIR'S MERGE (my tip 4decc3acc, then 5e9c02c55; my second tree moved to 52f0a1684): the twenty laws re-run
ALONE at my tip. Green: `engineCoreLazyEdge` (cured by the line), `presumedThings`, `writerReach` and the other
fourteen. Red at my tip: `generationForkCensus` and `pipelinePinnedMode`, also red at 52f0a1684 with the same arms
(the base's: golden-derived, red on purpose); and `tests/lint/proseWiringCensus.walker.test.js`, GREEN AT 52f0a1684:
a STORED FIGURE MY DECLARED CURE MOVES (below).

THE BOOKS MY CURES MOVE (named, NOT re-taken):

| test | arm | old -> new | door | batch |
|---|---|---|---|---|
| `tests/lint/proseWiringCensus.walker.test.js` | "the committed census is byte-identical to a fresh build, and the stamp is live"; "THE DRY READ" | the register's STAMP only: `node scripts/wiring-census.mjs --dry` reads "sections that would move: stamp · stamped shas that would move: (none) · ROWS that would move: 0 · bytes delta 0" | `node scripts/wiring-census.mjs` (its own writer) | 1 |

No other stored figure moved. No stored figure moved (display only); the presumed-things
door's `--check` reads the same rows at both trees (fresh 3, stale 3, none in my files); the grid: 0 falls at both.
Goods roster: no new import of a goods module in any file I touched (no roster row owed).
The chair's four laws of the test corpus (19:50 UTC), for my guard `tests/components/bar3LabelWords.test.jsx`:
`negativeAssertionAnchor` flagged its two negatives (lines 110, 131): cured in my test, each now
`expectAbsentWithAnchor(rows, not, instead)` (the row that prints instead is the anchor, on the same path);
`seedLoopTotality` and `proseDrawnAnchors` name no line of mine (the guard collects through `collectSeedFailures` and
anchors no state-prose sentence). The three walkers' remaining reds name only the last round's `bar2*` files (the
chair's sweep). Manifest entry owed: none (no new test file under `tests/generators`).
A FILE I DID NOT TOUCH: the repository's main checkout shows `src/domain/facts/crisisKind.js` emptied (225 lines
deleted, uncommitted, mtime 19:42:38 UTC, while my law runs were in flight in the scratch trees). Not restored, not
committed: told to the chair at once. THE CAUSE WAS MINE: an unquoted heredoc in my hand-back write ran its backtick
span `src/domain/facts/ironAtHand.js -> src/domain/facts/crisisKind.js`, whose `>` truncated the file by a relative path
after the harness had reset the shell to the main checkout. The chair's word was to restore it there; MY OWN PERMISSION
CHECK REFUSED the restore (`git checkout --` of that file), and the refusal stands: the file is still emptied in this
container's main checkout ONLY; no branch holds it (the chair read my pushed tip: whole). Evidence:
`git status --short` and `git diff --stat` of the main checkout, saved in my scratchpad (`main-evidence.txt`).
From then on: absolute paths and quoted heredocs only.

## THE 525
0 of the 525 move: no file under `src/generators/`, `src/data/` or any record writer changed (display only); and the
census's 720 records are byte-identical at base and tip (sha256 of the decompressed corpus, fdf0bb5d…).

## Instruments (scratchpad; each is a few lines)
- The census: `census3.sh <tree> <out> 4` from `lane/census-3-2026-11-14`'s probes, git-archived out; `inventory.py`
  and `inventory_diff.py` from the chair's READ-ALL probes.
- The measures: `m/l1.mjs`, `m/l2.mjs`, `m/l2b.mjs` (the states over the corpus), `m/after.mjs` (each cure's moves,
  seed by seed, with the tree's own leaves; `TREE=<tree> CORPUS=<corpus.ndjson.gz> node m/after.mjs`), `m/keep.mjs`
  (the KEEP seeds).
- The readers' towns: `births.mjs` with `SEEDS=` the two seeds files, sorted and unique (150 seeds).
- The books: `runall.sh <tree> <label> <list>`: each file alone through `scripts/gate-tail.sh`; `out/<label>/RESULTS`.

## What is left, IN ORDER
0. L1b (the chair's direction of 19:58 UTC, measured, NOT cured: no time for its after-census). MEASURE: the Magic tab
   does NOT name what relies on magic. Beside the word it prints only the supplier ("Reliance on magic: Relied upon ·
   supplied by House of worship", `MagicTab.jsx` `magic-reliance-source`) and, under the roles, the dependence block's
   unnamed sentence ("Some at … do work that nobody else there can do, and the village has come to lean on it…",
   mount `viability.magicDependency`). That holds in all 315 of the 720 towns where the word is above the lowest (at my
   tip; e.g. r2r-village-12, whose one dependent is the running chain "Divine & Magical Healing", printed only on the
   Economics tab). THE CURE TO MAKE: in `MagicTab.jsx`'s reliance row, after the word, a short phrase naming the
   dependents from the one leaf that counts them (`magicProvisionShown.js :: magicDependentsShown`: chain ids, then
   "Food supply"). Each chain's name must be printed through its leaf, not `chain.label` (`chainPrintSites` law). The
   food supply must be named as the food row names it. Then: one guard, one census before and after, and the new
   words on the veto list with three towns.
1. L3, the resource and chain labels (DISPLAY-ECON, DEFECON): "✓ Fully exploited Livestock" (C7595 C7371, 95 towns)
   where the card's `dependsOn` ("grazing land") names a ground the record does not hold: the reader is
   `domain/display/validationOnPage.js :: exploitationCardShown` (P1's form): measure the cards whose `dependsOn` ground
   is not among `resourceAnalysis.resourceConditions` (the names are display words, not keys: map them first). Then
   "Complete production chain in place" over a vulnerable chain (C7614, `resourceGenerator.js :: buildViabilityReport`,
   59), "Grain export"/"Surplus food" under a famine or no surplus (C7514 C18969 C7264, 10), Harbour "Running" under a
   siege with its houses stopped (C12020, 24), a depleted commodity listed or exported (C32888 C32884 C30646, and L5's
   second header flag: dates), "Needed, and not brought in: copper ore" (C3184, 11).
2. L1's last word: "Religious acceptance: hostile" beside a church that supplies the magic (C36552 153, C31315 11):
   `magicProfile.js :: deriveReligiousAcceptance` (not my file) against `facts/magicSource.js`'s supply: needs the
   chair's word on which line is false (the acceptance, or the supply line); measure first.
3. L2's rest: "Trade connectivity: Collapsed" in a war that is not a siege (C6511, 2 towns: `SubstrateTab.jsx`, the
   siege word's form); the DEFECON crime lines under a crime wave ("Crime exists but is well-managed" C17459 33; "It is
   noticed, and so far it does little harm" C22802 136; "Thieves are scarce now" C31257 28: `safetyProfile.js`, a
   generator: a declared move, its field diff on the 720), "Everyone comes in by the gates" (C20212 C26238 20), the
   wide read's DEFECON rows (foodBalance C20434 C10009 C19458; safetyLineTruth C12387; safetyProfile C30841 C55188
   C55187; defenseDisplay C30870).
4. L5's first header flag: the defence record's hired forces read none beside a Hired blades house whose captain sits
   on the War Council (wide-04): settle whether the record or the digest holds it.
5. The chair's merge of the joined line at 52f0a1684 (19:25 UTC): pushed after batch 1 (see the tip in my line to the
   chair); the books' second tree is 52f0a1684 from then.
