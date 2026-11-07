# SOAK-MERGE: the merge driver for sharded soak runs, and its proof (2026-11-07)

> A dated archival record. The SOAK-MERGE seat (an Opus-class child of the cloud chair, session `01FE9mEvGxnFx6WTBkEC6ie9`) built `scripts/audit/soak-merge.mjs` on `lane/soak-merge-2026-11-07` from master `db832c892` and proved it against a single run. The rung-3 brief it finishes is `BRIEF-RUNG3-SHARDS-2026-11-07.md` beside this file.

**The verdict: PROVEN.** Two 1,000-settlement shards merged reproduce a single 2,000-settlement run byte for byte in every table the aggregate computes from rows (findings, settlements, finding classes, reader observations, fields, field bands, inner categories, chains, both dependence tables) and in the verdict and its reasons. Repetition is reported per shard by construction; the reason is set out below.

## 0. What the first measurement refuted in the brief

1. **`--count` is the END index, not a count.** `soak-review.mjs` runs `for (let i = o.from; i < o.count; …)`. So `--from 1000 --count 1000` runs nothing, and the draft's `--from 25000 --count 25000` would run nothing either. Shard *k* of 25,000 is `--from 25000k --count 25000(k+1)`, and the rung-3 brief gives the commands that way. The script is unchanged; its usage stays as it is for every earlier rung.
2. **`settlements.jsonl` does not carry the field values.** It holds `i, seed, tier, population, stressCell, matrix, hashes, rendered, replay, error, findingCount, readerCount, checks`. The field walk (`features.scalars`), the chain facts, the houses reading, the reader distributions and the categorical counts exist only in `shards/`, which never moves. A merge over the moved files alone cannot recompute bands, medians, chains or dependence. So each shard **packs** what the aggregate reads (§1) and pushes the pack beside its other files: 2.9 MB per 1,000 settlements, measured.
3. **"Index order" is not a single run's order.** A run with W workers writes `shard-<w>.jsonl` holding the indices ≡ w (mod W), and `aggregate.mjs :: shardLines` reads those files sorted by name. A single run's `findings.jsonl` therefore runs 0, 4, 8, … then 1, 5, 9, …. The driver feeds rows in that order, the order one run of the whole range reads them, so the merged files are byte-identical rather than merely equal as sets. A test case fixes it: with 12 workers, `shard-10` sorts before `shard-2`.

## 1. The design

| table | how the merge gets it | identical to one run? |
|---|---|---|
| `findings.jsonl` · `settlements.jsonl` | rows rebuilt from the shards' `settlements.jsonl` + `findings.jsonl` + pack, fed to `aggregate()` itself | yes, by construction (one code path) |
| `finding-classes.json` (counts, seeds, `cases`, rates, pools) | `aggregate()` over the rebuilt rows | yes |
| `reader-observations.json` | `aggregate()` (the pack carries `reader`) | yes |
| `fields.json` · `field-bands.json` (bands, medians, quantiles) | `aggregate()` over the union's scalars (recomputed, never averaged) | yes |
| `chains.json` · `dependence-strong.json` · `dependence-residual.json` | `aggregate()` over the union's scalars | yes |
| `inner-categories.json` | the pack's categorical counts, kept per worker residue and summed in run order, then aggregate's own `≤ 60 keys` filter | yes (key order too) |
| `declared-share.json` (rung-2 aggregate) | the shards' `drawn`/`declared` summed, share re-derived | yes by arithmetic; this tip does not write it, so it is not exercised here |
| STOP / CLIMB · `reasons` | `aggregate()`'s own rule over the merged classes | yes |
| `repetition.json` · `repetition-prose.json` · `run.json :: proseRepetition` | **per shard**, `{ merged: false, note, shards: [...] }` | **no, by construction** (§2) |
| `sample/` | union of the shards' dossiers | yes at rung 3 (§2); not in the proof |
| `run.json` | aggregate's summary + `merge: { shards: [from, end, tip, settlements, durationMs, verdict, reasons], workers, mergeMs }`; `durationMs` is the sum of the shards' | equal in every figure except `tip`, `args`, `durationMs`, `proseRepetition`, `merge` |

**The pack** (`node scripts/audit/soak-merge.mjs --pack <shard-out>` writes `<shard-out>/merge-facts/`). For each settlement it writes `{ i, scalars, chains, houses, reader, presumptions }` as gzipped JSON lines, one set of 1,000-row parts per worker residue. It also writes the categorical counts per residue, and `pack.json`. Findings and settlement facts come from the shard's own `findings.jsonl` and `settlements.jsonl`, so nothing is stored twice.

**`aggregate.mjs`** gains one optional argument, `source`, a row iterable that defaults to its own `shards/`. A single run is unchanged: the proof's one-run and every shard ran through it.

