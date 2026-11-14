# COHERENCE-UPKEEP-5, stage one: the parts probe (2026-11-13)

Writes nothing in any tree. MEASURES ONLY; nothing here is product code.

- `parts.mjs`: `today(settlement, keep)` recomputes today's readiness term by term (it must equal the
  birth's `defenseProfile` on every birth: the receipt that every term is classed); `itemise(settlement,
  keep, 'V1'|'V2', monthsPre)` lists the parts, applies each crisis once to the parts it touches, and sums.
- `births.mjs <tree> <out.ndjson> <shard> <shards> [parts]`: births the 3,036 (the reviewer's cold births,
  forced famine/siege/war, fresh seeds, eight other crises). With `parts`, the tree must carry
  `measure-lines.patch` (the label before any crisis with its draw replayed; the stores at that label's
  share): `git apply` it on a scratch copy of the lane tip.
- `an2.py <scratch>`, `towns.py <scratch> <keys>`: the tables and the eight towns' sums (`towns.txt`),
  read from `<scratch>/out/{meas,base}.<shard>.ndjson`. `movers.txt`: the largest moves, by part.

Base: the agreement tip 69b53decd. Today: the lane at 15fa0c569 (the merge of 69b53decd).
