# UK-FOLLOW — seatBandFold.test.js without a stored digest and without leaning on the default (builder BUF, for SEAT-9)

Ruled by the chair at 22:01Z on 2026-11-20 (SEAT-9 item 81). Base: `lane/seat-9-2026-11-20` at the commit that carries this brief.

## The file you own

`tests/generators/seatBandFold.test.js`, and NO other file. If anything else would need to change, stop and report it. The lighting census, the mutation manifest row and every other register belong to the integrator.

## Read first, whole

- the test file;
- `src/generators/npc/powerBand.js`;
- `src/domain/seat/seatLaw.js` (`seatsByHolder`, `resolveSeatLawVersion`, `NEW_SETTLEMENT_SEAT_LAW_VERSION`, `newSettlementSeatLaw`);
- `src/domain/density/densityCreateBoundary.js :: birthConfig`;
- `tests/helpers/seedFailures.js` (births in a loop go through `collectSeedFailures`, or `seedLoopTotality` reds).

## The cures

1. **Arm 3 holds NO stored digest.** Delete `RECORDED` and every sha256 of a whole birth or of a band table. Goldens are the owner's, and a lane does not add one. Replace the arm with a differential in ONE tree:
   - (a) **The band of every role.** Take every role string the lists and the fold can meet:
     - the 9 HIGH and 7 MID keywords as written;
     - the `wealthiest merchant` row;
     - their spaced and capitalised forms (`Guild Master`, `Council Member`, `Wealthy Merchant`, `Thieves Guild Master`, `Wealthiest Merchant`, …);
     - the pool roles the file already collects (`ROLES`);
     - a handful that match nothing.

     For each, the band under `{}`, `{ _seatLawVersion: 1 }`, `{ _seatLawVersion: '2' }`, `{ _seatLawVersion: 3 }` and no config EQUALS a local restatement of the OLD expression (lower-case `includes` over the two literal lists, no fold). Under `{ _seatLawVersion: 2 }`, the band differs from the old expression on EXACTLY a declared set: the roles whose spaced form meets an underscored keyword (Guild Master and Thieves Guild Master to high, Council Member to moderate, …) plus the `wealthiest merchant` stem. Write the expected set out literally, and assert it in both directions: every declared role moves, and no other role moves.
   - (b) **The whole birth.** For two births (`town`/`uk-town-17` and `city`/`uk-city-5`), take the record born with the key truly ABSENT (strip `_seatLawVersion` from `birthConfig`'s output explicitly, so the arm never depends on the dial) and the record born with `_seatLawVersion: 1` forced. Their whole records deep-equal, with the one config key excepted, and assert that it is the only difference.
2. **No arm leans on the default.** Every arm whose meaning is "under law 1" or "dark" forces law 1 in its own config (`_seatLawVersion: 1`), or strips the key as in 1(b). It never relies on what `birthConfig` mints today. Change `born(...)`'s dark calls accordingly. Arm 2's "born dark" asserts law 1 is in force, not that the key is undefined. No test in this file may pin what a NEW place is born with: that pin is `seatLawWiring`'s, and it is on the flip's list.
3. **Length guards.** Every loop or `.every` over cards that could be empty gets a guard (`length > 0`, and the guard's message names the card) before it: arm 2's town dark `.every` (Council Member), arm 2's city dark-side loop (Thieves Guild Master) and arm 4's dark-side loop (Wealthiest Merchant).

Keep arms 1, 2 (law side), 4 and 5 in meaning. Keep their titles where the meaning is unchanged. A title whose meaning changed (arm 3's) may be renamed.

## Proofs (each executed; receipts in the commit body)

Run every line through `GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- npx vitest run tests/generators/seatBandFold.test.js --maxWorkers=2 > <log> 2>&1`. Never read a run through a pipe; read the log's count lines. The box is shared, and the mutex queues you.

1. Green at your tip.
2. **Plant (i):** in `npc/powerBand.js`, make the fold apply regardless of the law (`const law = true`). Arm 3(a)'s old-law half and arm 1's "low without the law" must red. Restore the file byte-identical (`git diff --quiet -- src`).
3. **Plant (ii):** drop the fold under the law (`const fold = s => String(s || '').toLowerCase()`). Arm 3(a)'s declared set and arm 1 must red. Restore.
4. **Flip-proof:** in `src/domain/seat/seatLaw.js`, set `NEW_SETTLEMENT_SEAT_LAW_VERSION = HOLDER_SEAT_LAW_VERSION` (the flip's first dial). The WHOLE file must stay green. Restore. It is never committed.
5. Run `npx eslint tests/generators/seatBandFold.test.js`: 0 errors.

## Commit and report

Make ONE commit on your branch, by explicit path, with the receipts in the body. Do not push. Then report to SEAT-9 in at most 250 words:
- the commit;
- the test count before and after (the lighting census's title count moves);
- each proof's line;
- anything you could not do.
