# The join of the round BAR6: the order, the three collisions and their resolutions

The chair rehearsed this join on a scratch tree from the joined line `lane/join-2026-11-14` at 6c117344f (the whole of
BAR5, the five audit branches and the close of BAR4), on 2026-11-17 between 01:06 and 01:21 UTC: TEN branches, one merge
commit a branch, `--no-ff`, each at exactly the commit named, in this order. (The eleventh, BAR6-POWERS, had not handed
back; it follows as an eleventh point by a later word of the chair.) Every branch was read before this (its commits and
signatures, its changed tests, a read-only helper's seven-point reading) and passed the chair's own gates at its tip
(the strict type gate, eslint on its changed sources, the architecture guards, its own guard): ten of ten.

## The order, and what the tree reads after each merge

After each merge commit `git rev-parse HEAD^{tree}` and `git rev-parse HEAD:src` read as below. THE TREE HASH HOLDS ONLY
IF NOTHING ELSE IS COMMITTED BETWEEN THE MERGES: keep the hand-back document for ONE commit after the tenth. A tree that
reads otherwise after a merge is a STOP: say the point and both hashes.

| point | branch | at exactly | the tree after | `src` after |
|---|---|---|---|---|
| 1 | `lane/bar6-guard-2026-11-16` | 4acf430159eb6cc468c08fb2a58a180e7732e8c1 | b36521237c7f1f108560d140587676dc813aba87 | 3365a7311b571cc72f086122d4f38ba1af7c2965 |
| 2 | `lane/bar6-houses-2026-11-16` | 3d3f936fdb07e32c1f2b6650746f1850d1e5d01c | 19792e5b6062475d497f5f7a1b6db4d7d83b23ad | 6008af79da75a00005da1b7ad69e2b7bad6bac5a |
| 3 | `lane/bar6-crime-2026-11-16` | 247df4657cc8fce1086082db40eda442c4c4dd16 | 3b7869db06cde8babbb245f3fb73d95e6b3ac8dc | dd71b784026677f7cac10f225b955818fdc91a88 |
| 4 | `lane/bar6-defdesk-2026-11-16` | 853e5461580fe8f38d1dff17347935d2e16febf8 | a47c8c37ba3d7e788dbdda708dc14559c815dd98 | ef6de8024988ca2af901a09572256c078e1fd827 |
| 5 | `lane/bar6-marks-2026-11-16` | 0a0932ca7dedec18b941956144d28bc48e571f19 | 64011a7395b91f86c6f157061d54dd7ef94f01ac | ce2ca7bd95171fbddb76dbf6d4166548826ae65d |
| 6 | `lane/bar6-record-2026-11-16` | 04ef95b44183e0f33661c49ec8f57b2e29bc3493 | bb22258d2a8cb76f8467d68fb1e890bebebb4015 | 43c2f9879e960675d07be9a10305eaacd338a05c |
| 7 | `lane/bar6-econ-2026-11-16` | f0ba9eb7e0058a66077cd206272814156b0c283e | 33bd374c5a250ea7fe2d1194fdc75168737a846b | 54fc84041ecfa729f24b46aacd945541d35cda28 |
| 8 | `lane/bar6-people-2026-11-16` | 7ac99d4234ca95c36c6efcd0b1cad1f67352772f | 4300b3493243520b0fe65f96a83dbd10769be9fb | ca2e6e55e20884cd417475f674dd65dc5fcff148 |
| 9 | `lane/bar6-scenes-2026-11-16` | dc6beaeebd3263ffc9b875bb5617f763670e5362 | dd33a19302e32911f223cebf2d74c7e21d6982d8 | ec45ede1f89cbcdc57b0b682a6d3a1ddad69888d |
| 10 | `lane/bar6-culture-2026-11-16` | e39ffb2d6705734d95cdd2f65f5cee5fd54c85fe | d1aadc1b17b0e0634459fc9c41e5100d1fcf7481 | e0098eafae788fd6ed62fc4483c339049c98679d |

WHY THIS ORDER: the guard first (its register is banked at the base); HOUSES early (it made the sovereign leaf others
copied); CRIME before DEFDESK (DEFDESK's branch holds CRIME's commit 2065d95bc by one merge of its own: ruling XA2).

## The collisions: points 1 to 7 merge with none; exactly these three collide

- **POINT 8 (PEOPLE): `src/domain/facts/sovereign.js`, both added.** PEOPLE took the sovereign leaf byte for byte when it
  was first frozen; its maker BAR6-HOUSES changed it once after, on the chair's word (it now imports nothing). THE LINE'S
  STANDS: `git checkout --ours -- src/domain/facts/sovereign.js && git add src/domain/facts/sovereign.js`; then
  `git hash-object src/domain/facts/sovereign.js` reads `50b0fa0d4e446ac5289b74b2d5ed19c7d41f6f51`.
- **POINT 9 (SCENES): `src/domain/facts/factVocabulary.js` and `src/domain/facts/factsOf.js`.** Unions: in the type note
  HOUSES's `sovereign` stands on its line and SCENES's `goodExported` and `legitimacyCrisis` on the next; beneath `ruler`
  the `sovereign` entry and then the `legitimacy crisis` entry; in `factsOf.js` the two getters, the sovereign's first.
  Take the chair's whole files: `factVocabulary.after-scenes.js` (blob `15b2d55129756d0d3d1203a1de63619e7fd00266`) and
  `factsOf.after-scenes.js` (blob `bfc95c2a199707017ed134975d6f28a229d96b27`).
- **POINT 10 (CULTURE): `src/domain/facts/factLayers.js`, `factVocabulary.js` and `factsOf.js`.** Unions: PEOPLE's
  `paidWatch` and CULTURE's `courtSits`; DEFDESK's `monsterFrontier` and CULTURE's `legacyRuin`; the type note's third
  line gains CULTURE's two properties; the imports and the getters of both. Take the chair's whole files:
  `factLayers.after-culture.js` (blob `ec68e2071257062b20feb8ecec2e11db61a37b1e`), `factVocabulary.after-culture.js`
  (blob `1d93806408a0c8d860c932af785d595094d1eda2`), `factsOf.after-culture.js` (blob
  `2530f2baf3974cf04ebd14daada3c0ceea8bcc72`).

HOW A WHOLE FILE IS TAKEN: `git show origin/lane/chair-2026-11-08:docs/chair/2026-11-16/bar6/JOIN/<file> > <the
conflicted path>`, then `git hash-object <the conflicted path>` must read the blob named (any other reading is a STOP),
then `git add`. ANY OTHER CONFLICT AT ANY POINT IS A STOP: `git merge --abort`, the file and the point named to the chair.

## What the rehearsal tree of ten read

GREEN: `npm run typecheck:domain:strict`; `npm run typecheck:ratchet`; `npx eslint` on every changed source;
`npx vitest run tests/architecture` (347 tests); the round BAR5's guards; `npm run build`; and the build tests
`tests/build/vendorPdfLazy.test.js` and `tests/build/bootSmoke.test.js`.

RED, EACH NAMED, NONE A STOP FOR THE MERGE SEAT (the seam's, or the close's):
- the reference files and every stored figure the rounds BAR5 and BAR6 move: never run by the merge seat;
- `tests/lint/presumptionClasses.walker.test.js` (the build guard): GREEN ALONE AT POINT 1 (`hits 1938 · banked 1938 ·
  fresh 0 · stale 0`); after the tenth point two arms red by design (129 cured rows are stale until the close shrinks them
  through the door; 3 new undeclared lines: the seam's);
- `tests/domain/bar6ScenesGoods.test.js`: ONE arm red from point 9 on ("each good reads the page's own lists ..."): the
  marks seat's wider reading of "short" meets its constructed record: the seam's;
- so ALL TEN GUARDS TOGETHER after the tenth point read 2 files failed, 3 tests failed of 74;
- `tests/generators/bar4ScenePresumption.test.js`: 2 of the 720 (the tanners' town and one city's forges): the seam's;
- `tests/domain/facts/textOf.test.js`: 227 against 224 (a count two seats moved): the seam's;
- `node scripts/presumed-things-door.mjs --check`: fresh 38, stale 72, first-register stale 6;
- `tests/domain/facts/census2dTables.test.js`, `tests/lint/factLayers.walker.test.js`,
  `tests/generators/houseDescLateReRead.test.js`: stored figures named by their seats.

## What the join clears, measured at the rehearsal tree

The wide read's 147 standing rows over its 150 towns: found by a detector at the base 140; after BAR5 97; at this tree
10 (eight under the powers seat's rules, not yet joined); 7 are found by no detector. Towns with no standing row: 66,
then 84, then 135 of 150.

## THE ELEVENTH POINT (added 2026-11-17 02:10 UTC): `lane/bar6-powers-2026-11-16`

BAR6-POWERS handed back after the ten were rehearsed. The chair read it (seven commits, signed; a helper's reading: no
HIGH; every grant kept), passed it through its own gates at its tip, and rehearsed it ON TOP OF THE TENTH POINT.

- AT EXACTLY: fdf9e83dc72c3897361e49978cca425c32175d22.
- IT COLLIDES IN TWO FILES, both unions: `src/domain/facts/factVocabulary.js` (the type note's first line gains
  `seatMembers` beside `sovereign`; the `legitimacy crisis` entry stays where the powers' side holds nothing) and
  `src/domain/facts/factsOf.js` (the legitimacy getter stays). Take the chair's whole files:
  `factVocabulary.after-powers.js` (blob `68d285c70b5f9cd71fed71b831d523f0619fd77e`) and `factsOf.after-powers.js` (blob
  `a0fac108e30279526d7f482653d478a35a2b5cc7`). Its copy of `sovereign.js` is already the line's blob: no conflict there.
  The Institutions tab, the pool table and the presumed-things register merge by themselves. Any other conflict is a STOP.
- AFTER ITS MERGE (the merge seat's hand-back commit stands between, so the whole tree is not compared here):
  `git rev-parse HEAD:src` reads `e88e71e934ed2f0c8d3e1844499403a4a6e1d22a` and `git rev-parse HEAD:tests` reads
  `b264a72623ce8024cc59ca2b3f63e75607565629`.
- AT THE REHEARSAL TREE OF ELEVEN: the two type gates, eslint, the architecture guards (347), the round BAR5's guards, the
  build and the two build tests GREEN; ALL ELEVEN GUARDS TOGETHER (the ten and `tests/domain/bar6PowersCards.test.js`):
  2 files failed, 3 tests failed of 84, the same three by name; the build guard's door `hits 1805 · banked 1938 · fresh 4
  · stale 137` (the fourth fresh line is the power desk's "Travellers reach {settlement} and find nobody about ...": the
  seam's); the scene guard 2 of the 720 as before; the presumed-things door fresh 39, stale 72.
