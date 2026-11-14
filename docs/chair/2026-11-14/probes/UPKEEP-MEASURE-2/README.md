# UPKEEP-MEASURE-2 probes (2026-11-14): how every figure is re-made

Measured at the defence lane's tip **c56fd565e** (read back from origin at the start; it did not move). The three files
ruled on (`defenseGenerator.js`, `defenceWeights.js`, `defenseInstitutionBuckets.js`) are byte-identical there to the
capacity stage's 9354d792a, which the reader measured. Nothing here is built: every candidate is a `.patch` under
`patches/`, applied to a detached scratch worktree of c56fd565e (outside every repository tree, `node_modules`
symlinked from the tip worktree, where `npm ci` ran).

## Trees (scratch worktrees, each `git worktree add --detach <dir> c56fd565e`, then `git apply` the patches named)
| label | patches | what it is |
|---|---|---|
| tip | none | the defence lane's tip |
| def | none, at 6e61d042a | the reader's DEF: the tip's defence before the capacity stage (P5 only) |
| c2 | `c2.patch` | P2, the chair's candidate: limit 1 score by score, and readiness's sustaining total held to the force |
| c2b | `c2b.patch` | P2's rival: limit 1 holds the supply score alone |
| c3 | `c3.patch` | P3: a house on no ladder of a laddered part placed by its size |
| c4 | `c4.patch` | P4: the military score full at its people's measure (`people.milPerHead` 1) |
| cx | `cx.patch` | X1 to X5, the residue the probe finds once P2 is in (the will's hold score by score, its floor, the traditions' cap on counted points, the siege's two reliefs, the monasteries keyword) |
| c2x | `c2.patch` + `cx.patch` | P2 with the residue |
| call | `call.patch` (= c2 + c3 + cx + P4 + X9 composed) | every candidate together |
`p4x9.py <tree> P4|X9|P4,X9 [milPerHead]` writes P4 and X9 into a tree (how c4 and call were made).

## Instruments
- **`mono.mjs`** (the reader's, unchanged, from lane/review-upkeep-capacity-2026-11-14): `TREE=<tree> node mono.mjs <recdir> all.seeds <out>`.
  At the tip it reproduces the reader's `mono.tip.ndjson` BYTE FOR BYTE (sorted): 1,206 fall rows in 265 births.
  It reads military, monster, internal, economic and readiness, NOT the magical score. `monosum.py <out>` tables it.
- **`born.mjs`**: `TREE=<tree> node born.mjs <seedfile> <outdir> [shard] [shards]` births the reader's seeds (render5.mjs's
  `cfgFor`, copied) through the whole pipeline at the tree; writes `<outdir>/rec/<seed>.json.gz` and a summary row per
  birth in corpus2.mjs's shape (`compare.py` reads it). 972 births in 26 s on 4 shards.
- **`mono2.mjs`**: the monotonicity probe widened: ADD every catalogue house (282 names) written at the tier or one
  around; ENLARGE every ladder pair of `UPGRADE_CHAINS`; all five scores and readiness. The reader's own set (houses
  that open a scaled part; pairs sharing a scaled job) is marked `r:1`. `sh runmono2.sh <tree> <recdir> <seeds> <prefix>`
  runs it on 4 shards; `sh run972.sh <label>` births the 972 at `wt/<label>` and runs it. `monosum2.py <ndjson> [N]`
  tables it (`results/mono2.<label>.txt`, raw rows `results/mono2.<label>.ndjson.gz`).
- **`why3.mjs`, `dims.mjs`, `parts2.mjs`**: one record's parts before and after one change (readiness points; score
  points per dimension; score points per part). `dims.mjs` and `parts2.mjs` write an UNTRACKED debugging copy of the
  tree's generator exporting `computeDefenseScores`, and remove it after.
- **`milparts.mjs`**: per birth, the military score, its band, the population and each part feeding military.
- The lane's corpus of 3,756 births: `corpus2.mjs` with `compare.py` (docs/chair/2026-11-13/probes/UPKEEP-CAPACITY/),
  `CAP_CANDS=base node corpus2.mjs <tree> census.json <dir>/c2-<i>.ndjson <i> <n> 0`, then `python3 compare.py <a> <b>`.
