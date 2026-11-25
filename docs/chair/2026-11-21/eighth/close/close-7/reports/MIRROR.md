# CLOSE-7 — THE MIRROR (chain one), as built

Brief: `close-7/briefs/MIRROR.md` (6922542d5) and R24d lines 10–12. Tree: `/home/user/wt/mirror` on
`lane/close-7-2026-11-24-mirror-wip`, cut at e7441a93f. Receipts: `close-7/mirror/`. Written as it goes (allowance warning).

## 1. How a line's id is minted, and K1 / K2

A pool line is `{ id, text, needs, excludes? }`. The id is the line's number in the lines document that wrote it
(`foodCulture.js` head: "the id is the line's number in LINES-2 § 1"; `dawnWork.js` head: "its LINES-1 / LINES-1b
number"): a letter for the branch as the document named it and a number in that branch (critical C0–C7, collapsed
X0–X3, surplus.wanting W0–W4; Dawn Work food F0–F6). No code reads an id: the deriver filters by `needs`/`excludes`
and picks by index (`pickVariantMixed`); no test or register in `src/`, `tests/` or `scripts/` names C7 or F6 by id.

- `FOOD_CULTURE` (every branch): ids A0–A16, C0–C7, S0–S12, T1–T11, W0–W4, X0–X3. **K2 is not taken.**
- `DAWN_WORK` (every branch): ids B0–B27, C0–C2, F0–F6, M0–M6, S0–S1, W0–W15. **K1 is not taken.**
- Elsewhere: `src/data/dailyLife/recentChanges.js` uses K0, K1, K2 in several of ITS branches (a different pool and
  slot, `recent_changes`; it repeats K1/K2 across its own branches, so its ids are branch-local there too). Not a
  collision in the pools the two lines enter; I read "taken in a pool" as the receiving pool and build. If the chair
  reads it as any pool, the two ids are the only thing to rename; nothing keys on them.

## 2. The build (as committed; the commit is named in § 5)

