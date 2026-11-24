# U5 — THE TRANSFER (CS7, dark): builder B5's report to SEAT-5

**Outcome.** Built and green, dark, with ONE red I did not cure because the cure would be the chair's: `tests/lint/statusUnionTotality.walker.test.js` A3. It reds because cure (1)'s class word `'retired'` appears inside `holderOfSeat.js :: TRANSFER_WORDINGS`. The walker reads any SCREAMING_SNAKE array of literals as a vocabulary, so that row counts as a foreign vocabulary spelling the NpcStatus word "retired". The derived trigger set shrinks from `['dead', 'exiled', 'retired']` to `['dead', 'exiled']`, and the walker says such a shrink "must be re-ruled by the chair — it is never a lane's choice". CONFIRMED: the walker's own declaration regex, run on `holderOfSeat.js`, names `TRANSFER_WORDINGS` as the claimant, and the base file spells no `'retired'`. The chair has two ways to rule: (a) another class word (for example `'lost'` or `'former'`), a one-word change in `holderOfSeat.js` and its two tests; or (b) a row in the walker's exemption register naming `TRANSFER_WORDINGS`, with its pin moved. I kept the chair's word and did not get around the walker.

Base `6e697f5db` (the lane tip with U4 merged green at `0702dc894`). Commits: `19f66e592` (code, tests, measure) and the commit carrying this report. Nothing pushed. No pull request.

## What changed (under `_seatLawVersion: 2` only, read by `seat/seatLaw.js :: seatsByHolder`)
- `rulingPower.js :: transferRulingPower` with `keepsForm`, which is private. The rule is `seatTable.js :: pairLicense(contestKindOf(winner), form)`:
  - `own` or `civic`: the form is KEPT. The governing row keeps its name, category and desc. `previousGovernments` gains no row.
  - `licensed`: the form is kept only when the licence's circumstance is in the new `opts.seatCircumstances` (a list, or a thunk returning one). Absent means not held, so it fails closed.
  - `fallback` or `none`: today's path, unchanged.
- **The retired edge.** Every edge on the seat whose narrative is the "power behind" sentence for another power becomes `competitive`, worded "<old holder> held the <form> until <taker> took it." Both powers are named. No edge is deleted and none is added. This runs on the kept path and on the renamed path. The pair is read as the transfer found it, so a demoted house's edge is covered too.
- **The kept form's `recentConflict`.** Two new lines: "<taker> seized the <form> and left the government as it stood." for a coup, and "Power passed to <taker> by <cause>; the <form> stands as it was." for any other cause. Neither says "reshaped".
- **`holderOfSeat.js` changes (the list and the sentence type only).** `TransferSentence` gains `'retired'`, per cure (1). `TRANSFER_WORDINGS` gains two `'conflict'` rows and one `'retired'` row. No row was replaced. The class counts are now edge 1, conflict 5, retired 1.
- `rulingPower.js` imports `seatLaw.js`, a leaf with no imports. It never imports `seatCircumstances.js` or `holderOfSeat.js`.

**JUDGMENT CALL (vetoable): a kept form under a demotion.** The brief asks that the demoted house live as its own row and that no two rows share a name. A kept form keeps the governing row's name, and today's demoted-house row would also take that name. So under a kept form no house row is appended, and `transfer.incumbent.demoted` is false. The body was never reshaped, so nothing a demotion exists to preserve was lost. A former holder that is a power already stands as its own row. An explicit `demoteIncumbent: true` is overridden by a kept form. The renamed path's demotion is unchanged under the law, as arm (5)'s control shows.

**MISMATCH, not wired.** The brief names `rulingPowerCoup.js :: resolveCoupVerdict` and `worldPulse/coup.js` as the callers that pass the circumstance. Neither one calls `transferRulingPower`. The coup verdict's transfer is applied in `worldPulse/applyWorldPulse.js` (its `powerTransfer` branch), which is outside my manifest. So **no caller passes `seatCircumstances`**, and in live play a licensed pair keeps falling to the winner's own form (fail closed). The callers, every one passing nothing:
- `events/mutateWorld.js :: changeRulingPower` (two calls)
- `worldPulse/applyWorldPulse.js` (power_transfer outcomes)
- `worldPulse/applyWorldPulseFactionRoster.js` (`government_change`)

The wiring is one argument in `applyWorldPulse.js`, a lazy module: `seatCircumstances: () => seatCircumstancesOf(<the settlement handed in>)`. That is the lane's owner's to authorize.

**The chair's condition 2, checked surface by surface, no STOP.** With the form kept, each of these names the taker:
- (a) `recentConflict`
- (b) the power-behind edge
- (c) `ascendant`

Arm (8) shows these three. (d) was CONFIRMED by reading the code:
- `coup.js`'s headline and `government_overthrown` reason name the winner.
- `mutateWorld.js :: changeRulingPower`'s detail names `transfer.authorityName` ("…; the government now sits as a <form>"). That stays true with the form kept.
- `registry.js :: CHANGE_RULING_POWER.narrate` names the target.

