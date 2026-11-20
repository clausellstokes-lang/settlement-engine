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
