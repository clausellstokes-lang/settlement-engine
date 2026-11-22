# U7'S PROBE: after a kept-form transfer under the lit law, does the page's ruling chain name the old house as ruler? (SEAT-10; the chair's order of 07:21Z)

Written 2026-11-22T07:28:58Z (`date -u`).

**YES. The chain names the OLD house's person in 6 of the 11 kept-form transfers.** CONFIRMED by run, `result.json`.

## THE RUN

- **The pool:** 160 lit births: germanic village, town, city and metropolis, 40 seeds each (`u7p-<size>-<i>`), through `birthConfig`.
- **The tree:** a scratch copy of the tip's `src` with exactly the two dials (`NEW_SETTLEMENT_SEAT_LAW_VERSION = HOLDER_SEAT_LAW_VERSION`, `SEAT_CONTEST_LIT = true`); `diff -rq` against the tip shows only those two files. All 160 births are law 2.
- **The run:** one node process in the mutex's exclusive slot, 07:23:57Z to 07:24:37Z.

## THE TWO ROADS

- **The DM's:** `mutateSettlementChecked` with `CHANGE_RULING_POWER`, to the first non-governing power that moves the holder.
- **The coup's:** a `power_transfer` `coup_succeeded` outcome to the top contender (`coupContenders`), applied by `applyWorldPulseOutcomes`.

A transfer counts as **kept-form** when the governing row (the form) is unchanged and `holderOf(…, { audience: 'owner' })` names a new holder.

## THE COUNT

| road | transfers | kept-form | chain names a person | that person of the OLD house only | of the NEW holder's house |
|---|---|---|---|---|---|
| DM | 155 | 10 | 10 | **6** | 4 |
| coup | 155 | 1 | 1 | 0 | 1 |

An example, `u7p-town-8` (DM): the seat "Town Mayor" passes from the Craft Guilds to the Merchant Guilds. `rulingChainOf` still prints the Town Mayor's first as "Judith Weber, the smelt master and Mayor", whose houses are the Craft Guilds and the Town Mayor.

**Why** (read): `dossier/powerStrata.js :: rulingChainOf` takes the person from the governing row's ladder (`ladderRungsOf(…, ladderFactionKeyOf(governing))`). Under the law, the governing row is the FORM, not the holder (`holderOfSeat.js :: holderOf`).

**So, by the chair's ruling:** U7 is built before the first deploy, after U6.
