# TAIL-CLOSE-PEOPLE-1 — hand-back

Seat: TAIL-CLOSE-PEOPLE-1 (close seat). Branch `lane/tail-close-people-2026-11-15`, cut from the joined line
`lane/join-2026-11-14` at **0b1248db** (read back from origin; the brief's floor was ae50369d).

## The bisect (all eight reds, one walk)

Each red file was run alone at the tip (all eight red as the chair measured) and at d817736d8 (all eight green). A
first-parent walk over the 43 `join(...)` merge points d817736d8..9d3d177a0, each point running all eight files
alone, found:

| red | file | first red point | the lane merged there |
|---|---|---|---|
| 1-5 | nobleFaces, seatKeeperContender, successionClaimants, lordNotGovernment, semanticFixtures | 5d1e3096 (JOIN-7 · 31) | lane/tail-titles-2026-11-15 at b30c1b7aa |
| 6 | outlookIssuesSayTheWorld | 1b672cbe (JOIN-7 · 25) | lane/tail-defecon-2026-11-14 at 21e578caa |
| 7 | generationCertificationCorpus | bd57eb02 (JOIN-8 · 21) | lane/tail-narrative-2026-11-14 at 091ef25e5 |
| 8 | powerStructure | 71898552 (JOIN-7 · 21) | lane/tail-ties-2026-11-14 at fdebbe346 |

## The reds

### Red 8 — powerStructure.test.js, "no power/ module packs more statements onto shared lines than its ceiling"

Two modules over (ceiling 0 each), not one:

- `relationshipArchetypes.js` — turned by **f00b248f** (TAIL-TIES-2 batch 1, T6; merged at 71898552): `const from = …; const to = …;` on one line.
- `claimStanding.js` — turned by **833566cf** (TAIL-POWERS-B-5, P33/P34; merged on the line after 9d3d177a0): the warehouse filter's arrow opened `{ const tags = …; return …; }` on one line.

**(i) cured, layout only**: each statement on its own line; no behaviour, no ceiling raised. MOVING check: neither file
differs on any `lane/tail-*` branch (three dots against the joined line). Proof: the red alone 1 failed → 5/5 passed;
the 10 test files that name either module: 6 failed / 48 passed before and after, the same six (generationForkCensus
A-rows, pipelinePinnedChoosers A1/A6: pre-existing, not this seat's); eslint clean on both; the full type check
reports nothing in either file; the twelve-birth grid 2 falls before (r2r-city-0 P7a, r2s-insurgency-metropolis-0 P7a)
and the same 2 after. No declared move (no output changes).

### Red 7 — generationCertificationCorpus.test.js, "pins the advisory record_coherence_battery failures BY IDENTITY"

**A WIN, pinned by identity.** The one identity gone: `certification-v1-subsistence-thorp-dun` stopped failing (31 → 30); no
new identity in the list. Earning commit: **ce69ac52** (TAIL-NARRATIVE-4 FB, ruling N17: a founder resolves draw-free to
one the Origin row agrees with), the only code commit of the merge bd57eb02 (JOIN-8 · 21, narrative at 091ef25e5); 796c49ef
fails it, bd57eb02 does not. Read at 796c49ef by a probe, the specimen's only battery finding was `battery.defense-words`
"soldiers without a garrison or a hired company" on the founder line "a discharged soldier who liked the view and had
nowhere better to be". The row is removed with a RE-KEYED comment naming the commit, as the pin's own text orders. Proof:
the red alone 1 failed → 13/13 passed; eslint clean; no other file names the specimen. MOVING: the file differs on no
`lane/tail-*` branch.

### Red 6 — outlookIssuesSayTheWorld.test.js, "#823 #824 #825 rr2s-city-famine-rand-1: the bank row"

**(ii) re-keyed by identity; the town is right.** Turning commit: **2ac50c55** (TAIL-DEFECON-3 batch 3, a DECLARED MOVE of
the economy family: "the banks' 'does little trade' … only where exports are short"), merged at 1b672cbe (JOIN-7 · 25,
defecon at 21e578caa). This town has banks beside a merchant guild and **exports 17 goods**, so "Banks stand here, but the city
does little trade" would be false, and the row is rightly gone (`viability.js`: `primaryExports.length < 4`). The guard now
reads the record: a merchant guild and banks stand, four or more exports, no machinery in any row (#823 #825), no
"without a merchant class" (#824), and the bank row is absent beside its sibling warning "Trade Dependencies"
(`expectAbsentWithAnchor`). The claim stays where it was and nothing is loosened.
**Named, not cured (not this seat's file):** the row's printed words now have **no birth witness**: 0 of 240 reader-shaped
births (town/city × famine/calm × 60) print it, and the economy-at-0 law births of village to metropolis (144) stand no bank
at all. A guard of the row's own words needs a unit-level birth of `viability.js` (the economy lane's).
Proof: the red alone 1 failed → 6/6 passed; eslint clean; the negative-anchor walker shows the same 4 pre-existing
offenders at base and after (crisisTab, tailHistoryBatch6, tailCrisisBatch4, tailCrisisBatch8: other seats'), none from this
file. MOVING: none.

### Reds 1-5 — the people's guards and the RELIGIOUS CAPITAL fixture: (ii) re-keyed by identity, all five

Turning commit for all five: **1036bf94** (TAIL-TITLES K-C, class k, a DECLARED MOVE: "a person's title and role are the
house's face in its holder's form"), the only code commit of the merge 5d1e3096 (JOIN-7 · 31, titles at b30c1b7aa). M-1b holds:
the role IS the title, one word; the face stays on `institution.title`; the move's own reader is
`holderTitleForms.js :: faceOfRole`.

**Every miss at the tip was a woman bearing the face "the lord" as "the lady"** (or, for red 5, "the senior abbot" as "the
senior abbess"). The person is right, and no keeper heading a contender, no tradesperson and no claimant outside the cast
appears among them. Read on the misses: nobleFaces 10 + 5, seatKeeperContender 2 + 1 + 7, successionClaimants 3 + 5 + 6 + 12,
lordNotGovernment's one premise (r2s-recently_betrayed-city-2: its one minted lord is a woman), semanticFixtures'
fixture-religious-0 (its one religious card, Sarnai Cumans, female). Diffed at 16419737 against the tip, that town's cast
moves only in two holder forms (the senior abbess; the front man → the nominal owner).

The re-key: each guard reads the card's FACE through the move's own reader, **and only where the printed title (role, for
the fixture) IS that face's holder form** (`titleForHolder(face, gender)`). So a man printed "the lady", or any wrong word,
still reds. No literal list is widened ('the lord', 'the monarch', the landed faces and REL_ROLE are unchanged), and no
assertion is removed.
- red 1 `nobleFaces.test.js`: the minted face, the landed faces, The Old Houses' face.
- red 2 `seatKeeperContender.test.js`: NOBLE_FACES and Landed Gentry's face (the keeper-heads-contender check is
  untouched and was never among the misses).
- red 3 `successionClaimants.test.js`: OF_THE_LINE, the review towns' claimants, x50-trim-21's two bodies.
- red 4 `lordNotGovernment.test.js`: `minted()` reads the face (as `npcStructure.js :: isMintedLord` itself does since 1036bf94).
- red 5 `semanticFixtures.test.js`: the religious-roles row reads each card's face.
Proof: each red alone before (2/3/4/1/1 failed) → after (3/3, 3/3, 6/6, 2/2, 31/31 passed); eslint clean on the five files.
MOVING: none of the five files differs on any `lane/tail-*` branch. No source file was changed for these five, so there is
no census move and the grid is not touched.

## Declared moves (for the owner's veto list)

- **None of this seat's.** No generator output moves: red 8 is a layout change, and reds 1-7 are guards re-keyed or a pin
  following a win. The moves the guards now follow are other lanes' declared moves, named so the owner's veto can find them:
  - 1036bf94 (TAIL-TITLES K-C): a face's word in its holder's sex. A woman minted for a noble body is "the lady", a woman
    heading the monasteries "the senior abbess", a woman fronting a criminal business "the nominal owner".
  - 2ac50c55 (TAIL-DEFECON-3): the bank row "does little trade" prints only where fewer than four goods are exported.
  - ce69ac52 (TAIL-NARRATIVE-4 N17): the founder resolves to one the Origin row agrees with. A thorp loses its discharged-soldier
    founder, and its advisory battery finding with it.

## Status: HANDED BACK at the tip of `lane/tail-close-people-2026-11-15`

All eight reds are closed, and each file is green run alone at the tip: 8 cured (layout), 7 pinned (a win), 6 and 1-5
re-keyed (ii). None was sent up as (iii), and none was left.
Named for others, not cured here:
- the bank row's own words have no birth witness after 2ac50c55 (the economy lane: a unit birth of `viability.js`).
- pre-existing reds seen while proving, the same at base and after, not this seat's: `generationForkCensus.test.js` (4
  A-rows) and `pipelinePinnedChoosers.test.js` (A1, A6); `negativeAssertionAnchor.walker.test.js` (4 un-anchored negatives in
  crisisTab.test.jsx:102, tailHistoryBatch6.test.js:106, tailCrisisBatch4.test.js:72, tailCrisisBatch8.test.js:149).
- the twelve-birth grid: 2 falls at base (r2r-city-0 P7a, r2s-insurgency-metropolis-0 P7a) and the same 2 after red 8; no rise.
