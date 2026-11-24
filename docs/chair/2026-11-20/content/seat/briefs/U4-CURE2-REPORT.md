# U4-CURE2-REPORT: Step 0 refutes the structured-only R1. STOPPED before any edit. Builder B4d to SEAT-5. Written 2026-11-20T14:41:43Z, read from `date -u`.

**STATUS: STOP (Step 0, condition (a)).** No code is changed. `src/domain/seat/holderOfSeat.js` and
`tests/domain/seat/holderOfSeat.test.js` are byte-identical to `fbf77bfa2`. No Step 1, no Step 2, and no gate was run (there is
no code change to gate). Branch `lane/seat-2026-11-20-u4-cure2`, cut from `fbf77bfa2`. Nothing was pushed. No register, census or
baseline was touched.

**The measure.** `docs/chair/2026-11-20/content/seat/u4cure2/measure-u4cure2.mjs` is one command. It was run from a scratch copy
with `--root /home/user/wt-u4cure2`, so its outputs (`u4cure2-step0.json` and `.md`) landed beside that copy and are not
committed. Re-run it with:
`node docs/chair/2026-11-20/content/seat/u4cure2/measure-u4cure2.mjs` (the defaults are `--n 150 --presets-n 10`).
- Pools: the seeds and configs of `measure-holder.mjs`, born through `birthConfig`. Default is 900 towns with 0 errors; presets
  is 960 towns with 0 errors. The run took 210 s.
- The sentence read is `holderOfSeat.js :: transferTakerOf`, restated verbatim.
- The structured read is the same loop with the match changed to `type === 'symbiotic' && direction === 'stable'`. It never
  reads `narrative`, and it keeps the `transferSays` tie-break, as Step 1 would.

## (a) A false R1 at birth: NON-ZERO, so STOP
These are towns where an edge's `pair` holds the current form and another power's row, and the edge reads `symbiotic`/`stable`.
The sentence read answers R1 in 0 of these towns, and so does the built leaf.

| pool | towns | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|---|
| default (900) | **163** | 0 | 5 | 5 | 68 | 68 | 17 |
| presets (960) | **111** | 0 | 13 | 22 | 17 | 25 | 34 |

Every one of these edges is the seat's edge with its MILITARY power (163 of 163 and 111 of 111). The writer is
`src/generators/factionDynamics.js :: computeFactionRelationships`, in its "Governing ↔ Military" block: a ratio from 0.5 to
0.85 gives `symbiotic`, and no siege or debt crisis plus a ratio of 1.0 or less gives `stable`. An example is
seat-measure-hamlet-29 (Elder Council): [Elder Council / Military Party] "...gives the orders and the Military Party carries them
out; each needs the other to stay strong." In these 274 towns, a structured-only read would answer R1 = the military at birth.
U3 measured R1 at 0 of 0 on these towns.

## (b) After transfers through the real `transferRulingPower`: 0 differences, but only through the sentence tie-break
The winner is `coupContenders(s).challengers[0]`, else the heaviest non-governing power (1 such town, in presets). Each cause
has its own chain. Thorps and hamlets with no other power have no winner: 240 such towns in default and 292 in presets.

| pool | step | towns (each cause) | structured = sentence, coup | structured = sentence, election | structured finds 2+ takers, coup / election |
|---|---|---|---|---|---|
| default | #1 / #2 / #3 | 660 | 660 / 660 / 660 | 660 / 660 / 660 | 82 each step / 0, 3, 3 |
| presets | #1 / #2 / #3 | 668 | 668 / 668 / 668 | 668 / 668 / 668 | 29 each step / 0, 5, 5 |

The sentence read answers the real winner in every one of these towns. The built `holderOf` (owner) R1 equals it in every one.
In the coup chains, the born military edge is re-keyed onto the new form and is still `symbiotic`/`stable`, so the structured
read sees two takers. It picks the right one only through `holderOfSeat.js :: transferSays`, which reads the prose of
`powerStructure.recentConflict`.

