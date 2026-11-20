# SEAT-2 — HAND-BACK (kept current at every push; last written 2026-11-20T07:54Z, read from `date -u`)

Branch `lane/seat-2-2026-11-20`, fast-forwarded to SEAT-1's final tip `a9923e761` when the chair said "THE LANE IS YOURS at a9923e761" (07:39Z). SEAT-1's record stays in `SEAT-1-HANDBACK.md` and `SEAT-1-PROPOSAL.md`; the rulings in `briefs/RULINGS.md`; my lane's working rules appended to `briefs/COMMON.md` ("SEAT-2's lane").

## The rulings as built

| unit | ruling | builder branch | red → green | merged at | state |
|---|---|---|---|---|---|
| U1 THE LAW (dark) | CS10 | `lane/seat-2026-11-20-u1` (B1, staffed by SEAT-1; read line by line by SEAT-2) | wiring test: module absent 0/6 run; module only 3 failed / 3 passed (arms 2 clamp, 4 register, 5 lit); green 6/6 | `cbd97ff63`, census re-taken `dcca344d8` | merged |
| U2 THE TABLE AND THE KIND | CS6, CS4 | `lane/seat-2026-11-20-u2` | – | – | dispatched next |
| U3 THE HOLDER | CS2, CS11 | – | – | – | waits on U2 |
| U4 and after | | | | | wait for the chair's "BUILD-ON at <commit>" |

**U1's receipts at the merged tip** (executed here): `tests/lint` whole 218 of 219 files, 3,257 of 3,258 tests; the one red is `negativeAssertionAnchor.walker` on `tests/build/ensurePlaywrightBrowsers.test.js`, red at the seat base without U1 (run here), the line's own, expected cured by BUILD-ON's merge of the line. The merged `src/` and `tests/` equal the build `b8e978336` byte for byte apart from the census file, so the builder's typecheck (ratchet 167/167, domain strict 1113/1113), lint (0 errors) and governing-suite receipts (474 files, 3,290 passed) stand for it.

## The census, re-taken at each merge (the integrator's; the chair's ruling of 07:39Z)

| after | `.lighting-census-baseline.json` files / credited / titles / suiteTitles | `wiring-census.json` producerIndexFiles |
|---|---|---|
| base (CI-FIT point 75) | 3701 / 3229 / 31162 / 8627 | 1435 |
| U1 | 3702 / 3230 / 31168 / 8628 | 1436 |

## The tables (the proposal's figures; each unit re-measures its own)

- Holder leaf (default / presets): R2 365 / 213 · R3 96 / 243 · R4 413 / 444 · R5 26 / 60; 2 towns where rules disagree. Re-run by SEAT-2 at 06:2xZ: `measure-holder.mjs` reproduces both pools byte for byte.
- Contenders, BEFORE → CS3 (default): craft 2 → 37 · nobles 98 → 115 · arcane 29 → 71 · merchants 450 → 145 · no contender 240 → 269.
- The figures the owner signs (all DARK until the close): CS5's circumstance factors; the card's choice (Crime Bosses where criminal operations ≥ 3 AND operations ÷ lawful effective sources ≥ 0.75 AND black market share ≥ 20); CS16's raised corruptible draw; the principal front's rate 0.0897 per eligible head.

## Stored figures that move

None. The law is dark: no golden row, no stored town, no born fixture moves until U8 (the owner's light). The two census files above are counts of the tree, not stored figures.

## Twelve towns' ruling lines, before and after

Owed by U7 (the page).

## Executed vs plausible

Executed: every receipt above. PLAUSIBLE: U1's lit mint is proven through a mocked module (the living-content test's own seam); its real lit branch runs first at U8.

## What a reader should attack

SEAT-1's proposal section (8), kept current as units land. Added by U1: the key `_seatLawVersion` rides `config` into the public projection like the two laws before it; it says only which law a world was born under.