- **The hold goes** (`src/domain/dailyLife.js :: fareBandOf`): a printed Famine over production adequate or surplus reads
  `critical`, like every other Famine (R24d's table: "every production but collapsed reads critical").
- **The declared condition: a new atom, `food production: ≥ adequate`** (`factVocabulary.js`, a band over
  `FOOD_PRODUCTION_RUNGS` collapsed..surplus; new vocabulary, so on the owner's veto list beside the two lines). It reads
  the place's OWN production band, the capacity model's `food_production` band, through its one home
  `src/domain/facts/foodProduction.js :: foodProductionOf` (getter `factsOf(r).foodProduction`; LEAVES row in
  `factLayers.js`).
  - **Why a context atom (a judgment call, vetoable):** the band cannot be derived inside a fact home. `capacityModel.js`
    reaches `factsOf.js` through `threatProfile.js`, so a home that imported the model would close a dependency cycle,
    and `tests/architecture/layerBoundaries.test.js` holds the cycle set shrink-only (one allowed cycle). So the atom
    reads the capacity profile the caller already holds, handed as its context (`ctx.capacities`), the way `own house`
    reads the card handed to it. `dailyLife.js` hands its own `ctx.capacities` (the same profile `fareBandOf` reads) to
    the two pools' `filterDeclared` calls. With no profile handed the atom is unanswered, so a line that needs or
    excludes it is refused (fail-closed).
  - No existing atom serves: `failed: <source>` holds wherever the famine stress holds (`foodGenerator.js`: the failed
    source is the first source whenever the stress stands), including the cell; `food surplus` (growsMoreThanEats) is
    not production ≥ adequate.
- **The lines** (the chair's words, verbatim):
  - `FOOD_CULTURE.critical`: C7 gains `excludes: ['food production: ≥ adequate']`; **K2** appended right after it,
    `needs: ['fish', 'food production: ≥ adequate']` (C7's need, plus the atom).
  - `DAWN_WORK.food`: F6 gains the same exclusion; **K1** appended right after it,
    `needs: ['institution: farmland', 'tier: ≤ village', 'food production: ≥ adequate']`.
  - K1 keeps F6's two needs although its words no longer name the fields. This is a judgment call: it makes K1 eligible
    exactly where F6 was, so it stands in F6's index of the eligible list and the keyed pick moves nowhere else.
    `tier: ≤ village` is also what its own words presume ("every hand that can be spared", ruling 8).
  - **Why no other page can move:** outside the cell, the atom is false, so C7 and F6 are eligible exactly as before and
    K2 and K1 are not. In the cell, each swap keeps the eligible list's length and order. The only cell where
    production is adequate or better and the fare reads critical or worse is printed Famine: every other printed band's
    bound tops out at strained or better for that production.
- **The pattern:** row **PLENTY** "a line of plenty beside a printed Deficit or Famine" (`pageCensusFindings.js`, class
  CROSS). Its lines are the fare's `surplus`, `surplus.wanting` and `adequate` lines (the branches R24d's bound gives
  only a page that prints Pressured or better), matched by their printed form as FOODSEC's are, on a page whose
  `famineOf().shownBand` is `deficit` or `famine`.
  - Planted in `tests/domain/coherence/pageCensusFindings.test.js`: A3 beside a Famine reds; the halves control reads
    nothing; beside Pressured it reads nothing; beside Deficit it reds.
  - Enrolled by hand in `scripts/census/page-census.register.json`: master, integration and base null; banked 0. Its
    `_notes` entry `2026-11-25-close-7-mirror` says the 720 door run is NOT taken in this unit.
- **Pins re-stated by their cause:**
  - `tests/domain/close7FoodFact.test.js`: dp-village-51's row reads `critical`, not the held `adequate`; the shortage
    classing goes 43 → 45 (K2 and K1 sit in the critical fare and in Dawn Work's food branch).
  - `tests/lint/foodBandReaders.walker.test.js`: `src/domain/facts/foodProduction.js` is classed (1 reading line,
    SAYS SOURCE: it decides between the lines that say the source failed and the chair's lines in their place).
- **Own test:** `tests/domain/close7Mirror.test.js`, arms (a)–(d), described in its header.

## 3. A FINDING ON THE BRIEF'S PREDICTION: the cell does not draw C7, and draws F6 on two places of seven

The brief says the cell's fare "draws C7" and its Dawn Work "draws F6", and asks for proof that "the 4 / 3 places now
print K2 and K1". By derivation on the seven places (`close-7/mirror/cell-{before,after}-{C,V}.jsonl`), under the bound:

- **The fare:** no cell place's keyed pick lands on C7's index (C7 needs `fish`; the picks land on C0–C4). So **K2 prints
  on none of them**, and on no other page of C or V either (outside the cell K2 is not eligible).
- **Dawn Work:** two picks land on F6's index, **C dp-hamlet-117 and V dp-hamlet-139**, and these now print **K1**.
  The other five take the food branch's other lines: F1 "the search for food" on three of them (C dp-village-54, C dp-village-76, V dp-hamlet-100), F3 hunters on C
  dp-village-51, F5 beasts on V dp-village-76.
- **The cure still holds as ruled:** no cell place prints C7 or F6, and the condition is declared for any later place
  where the pick lands there. The seven pages move because the hold is gone. That is R24d's ruled move (C 4, V 3): the
  fare goes to the critical lines, the food grievance now fires (R24h), and Dawn Work takes the food branch.
- I did not stop on this, because the brief's only stop is an id collision. I report it here for the chair.

## 4. Proof (filled in as each run lands)

**The cell on the before tree** (`food-of.mjs` over the before tree, 900 + 900): printed Famine over production adequate or
surplus is exactly C dp-hamlet-117, dp-village-51, dp-village-54 (surplus) and dp-village-76; V dp-hamlet-100,
dp-hamlet-139 and dp-village-76. That is C 4 and V 3, as A2's table had it at d447ee31e.

**Red first, the row (the page battery over the before tree).** The before tree is e7441a93f's tree (`git archive`) with
only `pageCensusFindings.js` taken from the build, so the before pages are read by the new row.
- C: **PLENTY 4**, on dp-hamlet-117, dp-village-51, dp-village-54 and dp-village-76: exactly the cell, by seed.
  Every other row: as below.
- V: **PLENTY 3**, on dp-hamlet-100, dp-hamlet-139 and dp-village-76: exactly the cell, by seed.

**Red first, the test** (`tests/domain/close7Mirror.test.js` run on the before tree's source through a scratch tree;
nothing was written to any tree; `close-7/mirror/red-first-before.log`): **13 of 20 are red.**
- All seven cell places are red by name, each on the fed fare it printed: six read the `adequate` branch, and C
  dp-village-54 reads `surplus.wanting`.
- Arm (b) is red ×4: the words and the atom are absent.
- Arm (c) is red ×2: K1 is not printed on C dp-hamlet-117 or V dp-hamlet-139.
- Green on both trees (7): the five cell places of (c) that print neither line, and the two controls of (d) (C7 and F6
  stay where the source failed).

**Commit 1: fe948997a** (the build, with its pins, row, register entry and wiring stamp 1455 → 1456). Own four files
(`close7Mirror`, `pageCensusFindings`, `close7FoodFact`, `foodBandReaders` lint arm): **43/43 green.**

## 5. For the owner's veto list (CLOSE-7 carries it to FOR-THE-OWNER)

- **K2** (fare, critical branch, after C7): "Every fish that comes in is counted, and the shares are measured out house
  by house." It needs `fish` and `food production: ≥ adequate`. It printed on no place of C or V (see § 3).
- **K1** (Dawn Work, food branch, after F6): "Every hand that can be spared is out at first light, and what comes in is
  counted before it is eaten." It needs `institution: farmland`, `tier: ≤ village` and `food production: ≥ adequate`.
  It prints on C dp-hamlet-117 and V dp-hamlet-139.
- **New vocabulary:** the atom `food production` (the place's own production band, read off the capacity profile
  handed as its context), and its home `facts/foodProduction.js`.
- **Judgment calls, each vetoable:**
  - A context atom rather than a record-derived one (the cycle, § 2).
  - K1 keeps F6's farmland need.
  - PLENTY's "lines of plenty" are the three fed fare branches whole, A5 and A8 included ("simple stew", "fish is
    the mainstay"), because each is a branch the bound gives only a fed page.
  - "Taken in a pool" was read as the receiving pool (§ 1).

## 6. The gates, and the commits after the first (as they land)

**tests/lint whole on fe948997a** (`lint.log`): 7 red in 6 files, 3370 passed.
- Known reds, not this unit's: proseCorpusBytes RAW and GZIP, and proseComposed A0b.
- The lighting census: the file count moved 3789 → 3790 (this unit's new test).
- Three were this unit's, and each was re-stated by its cause:
  - **presumptionClasses** "no NEW undeclared line": the row's label "PLENTY a line of plenty …" carries the plenty
    class's word in the census file's literals, and the door never banks a new hit. **The row is renamed FEDFARE**,
    "a fare line of a fed band beside a printed Deficit or Famine". That is the chair's "a line of plenty" said without
    the class word. Register, plants and test follow. (Wherever this report says PLENTY above, read FEDFARE.)
  - **presumedThings** ARM1_INSTRUMENTS: pageCensusFindings.js hits 11 → 12 (its label names "Famine").
  - **samenessHideable** PHASE 3 RULE 2: K1's `institution: farmland` is added to the committed hand-pool house list.
- **tests/copy whole on fe948997a** (`copy.log`): **15 files, 172/172, exit 0.**
- The container restarted at about 01:20 UTC during the named-tests run. That run and the after measures reported
  nothing and are re-run below in split runs.

**Commit 2: 366d78ec6.** The rename and the three re-statements. Own four files plus the three walkers:
**133/133 green, exit 0.**

**Commit 3: 4c0051c4d.** The lighting census refrozen by its own door at 366d78ec6 on a clean tree: files
3789 → 3790, parked 491 → 492, credited, titles and suite titles unchanged. The refreeze run fails by design; the
walker run plainly after it is **34/34 green, exit 0.**

**tests/lint whole on 4c0051c4d** (`g2-lint.log`, its own mutex run): **3374 passed, 3 failed, exit 1.**
- The 3 failures are the known three only: proseCorpusBytes RAW and GZIP, and proseComposed A0b.
- A0b reads 2327 against its ceiling of 2103, the same figure as on A2's tree, so it is not moved by this unit.

**tests/copy whole on 4c0051c4d** (`g2-copy.log`): **15 files, 172/172, exit 0.**

**Named tests** (every test file naming a changed file, outside tests/lint and tests/copy: 183 files in five runs,
`g2-named-0{0..4}.log`):
- 00: 423 passed, 1 failed. **colourMarks4h** is red on the before tree too.
- 01: 599 passed, 3 failed: **this unit's**. `dailyLifeDawn`, `dailyLifeFoodResentments` and `dailyLifeNoRepeat` each
  re-derive the keyed pick with `filterDeclared` and no context. The `food production` atom is then unanswered, so their
  oracles refused C7, F6 and K1 where the page held them correctly:
  - hxd-hamlet-2 is a cell place of their own corpus and prints K1;
  - hxd-hamlet-4 prints C7 (production below adequate).
  The oracles now hand the deriver's own context (`ctx: { capacities: deriveAllCapacities(rec) }`). Re-stated by cause.
- 02: 297/297.
- 03: 512 passed, 3 failed.
  - **narrativeQualityCorpus** ×2 is red on the before tree too.
  - **bar5WorldLines (c)** is this unit's: its three r2s famine towns of the surplus band ARE the mirror's cell (they
    print Famine). They printed the `surplus.wanting` lines W1, W4 and W2 under A2's hold; under R24d's bound they print
    the critical fare (C3, C0, C2).
  - The pin is re-stated by its cause: the line is a critical fare line, still never "plentiful". These seeds are of the
    720 door's own prefix, so the 720 run should also show the cell there.
- 04: 280/280.

**The fare's and Dawn Work's slots on C (`food-of.mjs`, before = the before tree, after = 4c0051c4d;
`close-7/mirror/food-compare-C.txt`):**
- The Daily Life moved on **4 pages of 900**, exactly the cell: fare 4, grievance 4, visitor 2, Dawn Work 4.
- K1 prints on dp-hamlet-117. K2 prints nowhere, and neither does C7.
- F6 prints on the same 9 places before and after.

**The fare's and Dawn Work's slots on V** (`close-7/mirror/food-compare-V.txt`):
- The Daily Life moved on **3 pages of 900**, exactly the cell: fare 3, grievance 3, visitor 1, Dawn Work 3.
- K1 prints on dp-hamlet-139. K2 prints nowhere.
- C7 prints on the same 3 places before and after (dp-thorp-70, dp-hamlet-41, dp-town-89), and F6 on the same 17.

**Commit 4: 62efe59ee.** The four pins of the named tests re-stated. Those four files: **36/36 green, exit 0.**

## 7. The proof, whole (every run on the after tree is at 4c0051c4d's source; 62efe59ee changes tests only)

**The page battery** (`read25/page-battery.mjs`; before = e7441a93f's tree with the new row's reader, after = the
build). Receipts: `close-7/mirror/battery-{before,after}-{C,V}.table.txt` and `battery-diff-{C,V}.txt`.
- **Born records moved: 0 of 900 on C, 0 of 900 on V** (the battery's record hash). The cure is on the page only, so
  no golden or frozen surface moved (N6), and no golden byte change was dropped. None of this unit's files is in
  `tests/fixtures/.golden-freeze-register.json`.
- **FEDFARE: C 4 → 0, V 3 → 0.**
- Every other row is equal before and after on both corpora (P3source, NOHEAL and FOODSEC at 0).
- **Pages changed by this unit: C 4, V 3, the cell's places only.**
  - V: the battery's page hash moved on exactly those 3.
  - C: the page hash moved on 7. The 4 cell places, plus dp-thorp-0, dp-thorp-2 and dp-thorp-3, each the FIRST birth
    of its battery worker.
  - Those three are not this unit's: their Daily Life is identical before and after (`food-of`). Re-rendered on both
    trees in one plan with another birth first (`plan-thorps-C.json`, `--views`), they read **page moved 0**.
  - The first birth a worker renders does not hash stably from run to run: dp-thorp-1, first in that re-render, hashes
    differently from its own battery runs (`thorps-pagehash.tsv`).
- **The commonest-sentence share of the fare and Dawn Work slots, by size** (places printing the slot's commonest
  sentence / 150; `close-7/mirror/slot-share-{C,V}.tsv`):

  | size | C fare before → after | C Dawn Work before → after | V fare before → after | V Dawn Work before → after |
  |---|---|---|---|---|
  | thorp | 0.113 → 0.113 | 0.127 → 0.127 | 0.113 → 0.113 | 0.100 → 0.100 |
  | hamlet | 0.107 → 0.107 | 0.120 → 0.120 | 0.087 → 0.087 | 0.080 → 0.073 |
  | village | 0.080 → 0.080 | 0.147 → 0.133 | 0.080 → 0.080 | 0.087 → 0.087 |
  | town | 0.100 → 0.100 | 0.080 → 0.080 | 0.120 → 0.120 | 0.100 → 0.100 |
  | city | 0.113 → 0.113 | 0.107 → 0.107 | 0.087 → 0.087 | 0.073 → 0.073 |
  | metropolis | 0.107 → 0.107 | 0.107 → 0.107 | 0.113 → 0.113 | 0.093 → 0.093 |

  No share rises. Three fall, each where a cell place left the commonest Dawn Work sentence for the food branch: C
  village, V hamlet, and C hamlet's tie, where the commonest sentence changed at the same 0.120.

## 8. The gates, in sum
- **Own:** close7Mirror, pageCensusFindings, close7FoodFact, the foodBandReaders lint arm and the three restated walkers
  are green (133/133). The four restated named tests are green (36/36).
- **tests/lint whole** (at 4c0051c4d; 62efe59ee changes no lint file): 3374 passed, 3 failed, the known three only.
- **tests/copy whole:** 172/172.
- **Named (183 files, five runs):** green except colourMarks4h and narrativeQualityCorpus ×2, both red on the before
  tree, and the four this unit re-stated, green since 62efe59ee.
- **Not taken in this unit:** the 720 door run. The r2s famine towns of `bar5WorldLines` show the cell exists in that
  corpus too. Nothing is pushed.

**Commits on `lane/close-7-2026-11-24-mirror-wip`:** fe948997a (the build), 366d78ec6 (FEDFARE and the lint
re-statements), 4c0051c4d (the lighting census), 62efe59ee (the named pins).