## (c) Later writers that edit the taker's edge after a transfer
All of these run on the NPC section regeneration, `src/generators/generateSettlementPipeline.js :: regenNPCsPipeline`:
- `src/generators/factionDynamics.js :: withConflictRelations` handles a symbiotic row whose pair is named by a newly drawn
  quarrel. At HIGH intensity it sets `direction` to `'escalating'`, which breaks the structured read. At ANY intensity it
  appends " Even so, the two are now at odds over …" to `narrative`, which breaks today's sentence read.
- `src/generators/factionDynamics.js :: withCaptureRelations` is reached through
  `src/generators/narrativeGenerator.js :: withHallCapture`. It rebuilds a row that carries `captureState` with
  `govCriminalRelation`, whose type is never symbiotic. After a coup, a criminal taker's born capture row is re-keyed onto the
  form and converted with `captureState` still on it. The rebuild then breaks both reads.
- `src/domain/display/publicSafe.js :: toPublicSafe` drops any row that carries `captureState` from the served document. A
  criminal taker's converted edge is one of these, so the reader sees no R1 edge. This is a deletion, not a type edit, and it
  matters to Step 2's fixture (a).

None of the world pulse (`src/domain/worldPulse/*`), the events (`src/domain/events/mutateWorld.js`) or
`src/domain/factionRename.js` edits `type` or `direction`. The rename rewrites `pair` names and the prose only. Their only
relation writer is `transferRulingPower` itself.

## The other STRUCTURED fields a transfer writes, with the counts each would answer
- **`powerStructure.previousGovernments`** rows `{ label, cause, tick }`. Each row names the OUTGOING form, never the taker, so
  it answers the taker in 0 towns. At birth no town carries a row (0 of 900, 0 of 960).
- **The winner's `ascendant` modifier** (`transferRulingPower`, the winner's row). At birth no row carries it (0 of 900, 0 of
  960), so it gives no false R1. The table counts towns where the read answers, then towns where it equals the sentence read.

| pool | read | coup #1 / #2 / #3 | election #1 / #2 / #3 |
|---|---|---|---|
| default | the only row with `ascendant` | 660 = 660, every step | 660 = 660 / 365 = 365 / 357 = 357 |
| default | the row with the most `ascendant` | 660 = 660, every step | 660 = 660 / 365 = 365 / 509, of which 501 equal (8 WRONG) |
| presets | the only row with `ascendant` | 668 = 668, every step | 668 = 668 / 233 = 233 / 206 = 206 |
| presets | the row with the most `ascendant` | 668 = 668, every step | 668 = 668 / 233 = 233 / 589, of which 562 equal (27 WRONG) |

  The "only row" read is never wrong, but it goes silent after a second lawful transfer: 295 of 660 towns in default and 435
  of 668 in presets at election #2. The "most" read is wrong in 8 towns (default) and 27 towns (presets) at election #3.
- **The governing row's cause modifier** (`'seized_power'` or the cause) names no taker.
- **The `transfer` descriptor** (`fromGovernment`, `toGovernment`, `authorityName`, …) is RETURNED, not stored. The record
  never holds it. `src/domain/events/mutateWorld.js` keeps only a prose `detail`.

I propose no discriminator and parse no prose. The chair rules.

## What I did NOT do
- I made no edit to `holderOfSeat.js`, the test file, `rulingPower.js`, `seatCircumstances.js`, `factionDynamics.js` or
  `transferSays`.
- I wrote no arm (10), placed no plant and ran no gate.
- I took no census, ran no `confine-two.sh` (no code moved) and made no push.

CONFIRMED (executed here at `fbf77bfa2`): every count above, from the one measure run on both pools. The writers in (c) are
CONFIRMED by reading the code at `path :: symbol`. That they fire after a transfer on the regeneration path is PLAUSIBLE: it
was read from the code and not executed.

## Step 2 (SEAT-5's addendum): arm (10), built by builder B4e. Written 2026-11-20T14:47:12Z, read from `date -u`.

**STATUS: GREEN at base; the arm convicts two named plants.** `src/` is untouched at the tip (`git diff --quiet fbf77bfa2 -- src/`
holds). Only `tests/domain/seat/holderOfSeat.test.js` (arm (10) and its header line) and this section changed. Nothing was pushed.
No census, register or baseline was touched.

