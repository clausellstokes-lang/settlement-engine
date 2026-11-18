# FAULTS-ROWS hand-back

Seat FAULTS-ROWS of the round FAULTS (BRIEF-FAULTS, rulings FR3 and FR4). Base d75011e68 (FAULTS-NEED's atom at the
rehearsal base 4288049ba); branch `lane/faults-rows-2026-11-18`. One file of the seat's row touched:
`src/data/institutionDescVariants.js`. Guard: `tests/generators/faultsRows.test.js`. One older test re-keyed:
`tests/generators/houseDescLateReRead.test.js` (count 30 → 32, dated note).

## 1. The items

### Item 1 · THE FAIR (FR3) — CURED

`DESC_LATE_SIBLINGS` (the late re-read, `assembleSettlement.js :: readHouseDescsLate`, after the last roster write; no
draw moves) gains two sets, each keyed by the fair's line, each in its siege twin's form:

| the line (original) | its ONE twin |
|---|---|
| "Regional merchants. Luxury goods available." | "A yearly fair for regional merchants. The luxuries the town wants do not reach it." |
| "Merchants from across the region, and luxuries to be had." | "A yearly gathering of the region's merchants, though the luxuries the town wants do not come with them." |

Each original declares `excludes: ['crisis: under_siege', 'need not brought in: luxury']`; each twin `needs: ['need not
brought in: luxury'], excludes: ['crisis: under_siege']`. The key `luxury` is in FAULTS-NEED's atom (no key missing).

THE ORDER OF THE TWO DECLARATIONS. The siege is the draw's (`DESC_VARIANT_SIBLINGS`, resolved at the draw on the birth's
facts): a town under siege at the draw stores the siege twin, which is no key of the late table, so the late re-read never
reaches it (r2s-under_siege-town-2: the siege twin stands beside "Needed, and not brought in: Quality textiles"). Each
late member also declares the siege off, so a siege settled after the draw never takes the need twin's "held": both
members refused, the original is kept as at the base and noted for the birth check (no such town in the three
populations). The need list is the resource analysis's (layer 4, after the draw): the late re-read is the line's place.

__ITEM1_TOWNS__

### Item 2 · THE QUARTER (FR3) — LEFT BY NAME (a file not on my row)

__ITEM2__

### Item 3 · THE FISH MARKET'S CARD (FR4) — LEFT BY NAME (no atom states the swap's fact)

__ITEM3__

## 2. The rules, before and after

__RULES__

## 3. Every new line, with three towns it prints in (the owner's veto list)

__LINES__

## 4. Declared moves (R5) · field family `institutions[].desc`

__MOVES__

## 5. Stored figures my work moves (the close's; I re-take none)

__FIGURES__

## 6. The net, base and tip, each gate alone (`sh scripts/gate-tail.sh`)

__NET__

## 7. Left by name

__LEFT__
