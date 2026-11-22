# TRAD-4 · UNIT 6 — THE MEASURES ON THE FINAL LEAF, AND THE OWNER'S SAMPLES (30 BY THE FAIR RULE, 12 FROM TOWNS IN CRISIS)

Written 2026-11-20 13:5x UTC by TRAD-4; DISPATCHED at 34b71577f (units 7 and 5 merged).
Read `TRAD-2-COMMON.md` first; it binds you (read "TRAD-2" there as "TRAD-4"). Base: `lane/trad-4-2026-11-20` at
`34b71577f` (units 7 and 5 merged). Unit 8 is built beside you (tests/security only): path-disjoint. THIS UNIT CHANGES NO SOURCE AND NO TEST.

## Files you may change
Under `docs/chair/2026-11-20/content/traditions/` only: `tools/measure2.mjs`, `tools/trad-pool.mjs`, `tools/samples.mjs`,
`tools/measure.mjs` (edits to the lane's existing tools: the chair's word "no new measuring helpers"), new files under
`out-trad4/`, and the three owner files named below. Nothing under `src/`, `tests/`, `scripts/`. Anything else: STOP.

## 1. THE MEASURES (CTR8 on the final leaf), owner AND reader, written to `out-trad4/measure-<audience>.txt`
- The 432 pool (`tools/trad-pool.mjs <dir>`), then `tools/measure2.mjs` for each audience: keeper, cause, payer
  (economy), the short form, BY ELEMENT AND BY SIZE (tier); the ten most repeated whole descriptions and shapes with the
  town's name masked; distinct counts.
- THE PER-SLOT POOL SECTION prints EMPTY today: find why (read `src/domain/facts/presumptionLedger.js` and what
  `drawDeclared` records; do not edit either) and re-point `measure2.mjs` so each slot prints: draws, distinct lines
  printed, THE POOL-DOMINANCE FIGURE (the most printed line's share), and the lines refused on the pool with what
  replaced them (twin / argmax / nothing). If the ledger cannot see a slot, say so and measure that slot by re-reading
  the drawn line from the description's own parts instead.
- CTR11's OTHER DIRECTION, for the owner's list: on the 432 pool, count the printed rites whose OWNER economy sentence
  differs from the READER's because a row of the hideable class stands among the town's incomes (the owner, with the
  criminal income shown, ranks with it; the reader ranks without it). Quote up to three such pairs, town masked.

## 2. FOR THE OWNER: THIRTY DESCRIPTIONS BY THE FAIR RULE → `../TRAD-4-SAMPLES-30.txt`
`tools/measure.mjs` (owner audience) writes the rows; `tools/samples.mjs <rows.json> <out> 5` picks, per tier, the
printed rites ordered by `fnv1a32(seed|rec.id)`, the first five: 30, by hash, never by hand. Each: town (tier, culture,
terrain), the rite's name, its description, what it drew on, `[SHORT FORM]` where it is one. Head the file with one
line saying how they were drawn. Plain text, no markdown tables.

## 3. FOR THE OWNER: TWELVE FROM TOWNS IN CRISIS, EACH BESIDE THE SAME RITE'S CALM READING → `../TRAD-4-SAMPLES-CRISIS-12.txt`
- Births: give `tools/trad-pool.mjs` an optional second argument, a crisis key; with it every town is born with
  `{ ..., selectedStressesRandom: false, selectedStresses: [<crisis>] }` and the SAME seeds as the calm pool. Crises:
  `famine`, `under_siege`, `occupied`, `wartime`, `plague_onset` (read the stress keys the engine holds; never invent
  one; if one is not a key, say so and drop it).
- The pick, by rule: over every printed rite of every crisis town, ordered by `fnv1a32(crisis|seed|rec.id)`, take in
  order the first rite whose SAME rite (same `id`) is printed in the same seed's calm town, until twelve, at most three
  per crisis and at least two per crisis where two exist. Count and state the rites skipped because the calm town does
  not print the same rite (the crisis can change what is shown: say how often).
- Each entry: crisis, town (tier, culture), the rite's name; CRISIS reading; CALM reading; and, where they differ, which
  line was refused under the crisis and what replaced it (twin / argmax / nothing). Head the file with the rule.
- Also state, over ALL crisis rites (not only the twelve), how many read differently from their calm reading and by
  which pools.

## 4. `../TRAD-4-MEASURES.txt`: the figures of §1 in plain words for the owner (before = TRAD-3-HANDBACK §5, after =
yours), one short paragraph each: how often a description names a keeper, a cause, a payer; how often it is the short
form and in which sizes (below village size the short form is a whole sentence, not a gap: CTR8's fact); the most
repeated description and how many towns in a hundred carry it; whether any slot's pool is dominated by one line.

## Commit
ONE commit on your branch by explicit paths, hooks ON. No gate beyond: the tools run to exit 0; `npx eslint` is not
required on these tool files unless the repository's lint covers `docs/` (check `npm run lint`'s globs and say).