**The arm.** `(10) CS11: on a SERVED document, no audience but the owner's is told a criminal or a hidden power`. For each of seven
non-owner audiences (`'reader'`, no options, `{}`, `null`, `''`, `'public'`, `'dm'`), `holderOf(toPublicSafe(s), options)` holds
neither forbidden name (`The Shadow Hand`, criminal; `Velvet Ledger`, `hidden: true`) anywhere in `JSON.stringify` of the answer.
Every fixture is town size, and the seat's card holds a membership in each forbidden power, stamped `veiled: true`. The six tests:
- (a) the criminal power took the seat through the real `transferRulingPower`: refused R1;
- (b) the hidden power took it: refused R1;
- (c) the merchants took it beside the criminal power's born symbiotic/stable edge on the same form: R1 Merchant Guilds, told. Three
  variants: the transfer's sentence stands; a later writer replaced `recentConflict`; the criminal power held the seat before;
- (d) a born-shape town with a symbiotic/stable edge between the seat and its military power (Town Watch), and no transfer on record:
  R4, never R1, with the person Hilde Brandt.

Non-vacuity: the owner is told (a) and (b) on the record. The served document keeps (a)'s row. (c) and (d) assert the served
symbiotic/stable edges on the form. In (d) the owner's answer on the record names both powers through the person.

**Red first.** At base, 6 passed, 0 failed. The plants, each run and restored:
- P1 in `holderOfSeat.js :: servable`: `const servable = (row) => true || (!isVeiledRow(row) && contestKindOf(row) !== A.CRIMINAL);`
  gives 1 failed, 5 passed. (a) fails: "audience 'reader': expected [ 'The Shadow Hand' ] to deeply equal []".
- P2 in `holderOfSeat.js :: transferTakerOf`, the structured-only read: the narrative test becomes
  `!(rel.type === 'symbiotic' && rel.direction === 'stable')`. That gives 2 failed, 4 passed: (c) with the sentence replaced, and (d)
  ("expected 'R1' not to be 'R1'").

No plant in the leaf can convict (b). The served document holds no trace of the hidden name, because `toPublicSafe` drops its row and
masks it. (b) guards the pairing of the leaf with `toPublicSafe`.

**Green.** `holderOfSeat.test.js` and `seatContest.test.js` whole: 62 passed of 62. `eslint` on the test file: exit 0.

CONFIRMED (executed here): every count above. PLAUSIBLE: that no other leaf change would let (b) name the hidden power. I reasoned this
from `publicSafe.js :: publicVeilPass` and did not test it.

**Not done: ADDENDUM 2's Step 1′.** Addendum 2 (14:47:15Z) landed in the brief while this section was being written. My dispatch says to
build Step 2 only and to change nothing under `src/`. So Step 1′ (the one matcher, the frozen list of wordings, and its arms (a) and
(c)) is not started. It is SEAT-5's to dispatch. Step 2's arm (10) is condition (4) of that ruling.

## Step 1′ (Addendum 2, SEAT-5's dispatch after `4f0ba44b5`): built by builder B4e at `6fa7063fb`. Written 2026-11-20T15:06:26Z, read from `date -u`.

**STATUS: (1), (2) and (a) are built and green. (c) STOPS on a WRONG power. That case is reported below. It is not pinned and not
cured.** Nothing was pushed. No register, census or baseline was touched.

**(1) One matcher.** `holderOfSeat.js :: transferSentenceSays(line, sentence, taker, form, wordings = TRANSFER_WORDINGS)` is exported.
It matches the whole line. `{taker}` and `{form}` (lower case) must match exactly. `{from}` and `{cause}` match any text. Both of
R1's reads go through it: the edge's `narrative` (`'edge'`) and the `recentConflict` tie-break (`'conflict'`). `takerLine` and
`transferSays` are removed, so the leaf holds no other template and no other equality. `transferTakerOf` is now exported and takes
the list as a parameter. `holderOf`'s API is unchanged. One behaviour narrows on purpose: the lawful line was matched with `includes`
and is now matched whole, one row per wording. Every fixture and `seatContest.test.js` answer as before (71 of 71).

