# U6-PROSE REPORT (builder BU6, for SEAT-10)

Tree: scratch clone `bu6`, branch `u6`, cut at `46339e5c7`. Times are UTC, read from `date -u`. Each claim is CONFIRMED (run) or PLAUSIBLE (read).

## THE CURE, BY `file :: symbol`

- `src/data/seatHolderLines.js :: SEAT_HOLDER_LINES` (NEW). One table: `relation` (W1, six lines), `licensed` (W2, one line), `standing` (W3, five lines), in the chair's wordings. The slots: `{form}` (the form after its article), `{form's}`, `{holder}` (with its article), and `{holder|one|many}` (the verb's number, `fillAgreement`). CONFIRMED that it renders verbatim (test arms 2 and 4).
- `src/generators/factionDynamics.js :: seatHolderApartOf` (NEW, the gate, condition 3). It returns null unless all of these hold: `seatsByHolder(config)` (the born config); a governing row exists; `holderOf({ powerStructure: { factions }, config }, { audience: 'owner' }).holder` stands apart from it; and `isVeiledRow(holder)` is false. It also carries `licensed = pairLicense(kind, form).pair === 'licensed'`.
- `src/generators/factionDynamics.js :: seatHolderLineOf` (NEW). It draws ONLY through `pickVariantMixed`, keyed `${seed}::seatHolder:${pool}:${form}:${holder}`, where the seed is the birth's (`getActiveRng().seed`). It fills the slots, and `opening` raises the sentence's first "the".
- `src/generators/factionDynamics.js :: computeFactionRelationships`. It takes an 8th parameter, `seatConfig`. In `addRel`, a row whose pair is {form, holder} takes W1, plus " " + W2 on a licensed pair.
- `src/generators/power/factionStanding.js :: annotateFactionStanding`. When `seat.config` is present and the gate holds, the holder row's rank-1 standing is W3. It replaces the "The gap between them", the contested, the "in the shadow of" and the "Behind" branches.
- `src/generators/power/claimStanding.js :: settleClaimsToLabel`. It takes a 5th parameter, `holderName`, and uses `SEAT_ACCESS`, derived from `SEAT_WORDS`' last pair. On the holder's row, " and expect council access in return." and " and expect access to the hall in return." become ".", so the claim reads "Established merchant community; fund civic works.". No word is authored (condition 4). CONFIRMED (arm 2, u6t-town-22).
- `src/generators/power/rulingStructure.js :: generatePowerStructure`:
  - FAULT (c): `annotateFactionStanding(factions, standingForce, { publicLegitimacy, config })`.
  - The born config is handed to `computeFactionRelationships`.
  - `seatHolderApartOf(...)?.holder.faction` is handed to `settleClaimsToLabel`.
  - The gate's import specifier joins the existing `computePublicLegitimacy,` line, because F31's module line ceiling (800) stood one over.
- FAULT (b), `people/castPowers.js :: raiseToOfficeBand`: NOT CURED, no witness (below). castPowers.js is untouched.

## THE TWO WITNESSES

- FAULT (c), witness `u6f-town-18` (lit, town, germanic). It was found by a search over 600 lit births (`u6f-<size>-0..99`) in the flipped copy, instrumented and then reverted. 38 power-step calls had a law-1 `contestedBy` that differed from the law-2 field. On the witness, law 1 reads "Landed Gentry" and the law reads null. CONFIRMED.
  - RED FIRST: with line 738 put back to `{ publicLegitimacy }`, the new file went 3 failed / 6 passed (07:54:00Z). The arm-1 red: "the power step hands annotateFactionStanding the born config: expected false to be true". Both arm-2 cases also went red, because W3 rides the same config. Restored, the file is 9/9 green. CONFIRMED.
- FAULT (b): NO WITNESS. The same 600 lit births made 526 `raiseToOfficeBand` calls, and 0 of them took a different band under the law's fold. The office role is `seatPoolFor(tier).role`, one of Elder, Mayor or Governor, and the fold maps each to itself. By the brief's rule I stopped there: no fabricated fault, no cure, no arm. CONFIRMED (run, 07:44:35Z to 07:46:20Z).

## A FINDING THE INTEGRATOR NEEDS (STOP-class, by symbol)

The brief puts the writers at the power step, and there `holderOf` sees no people: it reads only R3, or R4/R5. On the finished record the holder is mostly R2, the person's first power, which is cast after the power step.

- In 60 lit births: 32 had the holder apart, 25 of them by R2 and 7 by R3. The power step's read agreed with the record in 18 of the 32. In the other 14 the step read no holder (R4), so those 14 keep today's lines. In this sample no case showed a power-step holder that differed from the record's. CONFIRMED.
- The chair's probe (150 lit births) after the cure:
  - Of the 63 form↔holder rows, 28 now print W1. 32 still print the "taxes and loans" or "work under the rules" lines, all on R2 holders.
  - The holder rows print W3 in at least 20 births (counted on the top-25 shapes). At least 22 keep the rank-1 lines.
  - `contestedOnHolder` is 0.
  - CONFIRMED.
- W2 can never fire at birth: a merchant holds a Royal Authority only by R2. W2 is proved by a planted holding (arm 4).
- To cure the R2 births, the gate and the two lines must also run once on the FINAL record. The seam is `generators/generateSettlementPipeline.js`, beside `claimStanding.js :: settleArcaneToPractitioners` (line 205). That file is outside this manifest, so I did not touch it. PLAUSIBLE (read).
- Residues, not in the brief and left as they are:
  - A holder at rank 2 keeps "They are always at the table…".
  - `withConflictRelations` appends "Even so, the two are now at odds over…" after W1.
  - `power/rosterText.js :: standingsOf` re-reads the standing with no config, which is fault (c)'s twin.
  - The row's `type` stays `subordinate` or `dependent`.

## GREEN

All runs used `TMPDIR=/tmp GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=2 …`, with output to a file that was read afterwards.

- The new file `tests/generators/seat/seatHolderLines.test.js`: 9/9. CONFIRMED.
- The final GREEN set, run together at 08:18:40Z on `089bc7eea`: 12 files, 225 tests, 224 passed. It covered the new file, `tests/domain/seat` (the filter also takes `tests/domain/seatLawWiring.test.js`), `tests/generators/seatBandFold.test.js`, `tests/generators/people/seatKeeperContender.test.js` and `tests/generators/powerStructure.test.js`. The one red is RED-AT-LINE's own: `powerStructure.test.js` "no power/ module packs more statements…", with `relationshipArchetypes.js: 1 packed lines`, a file I did not touch. The module line ceiling arm is green. CONFIRMED.
- `tests/lint/samenessHideable.walker.test.js`: 29/29 with the new row and HAND_CEILING at 74. The house readings were re-taken and needed no row: RULE 2 is green, and none of the six lines on THE WATCH is this table's. CONFIRMED.

## `tests/lint` WHOLE

LINT_FIGURES

## THE FLIPPED COPY

`scratchpad/bu6-flipped` is the tree's files plus exactly two dials. It is not committed. Its diff against the tree:

```
src/domain/seat/seatCircumstances.js:50  - export const SEAT_CONTEST_LIT = false;
                                         + export const SEAT_CONTEST_LIT = true;
src/domain/seat/seatLaw.js:77            - export const NEW_SETTLEMENT_SEAT_LAW_VERSION = DEFAULT_SEAT_LAW_VERSION;
                                         + export const NEW_SETTLEMENT_SEAT_LAW_VERSION = HOLDER_SEAT_LAW_VERSION;
```

The run at 08:19:20Z covered the new file and `tests/domain/seat`: 9 files, 204 tests, 198 passed.

- The new file is green (9/9). CONFIRMED.
- Six reds are tests that pin the DARK dials, and the flip turns them by construction. PLAUSIBLE (read) that they are only that: they were not run against an unmodified flipped tree.
  - `tests/domain/seat/seatContest.test.js`, 3: "the dial is dark and every factor…", "under the law, dark: the kind read is today's…", "dark: today's read (a craft archetype has no row…)".
  - `tests/domain/seatLawWiring.test.js`, 3: "the vocabulary: … the dial at the default", "1. CREATE (dark)…", "2. CREATE (THE CLAMP)…".

## COMMITS

The commits are `72db0b9f3` (source), `f75114c2f` (the test and the hand list), `a5532af3e` (F31's ceiling) and `089bc7eea` (arm 5 as a loop), then this report's commit (its sha is in the final message). Nothing was pushed.