## Red and green per arm (targeted vitest; `seatTransfer.test.js` is new)
| arm | red at base | green at tip |
|---|---|---|
| (1) civic kept: city and town | 2 of 2 | 2/2 |
| (2) none and fallback, law equals old byte for byte | 0 of 3 (today's path by design) | 3/3 |
| (3) licensed: Royal Authority with and without trade wealth; nothing handed in; old law; condition 1 measured | 2 of 5 | 5/5 |
| (4) one R1 taker after every transfer (MC→MCC→Ducal→MCC; three on a kept form; a town) | 3 of 4 | 4/4 |
| (5) demotion with a kept form | 2 of 4 | 4/4 |
| (6) town: the person and the cards are unmoved | 1 of 1 | 1/1 |
| (7) old law byte-identical, every cause (digests recorded from base) plus its negative control | 1 of 2 (the control) | 2/2 |
| (8) condition 2, every cause | 5 of 6 | 6/6 |
| (9) CS22 guard on arm (3)'s town, plus a planted keeper-king | 1 of 2 | 3/3 (born-monarch read added green) |
| (10) cure (1): the `'retired'` class | 1 of 2 | 2/2 |
| `holderOfSeat.test.js` arm (11): the law loop, then counts 5 and 1 | 2, then 1 | 51/51 |

Totals: `seatTransfer` 32/32 and `holderOfSeat` 51/51 at the tip. The governing suites are the 61 test files naming `rulingPower`: 1357/1357.

## Gates
- `typecheck:ratchet` 167/167.
- `typecheck:domain:strict` 1113/1113 (`rulingPower.js` stays at 3).
- `lint`: 0 errors, none of the warnings in my files.
- **`tests/lint` whole: 3 failed / 3268 passed.**
  - `negativeAssertionAnchor` was cured by anchoring my three negative assertions. It is green on re-run.
  - The `sovereigntyLightingContract` census arm: the file count goes 3709 → 3710. The one new file is `tests/domain/seat/seatTransfer.test.js`.
  - `statusUnionTotality` A3: see Outcome above.

**Confinement:** `confine-two.sh 6e697f5db 19f66e592` gives EQUAL.
- base: all `36ee5bb0bea0bb3fcc6bd83f1e9e732b4dc643f09e0844545c64785798d8ce89` 1245
- tip: all `36ee5bb0bea0bb3fcc6bd83f1e9e732b4dc643f09e0844545c64785798d8ce89` 1245

## Size (fresh `npm run build`, then `verify:dist`, at base and at tip)
| | base | tip | delta |
|---|---|---|---|
| first paint, raw | 1,178,471 | 1,179,486 | +1,015 |
| first paint, gzip | 375,040 | 375,386 | +346 |
| first paint, Brotli | 314,781 | 315,266 | +485 |
| worker | 2,597,915 | 2,598,229 | +314 |
| engine chunk | 910,877 | 910,877 | 0 |

All of these budgets were already red at base. The same 13 build rows fail at base and at tip. No ceiling was re-recorded.

## The pools (`u5/measure-u5.mjs --force-law _seatLawVersion=2`, one command; every rate under today's standing)
**Default pool, 900 towns** (first coup):
- OLD: 0 kept, 660 renamed.
- LAW: **36 kept (5.7%)**, 595 renamed.
- Pair classes: own 14, civic 22, licensed held 0, licensed not held 0, fallback 363, none 232.

**Presets pool, 960 towns:**
- OLD: 0 kept, 667 renamed.
- LAW: **88 kept (13.6%)**, 559 renamed.
- Pair classes: own 50, civic 29, licensed held 9, licensed not held 7, fallback 135, none 417.

**Both pools:**
- **R1 answers more than one taker: 0 under the law** after each of three coups in a row (OLD also 0).
- **The fail-closed rule (`unattributedTransferOn`) fires in 0 towns after every transfer**, read by `holderOf`'s answer and by the predicate.
- Retired edges: 1008 (default) and 1020 (presets) written, every one in the `'retired'` wording, none readable as an `'edge'` wording.
- FORCED births differ from LAW only in the towns whose forced birth U4 already found different (town-22; lawless_frontier-8, theocracy-6).

**Condition 1 (CS22).** 5 towns keep a crowned Royal Authority, all taken by Merchant Guilds. `holderOf` names "the monarch", with `personRule` 'crown'.
- The person KEEPS no other house: 0 towns. The monarch is a member of Noble Houses or Families at rank null or 3, never its keeper. **The guard is not red** where the leaf names a person.
- **A finding for U12 and the titles lane.**
  - `officeWordInfo` reads the born title "the monarch" as null. Read bare, as CS22 (d) spells it, the guard therefore sees no crown on born kings, and the bare read flags 0 towns.
  - With the article dropped, as in my arm (9), the table reads "Lord" and "Lady" as sovereign crown words. That flags noble-house heads ("the lord" or "the lady", keepers of their own houses) in the same 5 towns.
  - Those flags were already there BEFORE the transfer (5 of 5), and none of them is the person.

## Registers that move (named, not re-recorded; the lane's owner re-takes)
- `tests/lint/.lighting-census-baseline.json` (sovereignty census): files 3709 → 3710.
- `statusUnionTotality` derived trigger: `['dead', 'exiled', 'retired']` → `['dead', 'exiled']`. The chair's to rule.
- `scripts/.observed-shape-readers-baseline.json` manifests, the `src/domain/rulingPower.js` rows:
  - recorded: sha `f31f48ba…`, size 38575
  - base: `555abd8a…` (already stale before U5)
  - tip: `625207c5…`, size 41192
  - The finding inventory is unmoved: 2214, an exact match.
- Unmoved:
  - `.tuning-inventory.json` (bareDecimals 15, unregisteredNamed 1)
  - `presumedThings.widened.register.json`
  - `.domain-strict-baseline.json` (3)
  - `factionNamePrecedenceScan`
  - `writerReach`
  - wiring census
- Worker +314 B.

## Not done
- No caller wired (see the mismatch above).
- No card touched.
- `factionDynamics.js`, `rulingPowerCoup.js` and `coup.js` untouched.
- The `statusUnionTotality` red is left for the chair.

**CONFIRMED vs PLAUSIBLE.**
- CONFIRMED by executed tests, measures and the build: the old law is byte-identical, R1 reads one taker, fail-closed fires 0, the confinement is EQUAL, and the size deltas are as tabled.
- PLAUSIBLE until the lane's owner wires the coup path: that the licensed kept form appears in live play.