**(2) The frozen list.** `holderOfSeat.js :: TRANSFER_WORDINGS` has four frozen rows: the edge sentence, the coup line, the lawful
line, and the lawful line with the demotion clause. Arm (11) does three things:
- It drives the real `transferRulingPower` on all 5 `RULING_POWER_CAUSES`, each with `demoteIncumbent` false and true. Both sentences
  of every run must match the list.
- It pins the list frozen, with 1 edge row and 3 conflict rows.
- It puts a made-up new wording FIRST in the list. A town in the frozen wording still reads its taker (Merchant Guilds), and so does
  arm (3)'s two-taker town (Coin Exchange). A town in the made-up wording reads its taker only through a list that holds it.

**(3a)** A born military symbiotic/stable edge with no transfer (Town Council / Town Watch at town size, Elder Council / Military
Party at hamlet size) gives no taker from `transferTakerOf`. Neither the owner nor the reader gets an R1 answer, on the record or
served.

**(3c) The DM's rename after a transfer.** The events registry and `src/domain/events/mutateWorld.js` hold no faction rename. The
DM's path is `src/store/settlementRenameHelpers.js :: renameFactionImpl`, which calls
`src/domain/factionRename.js :: applyFactionRenameToSettlement`. I ran it on a transferred town (cause `coup` and cause `election`):
- **Renaming the TAKER** gives the right power. The cascade rewrites the pair, the edge narrative and `recentConflict`. Owner and
  reader (served) both get R1 = the new name. This case is pinned.
- **Renaming a BYSTANDER** gives the right power (R1 = the taker). This case is pinned.
- **Renaming the SEAT gives a WRONG power. STOP.** The cascade rewrites `government`, `governingName`, the row and the edge's
  `pair`. It does not rewrite the edge narrative's lower-case form ("…power behind the merchant city council…"). R1 therefore finds
  no taker, and R3 answers the leading open power of the seat's kind. On a town where Coin Exchange (merchant, power 40) stands
  beside the taker Merchant Guilds (31 after the transfer), both owner and reader get **R3 Coin Exchange**. Without a heavier
  merchant power, R3 answers Merchant Guilds, which is right only by accident. The base leaf (`fbf77bfa2`, run in place on the same
  probe) gives the same answer, so this is not a change made here. I did not pin it and did not cure it. The chair rules.

**Red first.** On the base leaf, the test file does not load ("TypeError: TRANSFER_WORDINGS is not iterable"), so no test runs. Arm
(11) has 9 tests. The plants, each run and restored:
- P3 drops the demotion row. That gives 2 failed, 7 passed: "election, demoteIncumbent true: recentConflict: expected false to be
  true", and the 3-row count.
- P4 makes the matcher ignore its list (`return TRANSFER_WORDINGS.some(...)`). That gives 1 failed, 8 passed: "the list is live".

Arms (a) and (c) pin behaviour that the base leaf already has.

**Green.**
- `holderOfSeat.test.js` and `seatContest.test.js`: 71 of 71. Arm (10) is still green.
- The 18 test files that name `holderOfSeat` or `rulingPowerCoup`, plus `engineCoreLazyEdge`, `layerBoundaries` and
  `densityCreateBoundary.walker`: 21 files, 551 of 551.
- `typecheck:ratchet`: 167 of 167. `typecheck:domain:strict`: 1113 of 1113. `lint`: 0 errors, 38 warnings, none in a touched file.
- `writerReach.walker` is red, as expected: 1 failed (the round-trip arm), 127 passed, with `tuningRegister.walker` run alongside.
  Measured per identity through the walker's own `measure`, exactly 3 identities differ, and they are the three ruled ones:
  `narrative on factionRelationships`, `recentConflict on powerStructure` and `priorityMilitary on config`.
- `confine-two.sh fbf77bfa2 6fa7063fb`: base and tip both give
  `all 36ee5bb0bea0bb3fcc6bd83f1e9e732b4dc643f09e0844545c64785798d8ce89 1245`. EQUAL.