**Refusals:** shards on different tips; different worker counts; a first shard not at 0; a gap or an overlap; a pack whose row count is not its range; an unpacked shard; an `--out` already holding a run; and any finding moved but not merged (the line counts are compared after the aggregate).

**Integration note for the chair (rung-2 landing).** `lane/rung2-landing-2026-11-06` adds a second pass in `aggregate()` that calls `shardLines(out)` directly, for declared-share. Composed with this branch, that line should read `source()`. If it is left as it is, a merge still works: the driver creates an empty `<out>/shards/`, that pass reads no rows, and the driver then writes the summed `declared-share.json` and `run.json :: declaredShare` over it. The two edits to `aggregate.mjs` (the signature and the main loop) touch hunks the rung-2 diff does not.

## 2. The proof: one run of 2,000 against two shards of 1,000, merged

Commands (four workers, four cores; outputs in the seat's scratchpad):

```
node scripts/audit/soak-review.mjs --count 2000 --workers 4 --out proof/one
node scripts/audit/soak-review.mjs --from 0    --count 1000 --workers 4 --out proof/shardA
node scripts/audit/soak-review.mjs --from 1000 --count 2000 --workers 4 --out proof/shardB
node scripts/audit/soak-merge.mjs --pack proof/shardA ; node scripts/audit/soak-merge.mjs --pack proof/shardB
node scripts/audit/soak-merge.mjs --out proof/merged proof/shardA proof/shardB
```

| table | one run (sha256/12) | merged | identical? |
|---|---|---|---|
| `findings.jsonl` (20,172 rows) | `a4b0d2e3ff96` | `a4b0d2e3ff96` | **yes** |
| `settlements.jsonl` (2,000 rows) | `4436769f253b` | `4436769f253b` | **yes** |
| `finding-classes.json` | `5b7d8f7e0757` | `5b7d8f7e0757` | **yes** |
| `reader-observations.json` | `7e248dc06b78` | `7e248dc06b78` | **yes** |
| `fields.json` (685 fields; bands, medians, every quantile) | `08e78c6edbf6` | `08e78c6edbf6` | **yes** |
| `field-bands.json` | `23d5096d7b63` | `23d5096d7b63` | **yes** |
| `inner-categories.json` | `207c7dab7815` | `207c7dab7815` | **yes** |
| `chains.json` | `7b3c7ee7454e` | `7b3c7ee7454e` | **yes** |
| `dependence-strong.json` (417 candidates, 13,632 strong pairs) | `a6c5a2236a42` | `a6c5a2236a42` | **yes** |
| `dependence-residual.json` | `88f7ccaf1311` | `88f7ccaf1311` | **yes** |
| verdict · reasons | STOP · 4 reasons | STOP · the same 4 | **yes** |
| `run.json`, every other figure | | | **yes** (all but `tip`, `args`, `durationMs`, `proseRepetition`, `merge`) |
| `repetition.json` | whole: distinct 41,551 · shared ≥ 10% 813 · median seen elsewhere 0.971 · p90 0.994 | A: 27,254 · 828 · 0.963 · 0.988 / B: 27,157 · 822 · 0.962 · 0.986 | **no**, by construction |
| `repetition-prose.json` / `proseRepetition` | story 0.051 / same-tier 0.117 · exact 0.076 / 0.139 · hooks 0.156 · skeletons ≥ 10% 108 | A: 0.051 / 0.118 · 0.076 / 0.139 · 0.157 · 113 / B: 0.051 / 0.116 · 0.076 / 0.138 · 0.154 · 111 | **no**, by construction |
| `sample/` | 60 | 84 (30 shared) | **no** in the proof; **yes** at rung 3 |

**Why repetition cannot merge.** Every repetition figure is a share of a town's sentences that recur across the corpus: "in ≥ 10% of towns", "seen in another town", the mean pairwise overlap. Whether a sentence clears the bar depends on every other town, and the per-town share needs that town's own sentence hashes (7–11 KB a settlement, in `shards/` only). The per-shard figures measure repetition within 25,000 towns rather than 100,000. They read close to the whole: the pairwise figures agree to ±0.002, and the distinct-sentence count is the one that grows with N. They are therefore a sound per-shard reading, not the rung's single figure. Repetition is outside the stop rule (kind 6 classes count, and those are finding classes, which do merge exactly), so the verdict never rests on it.

**Why the sample differs in the proof and not at rung 3.** `isSampled(i, count)` strides by `min(100, ⌊count/60⌋)` over `⌊i/6⌋ < 10 × stride`, and `count` is the END index. In the proof, shard A's end of 1,000 gives stride 16, where the one run of 2,000 gives 33. At rung 3, one run of 100,000 strides 100, so it samples `i < 6,000`. Shard 0 (end 25,000) also strides 100 and samples the same sixty, and shards 1–3 sample none. The merged sample is the single run's sixty.

**The verdict detail.** This tip is master `db832c892` (rung 1), not the rung-2 landing, so the 2,000 read STOP on four classes in shard B's half (`coh:food-words` 4; `cert:receipt_needs_review`, `cert:receipt_check_failed`, `cert:receipt_judgment_failed` 3 each). Shard A alone read CLIMB, and shard B read STOP on the same four reasons at the same counts. The merge read STOP on exactly the single run's reasons. This proof does not separate "the rule over the union" from "STOP if any shard stops", because every reason sits wholly in one shard. Where they differ (a class at 2 settlements in each of two shards is under the `≥ 3` contradiction line in each and over it in the union; a wording rate near 1% likewise), the driver applies `aggregate()`'s own rule to the summed classes. A shard's own CLIMB is therefore not the rung's: the rung reads the merged line.

**Tips.** The one run went at `db832c892`, and the two shards at `be217c56c`, the driver's own commit, which landed while they queued. The only difference between the two trees is this driver, its test and `aggregate.mjs`'s defaulted `source` argument. No generator changed: all 2,000 `hashes.record` are equal in the identical `settlements.jsonl`. The real driver refuses mixed tips, so the proof's merge saw two shards on one tip, and the one run is the reference.

**Two further checks.** Merging shard A alone reproduces shard A's own aggregate byte for byte in all ten row tables. A second merge of A + B reproduced the first byte for byte (deterministic).

## 3. The synthetic test

`tests/scripts/soakMerge.test.js` (6 tests, about 1 s) writes 24 synthetic soak rows as soak-review's workers would. That is one run of 24 on four workers, plus two shard runs (`from 0, end 12` and `from 12, end 24`), each aggregated through the real `aggregate()`. The shards are packed and merged (given out of order), and the test asserts the following:
- all ten row tables are byte-identical;
- `run.json` is equal except args, duration, repetition and merge, and both read STOP (a `cert:*` in one row of shard B);
- repetition comes out per shard with the note, and the samples are unioned;
- the stop rule runs on the summed classes: `A-04` at 2 + 2 is a reason in the union and in neither shard (anchored negative), which is the case the 2,000 proof cannot show;
- every refusal fires (tips, a first shard not at 0, a pack not covering its range, a gap, an overlap, an unpacked run);
- the worker-file order follows names (`shard-10` before `shard-2`).

**Red first:** a shard-major order (the naive concatenation) fails the byte-identity test, and the test passes on the run order. The negative-assertion walker is green, since the file has no negative assertion. eslint is clean.

## 4. Timings and sizes (measured; four cores)

| | measured | projected for a rung-3 shard (25,000) / the merge (100,000) |
|---|---|---|
| generation (`durationMs`) | 2,000 in one: 162 s · 1,000: 87 s and 89 s | rung 2F: 1,096 s per 10,000 → **≈ 46 min** per shard |
| aggregation | 2,000: 101 s · 1,000: 51 s (rung 2F, 10,000: 751 s) | ≈ linear in N → **≈ 31 min** per shard; **so ≈ 77 min per shard, not 46** |
| pack | 2 s per 1,000; **2.9 MB per 1,000** | ≈ 1 min; **≈ 73 MB** per shard in 1,000-row parts of ≈ 0.7 MB |
| merge | 2,000: **91 s**; 1,000: 45 s | **≈ 2 h** for 100,000 (it is the aggregation of the union) |
| merge peak RSS | 1,000: 307 MB · 2,000: 348 MB (≈ 41 KB a settlement) | **≈ 4.4 GB for 100,000, above node's default heap here (2.2 GB)**: run it as `node --max-old-space-size=8192` (the container has 15 GB). A single run of 100,000 would need the same. |
| moved per shard | findings 1.9 MB, settlements 0.68 MB, aggregates 2.4 MB, sample 6.5 MB per 1,000 here | at this tip's finding rate, findings ≈ 48 MB a shard (one file, under GitHub's 100 MB); rung 2F's rate (0.27 MB/1,000) gives ≈ 7 MB |

## 5. CONFIRMED vs PLAUSIBLE

**CONFIRMED:** every identity in §2, each by sha256 of the files; the refusals and the order rule (tests); the measured times, sizes and RSS in §4 at 1,000 and 2,000; `--count` as the end index, from the script's loop and from the shard runs' row counts. **PLAUSIBLE:** the projections for 25,000 and 100,000 (linear from two points and rung 2F; the dependence scan's cost is linear in N at a fixed candidate count, but the candidate count can move); the rung-2 composition note (read from that branch's diff, not run); declared-share's sum (arithmetic, not exercised on this tip).
