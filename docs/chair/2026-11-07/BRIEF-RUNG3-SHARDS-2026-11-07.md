# BRIEF — RUNG 3: THE 100,000 AS FOUR SHARDS, MERGED (2026-11-07)

> The chair's draft (cloud chair, session `01FE9mEvGxnFx6WTBkEC6ie9`), finished by the SOAK-MERGE seat with the measured figures of the merge proof (`SOAK_MERGE_2026-11-07.md` beside this file) and the exact commands. Two corrections to the draft are measured: **`--count` is the END index** (the draft's `--from 25000 --count 25000` runs nothing), and **a shard takes ≈ 77 min, not 46** (generation ≈ 46 min plus its own aggregation ≈ 31 min).

FOUR child sessions, each on the landed master at the same sha, each one shard of 25,000:

| shard *k* | command |
|---|---|
| 0 | `node scripts/audit/soak-review.mjs --from 0 --count 25000 --workers 4 --out artifacts/rung3-shard-0` |
| 1 | `node scripts/audit/soak-review.mjs --from 25000 --count 50000 --workers 4 --out artifacts/rung3-shard-1` |
| 2 | `node scripts/audit/soak-review.mjs --from 50000 --count 75000 --workers 4 --out artifacts/rung3-shard-2` |
| 3 | `node scripts/audit/soak-review.mjs --from 75000 --count 100000 --workers 4 --out artifacts/rung3-shard-3` |

The run's output goes to a file and the exit code is read, never through a pipe. **Every shard uses `--workers 4`**, because the driver refuses mixed worker counts: the merge emulates one run's read order. Each shard then packs:

```
node scripts/audit/soak-merge.mjs --pack artifacts/rung3-shard-<k>     # ≈ 1 min, ≈ 73 MB in 0.7 MB parts
```

Expected ≈ 46 min generation (rung 2F: 1,096 s per 10,000 on four cores) + ≈ 31 min aggregation (rung 2F: 751 s per 10,000; the proof: 51 s per 1,000) + 1 min pack ≈ **78 min per shard**.

Each child runs its OWN aggregation and reads its own STOP/CLIMB on its shard: every `cert:*` 25,000 of 25,000, every `coh:*` 0, the bands, the reader kinds outside the rule. It writes `docs/SOAK_100000_RUNG3_SHARD<k>_<date>.md` (rung 2F's record shape: the corpus and the tip, the finding classes, the bands, the declared share, the stop table, CONFIRMED vs PLAUSIBLE). A shard's own line is a reading, not the rung's: a class at 2 settlements in each of two shards is under the `≥ 3` line in each and over it in the union, so only the merged line is rung 3's.

Each child pushes to its own scratch branch `soak/rung3-shard-<k>-<date>` (no pull request, `git push --no-verify -u origin soak/rung3-shard-<k>-<date>`). `artifacts/` is gitignored, so it adds with `git add -f`, by explicit path:
- the record;
- `artifacts/rung3-shard-<k>/findings.jsonl`, `settlements.jsonl`, `run.json`;
- `aggregates/`;
- **`merge-facts/`** (the pack; without it the shard cannot be merged);
- `sample/`.

Never the shards directory (≈ 1.8 GB a shard). Only shard 0 writes sample dossiers: `isSampled` strides 100 below index 6,000 at every end ≥ 6,000, so shard 0 holds the same sixty a single run of 100,000 would, and shards 1–3 hold none. Every file stays under GitHub's 100 MB. The largest is `findings.jsonl`: ≈ 7 MB at rung 2F's finding rate, ≈ 48 MB at rung 1's.

THE CHAIR MERGES with the driver, on any container (the shards directory is not needed). It fetches the four scratch branches, checks each out into its own worktree or copies the four `artifacts/rung3-shard-<k>/` trees side by side, then:

```
node --max-old-space-size=8192 scripts/audit/soak-merge.mjs --out artifacts/rung3 \
  artifacts/rung3-shard-0 artifacts/rung3-shard-1 artifacts/rung3-shard-2 artifacts/rung3-shard-3 > rung3-merge.log 2>&1; echo exit $?
```

The heap flag is required. The merge holds the union's field walk, ≈ 41 KB a settlement measured, so ≈ 4.4 GB at 100,000, above node's default heap of 2.2 GB on these 15 GB containers. Expect **≈ 2 h** (the merge is the aggregation of the union: 91 s per 2,000 measured; linear projection).

The driver refuses shards on different tips or worker counts, a gap or overlap in the ranges, an unpacked shard, and a lost finding. The merged files are byte-identical to what one run of 100,000 on four workers would write in every row-computed table: findings, settlements, finding classes, reader observations, fields and bands, inner categories, chains, both dependence tables, and the verdict (proven at 2,000; `SOAK_MERGE_2026-11-07.md` §2). **Repetition is the exception:** `repetition.json`, `repetition-prose.json` and `run.json :: proseRepetition` come out per shard (`merged: false`, with the note), because they need every town's sentence hashes, which stay in the shards directory. They are outside the stop rule. The kind-6 finding classes (`X-50`, `A-09`) do merge exactly.

The merged verdict is rung 3's. The chair's record `docs/SOAK_100000_RUNG3_<date>.md` carries the four shard tables and the merged one, with the per-shard repetition figures side by side.

STOP rule unchanged: any `cert:*` miss, any `coh:*` above 0, a band outside, or a class the chair rules significant. A STOP is bisected to its class and seed on the shard that saw it (the seed regenerates by index alone: `soak1k-<i>`, `cellFor(i)`), cured on a fix lane, and the shard RE-RUN on the cured tip. A re-run shard changes the tip, so the other three are re-run on the cured tip as well before the merge, since the driver refuses mixed tips. A cure that moves no generated town still moves the sha; the chair may rule the old shards' rows valid only by re-running one and comparing its `settlements.jsonl :: hashes`.

Rung 4 (1,000,000) follows the same shape with 8–10 shards (`--from 100000k --count 100000(k+1)` for ten, ≈ 5 h a shard by the same rates). The merge at 1,000,000 projects to ≈ 44 GB of heap and ≈ 20 h, which no container here holds. **Before rung 4 the merge needs a streaming field walk** (per-path, per-tier value histograms for the quantiles, a sampled or blocked dependence scan); that is a unit to brief, not a flag to raise.