CONFIRMED (executed here): every count, hash and rename answer above. PLAUSIBLE: that no other DM path renames a power after a
transfer. I grepped `src/domain/events/` and the callers of `applyFactionRenameToSettlement`. The other caller,
`src/generators/power/factionLabelClose.js`, runs at birth.

## Addendum 3 (the chair 15:17Z): fail closed inside the leaf. Builder B4e, `7483c33e5`. Written 2026-11-20T15:35:38Z, read from `date -u`.

**STATUS: GREEN.** The renamed-seat case now answers nobody. The measure counts 0 on both pools. Nothing was pushed. No register,
census or baseline was touched. `factionRename.js` is not touched: its lower-case miss stays as the named survivor.

**The rule.** It lives in `holderOfSeat.js :: unattributedTransferOn`. It fires where `transferTakerOf` finds no edge for the
current form, but an edge on the current seat's pair is a frozen edge wording for its other power and some form. In that case
`holderOf` returns `rule` 'R1' with no holder, `refused` false and the office's `kind`. This holds for both audiences, and the read
never falls through to R2 or R3. The one matcher, `transferSentenceSays`, now takes `form` null to mean "any form".

**Red first (condition 3).** Arm (12) on `5b95aaaf5`'s leaf: `holderOfSeat.test.js` gives 3 failed, 47 passed.
- The two renamed-seat tests (coup and election) fail with "expected { rule: 'R3', … } to match object { rule: 'R1', holder: null, … }",
  that is, Coin Exchange.
- Condition 1 fails with "record: expected [ 'Merchant Guilds', … ] to deeply equal [ 'Coin Exchange', … ]": the wrong holder was
  removed from the contest.

With the rule, `holderOfSeat.test.js` and `seatContest.test.js` pass 75 of 75.

**Condition 1: "nobody" is an omission.** On the renamed seat (seat law 2), `dossier/powerStrata.js :: derivePowerStrata` runs on
the record and on the served document. In both, the ruler is the seat's form, 'The Gilded Compact', and no row matches
`/vacant|empty|unheld|no one holds|nobody holds/i`. The contenders equal the contest's with no holder removed (the old law's list),
and Coin Exchange and Merchant Guilds both stand in it. The surfaces that read `holderOf` today: one caller,
`src/domain/rulingPowerCoup.js :: coupContenders`, with the owner audience and only under the seat law. It uses the answer only to
remove the holder from the challengers. Every page reaches it through `coupContenders`:
- `dossier/powerStrata.js :: derivePowerStrata`
- `components/dossier/EngineSections.jsx`
- `components/new/powerDeskRead.js`
- `display/stateProse/powerStateProse.js` and `printProse.js`
- `generators/power/factionStanding.js`
- the world pulse readers

No page prints `holderOf`'s answer itself, so "nobody" can only leave a holder in the contest. It cannot print a vacancy.

**Condition 2: the measure.** I added (e) to `measure-u4cure2.mjs` and ran it from a scratch copy with `--root` (211 s, 0 errors).
- The rule fires at birth in **0 of 900** default towns and **0 of 960** presets towns.
- It fires in 0 towns after every real transfer (coup and election, steps #1 to #3).
- The built R1 equals the verbatim sentence read in 660 of 660 (default) and 668 of 668 (presets) towns at every step.

**Green.**
- The 20 files that name `holderOfSeat` or `rulingPowerCoup`, plus `engineCoreLazyEdge`, `layerBoundaries` and
  `densityCreateBoundary.walker`: 21 files, 555 of 555.
- `writerReach.walker`: 1 failed, 51 passed. Measured per identity, exactly the three ruled identities differ:
  `narrative on factionRelationships`, `recentConflict on powerStructure` and `priorityMilitary on config`.
- `typecheck:ratchet`: 167 of 167. `typecheck:domain:strict`: 1113 of 1113. `lint`: 0 errors, 38 warnings, none in a touched file.
- `confine-two.sh fbf77bfa2 7483c33e5`: base and tip both give `all 36ee5bb0…d8ce89 1245`. EQUAL.

CONFIRMED (executed here): every count and hash above. PLAUSIBLE: that no page prints `holderOf`'s answer. I read this from the one
importer and did not render any page.
