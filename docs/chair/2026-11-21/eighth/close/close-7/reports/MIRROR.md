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
