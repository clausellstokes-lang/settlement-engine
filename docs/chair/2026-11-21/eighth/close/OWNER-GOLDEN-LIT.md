# For the owner: the lit golden twin, prepared and shown, NOT signed

Written 2026-11-22 16:49 UTC (read from `date -u`) by the GOLDEN-LIT builder for CLOSE-1, on branch
`lane/close-1-2026-11-22-golden-wip`, cut from the lit ref 217b628f3 (the working line at point 98 plus the three
dials). Nothing here is recorded. No manifest is in the tree, no shift record was written, and nothing was signed.

## What this is, in one paragraph

The golden master checks 525 sample places every time the tests run. It births them the OLD way, without the laws a new
world is born under today, so flipping a dial never moves it. The new twin,
`tests/property/generatorGoldenMasterLit.test.js`, births the same 525 places with the same seeds the way the product
births a NEW world (through `birthConfig`). Its reference file can be written only through the signed door, so until you
sign, the twin is red by name ("manifest exists"), the same way the old master is red when it has no reference file.

## (1) How many of the 525 places read differently, lit against dark

Every one of them: **525 of 525**. By size:

| size | places | differ |
|---|---|---|
| thorp | 84 | 84 |
| hamlet | 84 | 84 |
| village | 84 | 84 |
| town | 105 | 105 |
| city | 84 | 84 |
| metropolis | 84 | 84 |
| **all** | **525** | **525** |

This holds both against the dark master's committed reference file and against the dark births of this same tree.
Two things to know before reading it as "the three dials moved everything":

- **The lit birth carries FOUR laws, not three.** `birthConfig` on this tree mints the density law, the living-content
  law, the seat law and the fortune law, all at version 2. Density and living content were lit before today. The old
  master never births through `birthConfig`, so it has never seen any of the four. The 525 is the four laws together,
  not the three dials alone.
- **The old master does not reproduce its own reference file on this tree.** Born here the old way, 0 of the 525 places
  match `tests/fixtures/generator-golden-master.json`, last recorded 2026-11-19 for points 54 to 70. The three dials
  cannot cause that: both readers of the seat-contest dial check the world's own seat law first, and an old-way birth
  carries none. So the line has moved the old master since its last record. That is CLOSE-1's to class, not this page's.

What moved inside those rows, lit against dark, born on this same tree:

| what the record holds | thorp | hamlet | village | town | city | metropolis | all |
|---|---|---|---|---|---|---|---|
| prosperity (`economicState.prosperity`) | 48 | 60 | 72 | 29 | 60 | 61 | 330 |
| ruler's standing (`powerStructure.publicLegitimacy`) | 84 | 84 | 84 | 104 | 84 | 84 | 524 |
| who holds the seat (`holderOf`, read by the owner) | 0 | 48 | 0 | 4 | 0 | 22 | 74 |
| the crisis's powers (`stress.cast.stakes`) | 84 | 84 | 84 | 96 | 84 | 84 | 516 |
| the powers and their strength (`powerStructure.factions`) | 84 | 84 | 84 | 105 | 84 | 84 | 525 |

## (2) Three places, before (dark) and now (lit)

**A riverside hamlet** (germanic, on a river, a civilized land; seed golden-master-v3; Schwarzwalde).
- Prosperity: Poor, now **Comfortable**.
- The ruler's standing: 38, Contested, now **58, Tolerated**.
- Who holds the seat: the seat is a Feudal Stewardship with Karl Koch in it. Before, the Manor Household held it; now
  nobody outside holds it (an appointed form whose appointer the record does not name).
- The crisis (Infiltrated) and its powers: before, the Stewardship lost and three other powers were split; now the
  Stewardship is the hamlet's only power (strength 100), and it alone loses.

**A plains town** (germanic, on a river route, a civilized land; seed golden-master-v3; Schwarzwalde).
- Prosperity: Moderate, now **Comfortable**.
- The ruler's standing: 48, Tolerated, now **68, Approved**.
- Who holds the seat: the Town Mayor's seat, Pilgrim Wolf in it. Before, the Merchant Guilds held it; now the office
  holds itself.
- The crisis (Infiltrated) and its powers: seven powers before (the Mayor at 22), four now (the Mayor at 32). The Mayor
  and the Religious Authorities lose; the Guilds and the Guard are split; the Craft Guilds, the Independent Bloc and the
  Landed Gentry are gone from the town.

**A forest metropolis** (south Asian, isolated, a civilized land; seed golden-master-v3; Suryaganj).
- Prosperity: Comfortable, now **Poor**.
- The ruler's standing: 65, Approved, now **37, Contested**. The new law judges a great city against cities, not
  against hamlets.
- Who holds the seat: the City-State Council's seat, Arjun Parekh in it. Before, the Craft Guilds held it; now the
  Merchant Guilds do.
- The crisis (Infiltrated) and its powers: before, nine powers, with the Thieves' Guild gaining and the Religious
  Authorities losing; now seven, with the Religious Authorities split, the Peerage new, and the Craft Guilds, the
  Independent Bloc and the Thieves' Guild gone. The Council still loses.

## (3) The command, AFTER your signed shift record exists

Your shift record (a file under `docs/shift-records/`) must name the surface `generator-golden-master-lit` with
`predictedRows: 525`. **One step comes first, and it is not a seat's:** the door refuses a surface with no row in
`tests/fixtures/.golden-freeze-register.json`, and that register has no row for this surface yet. A row cannot be added
ahead of the reference file, because the freeze walker reds any row whose file does not exist, and any row without
your `ownerRow`. So the row is part of your signing act, written by whoever you have the act carried out by. Then:

```
GOLDEN_SHIFT_SIGNED=docs/shift-records/<your record>.json UPDATE_GOLDEN=1 \
  npx vitest run tests/property/generatorGoldenMasterLit.test.js
```

It takes about **50 seconds** of births here (47.9 s and 49.8 s measured in two scratch captures; the old master takes
about 64 s). The run then fails **on purpose**: that is the door's way of saying "written". Then run the same file
again without the two variables, and run `tests/lint/goldenFreeze.walker.test.js`. Those two green runs are the
receipt.
